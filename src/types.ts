import {makeAutoObservable, autorun} from 'mobx';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isObject from 'lodash/isObject';

import {Path} from './classes/Path';
import {ValidationError} from './classes/ValidationError';
import {PathSegment} from './classes/PathSegment';

// Utils and functions
export type NodeKind = string;
export type NodeValue = any;
export type FormatterFn = (value: any, type: string, node: SchemaNode) => any;
export interface ObjectMap<T = any> {
  [key: string]: T;
}
type TranslatorKey =
  | 'default'
  | 'label'
  | 'error'
  | 'helpText'
  | 'placeholder'
  | 'description'
  | string;

export interface TranslatorArgs extends ObjectMap {
  key?: TranslatorKey;
  error?: ValidationError | null;
  // translators and `node.translate` can invokes can use any sort of additional arguments
}

export type TranslatorFn = (
  node: SchemaNode,
  args?: TranslatorArgs,
) => string | undefined;

export type ValidatorFn<T extends ObjectMap = any> = (
  val: NodeValue,
  options: SchemaValidator<T>,
  node: SchemaNode,
) => ValidationError | null;

/**
 * used to map errors to their fields py short paths.
 * the generic key is a placeholder for when
 * an error is not matchable to a path
 */
export interface ContextErrors extends ObjectMap<string[]> {
  generic: string[];
}

/**
 * used to bubble up all errors from a given point down in the
 * tree and return the node's isValid value
 */
export interface ValidateAll {
  errors: ValidationError[];
  isValid: boolean;
}

interface BaseSchemaValidator {
  name: string;
  message?: string;
}

export type SchemaValidator<T extends ObjectMap = ObjectMap> =
  BaseSchemaValidator & T;

export interface SchemaNodeServerDefinition {
  type?: NodeKind | NodeKind[] | {polymorphic: string[]};
  watch?: string;
  value?: any;
  labels?: LabelDictionary;
  attributes?: ObjectMap<SchemaNodeServerDefinition>;
  validators?: SchemaValidator<ObjectMap>[];
  meta?: ObjectMap;
  options?: string[];
}

type LabelDictionary = ObjectMap<string | LabelDictionary>;

/**
 * Internal definition of the schema
 */
export interface SchemaNodeDefinition {
  type: NodeKind;
  watch?: string;
  value?: any;
  labels?: LabelDictionary;
  attributes?: ObjectMap<SchemaNodeDefinition>;
  validators?: SchemaValidator[];
  meta?: ObjectMap;
  options?: string[];
}

// Components

/**
 * React properties used for declarative-forms custom components
 * You can pass as `T` the return type in {@link SchemaNode.data} of the {@link SchemaNode}
 **/
export interface NodeProps<T extends NodeValue = NodeValue> {
  node: SchemaNode<T>;
  children?: React.ReactNode;
}

/**
 * Contains default values that are used by declarative-forms's internals
 * context.sharedContext can be used by the consumer's code but should
 * be typed extending this interface for better typechecks
 */
export interface SharedContext extends ObjectMap {
  debug?: boolean;
  _debug_next_reaction?: boolean;
  errors?: ContextErrors;
}

// used internally only
export interface FormContext<T extends SharedContext = SharedContext> {
  features: {
    /**
     * False by default
     * When enabled, changing a node's value will still trigger validation but not set the errors.
     * The errors are used for displaying the error message in the UI.
     * the user will have to manually call `validateAll` on the node to show the error message in the UI
     * the error clearing upon changing the value still remains the same
     */
    asyncValidation?: boolean;
    /**
     * False by default
     * Format is disabled until core fixes the js regexps sent.
     * We formerly had issues in production with ruby patterns such as `\p{Katakana}` and `\p{Hiragana}`
     * which didn't translated into a valid regex.
     */
    enableFormatValidator?: boolean;
    preventInvalidValues?: boolean;
    /**
     * Tells the library what to do when a node is being
     * created using a path that was already taken.
     * the path pointer will always point to the last created node unless `throw` is used.
     */
    nodePathCollision?: 'throw' | 'warn' | 'ignore';
    suppressWarnings?: boolean;
  };
  sharedContext: T;
  nodes: Map<string, SchemaNode>;
  validators: ObjectMap<ValidatorFn> & {
    Presence?: ValidatorFn<ObjectMap>;
    Length?: ValidatorFn<ObjectMap>;
    Format?: ValidatorFn<ObjectMap>;
  };
  values: ObjectMap;
  formatters: ObjectMap<FormatterFn> & {
    local?: FormatterFn;
    remote?: FormatterFn;
  };
  translators: ObjectMap<TranslatorFn> & {
    label?: TranslatorFn;
    error?: TranslatorFn;
  };
  decorators: Decorator[];
  where(fn: DecoratorMatcher): Omit<Decorator, 'apply'>;
  updateContext<K extends keyof FormContext<T>['sharedContext']>(
    valueOrKey: K | Partial<FormContext<T>['sharedContext']>,
    value?: FormContext<T>['sharedContext'][K],
  ): void;
  focusField(path: string): void;
  sendErrorsToNode(errors: ContextErrors): void;
  addInitialValuesAfterNode(
    nodeName: SchemaNode['name'],
    values: FormContext['values'],
  ): void;
}

