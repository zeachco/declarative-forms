import React from "react";
import { NodeProps, NodeValue, SchemaNodeDefinitionLegacy } from "./framework/types";
import { SchemaNodeDefinition } from "./framework/types";
import { Validator } from "./framework/types";
import { ValidatorFn } from "./framework/types";
import { SCHEMA } from './schema'

// PLUGINS

const noValidator: ValidatorFn = (_) => '';

const validatorFunctions: Record<string, ValidatorFn> = {
  Presence(val, _options: Validator) {
    return Boolean(val) ? '' : 'PresenceError :: Field must be defined'
  },
  Format(val, options: Validator) {
    if (!options.format) {
      return '';
    }
    const exp = new RegExp(options.format)
    return exp.test(val) ? '' : `FormatError :: Field does not match expression ${options.format}`
  }
}

const plugins = {
  string: StringNode,
  date: StringNode,
  region: StringNode,
  list: ListNode,
  polymorphic: PolyNode,
};

function UndefinedKindNode({ node }: NodeProps) {
  return (
    <div>
      [{ node.schema?.kind} {node.value} {JSON.stringify(Object.keys(node.children))}]
    </div>
  );
}

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

function ListNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  const options = Object.keys(node.schema.attributes);
  const variant = node.children[node.value]
  return (
    <div>
      <label>{node.path} :</label>
      [ListNode...]
      {errors.map(err => <strong>{err}</strong>)}
    </div>
  );
}

function PolyNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  
  if (!node) {
    return <pre>{JSON.stringify({node})}</pre>
  }
  
  const optionsJsx: React.ReactNodeArray = []
  node.children.forEach((_,key) => {
    optionsJsx.push(<option key={key}>{key}</option>)
  })

  const subNode = node.children.get(node.value)
  
  return (
    <div>
      <label>{node.path} :</label>
      <select onChange={onChange}>
        {optionsJsx}
      </select>
      {errors.map(err => <strong>{err}</strong>)}
      {subNode && <SchemaNodeComponent node={subNode} />}
    </div>
  );
}

// FORM FRAMEWORK
class Node {
  public name: string;
  public errors: string[] = [];
  public children: Map<string, Node>;
  public schema: SchemaNodeDefinition;

  constructor(
    public path: string,
    schema: SchemaNodeDefinitionLegacy = {},
    public value: NodeValue = null,
  ) {
    // compatibility layer
    const options = (schema?.kind as any)?.polymorphic

    this.schema = {
      ...schema,
      kind: Array.isArray(options) ? 'polymorphic' : schema.kind,
    }

    if (this.schema.kind === 'polymorphic') {
      this.value = this.value || options[0];
    }

    if (Array.isArray(this.schema.kind)) {
      this.schema.kind = 'list';
    }

    this.buildChildren();
  }

  onChange = (value: any) => {
    // supports native event as well
    this.value = value?.target?.value === undefined ? value : value?.target?.value
    this.validate();
  }

  validate = () => {
    if (!this.schema.validators) return [];

    this.errors = this.schema.validators
      .map((config) => {
        const fn = validatorFunctions[config.name] || noValidator;
        return fn(this.value, config);
      })
      .filter(Boolean);

    return this.errors;
  }

  buildChildren() {
    const children = new Map<string, Node>();
    for (let key in this.schema.attributes) {
      const path = this.path ? [this.path, key].join('.') : key
      children.set(key, new Node(path, this.schema.attributes[key]))
    }
    this.children = children;
  }
}

function SchemaNodeComponent({ node }: NodeProps) {
  const jsx: React.ReactNodeArray = [];

  node.children.forEach((childNode: Node) => {
    const key = childNode.path;

    const pluginName = plugins[childNode.schema?.kind]?.toString().split('(')[0].replace('function ', '') || childNode.schema?.kind
    jsx.push(
      <div>
        &lt;{pluginName} /&gt;
      </div>
    );

    if (!childNode.schema) {
      jsx.push(<div key={key}>"{key}" has no schema</div>);
      return;
    }

    const Plugin = plugins[childNode.schema?.kind];

    if (Plugin) {
      jsx.push (<Plugin key={key} node={childNode} />);
      return;
    }

    childNode.children.forEach(child => {
      jsx.push(<SchemaNodeComponent key={child.path} node={child} />)
    })
    return;
    
  })

  return <div>{jsx}</div>;
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

const legacyConfigWrappedInNodes = new Node('', {attributes: SCHEMA});

export function App() {
  return (
    <div>
      <SchemaNodeComponent node={legacyConfigWrappedInNodes} />
    </div>
  );
}
