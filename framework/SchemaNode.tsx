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
  public decorator: Decorator | null = null;

  constructor(
    public context: DeclarativeFormContext,
    public path: string,
    schema: SchemaNodeDefinitionLegacy
  ) {
    const formatter = this.context.formatters['local'];
    const value = this.context.values[this.path];
    this.value = value;
    this.schema = this.schemaCompatibilityLayer(schema);
    if (formatter) {
      this.value = formatter(value, this.schema.kind);
    }
    this.children = buildChildren(this.context, this.path, this.schema);
    this.attributes = Object.keys(this.children);
    this.depth = this.path.split('.').length;

    const node = this;
    const decorator = this.context.decorators.find((d: Decorator) =>
      d.test(node)
    );
    if (decorator) {
      this.decorator = decorator;
    }
  }

  private saveDecorators(node: SchemaNode) {
    const decorator = node.context.decorators.find((d: Decorator) =>
      d.test(node)
    );
    if (decorator) {
      this.decorator = decorator;
    }
  }

  public get uid() {
    return [this.path, this.schema.kind, ...this.attributes].join('_');
  }

  public onChange = (value: any) => {
    this.value = value;
    this.validate();
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

  public addListItem() {
    if (!Array.isArray(this.value)) {
      this.value = [];
    }
    const subPath = [this.path, this.value.length].join('.');
    this.value.push(new SchemaNode(this.context, subPath, this.schema));
  }

  // TODO reshift children nodes
  public removeListItem(index: number) {
    if (!Array.isArray(this.value)) {
      this.value = [];
    }
    this.value.splice(index, 1);
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

function buildChildren(
  context: DeclarativeFormContext,
  path: string,
  schema: SchemaNodeDefinition
) {
  const children: SchemaNode['children'] = {};
  for (let key in schema.attributes) {
    const subPath = path ? [path, key].join('.') : key;
    children[key] = new SchemaNode(context, subPath, schema.attributes[key]);
  }
  return children;
}
