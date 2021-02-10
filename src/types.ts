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
  options: Validator
) => ValidationError | null;

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
  type: NodeKind | NodeKind[] | {polymorphic: string[]};
  attributes?: Record<string, SchemaNodeDefinitionLegacy>;
  validators?: Validator[];
  meta?: Record<string, any>;
}

export interface SchemaNodeDefinition {
  type: NodeKind;
  attributes?: Record<string, SchemaNodeDefinition>;
  validators?: Validator[];
  meta?: Record<string, any>;
}

// Components
export interface NodeProps {
  node: SchemaNode;
  children?: React.ReactNode;
}

export interface FormContext {
  debug: boolean;
  plugins: Record<string, ReactComponent> & {
    polymorphic?: ReactComponent;
    string?: ReactComponent;
    integer?: ReactComponent;
    boolean?: ReactComponent;
  };
  validators: Record<string, ValidatorFn> & {
    Presence?: ValidatorFn;
    Length?: ValidatorFn;
    Format?: ValidatorFn;
  };
  values: Record<string, any>;
  formatters: Record<string, FormatterFn> & {
    local?: FormatterFn;
    remote?: FormatterFn;
  };
  translators: Record<string, TranslatorFn> & {
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
export type DecoratorObject = Omit<Decorator, 'test'>;

// decorator props to components
type Noop = (props: any) => React.ReactNode;
type GetProps<T extends Noop> = T extends (args: infer P) => any ? P : never;
type SpecialProps<T extends Noop> = Omit<GetProps<T>, keyof NodeProps>;
export type DecoratorPropsGetter<T extends Noop> =
  | SpecialProps<T>
  | ((node: SchemaNode) => SpecialProps<T>);

export class Decorator {
  public Before?: DecoratorSlot;
  public After?: DecoratorSlot;
  public Wrap?: DecoratorSlot;
  public Pack?: DecoratorSlot;
  public Replace?: DecoratorSlot;

  constructor(public test: DecoratorMatcher) {}

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
    props?: DecoratorPropsGetter<T>
  ) {
    this[slotName] = {Node: fc, props};
    return this;
  }
}

// Schema Node
export class SchemaNode {
  public errors: ValidationError[] = [];
  public children: Record<string, SchemaNode>;
  public schema: SchemaNodeDefinition;
  public value: NodeValue = null;
  public isList = false;
  public attributes: string[] = [];
  public depth: number;
  public decorator: Partial<Decorator> = {};

  constructor(
    public context: FormContext,
    public path: string,
    schema: SchemaNodeDefinitionLegacy
  ) {
    this.depth = this.path.split('.').length - 1;
    const formatter = this.context.formatters.local;
    const value = this.context.values[this.path];
    this.value = value;
    this.schema = this.schemaCompatibilityLayer(schema);
    if (formatter) {
      this.value = formatter(this.value, this.schema.type);
    }
    this.children = this.buildChildren();
    this.saveDecorators();
  }

  public get uid() {
    return [this.path, this.schema.type].join('_');
  }

  public onChange(value: any) {
    this.value = value;
    return this.validate();
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

  public translate(mode: 'label' | 'error' | string, args?: any): string {
    const {translators} = this.context;
    const translator =
      translators[mode as keyof typeof translators] || translators.default;
    if (!translator) {
      return '';
    }
    return translator(this, args) || '';
  }

  public data(): Record<string, any> {
    if (this.schema.type === 'polymorphic') {
      return this.attributes.reduce((acc, key) => {
        if (key === this.value) {
          acc[key] = this.children[key].data();
        }
        return acc;
      }, {} as any);
    }
    if (this.isList) {
      return this.value.map((item: SchemaNode) => item.data());
    } else if (this.attributes.length) {
      return this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].data();
        return acc;
      }, {} as any);
    }
    const formatter = this.context.formatters.remote;

    return formatter ? formatter(this.value, this.schema.type) : this.value;
  }

  // methods specific to list type
  public addListItem() {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    const node = new SchemaNode(this.context, '', this.schema);
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
  private buildChildren(): SchemaNode['children'] {
    const children: SchemaNode['children'] = {};
    if (this.isList) {
      this.value.forEach((node: SchemaNode, newIndex: number) => {
        node.path = [this.path, newIndex].join('.');
      });
      return this.children;
    }

    if (!this.schema.attributes) {
      return {};
    }
    this.attributes = Object.keys(this.schema.attributes);
    this.attributes.forEach((key) => {
      const attributes = this.schema.attributes || {};
      const schema = attributes[key] as SchemaNodeDefinition;
      const subPath = this.path ? [this.path, key].join('.') : key;
      children[key] = new SchemaNode(this.context, subPath, schema);
    });
    this.attributes = Object.keys(children);
    return children;
  }

  private saveDecorators() {
    this.context.decorators.forEach((decorator: Decorator) => {
      if (decorator.test(this)) {
        Object.assign(this.decorator, decorator, {test: null});
      }
    });
  }

  // magic happend to be retrocompatible and set some flags
  // warning, this method have side effets
  private schemaCompatibilityLayer(
    schema: SchemaNodeDefinitionLegacy
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

    return {
      ...schema,
      attributes: schema.attributes as SchemaNodeDefinition['attributes'],
      type: type as NodeKind,
    };
  }
}

export class ValidationError {
  constructor(public type: string, public data?: Record<string, any>) {}
}
