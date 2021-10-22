import {makeAutoObservable, toJS} from 'mobx';
import React from 'react';

// Utils and functions
export type NodeKind = string;
export type NodeValue = any;
export type ReactComponent = any;
export type FormatterFn = (value: any, type: string, node: SchemaNode) => any;
export type TranslatorFn = (node: SchemaNode, args?: any) => string;
export type ValidatorFn = (
  val: NodeValue,
  options: Validator,
  node: SchemaNode,
) => ValidationError | null;

/**
 * used to map errors to their fields py short paths.
 * the generic key is a placeholder for when
 * an error is not matchable to a path
 */
export interface ContextErrors {
  generic: string[];
  [key: string]: string[];
}

// Schema structure
export interface Validator {
  name: string;
  maximum?: number;
  minimum?: number;
  format?: string;
  // ! Client don't support this format yet but server could
  // | {
  //     greater_than?: number;
  //     less_than?: number;
  //     allow_nill?: boolean;
  //   };
}

export interface SchemaNodeDefinitionLegacy {
  type?: NodeKind | NodeKind[] | {polymorphic: string[]};
  attributes?: {[key: string]: SchemaNodeDefinitionLegacy};
  validators?: Validator[];
  meta?: {[key: string]: any};
  options?: string[];
}

export interface SchemaNodeDefinition {
  type: NodeKind;
  attributes?: {[key: string]: SchemaNodeDefinition};
  validators?: Validator[];
  meta?: {[key: string]: any};
  options?: string[];
}

// Components
export interface NodeProps {
  node: SchemaNode;
  children?: React.ReactNode;
}

export interface SharedContext {
  [key: string]: any;
}

export type DecorateFunction<T extends SharedContext = SharedContext> = (
  ctx: FormContext<T>,
) => void;

export interface FormContext<T = SharedContext> {
  debug: boolean;
  version: number;
  sharedContext: T;
  ReactContext: React.Context<{errors: ContextErrors} & SharedContext>;
  nodes: Map<string, SchemaNode>;
  validators: {[key: string]: ValidatorFn} & {
    Presence?: ValidatorFn;
    Length?: ValidatorFn;
    Format?: ValidatorFn;
  };
  values: {[key: string]: any};
  formatters: {[key: string]: FormatterFn} & {
    local?: FormatterFn;
    remote?: FormatterFn;
  };
  translators: {[key: string]: TranslatorFn} & {
    label?: TranslatorFn;
    error?: TranslatorFn;
  };
  decorators: Decorator[];
  where(fn: DecoratorMatcher): Omit<Decorator, 'apply'>;
  addInitialValuesAfterNode(
    nodeName: SchemaNode['name'],
    values: FormContext['values'],
  ): void;
}

// Decorators
const slotNames = ['Before', 'After', 'Wrap', 'Pack', 'Replace'] as const;
export type DecoratorKeys = typeof slotNames[number];

interface DecoratorSlot {
  Node?: ReactComponent;
  props?: object | Function;
}

type DecoratorMatcher = (node: SchemaNode) => boolean;

// decorator props to components
type Noop = (props: any) => React.ReactNode;

// All props of a function (or React component)
type GetProps<T extends Noop> = T extends (args: infer P) => any ? P : never;

// Usual excluded props in custom components
export type GenericExcludedComponentProps =
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'value';

// Used to defines properties of a function
// without the usual schema node props
export type SpecialProps<
  T extends Noop,
  E extends
    | GenericExcludedComponentProps
    | string = GenericExcludedComponentProps
> = Omit<GetProps<T>, keyof NodeProps | E>;

// Used to defines props or a function returning props
// of a function without the usual schema node props
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

export class Decorator {
  private Before?: DecoratorSlot;
  private After?: DecoratorSlot;
  private Wrap?: DecoratorSlot;
  private Pack?: DecoratorSlot;
  private Replace?: DecoratorSlot;

