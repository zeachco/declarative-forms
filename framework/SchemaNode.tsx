import { DeclarativeFormContext } from './DeclarativeFormContext';
import { Decorator } from './Decorator';
import {
  NodeKind,
  NodeValue,
  SchemaNodeDefinition,
  SchemaNodeDefinitionLegacy,
} from './types';

export class SchemaNode {
  public errors: string[] = [];
  public children: Record<string, SchemaNode>;
  public schema: SchemaNodeDefinition;
  public value: NodeValue = null;
  public isList = false;
  public attributes: string[] = [];
  public depth: number;
  public decorator: Partial<Decorator> = {};

  constructor(
    public context: DeclarativeFormContext,
    public path: string,
    schema: SchemaNodeDefinitionLegacy
  ) {
    this.depth = this.path.split('.').length;
    const formatter = this.context.formatters['local'];
    const value = this.context.values[this.path];
    this.value = value;
    this.schema = this.schemaCompatibilityLayer(schema);
    if (formatter) {
      this.value = formatter(value, this.schema.kind);
    }
    this.children = this.buildChildren();
    this.saveDecorators();
  }

  public get uid() {
    return [this.path, this.schema.kind].join('_');
  }

  public onChange = (value: any) => {
    this.value = value;
    return this.validate();
  };

  public validate = () => {
    if (!this.schema.validators) return [];

    this.errors = this.schema.validators
      .map((config) => {
        const fn = this.context.validators[config.name];
        if (!fn) return '';
        return fn(this.value, config);
      })
      .filter(Boolean);

    return this.errors;
  };

  public data(): Record<string, any> {
    if (this.schema.kind === 'polymorphic') {
      return this.attributes.reduce((acc, key) => {
        if ((key = this.value)) {
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
    const formatter = this.context.formatters['remote'];

    return formatter ? formatter(this.value, this.schema.kind) : this.value;
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
    new Error('deleteSelf is callable on list node children only');
  }

  // utilities
  private buildChildren() {
    const children: SchemaNode['children'] = {};
    if (this.isList) {
      this.value.forEach(
        (node: SchemaNode, newIndex: number) =>
          (node.path = [this.path, newIndex].join('.'))
      );
      return this.children;
    }
    for (let key in this.schema.attributes) {
      const subPath = this.path ? [this.path, key].join('.') : key;
      children[key] = new SchemaNode(
        this.context,
        subPath,
        this.schema.attributes[key]
      );
    }
    this.attributes = Object.keys(children);
    return children;
  }

  private saveDecorators() {
    this.context.decorators.forEach((decorator: Decorator) => {
      if (decorator.test(this)) {
        Object.assign(this.decorator, decorator, { test: null });
      }
    });
  }

  // magic happend to be retrocompatible and set some flags
  // warning, this method have side effets
  private schemaCompatibilityLayer(
    schema: SchemaNodeDefinitionLegacy
  ): SchemaNodeDefinition {
    let kind = schema.kind || 'group';

    if (typeof kind !== 'string') {
      if (Array.isArray(kind)) {
        kind = kind[0];
        this.isList = true;
        if (!Array.isArray(this.value)) {
          this.value = [];
        }
      } else if (Array.isArray(kind.polymorphic)) {
        kind = 'polymorphic';
        const options = Object.keys(schema.attributes || {});
        if (options.indexOf(this.value) === -1) {
          this.value = options[0];
        }
      }
    }

    return {
      ...schema,
      attributes: schema.attributes as SchemaNodeDefinition['attributes'],
      kind: kind as NodeKind,
    };
  }
}
