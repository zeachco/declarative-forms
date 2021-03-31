import React from 'react';

// Utils and functions
export type NodeKind = string;
export type NodeValue = any;
export type ReactComponent = any;
export type FormatterFn = (value: any, type: string) => any;
export type TranslatorFn = (node: SchemaNode, args?: any) => string;
export type ValidatorFn = (
  val: NodeValue,
  options: Validator,
) => ValidationError | null;

export interface ContextErrors {
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

export interface FormContext {
  debug: boolean;
  version: number;
  ReactContext: React.Context<{errors: ContextErrors} & any>;
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

  public replaceWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Replace', fc, props);
  }

  public prependWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Before', fc, props);
  }

  public appendWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('After', fc, props);
  }

  public wrapWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Wrap', fc, props);
  }

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
}

// Schema Node
export class SchemaNode {
  public errors: ValidationError[] = [];

  /**
   * List of nodes with their names as a key
   */
  public children: NodeChildrenMap = {};

  /**
   * Converted schema received from the backend
   */
  public schema: SchemaNodeDefinition;
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
  public decorator: RegisteredDecorations = {};

  /**
   * Indicates if this node's value is mandatory'
   */
  public required = false;

  constructor(
    public context: FormContext,
    schema: SchemaNodeDefinitionLegacy,
    public path: Path = new Path(),
    public value: NodeValue = NO_VALUE,
    private updateParent: SchemaNode['onChildrenChange'] = () => {},
  ) {
    this.depth = path.segments.length;
    this.name = path.tail.toString();
    const formatter = this.context.formatters.local;
    this.value = value === NO_VALUE ? this.context.values[this.name] : value;
    // the invocation of schemaCompatibilityLayer must be after value hydratation
    // since it redefines the value but it must be before building
    // the children because it sets the type of node as well
    this.schema = this.schemaCompatibilityLayer(schema);
    if (formatter) {
      this.value = formatter(this.value, this.type);
    }
    this.buildChildren();
    this.saveDecorators();
    this.onChange(this.value, false);
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
  public onChange(value: any, validate = true, callParent = true) {
    this.value = value;
    this.updateVariant(value);
    if (callParent) {
      this.updateParent(
        this.name,
        this.isVariant ? this.childrenData() : value,
      );
    }
    return validate ? this.validate() : this.errors;
  }

  // This method allows bubbling up the values of the children
  // when they change, for some type of nodes, we want to skip
  // to the next parent because the node is an abstraction
  // ei: the polymorphic and list nodes have values that represent
  // their list of selected variants instead of the value of their children
  // so they will just pass up the value to the next node above them
  public onChildrenChange(childrenName: string, childrenValue: any) {
    // for intermediary nodes, values are objects representing children
    if (
      (this.attributes.length && this.value === null) ||
      this.value === undefined
    ) {
      this.value = {};
    }
    // polymorphic nodes values are the polymorphic selection
    // we skip that level but we register the selection on the parent's level
    if (this.isVariant) {
      this.updateParent(this.name, {
        ...childrenValue,
        [`${this.name}Type`]: childrenName,
      });
      return;
    }
    // same for lists
    if (this.isList) {
      this.updateParent(
        this.name,
        this.value.map((item: SchemaNode) => item.childrenData()),
      );
      return;
    }
    // other types of nodes just get updated
    this.onChange({
      ...this.value,
      [childrenName]: childrenValue,
    });
  }

  public validate(): ValidationError[] {
    if (!this.schema.validators) return [];

    this.errors = this.schema.validators
      .map((config) => {
        const fn = this.context.validators[config.name];
        if (!fn) return null;
        return fn(this.value, config);
      })
      .filter(Boolean) as ValidationError[];

    return this.errors;
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
      this.path.add('-1', true),
      null,
      (value, path) => this.onChildrenChange(value, path),
    );
    this.value.push(node);
    this.buildChildren();
    return node;
  }

  public removeListItem(index: number) {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    this.value.splice(index, 1);
    this.buildChildren();
  }

  public deleteSelf() {
    throw new Error('deleteSelf is callable on list node children only');
  }

  // utilities
  private updateVariant(value: string) {
    if (this.isVariant) {
      this.path.segments.splice(-1, 1, new PathSegment(value));
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
        (value, path) => this.onChildrenChange(value, path),
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
      if (Array.isArray(type)) {
        // We remap from the Legacy Schema syntax
        type = type[0];
        this.isList = true;
        // List node have their children in the value attribute
        if (!Array.isArray(this.value)) {
          this.value = [];
        }
      } else if (Array.isArray(type.polymorphic)) {
        // we don't need to read the polymorphic attributes
        // as they are just a list of the keys in attributes
        // instead we change the type for a plain string
        type = 'polymorphic';
        this.isVariant = true;
        const options = Object.keys(schema.attributes || {});
        // Making sure we have something selected
        if (options.indexOf(this.value) === -1) {
          this.value = options[0];
        }
      }
    }

    // If we have a node with options and no values,
    // preselecting the first option if present
    if (schema.options) {
      this.value = this.value || schema.options[0] || '';
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

  // This method calculate the node's value
  // descending all it's children
  private childrenData(validate = false): {[key: string]: any} {
    if (this.isVariant) {
      return this.attributes.reduce((acc, key) => {
        if (key === this.value) {
          Object.assign(acc, this.children[key].childrenData());
          acc[`${this.name}Type`] = this.value;
        }
        return acc;
      }, {} as any);
    }
    if (this.isList) {
      return this.value.map((item: SchemaNode) => item.childrenData());
    } else if (this.attributes.length) {
      const value = this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].childrenData();
        return acc;
      }, {} as any);
      this.value = value;
      return value;
    }

    if (validate) this.validate();

    const formatter = this.context.formatters.remote;
    return formatter ? formatter(this.value, this.schema.type) : this.value;
  }
}