  constructor(private match: DecoratorMatcher) {}

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
   * the passed custom component will wrap arround the node's current component
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

export class ValidationError<T = {[key: string]: any}> {
  constructor(public type: string, public data?: T) {}
}

export interface NodeChildrenMap {
  [key: string]: SchemaNode;
}

const NO_VALUE = Symbol('');

class PathSegment {
  constructor(
    public key: string,
    public isList = false,
    public isVariant = false,
  ) {}

  toString() {
    return this.key;
  }
}

export class Path {
  public segments: PathSegment[];
  public head: string;
  public tail: string;

  constructor(
    name = '',
    segments: PathSegment[] = [],
    {isVariant = false, isList = false} = {},
  ) {
    if (name) {
      const tail = new PathSegment(name, isList, isVariant);
      this.segments = segments.concat(tail);
      this.head = segments[0]?.toString() || '';
      this.tail = tail.toString();
    } else {
      this.segments = [];
      this.tail = '';
      this.head = '';
    }
  }

  /**
   * Append a new path segment to a path
   */
  add(name: string, isList = false, isVariant = false): Path {
    return new Path(name, this.segments, {isList, isVariant});
  }

  /**
   * full path including variant selections and array indexes
   */
  toString(): string {
    return this.segments.join('.');
  }

  /**
   * @description full path separated by dots without variant selections or indexes.
   * Variants and indexes can still be included with a bracket syntax by passing setting
   * withVariant or withList arguments
   * @param withVariant show variant selections next to their polymorphic node ei: "foo.node[selectedVariant].bar"
   * @param withList show indexes next to their list node ei: "foo.node[0].bar"
   */
  toStringShort(withVariant = false, withList = false): string {
    return this.segments.reduce((acc: string, seg: PathSegment) => {
      if (seg.isList) return withList ? `${acc}[${seg}]` : acc;
      if (seg.isVariant) return withVariant ? `${acc}[${seg}]` : acc;
      return acc ? `${acc}.${seg}` : seg.toString();
    }, '');
  }

  toFullWithoutVariants() {
    return this.segments.filter((seg) => !seg.isVariant).join('.');
  }
}

// Schema Node
type NodeSource = 'child' | 'parent' | 'self';
export class SchemaNode {
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
   * True if the node is a polymorphic node
   * Polymorphic nodes select their variant(s) to display
   * The selection name is held in the value attribue
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
  public invalidChildren: Map<string, true> = new Map();
  public decorator: RegisteredDecorations = {};

  /**
   * Indicates if this node's value is mandatory'
   */
  public required = false;

  /**
   * valid can be false without errors registered when it fails validation
   * before the user change it's value. It is usefull to prevent submitting
   * a form that was prefilled with wrong values.
   * It is privately used in isValid() public method for that reason.
   */
  private valid = false;

  constructor(
    public context: FormContext,
    schema: SchemaNodeDefinitionLegacy,
    public path: Path = new Path(),
    public value: NodeValue = NO_VALUE,
    private updateParent: SchemaNode['onChildrenChange'] = () => {},
  ) {
    this.depth = path.segments.length;
    this.name = path.tail.toString();
    this.resetNodeValue(value, schema);
    this.saveDecorators();
    makeAutoObservable(this);
    this.context.nodes.set(this.path.toString(), this);
  }

  public resetNodeValue(
    value: any = NO_VALUE,
    schema: SchemaNodeDefinitionLegacy = this.schema,
  ) {
    const formatter = this.context.formatters.local;
    // Search for value override by traversing the path

    let initialValue = this.context.values[this.name];

    // To recover values set with `addInitialValuesAfterNode` from the context
    // By default, no other values should be mixed up to that point
    for (const segment of this.path.segments) {
      const segmentValue = this.context.values[segment.key];
      if (typeof segmentValue === 'object' && segmentValue !== null) {
        initialValue = this.context.values[segment.key][this.name];
        break;
      }
    }

    this.value = value === NO_VALUE ? initialValue : value;
    // the invocation of schemaCompatibilityLayer must be after value hydratation
    // since it redefines the value but it must be before building
    // the children because it sets the type of node as well
    this.schema = this.schemaCompatibilityLayer(schema);
    if (formatter) {
      this.value = formatter(this.value, this.type, this);
    }
    // If we have a node with options and no values,
    // preselecting the first option if present
    if (schema.options && !schema.options.includes(this.value)) {
      this.value = schema.options[0] || null;
    }
    this.buildChildren();
    this.onChange(this.value, 'self', true);
  }

