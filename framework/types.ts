export type NodeKind = 'polymorphic' | 'string' | 'list' | 'group';
export type NodeValue = any;
export type ReactComponent = any;

export interface Validator {
  name: string;
  format?: string;
}

export type ValidatorFn = (val: NodeValue, options: Validator) => string;

export interface SchemaNodeDefinitionLegacy {
  kind: NodeKind | [NodeKind] | { polymorphic: string[] };
  attributes?: Record<string, SchemaNodeDefinition>;
  validators?: Validator[];
  meta?: Record<string, any>;
}

export interface SchemaNodeDefinition {
  kind: NodeKind;
  attributes?: Record<string, SchemaNodeDefinition>;
  validators?: Validator[];
  meta?: Record<string, any>;
}