// Decorators
const slotNames = ['Before', 'After', 'Wrap', 'Pack', 'Replace'] as const;
export type DecoratorKeys = typeof slotNames[number];

interface DecoratorSlot {
  Node?: any;
  props?: object | Function;
}

/**
 * Using a subset of {@link SchemaNode} since decoration happens only at the construction of the schema and dynamic values don't retrigger decorators for performance and dependency reasons.
 */
export type SchemaNodeDecoratorSafeAttributes = Pick<
  SchemaNode,
  | 'type'
  | 'name'
  | 'depth'
  | 'isList'
  | 'isVariant'
  | 'schema'
  | 'path'
  | 'pathShort'
  | 'pathVariant'
  | 'attributes'
  | 'required'
  // less preferred selectors as they might change dynamically
  | 'parentNode'
  | 'getNodeByPath'
  | 'decorator'
  | 'context'
  | 'isValid'
>;

type DecoratorMatcher = (node: SchemaNodeDecoratorSafeAttributes) => boolean;

// decorator props to components
type Noop = (props: any) => React.ReactNode;

// All props of a function (or React component)
type GetProps<T extends Noop> = T extends (args: infer P) => any ? P : never;

/**
 * Usual excluded props in custom components,
 */

export type GenericExcludedComponentProps = 'onChange' | 'value';

/**
 * Used to defines properties of a function without the usual schema node props.
 * This is useful to know what properties are expected from a library consumer point of view
 */
export type SpecialProps<
  T extends Noop,
  E extends
    | GenericExcludedComponentProps
    | string = GenericExcludedComponentProps,
> = Omit<GetProps<T>, keyof NodeProps | E>;

/**
 * Used to defines Props (or a function returning Props) for a function without
 * the usual schema node props and it's children. That way we can only focus on
 * the special Props without knowing about the library's internals
 */
export type DecoratorPropsGetter<T extends Noop> =
  | SpecialProps<T>
  | ((node: SchemaNode) => SpecialProps<T>);

interface RegisteredDecorations {
  Before?: DecoratorSlot;
  After?: DecoratorSlot;
  Wrap?: DecoratorSlot;
  Pack?: DecoratorSlot;
  Replace?: DecoratorSlot;
}

/**
 * This is an class that holds the information about decoration registered for each {@link SchemaNode}
 */
export class Decorator {
  private Before?: DecoratorSlot;
  private After?: DecoratorSlot;
  private Wrap?: DecoratorSlot;
  private Pack?: DecoratorSlot;
  private Replace?: DecoratorSlot;

  constructor(private match: DecoratorMatcher) {}

  /**
   * Used internally, this is being called by all {@link SchemaNode} in order to know
   * if they are concerned with that decorator
   */
  public apply(node: SchemaNode) {
    if (this.match(node)) {
      slotNames.forEach((key) => {
        if (this[key]) node.decorator[key] = this[key];
      });
    }
  }

  /**
   * the passed custom component will replace the node's current component
   */
  public replaceWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Replace', fc, props);
  }

  /**
   * the passed custom component will be placed before the node's current component
   */
  public prependWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Before', fc, props);
  }

  /**
   * the passed custom component will be placed after the node's current component
   */
  public appendWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('After', fc, props);
  }

  /**
   * the passed custom component will wrap around the node's current component
   * the props `children` will represents the node's current rendered component inside the custom component
   */
  public wrapWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Wrap', fc, props);
  }

  /**
   * similar to `wrapWith` but the passed custom component will wrap
   * around the node's components including other attached decorators
   * such as the ones added from prependWith, appendWith and wrapWith decoration verbs
   */
  public packWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Pack', fc, props);
  }

  private store<T extends Noop>(
    slotName: DecoratorKeys,
    fc: T,
    props?: DecoratorPropsGetter<T>,
  ): Omit<Decorator, 'apply'> {
    this[slotName] = {Node: fc, props};
    return this;
  }
}