  public isValid(skipChildrenValidation = false): boolean {
    if (!this.valid || this.errors.length) return false;
    if (skipChildrenValidation) return true;
    // For variants, we do not care about other nodes than the one selected
    if (this.isVariant) return !this.invalidChildren.get(this.value);
    return this.invalidChildren.size === 0;
  }

  /**
   * @deprecated use .path.toStringShort() instead
   */
  public get pathShort() {
    return this.path.toStringShort();
  }

  /**
   * @deprecated use .path.toStringShort(true) instead
   */
  public get pathVariant() {
    return this.path.toStringShort(true);
  }

  /**
   * @description usefull for react key since it aims to be unique
   */
  public get uid() {
    return this.path.toString();
  }

  // Generic onchange called by the useNode hook or upon construction
  // we can turn up bubbling the even up or validating in some cases
  public onChange(
    value: any,
    from: NodeSource = 'self',
    isInitialValue = false,
  ) {
    this.value = value;
    const errors = this.validate(true);
    this.dirty = !isInitialValue && from !== 'parent';
    this.valid = errors.length === 0;
    // We don't want to have errors on creation, just when dirty
    if (!isInitialValue) this.errors = errors;

    if (from !== 'child' && !isInitialValue) {
      this.updateChildren();
    }

    if (from !== 'parent') {
      this.updateParent(
        this.name,
        this.isVariant ? this.data() : this.value,
        this.isValid(),
        'child',
        isInitialValue,
      );
    }

    return this.errors;
  }

  public setErrors(errors: ValidationError[]) {
    this.errors = errors || [];
  }

  // This method allows bubbling up the values of the children
  // when they change, for some type of nodes, we want to skip
  // to the next parent because the node is an abstraction
  // ei: the polymorphic and list nodes have values that represent
  // their list of selected variants instead of the value of their children
  // so they will just pass up the value to the next node above them
  public onChildrenChange(
    childrenName: string,
    childrenValue: any,
    isValid = false,
    from: NodeSource = 'self',
    isInitialValue = false,
  ) {
    if (from === 'child') {
      this.updateChildrenValidity(childrenName, isValid);
    }
    // Let's skip nodes with null as
    // it might be intentionnaly set for opt-out nodes
    if (isInitialValue && this.value === null && from !== 'parent') {
      this.updateParent(
        this.name,
        childrenValue,
        this.isValid(),
        'child',
        isInitialValue,
      );
      return;
    }
    // for intermediary nodes, values are objects representing children
    const isLeaf = this.attributes.length === 0;
    if (!isLeaf && !this.value) {
      this.value = {};
    }
    // polymorphic nodes values are the polymorphic selection
    // we skip that level but we register the selection on the parent's level
    if (this.isVariant) {
      this.updateParent(
        this.name,
        {
          ...childrenValue,
          [`${this.name}Type`]: childrenName,
        },
        this.isValid(),
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
        this.isValid(),
        'child',
        isInitialValue,
      );
      return;
    }
    // other types of nodes just get updated
    this.onChange(
      {
        ...this.value,
        [childrenName]: childrenValue,
      },
      from,
      isInitialValue,
    );
  }

  public validate(asDryRun = false): ValidationError[] {
    if (!this.schema.validators) return [];

    const errors = this.schema.validators
      .map((config) => {
        const fn = this.context.validators[config.name];
        return fn?.(this.value, config, this);
      })
      .filter(Boolean) as ValidationError[];

    if (!asDryRun) this.errors = errors;

    return errors;
  }

  public translate(mode: 'label' | 'error' | string, args?: object): string {
    const {translators} = this.context;
    const translator = translators[mode as keyof typeof translators];
    if (!translator) {
      return translators.default
        ? translators.default(this, {...args, key: mode})
        : '';
    }
    return translator(this, args) || '';
  }

