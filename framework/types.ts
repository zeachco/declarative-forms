export type NodeKind<T = string> = "polymorphic" | "string" | "list" | T;
export type NodeValue = any;
export type ReactComponent = any;

export interface Validator {
  name: string;
  format?: string;
}

export type ValidatorFn = (val: NodeValue, options: Validator) => string;

export interface SchemaNodeDefinition {
  kind?: NodeKind | [NodeKind];
  attributes?: Record<string, SchemaNodeDefinition>;
  validators?: Validator[];
  meta?: Record<string, any>;
}

export interface NodeProps {
  node: Node;
}