export type NodeChildrenMap = ObjectMap<SchemaNode>;

const NO_VALUE = Symbol('');

type NodeSource = 'child' | 'parent' | 'self';

export const CLONED_SYMBOL = '__cloned__';

/**
 * this represent a highly interactive node of a form schema that is
 * observable with {@link useWatcher} in order to notify React that attributes have been mutated.
 */
export class SchemaNode<T extends NodeValue = NodeValue> {
  public errors: ValidationError[] = [];

  /**
   * List of nodes with their names as a key
   */
  public children: NodeChildrenMap = {};

  /**
   * Converted schema received from the backend
   */
  public schema: SchemaNodeDefinition = {type: 'not_set'};
  public isList = false;

  /**
   * True if the node is a polymorphic node.
   * Meant to manage a node that conditionally renders it's children based on it's own value.
   * Unmatched children still retain their values and validation is skipped.
   * Matched children still account in the overall validation process.
   * When declaring a schema, you can use `polymorphic` as a type to make it a variant.
   * You can also use `polymorphic-*` ie: `polymorphic-radio`.
   * Suffix have to follow a dash.
   */
  public isVariant = false;

  /**
   * Cached list of all the children key names
   */
  public attributes: string[] = [];
  public depth: number;
  public name: string;
  public type = '';
  public dirty = false;
  public focused = false;
  public decorator: RegisteredDecorations = {};

  /**
   * Indicates if this node's value is mandatory'
   */
  public required = false;

  /**
   * valid can be false without errors registered when it fails validation
   * before the user change it's value. It is useful to prevent submitting
   * a form that was prefilled with wrong values.
   * It is privately used in {@link isValid} public method for that reason.
   */
  private valid = false;

  constructor(
    public context: FormContext,
    schema: SchemaNodeServerDefinition,
    public path: Path = new Path(),
    public _value: NodeValue = NO_VALUE,
    private updateParent: SchemaNode['onChildChange'] = () => {},
  ) {
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
    this.setInitialValue = this.setInitialValue.bind(this);
    this.depth = path.segments.length;
    this.name = path.tail.toString();

    // the following line needs to come before the call to this.resetNodeValues();
    // This allows the list specific behavior for getInitialValue to function properly
    // by traversing the tree back up to get an ancestors value.
    this.registerNode(this.path.toString());
    this.resetNodeValue(_value, schema);
    this.saveDecorators();
    makeAutoObservable(this, {
      // list of properties that we don't care have a false flag
      decorator: false,
      // Unlikely to change
      attributes: false,
      path: false,
      name: false,
      depth: false,
      type: false,
      // to avoid overreaching during watcher mapping
      children: false,
      context: false,
    });
  }

  public resetNodeValue(
    value: any = NO_VALUE,
    schema: SchemaNodeServerDefinition = this.schema,
  ) {
    let initialValue = this.getInitialValue(schema);

    // When using `addInitialValuesAfterNode(afterNode: string, initialValues: Record<string, any>)`
    // in the decoration process, it adds an entry that looks like `${afterNode}.${this.name}`
    for (const segment of this.path.segments) {
      const segmentValue = this.context.values[segment.key];
      if (isObject(segmentValue) && !isMobxArray(segmentValue)) {
        initialValue = this.context.values[segment.key][this.name];
        break;
      }
    }

    // Normally, just the name of the the field is enough
    // but there's a possibility of collision on nested structures
    // so the server can also send the shortPath instead.
    const matchingValueByShortPath = this.path.segments
      .filter((seg) => !seg.isList && !seg.isVariant)
      .reduce(
        (acc: any, seg: PathSegment) => (acc ? acc[seg.key] : undefined),
        this.context.values,
      );

    if (
      matchingValueByShortPath &&
      // Because a node that is not a leaf might also find a match,
      // we exclude that possibility by filtering out values that are objects.
      typeof matchingValueByShortPath !== 'object'
    ) {
      initialValue = matchingValueByShortPath;
    }

    this.value = value === NO_VALUE ? initialValue : value;

    // the invocation of schemaCompatibilityLayer must be after value hydration
    // since it redefines the value but it must be before building
    // the children because it sets the type of node as well
    this.schema = this.normalizeSchema(schema);

    if (this.isList && isMobxArray(this.schema.value)) {
      this._onChange(this.schema.value as NodeValue, 'self', true);
      return;
    }

    // makes sure the value matches the client's expected format / type
    const formatter = this.context.formatters.local;
    if (formatter) {
      this.value = formatter(this.value, this.type, this);
    }

    this.buildChildren();
    this._onChange(this.value, 'self', true);
  }

