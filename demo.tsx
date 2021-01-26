import React from "react";
import { NodeProps } from "./framework/types";
import { NodeValue } from "./framework/types";
import { ReactComponent } from "./framework/types";
import { SchemaProps } from "./framework/types";
import { NodeKind } from "./framework/types";
import { SchemaNodeDefinition } from "./framework/types";
import { Validator } from "./framework/types";
import { ValidatorFn } from "./framework/types";
import { SCHEMA } from './schema'

// PLUGINS

const NoValidator: ValidatorFn = (_) => '';

const validatorFunctions: Record<string, ValidatorFn> = {
  Presence(val, options: Validator) {
    return Boolean(val) ? '' : 'Must be present'
  }
}

const plugins = {
  string: StringNode,
  date: StringNode,
  region: StringNode,
  list: ListNode,
  polymorphic: PolyNode,
};

function StringNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  return (
    <div>
      <label>{node.path} : </label>
      <input value={node.value} onChange={onChange} />
      {errors.map(err => <strong>{err}</strong>)}
    </div>
  );
}

function PolyNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  const options = Object.keys(node.schema.attributes);
  const variant = node.children[node.value].schema.attributes
  console.log('poly node render');
  return (
    <div>
      <label>{node.path} :</label>
      <select onChange={onChange}>
        {options.map(key => <option key={key}>{key}</option>)}
      </select>
      {errors.map(err => <strong>{err}</strong>)}
      {variant && <SchemaRender treeConfig={variant} />}
      {JSON.stringify(variant)}
    </div>
  );
}

function ListNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  const options = Object.keys(node.schema.attributes);
  const variant = node.children[node.value]
  console.log('list node render');
  return (
    <div>
      <label>{node.path} :</label>
      ListNode...
      {errors.map(err => <strong>{err}</strong>)}
    </div>
  );
}

function UndefinedKindNode({ node }: NodeProps) {
  return (
    <div>
      { node.schema?.kind } { node.value }
    </div>
  );
}

// FORM FRAMEWORK

class Node {
  public name: string;
  public errors: string[] = [];
  public children: Record<string, Node>;
  public schema: SchemaNodeDefinition;
  public childrenKind: string = '';

  constructor(
    public path: string,
    schema: SchemaNodeDefinition = {},
    public value: NodeValue = null,
  ) {
    // compatibility layer
    const options = (schema?.kind as any)?.polymorphic

    this.schema = {
      ...schema,
      kind: Array.isArray(options) ? 'polymorphic' : schema.kind,
    }

    if (Array.isArray(this.schema.kind)) {
      this.schema.childrenKind = this.schema.kind[0];
      this.schema.kind = 'list';
    }

    if (this.schema.kind === 'polymorphic') {
      this.value = this.value || options[0]
    }

    if (this.schema.attributes && !plugins[this.schema.kind]) {
      this.schema.kind = 'group'
    }

    this.children = parseSchema(schema.attributes, path);
  }

  onChange = (value: any) => {
    // supports native event as well
    this.value = value?.target?.value === undefined ? value : value?.target?.value
    this.validate();
  }

  validate = () => {
    if (!this.schema.validators) return [];

    this.errors = this.schema.validators
      .map(getValidatorFn)
      .map(([fn, config]) => fn(this.value, config))
      .filter(Boolean);

    return this.errors;
  }
}

function getValidatorFn(validatorConfig: Validator) {
  return [validatorFunctions[validatorConfig.name] || NoValidator, validatorConfig]
}

function parseSchema(schema, parentPath = '') {
  const config: Record<string, Node> = {}
  for (let key in schema) {
    const path = parentPath ? [parentPath, key].join('.') : key
    config[key] = new Node(path, schema[key])
  }
  return config
}

class Mutator {
  constructor(
    public path: string,
    public mode: 'replace' | 'wrap' | 'prepend' | 'append',
    public component: ReactComponent,
  ) {

  }
}

class TreeConfig {
  constructor(
    public schema: Record<string, Node>,
    public validators: ValidatorFn[],
  ) {

  }
}

function getPluginComponent(kind: NodeKind): ReactComponent {
  if (!kind) {
    console.warn({kind})
  }
  return plugins[kind] || UndefinedKindNode
}

function SchemaRender({ treeConfig }: SchemaProps) {
  console.log(treeConfig)
  return (
    <div>
      {Object.keys(treeConfig).map(key => {
        const node = treeConfig[key] as Node;
        if (!node) {
          return <div>"{key}" plugin can't be found</div>
        }
        if(!node.schema) {
          console.warn(node)
          return <div>"{key}" has no schema</div>
        }
        const Plugin = getPluginComponent(node.schema?.kind);
        return <Plugin key={key} node={node} />;
      })}
    </div>
  );
}

function useNode(node: Node) {
  const [state, changeState] = React.useState({
    errors: [] as string[],
    onChange(val) {
      node.onChange(val);
      changeState({
        ...state,
        errors: node.validate(),
      })
    },
  });
  return state;
}

// DEMO

const legacyConfig = parseSchema(SCHEMA);

const treeConfig: Record<string, Node> = {
  fistName: new Node('fistName', { kind: 'string' }),
  lastName: new Node('lastName', { kind: 'string' }),
  birthDate: new Node('birthDate', { kind: 'date' }),
  street: new Node('street', { kind: 'string' }),
  zip: new Node('zip', { kind: 'string' }),
  region: new Node('region', { kind: 'region', validators: [{ name: 'Presence' }] }, 'QC'),
  ...legacyConfig,
};

console.log(treeConfig);

export function App() {
  return (
    <div>
      <SchemaRender treeConfig={treeConfig} />
    </div>
  );
}
