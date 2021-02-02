export type NodeKind = string;
export type NodeValue = any;
export type ReactComponent = any;
export type FormatterFn = (value: any, type: string) => any;

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

export type ValidatorFn = (val: NodeValue, options: Validator) => string;

export interface SchemaNodeDefinitionLegacy {
  type: NodeKind | NodeKind[] | { polymorphic: string[] };
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