  /**
   * @returns a copy of the node that will not mutate the original one
   * prefix is used to namespace the path used to store the node
   * note: the node still shared the same context so they can refer to
   * each other though {@link SchemaNode.getNodeByPath}
   */
  public clone(prefix = CLONED_SYMBOL) {
    // to safe guard against context references being overwritten
    if (this.isClone())
      throw new Error(`Cannot clone a clone, use the original reference`);

    // prepare a new unique path
    const newPath = cloneDeep(this.path);
    newPath.segments.unshift(new PathSegment(prefix, false, false, true));

    // actual cloning
    const clonedRoot = new SchemaNode<T>(
      this.context,
      cloneDeep(this.schema),
      newPath,
      cloneDeep(this.value),
    );

    // copying errors from the original node to the clone
    this.context.nodes.forEach((node: SchemaNode) => {
      if (node.isClone()) {
        const original = node.getOriginalNode();
        if (!original) return;
        node.errors = cloneDeep(original.errors);
      }
    });

    return clonedRoot;
  }

  /**
   * Tells if the current node is a node that was created using the
   * {@link SchemaNode.clone} method.
   */
  public isClone() {
    return !!this.path.segments.find(({isClone}) => isClone);
  }

  /**
   * Returns the node that was used to create this one through the
   * {@link SchemaNode.clone} method.
   * In order to make it possible, the cloned node have
   * to be cloned with the `keepContext` set to `true` otherwise
   * the sharedContext will not be the same.
   * In the case were a child is being added only on a cloned node (ie: items of a list),
   * it might not exists on the original node.
   */
  public getOriginalNode() {
    if (!this.isClone()) throw new Error('This node is not a clone');
    const path = new Path(
      '',
      this.path.segments.filter(({isClone}) => !isClone),
    );
    return this.getNodeByPath(path.toString());
  }

  /**
   * Useful to compare when a node that was cloned is modified
   * some example where that could be useful is when a cloned node
   * manages a temporary value that is not stored in the server.
   *
   * Gotcha:
   * In order to make it possible, the cloned node have
   * to be cloned with the `keepContext` set to `true` otherwise
   * the sharedContext will not be the same.
   */
  public isSameValueAsCloned() {
    if (!this.isClone()) throw new Error('This node is not a clone');
    const original = this.getOriginalNode();
    if (!original) return false;
    return original.value === this.value;
  }

  /**
   * Unregister the node from the context
   * this is useful when adding programmatically a node
   * that is not part of the schema.
   * A good example is the {@link SchemaNode.clone} method:
   * It's a good practice to clean the cloned node when it's not used anymore
   */
  public remove() {
    if (!this.isClone()) {
      console.warn(`Removing a node that is not a clone and likely part of the server schema.
      This might be a code smell.
      SchemaNode path is "${this.path}"
      `);
    }
    return this.context.nodes.delete(this.path.toString());
  }

  /**
   * Reflects whenever the node's value satisfy the validator
   * and does not have externally set errors
   * after the first change.
   * It's possible to have `isValid: false` with no errors with `asyncValidation` set to `true`
   */
  public get isValid(): boolean {
    if (!this.valid || this.errors.length) return false;
    return this.getInvalidChildren().length === 0;
  }

  /** Returns invalid children names.
   * Polymorphic node will only return invalid
   * children of the selected variant.
   */
  public getInvalidChildren(): string[] {
    const invalidChildren: string[] = [];

    for (const key in this.children) {
      if (Object.prototype.hasOwnProperty.call(this.children, key)) {
        // For variants, we do not care about other nodes than the one selected
        if (this.isVariant && key !== this.value) continue;

        const child = this.children[key];
        if (!child.isValid) invalidChildren.push(child.name);
      }
    }

    return invalidChildren;
  }

