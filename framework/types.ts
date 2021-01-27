export type NodeKind = 'polymorphic' | 'string' | 'list' | 'group' | string;
export type NodeValue = any;
export type ReactComponent = any;

export interface Validator {
  name: string;
  format?:
    | string
    | {
        greater_than?: number;
        less_than?: number;
        allow_nill?: boolean;
      };
}

export type ValidatorFn = (val: NodeValue, options: Validator) => string;

export interface SchemaNodeDefinitionLegacy {
  kind: NodeKind | NodeKind[] | { polymorphic: string[] };
  attributes?: Record<string, SchemaNodeDefinitionLegacy>;
  validators?: Validator[];
  meta?: Record<string, any>;
}

export interface SchemaNodeDefinition {
  kind: NodeKind;
  attributes?: Record<string, SchemaNodeDefinition>;
  validators?: Validator[];
  meta?: Record<string, any>;
}
