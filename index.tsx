import React from "react";
import { render } from "react-dom";
import "./style.css";

import {SCHEMA} from './schema'

console.clear();

interface Validator {
  name: string
  format?: string
}

type ValidatorFn = (val: any, options: Validator) => string;

const NoValidator: ValidatorFn = (_) => '';

const validatorFunctions : Record<string, ValidatorFn>= {
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

type NodeKind = keyof typeof plugins;

interface SchemaNodeDefinition {
  kind?: NodeKind;
  attributes?: Record<string, SchemaNodeDefinition>;
  validators?: Validator[];
  meta?: Record<string, any>;
}

class Node {
  public name: string;
  public errors: string[] = [];
  public children: Record<string,Node>;
  public schema: SchemaNodeDefinition;

  constructor(
    public path: string,
    schema: SchemaNodeDefinition,
    public value: any = null,
  ) {
    // compatibility layer
    const options = (schema?.kind as any)?.polymorphic
    
    this.schema = {
      ...schema,
      kind: Array.isArray(options) ? 'polymorphic' : schema.kind,
    }

    if (Array.isArray(this.schema.kind)) {
      this.schema.kind = 'list';
    }

    if (this.schema.kind === 'polymorphic' ) {
      this.value = this.value || options[0]
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

const legacyConfig = parseSchema(SCHEMA);

const treeConfig: Record<string, Node> = {
  fistName: new Node('fistName', {kind:'string'}),
  lastName: new Node('lastName', {kind:'string'}),
  birthDate: new Node('birthDate', {kind:'date'}),
  street: new Node('street', {kind:'string'}),
  zip: new Node('zip', {kind:'string'}),
  region: new Node('region', {kind: 'region',validators: [{name: 'Presence'}]}, 'QC'),
  ...legacyConfig,
};

class Mutator {
  constructor(
    public path: string,
    public mode: 'replace' | 'wrap' | 'prepend' | 'append',
    public component: any,
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

console.log(treeConfig)

interface NodeProps {
  node: Node;
}

function useNode(node:Node) {
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

function StringNode({ node }: NodeProps) {
  const {onChange, errors} = useNode(node);
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
  const variant = node.children[node.value]
  console.log('poly node render');
  return (
    <div>
      <label>{node.path} :</label>
      <select onChange={onChange}>
        {options.map(key => <option key={key}>{key}</option>)}
      </select>
      {errors.map(err => <strong>{err}</strong>)}
      {variant && <SchemaRender config={variant} />}
    </div>
  );
}

function ListNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  const options = Object.keys(node.schema.attributes);
  const variant = node.children[node.value]
  console.log('poly node render');
  return (
    <div>
      <label>{node.path} :</label>
      <select onChange={onChange}>
        {options.map(key => <option key={key}>{key}</option>)}
      </select>
      {errors.map(err => <strong>{err}</strong>)}
      {variant && <SchemaRender config={variant} />}
    </div>
  );
}

function UndefinedKindNode({ node }: NodeProps) {
  // { node.schema.kind } { node.value }
  return (
    <div>
    error
    </div>
  );
}

function SchemaRender({ config }) {
  return (
    <div>
      {Object.keys(config).map(key => {
        const node = config[key] as Node;
        if(!node) {
          return <div>"{key}" plugin can't be found</div>
        }
        const Plugin = getPluginComponent(node.schema?.kind);
        return <Plugin key={key} node={node} />;
      })}
    </div>
  );
}

function getPluginComponent(kind: NodeKind) {
  return plugins[kind] || UndefinedKindNode
}

function App() {
  // const [count, changeCount] = React.useState(0)
  // React.useEffect(() => {
    // treeConfig.updateValidators()
  // })
  return (
    <div>
      <SchemaRender config={treeConfig} />
    </div>
  );
}

render(<App />, document.getElementById("root"));