  public get pathShort() {
    return this.path.toStringShort();
  }

  public get pathVariant() {
    return this.path.toStringShort(true);
  }

  /**
   * Useful for react key since it aims to be unique
   * right now there is an issue with list items where removing an item from a list
   * would result with the next element taking over the removed item's id and causing
   * React's key to be the same.
   */
  public get uid() {
    return this.path.toString();
  }

  /**
   * This is a proxy to the node's value that also checks for watched attribute.
   * if the schema for this node looks like this:
   * ```json
   * {
   *  type: 'string',
   *  watch: 'path.to.other.node',
   * }
   * ```
   * that means that whenever the value changes on the node registered at
   * `path.to.other.node` the value of this node will change as well through reading it's proxy
   */
  public get value(): NodeValue {
    const target = this.schema.watch
      ? this.getNodeByPath(this.schema.watch)
      : null;

    return target ? target.value : this._value;
  }

  private set value(val: NodeValue) {
    this._value = val;
  }

  /** @deprecated use {@link value} directly
   * as of 1.6.1, proxy is not required anymore to get the watched value */
  public get proxy() {
    return this.value;
  }

  /**
   * action to change the value of the node and let {@link useWatcher}
   * react to the changes.
   */
  public onChange(value: T) {
    return this._onChange(value);
  }

  /**
   * Similar to {@link onChange} but does not trigger validation errors and dirty state
   */
  public setInitialValue(value: T) {
    return this._onChange(value, 'self', true);
  }

  /**
   * this is the main method used to update the list of errors for a given node.
   * They get "cleaned" when the fields becomes dirty again as default behavior.
   * there are a few preset of functions that automatically calls this method
   * when configured in {@link DeclarativeFormContext.validators}
   */
  public setErrors(errors: ValidationError[]) {
    this.errors = errors || [];
    this.valid = errors.length === 0;
    // Bubble up validity to the parents
    this.updateParent(
      this.name,
      this.isVariant || this.isList ? this.data() : this.value,
      'child',
    );
  }

  /**
   * Automatically called internally, it's very unlikely that you will ever need this
   */
  public setFocused(focused: boolean) {
    this.focused = focused;
  }

  public get errorMessage(): string {
    return this.errors.length
      ? this.translate('error', {error: this.errors[0]}) ?? ''
      : '';
  }

  /**
   *
   * This method allows bubbling up the values of the children
   * when they change, for some type of nodes, we want to skip
   * to the next parent because the node is an abstraction
   * ei: the polymorphic and list nodes have values that represent
   * their list of selected variants instead of the value of their children
   * so they will just pass up the value to the next node above them.
   * even though the method is public, it's an internal function.
   */
  public onChildChange(
    childName: string,
    childValue: any,
    from: NodeSource = 'self',
    isInitialValue = false,
  ) {
    // Let's skip nodes with null as
    // it might be intentionally set for opt-out nodes
    if (isInitialValue && this.value === null && from !== 'parent') {
      this.updateParent(this.name, childValue, 'child', isInitialValue);
      return;
    }
    // for intermediary nodes, values are objects representing children
    const isLeaf = this.attributes.length === 0;
    if (!this.isVariant && !isLeaf && !this.value) {
      this.value = {};
    }
    // polymorphic nodes values are the polymorphic selection
    // we skip that level but we register the selection on the parent's level
    if (this.isVariant) {
      this.updateParent(
        this.name,
        {
          ...childValue,
          [`${this.name}Type`]: childName,
        },
        'child',
        isInitialValue,
      );
      return;
    }
    // same for lists
    if (this.isList) {
      this.updateParent(
        this.name,
        this.value.map((item: SchemaNode) => item.data()),
        'child',
        isInitialValue,
      );
      return;
    }
    // other types of nodes just get updated
    this._onChange(
      {
        ...this.value,
        [childName]: childValue,
      },
      from,
      isInitialValue,
    );
  }

  public validate(asDryRun = false, updateParent = false): ValidationError[] {
    if (!this.schema.validators) return [];

    const errors = this.schema.validators
      .map((config) => {
        const fn = this.context.validators[config.name];
        return fn?.(this.value, config, this);
      })
      .filter(Boolean) as ValidationError[];

    if (!asDryRun && updateParent) {
      this.updateParent(
        this.name,
        this.isVariant || this.isList ? this.validateAll() : this.value,
        'child',
        false,
      );
    }

    if (!asDryRun) this.setErrors(errors);

    return errors;
  }

