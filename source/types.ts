/* eslint-disable @typescript-eslint/naming-convention */
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
  format?:
    | string
    | {
        greater_than?: number;
        less_than?: number;
        allow_nill?: boolean;
      };
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
  where(fn: DecoratorMatcher): Decorator;
}

// Decorators
export type DecoratorKeys = 'Replace' | 'Before' | 'After' | 'Wrap' | 'Pack';

interface DecoratorSlot {
  Node?: ReactComponent;
  props?: object | Function;
}

type DecoratorMatcher = (node: SchemaNode) => boolean;
export type DecoratorObject = Partial<Omit<Decorator, 'match'>>;

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

export class Decorator {
  public Before?: DecoratorSlot;
  public After?: DecoratorSlot;
  public Wrap?: DecoratorSlot;
  public Pack?: DecoratorSlot;
  public Replace?: DecoratorSlot;

  constructor(public match: DecoratorMatcher) {}

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
  ) {
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

// Schema Node
export class SchemaNode {
  public errors: ValidationError[] = [];
  public children: NodeChildrenMap = {};
  public schema: SchemaNodeDefinition;
  public isList = false;
  public attributes: string[] = [];
  public depth: number;
  public name: string;
  public type = '';
  public decorator: DecoratorObject = {};

  constructor(
    public context: FormContext,
    schema: SchemaNodeDefinitionLegacy,
    public path: string = '',
    public pathShort: string = path,
    public pathVariant: string = path,
    public value: NodeValue = NO_VALUE,
    private updateParent: SchemaNode['onChildrenChange'] = () => {},
  ) {
    const split = (this.path && this.path.split('.')) || [];
    this.depth = split.length;
    this.name = split.reverse()[0] || '';
    const formatter = this.context.formatters.local;
    this.value =
      value === NO_VALUE
        ? this.context.values[this.path] || this.context.values[this.name]
        : value;
    this.schema = this.schemaCompatibilityLayer(schema);
    if (formatter) {
      this.value = formatter(this.value, this.type);
    }
    this.buildChildren();
    this.saveDecorators();
    this.onChange(this.value, false);
  }

  public get uid() {
    return [this.pathVariant, this.type].join('_');
  }

  public onChange(value: any, validate = true, callParent = true) {
    this.value = value;
    this.updateVariant(value);
    if (callParent) {
      if (this.type === 'polymorphic') {
        this.updateParent(this.name, this.childrenData());
      } else {
        this.updateParent(this.name, value);
      }
    }
    return validate ? this.validate() : this.errors;
  }

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
    if (this.type === 'polymorphic') {
      this.updateParent(this.name, {
        ...childrenValue,
        [`${this.name}Type`]: childrenName,
      });
      return;
    }
    // same for lists
    if (this.isList) {
      // TODO update value correctly FIXME
      this.updateParent(this.name, childrenValue);
      return;
    }
    // other types of nodes just get updated
    this.onChange({
      ...this.value,
      [childrenName]: childrenValue,
    });
  }

  public updateVariant(value: string) {
    if (this.type === 'polymorphic') {
      this.pathVariant = `${this.pathVariant.replace(/\[.*\]$/, ``)}[${value}]`;
    }
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
      this.path,
      this.pathShort,
      this.pathVariant,
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
  private buildChildren() {
    const children: SchemaNode['children'] = {};
    if (this.isList) {
      this.value.forEach((node: SchemaNode, newIndex: number) => {
        node.path = [this.path, newIndex].join('.');
        node.buildChildren();
      });
      return;
    }

    if (!this.schema.attributes) return {};

    this.attributes = Object.keys(this.schema.attributes);
    this.attributes.forEach((key) => {
      const attributes = this.schema.attributes!;
      const schema = attributes[key] as SchemaNodeDefinition;

      const subPath = [this.path, key].filter(Boolean).join('.');
      const spreadPath = this.pathShort.split('.');
      let pathVariant = this.pathVariant;
      if (this.type === 'polymorphic') {
        pathVariant += `[${key}]`;
      } else {
        spreadPath.push(key);
        pathVariant += this.depth ? `.${key}` : key;
      }
      const subPathShort = spreadPath.filter(Boolean).join('.');

      children[key] = new SchemaNode(
        this.context,
        schema,
        subPath,
        subPathShort,
        pathVariant,
        this.children[key]?.value,
        (value, path) => this.onChildrenChange(value, path),
      );
    });
    this.children = children;
  }

  private saveDecorators() {
    this.context.decorators.forEach((decorator: Decorator) => {
      const {match, ...decoratorMods} = decorator;
      if (match(this)) {
        Object.assign(this.decorator, decoratorMods);
      }
    });
  }

  // magic happend to be retrocompatible and set some flags
  // warning, this method have side effets
  private schemaCompatibilityLayer(
    schema: SchemaNodeDefinitionLegacy,
  ): SchemaNodeDefinition {
    let type = schema.type || 'group';

    if (typeof type !== 'string') {
      if (Array.isArray(type)) {
        type = type[0];
        this.isList = true;
        if (!Array.isArray(this.value)) {
          this.value = [];
        }
      } else if (Array.isArray(type.polymorphic)) {
        type = 'polymorphic';
        const options = Object.keys(schema.attributes || {});
        if (options.indexOf(this.value) === -1) {
          this.value = options[0];
        }
      }
    }

    if (schema.options) {
      this.value = this.value || schema.options[0] || '';
    }

    this.type = type as NodeKind;

    return {
      ...schema,
      attributes: schema.attributes as SchemaNodeDefinition['attributes'],
      type: this.type,
    };
  }

  private childrenData(validate = false): {[key: string]: any} {
    if (this.type === 'polymorphic') {
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
