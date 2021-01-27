import { DeclarativeFormContext } from './DeclarativeFormContext';
import {
  NodeKind,
  NodeValue,
  SchemaNodeDefinition,
  SchemaNodeDefinitionLegacy,
} from './types';

export class Node<T = never> {
  public errors: string[] = [];
  public children: Map<string, Node<T>>;
  public schema: SchemaNodeDefinition;
  public value: NodeValue = null;

  constructor(
    public context: DeclarativeFormContext,
    public path: string,
    schema: SchemaNodeDefinitionLegacy
  ) {
    this.schema = schemaCompatibilityLayer(schema);
    this.value = this.context.values[this.path];

    // autoselect first polymorphic options if undefined
    if (this.schema.kind === 'polymorphic') {
      const options = Object.keys(this.schema.attributes || {});
      if (options.indexOf(this.value) === -1) {
        this.value = options[0];
      }
    }

    this.children = buildChildren(this.context, this.path, this.schema);
  }

  onChange = (value: any) => {
    // supports native event as well
    this.value =
      value?.target?.value === undefined ? value : value?.target?.value;
    this.validate();
  };

  validate = () => {
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
}

function schemaCompatibilityLayer(
  schema: SchemaNodeDefinitionLegacy
): SchemaNodeDefinition {
  let kind = schema.kind || 'group';
  let isList = false;

  if (typeof kind !== 'string') {
    if (Array.isArray(kind)) {
      isList = true;
      kind = kind[0];
    } else if (Array.isArray(kind.polymorphic)) {
      kind = 'polymorphic';
    }
  }

  return {
    ...schema,
    kind: kind as NodeKind,
    isList,
  };
}

function buildChildren(
  context: DeclarativeFormContext,
  path: string,
  schema: SchemaNodeDefinition
) {
  const children = new Map<string, Node>();
  for (let key in schema.attributes) {
    const subPath = path ? [path, key].join('.') : key;
    children.set(key, new Node(context, subPath, schema.attributes[key]));
  }
  return children;
}