  public translate(
    translatorKey?: TranslatorKey,
    args?: TranslatorArgs,
  ): ReturnType<TranslatorFn> {
    const {translators} = this.context;
    const translator = translators[translatorKey as keyof typeof translators];
    if (!translator) {
      return translators.default
        ? translators.default(this, {...args, key: translatorKey})
        : '';
    }
    return translator(this, args) || '';
  }

  /**
   *
   * @returns Function Returned function unsubscribes the listener
   */
  public subscribe(callback: (node: SchemaNode) => void): () => void {
    return autorun(() => callback(this));
  }

  public getNodeByPath(fullPath: string) {
    return this.context.nodes.get(fullPath);
  }

  /**
   * If you have a node with path a.b.c with a children d
   * You can do node.getRelativeNodeByPath('d') instead of node.getNodeByPath('a.b.c.d')
   */
  public getRelativeNodeByPath(relativePath: string) {
    return this.getNodeByPath(this.path.add(relativePath).toString());
  }

  public parentNode(): SchemaNode | undefined {
    const {segments} = this.path;
    const parentKey = segments.slice(0, -1).join('.');
    return this.getNodeByPath(parentKey);
  }

  // for both addListItem and setListValues, we call buildChildren in the case that
  // a node that is not the last one gets deleted and all indexes gets shifted, then we
  // would risk to be stuck with an index like [1, 2, 3, 3] instead of [1, 2, 3, 4]
  public setListValues(items: any[]) {
    this.value = items.map((item: NodeValue, index: number) => {
      const schema = this.buildListItemSchema(item);
      const itemNode = new SchemaNode(
        this.context,
        schema,
        this.path.add(index.toString(), true),
        this.getInitialValue({value: item}),
        (value, path) => this.onChildChange(value, path),
      );
      return itemNode;
    });
  }

  /**
   * When the node is of list type,
   * add a new item to the array potentially passing it's item value.
   */
  public addListItem(nodeValue?: any) {
    if (!this.isList) {
      throw new Error('node is not a list');
    }

    const schema = this.buildListItemSchema(nodeValue as NodeValue);

    const node = new SchemaNode(
      this.context,
      schema,
      this.path.add(this.value.length.toString(), true),
      nodeValue,
      (value, path) => this.onChildChange(value, path),
    );

    if (nodeValue) node._onChange(nodeValue);

    this.value = [...this.value, node];
    this.internalSetListValues();
    return node;
  }

  public removeListItem(index: number) {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    this.value = this.value.filter((_: any, i: number) => i !== index);
    this.internalSetListValues();
  }