  // methods specific to list type
  public addListItem() {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    const node = new SchemaNode(
      this.context,
      this.schema,
      this.path.add(this.type, true),
      undefined,
      (value, path) => this.onChildrenChange(value, path),
    );
    this.value = [...this.value, node];
    this.buildChildren();
    return node;
  }

  public getNodeByPath(fullPath: string) {
    return this.context.nodes.get(fullPath);
  }

  public parentNode(): SchemaNode | undefined {
    const parentKey = this.path.segments
      .filter((_s, index) => index < this.path.segments.length - 2)
      .join('.');
    return this.getNodeByPath(parentKey);
  }

  public removeListItem(index: number) {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    this.value = this.value.filter(
      (_: SchemaNode, idx: number) => idx !== index,
    );
    this.buildChildren();
  }

  // This method calculate the node's value
  // descending all it's children
  // it also calls the formater to convert client's values
  // to server values
  public data(validate = false): {[key: string]: any} {
    if (this.isVariant) {
      return this.attributes.reduce((acc, key) => {
        if (key === this.value) {
          Object.assign(acc, this.children[key].data());
          acc[`${this.name}Type`] = this.value;
        }
        return acc;
      }, {} as any);
    }
    if (this.isList) {
      return this.value.map((item: SchemaNode) => item.data());
    } else if (this.attributes.length && this.value !== null) {
      const value = this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].data();
        return acc;
      }, {} as any);
      this.value = value;
      return value;
    }

    if (validate) this.validate();

    const formatter = this.context.formatters.remote;
    return toJS(
      formatter ? formatter(this.value, this.schema.type, this) : this.value,
    );
  }

  // utilities
  private updateChildren() {
    if (this.isList || this.isVariant) return;
    this.attributes.forEach((key) => {
      const child: SchemaNode = this.children[key];
      if (!child || child.isList || child.isVariant) return;
      const childValue = this.value ? this.value[key] : null;
      child.onChange(childValue, 'parent');
      this.updateChildrenValidity(child.name, child.isValid());
    });
  }

  private updateChildrenValidity(childrenName: string, isValid: boolean) {
    if (isValid) {
      this.invalidChildren.delete(childrenName);
    } else {
      this.invalidChildren.set(childrenName, true);
    }
  }

  private buildChildren() {
    const children: SchemaNode['children'] = {};
    if (this.isList) {
      this.value.forEach((node: SchemaNode, newIndex: number) => {
        node.path = this.path.add(newIndex.toString(), true);
        node.buildChildren();
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
        this.children[key]?.value,
        (name, value, isValid, _source, isInitialValue) => {
          this.onChildrenChange(name, value, isValid, 'child', isInitialValue);
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

  private schemaCompatibilityLayer(
    schema: SchemaNodeDefinitionLegacy,
  ): SchemaNodeDefinition {
    let type = schema.type || 'group';

    if (typeof type !== 'string') {
      // Define if node should be a list node
      if (isMobxArray(type)) {
        // We remap from the Legacy Schema syntax
        type = type[0];
        this.isList = true;
        // List node have their children in the value attribute
        if (!isMobxArray(this.value)) {
          this.value = [];
        }
      } else if (isMobxArray(type.polymorphic)) {
        // we don't need to read the polymorphic attributes
        // as they are just a list of the keys in attributes
        // instead we change the type for a plain string
        type = 'polymorphic';
        this.isVariant = true;
      }
    }

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
 * when an array is proxied, it's not and instance of an Array anymore but the one of a Proxy
 * therefore Array.isArray returns false on arrays wrapped by mobx (Proxied)
 * Array.isArray is still safer semanticaly to future changes so it remains as the first condition
 * For more information, you can check https://doc.ebichu.cc/mobx/refguide/array.html
 */
function isMobxArray(array: any): array is any[] {
  return Array.isArray(array) || typeof array?.slice === 'function';
}