  // This method validates the entire schema tree, bubbling up
  // all child errors into one flat array for consumption
  public validateAll(
    validationResults: ValidateAll = {errors: [], isValid: true},
  ): ValidateAll {
    if (this.isVariant) {
      return (
        this.children[this.value]?.validateAll(validationResults) ??
        validationResults
      );
    } else {
      validationResults.errors.push(...this.validate(false, true));
      validationResults.isValid = validationResults.errors.length === 0;
    }

    if (this.isList) {
      this.value.map((item: SchemaNode) => item.validateAll(validationResults));
    } else if (this.attributes.length && this.value !== null) {
      this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].validateAll(validationResults);
        return acc;
      }, {} as any);
    }

    return validationResults;
  }

  /**
   * This method calculate the node's value
   * descending all it's children
   * it also calls the formatter to convert client's values
   * to server values
   */
  public data(validate = false): T extends never ? object : T {
    if (this.isVariant) {
      return this.attributes.reduce((acc, key) => {
        if (key === this.value) {
          Object.assign(acc, this.children[key].data(validate));
          acc[`${this.name}Type`] = this.value;
        }
        return acc;
      }, {} as any);
    }
    if (this.isList) {
      return this.value.map((item: SchemaNode) => item.data(validate));
    } else if (this.attributes.length && this.value !== null) {
      const value = this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].data(validate);
        return acc;
      }, {} as any);
      return value;
    }

    if (validate) this.validate(false);

    const formatter = this.context.formatters.remote;
    return formatter
      ? formatter(this.value, this.schema.type, this)
      : this.value;
  }

  /**
   * Used to build the schema for a list item. If the parent list item has the
   * matchValues meta option, we only include attributes from the parent schema
   * that have a corresponding value in the list item. This allows us to have
   * individual list items with different form fields in the same list node.
   * @param item The list item to build the schema for
   * @returns NodeSchema
   */

  private buildListItemSchema(item: NodeValue) {
    const schema = cloneDeep(this.schema);
    if (this.schema.meta?.matchValues) {
      const attributes = cloneDeep(this.schema.attributes);
      const itemAttributes: {[key: string]: any} = {};
      Object.entries(attributes || {}).forEach(([key, value]) => {
        if (item[key as keyof typeof item] !== undefined) {
          itemAttributes[key] = value;
        }
      });
      schema.attributes = itemAttributes;
    }
    return schema;
  }

  private internalSetListValues() {
    this.setListValues(this.value.map((item: NodeValue) => item.data()));
  }

  /**
   * action to change the value of the node and let {@link useWatcher}
   * react to the changes.
   *
   * `isInitialValue` does not run a full validation, meaning it does not
   * set the errors on the node but still detects when it's invalid
   *
   * `from` is used internally and serve to define in which direction the event
   * will be propagating to other nodes
   */
  private _onChange(
    value: T,
    from: NodeSource = 'self',
    isInitialValue = false,
  ): ValidationError[] {
    this.dirty = !isInitialValue && from !== 'parent';

    // Divergent behavior for normal, list and variant nodes
    if (this.isList) {
      this.setListValues(value as NodeValue);
    } else if (this.isVariant) {
      this.onVariantChange(value, from, isInitialValue);
    } else {
      this.value = value;
    }

    this.checkForErrors(isInitialValue);
    this.updateOtherNodes(from, isInitialValue);
    return this.errors;
  }

  private onVariantChange(
    value: T,
    from: NodeSource = 'self',
    isInitialValue = false,
  ) {
    if (isObject(value) && Object.keys(value).length) {
      const variantKey = `${this.name}Type`;
      const {[variantKey]: variant, ...data} = value as NodeValue;
      if (variant) {
        this._onChange(variant, from, isInitialValue);
        const selectedNode = this.children[variant];
        selectedNode._onChange(data, 'self', isInitialValue);
        selectedNode.updateChildren();
      } else if (!this.context.features.suppressWarnings) {
        console.error(
          `Failed to set value of the '${this.uid}' polymorphic node, the structure is not known and requires the '${variantKey}' property`,
        );
      }
    } else {
      this.value = value;
    }
  }

  private checkForErrors(isInitialValue = false) {
    const errors = this.validate(true);

    // We don't want to have errors on creation,
    // just when the user is changing the value afterwards
    const applyErrors =
      (!this.context.features?.asyncValidation && !isInitialValue) ||
      errors.length === 0;

    if (applyErrors) this.errors = errors;

    this.valid = errors.length === 0;
  }

  private updateOtherNodes(from: NodeSource = 'self', isInitialValue = false) {
    if (from !== 'child' && !isInitialValue) {
      this.updateChildren();
    }

    if (from !== 'parent') {
      this.updateParent(
        this.name,
        this.isVariant || this.isList ? this.data() : this.value,
        'child',
        isInitialValue,
      );
    }
  }

  private getInitialValue(schema: SchemaNodeServerDefinition = this.schema) {
    const initialValue = schema.value || this.context.values[this.name];
    if (initialValue !== undefined) return initialValue;

    const pathParts = this.path.toString().split('.');

    /**
     * This is naive and only checks the first possible list node,
     * but we could make this more robust by checking all
     * potential list nodes. This might be solved through recursion, or a while loop.
     * First collecting the indexes of all possible list nodes in one pass,
     * and then working through to find which is the top most that is an actual list type.
     * We don't want to assume that any node with a number as it's path name is definitely a list,
     * so we perform a second check below to verify that yes, in fact,
     * the ancestral node we found is in fact a list.
     */
    const possibleListNodeIndex = pathParts
      .reverse()
      .findIndex((part) => !isNaN(Number(part)));

    if (
      possibleListNodeIndex === -1 ||
      possibleListNodeIndex === pathParts.length - 1
    ) {
      return initialValue;
    }
    const possibleListNode = this.getNodeByPath(
      pathParts.slice(0, possibleListNodeIndex).join('.'),
    );
    if (!possibleListNode?.isList) return initialValue;

    const parentValue = possibleListNode?.schema?.value;
    const childPath = pathParts.slice(possibleListNodeIndex);
    return childPath.reduce((acc, part) => {
      // this check is to avoid triggering the mobx get proxy
      // eslint-disable-next-line no-prototype-builtins
      if (!acc?.hasOwnProperty(part)) return undefined;
      return acc[part];
    }, parentValue);
  }

  // utilities
  private updateChildren() {
    if (this.isList) return;
    // running updateChildren for variants with an invalid selections could stay null
    // if preventInvalidValues is set to true
    if (!this.context.features.preventInvalidValues && this.isVariant) return;

    if (isObject(this.value)) {
      const orphans = Object.keys(this.value)
        .filter((key) => !this.attributes.includes(key))
        .join(', ');
      if (orphans.length && !this.context.features.suppressWarnings) {
        console.warn(
          `Trying to set values on nonexisting keys. Orphans: ${orphans}`,
        );
      }
    }
    this.attributes.forEach((key) => {
      const child: SchemaNode = this.children[key];
      if (!child || child.isList) return;
      const childValue = this.value ? this.value[key] : null;
      child._onChange(childValue, 'parent');
    });
  }

  private buildChildren() {
    const children: SchemaNode['children'] = {};
    if (this.isList) {
      this.value.forEach((child: SchemaNode, newIndex: number) => {
        child.path = this.path.add(newIndex.toString(), true);
        child.name = child.path.tail;
        child.buildChildren();
      });
      return;
    }

    if (!this.schema.attributes) return {};

    this.attributes = Object.keys(this.schema.attributes);
    this.attributes.forEach((key) => {
      const attributes = this.schema.attributes!;
      const schema = attributes[key] as SchemaNodeDefinition;
      children[key] = new SchemaNode(
        this.context,
        schema,
        this.path.add(key, this.isList, this.isVariant),
        // In the case of grandchildren or deeper of lists, this children can be an empty {}.
        // Falling back to checking the parents value[key] allows us to handle this edge case.
        this.children[key]?.value ?? get(this.value, key),
        (name, value, _source, isInitialValue) => {
          this.onChildChange(name, value, 'child', isInitialValue);
        },
      );
    });
    this.children = children;
  }

  private saveDecorators() {
    this.context.decorators.forEach((decorator: Decorator) => {
      decorator.apply(this);
    });
  }

  private registerNode(namespace: string) {
    if (this.context.nodes.get(namespace)) {
      const {nodePathCollision} = this.context.features;
      const message = `node created at ${namespace} already exists`;
      if (nodePathCollision === 'throw') throw new Error(message);
      if (nodePathCollision === 'warn') console.warn(message);
    }
    this.context.nodes.set(namespace, this);
  }

  private normalizeSchema(
    _schema: SchemaNodeServerDefinition,
  ): SchemaNodeDefinition {
    const schema = cloneDeep(_schema);
    let type = schema.type || 'group';

    if (typeof type !== 'string') {
      // Define if node should be a list node
      if (isMobxArray(type)) {
        // We remap from the Legacy Schema syntax
        [type] = type;
        this.isList = true;
        schema.value = this.value;
        this.value = [];
      } else if (isMobxArray(type.polymorphic)) {
        // we don't need to read the polymorphic attributes
        // as they are just a list of the keys in attributes
        // instead we change the type for a plain string
        type = 'polymorphic';
      }
    }

    if (/^polymorphic(-.*)?$/.test(type as string)) this.isVariant = true;

    // At this point type can only be a string, no polymorphic or list shape
    this.type = type as NodeKind;
    this.required = Boolean(
      schema.validators?.find(({name}) => name === 'Presence'),
    );

    return {
      ...schema,
      attributes: schema.attributes as SchemaNodeDefinition['attributes'],
      type: this.type,
    };
  }
}

/**
 * when an array is a proxied, it's not and instance of an Array anymore but the one of a Proxy
 * therefore Array.isArray returns false on arrays wrapped by mobx (Proxies)
 * Array.isArray is still safer semantically to future changes so it remains as the first condition
 * For more information, you can check https://doc.ebichu.cc/mobx/refguide/array.html
 */
function isMobxArray(array: any): array is any[] {
  return Array.isArray(array) || typeof array?.slice === 'function';
}
