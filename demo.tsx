import * as React from 'react';
import {
  NodeKind,
  NodeValue,
  SchemaNodeDefinitionLegacy,
} from './framework/types';
import { SchemaNodeDefinition } from './framework/types';
import { Validator } from './framework/types';
import { ValidatorFn } from './framework/types';
import { SCHEMA } from './schema';

interface NodeProps {
  node: Node;
}
// PLUGINS

const noValidator: ValidatorFn = (_) => '';

const validatorFunctions: Record<string, ValidatorFn> = {
  Presence(val, _options: Validator) {
    return Boolean(val) ? '' : 'PresenceError :: Field must be defined';
  },
  Format(val, options: Validator) {
    if (!options.format) {
      return '';
    }
    const exp = new RegExp(options.format);
    return exp.test(val)
      ? ''
      : `FormatError :: Field does not match expression ${options.format}`;
  },
};

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
      <input value={node.value?.toString() || ''} onChange={onChange} />
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
    </div>
  );
}

function ListNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);

  const jsx: React.ReactNodeArray = ['[ListNode...]'];

  node.children.forEach((val, key) => {
    jsx.push(<pre key={key}>{JSON.stringify({ [key]: val })}</pre>);
  });

  return (
    <div>
      <label>{node.path} :</label>

      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
      {jsx}
      <button onClick={handleAddNew}>Add node</button>
    </div>
  );

  function handleAddNew() {
    const subPath = [node.path, node.value.length].join('.');
    onChange(node.value.push(new Node(subPath, node.schema)));
  }
}

function PolyNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);

  const optionsJsx: React.ReactNodeArray = [];
  node.children.forEach((_, key) => {
    optionsJsx.push(<option key={key}>{key}</option>);
  });

  const subNode = node.children.get(node.value);

  return (
    <div>
      <label>{node.path} :</label>
      <select onChange={onChange}>{optionsJsx}</select>
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {subNode && <SchemaNodeComponent node={subNode} />}
    </div>
  );
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

// FORM FRAMEWORK
class Node<T = never> {
  public errors: string[] = [];
  public children: Map<string, Node<T>>;
  public schema: SchemaNodeDefinition;

  constructor(
    public path: string,
    schema: SchemaNodeDefinitionLegacy,
    public value: NodeValue = null
  ) {
    this.schema = schemaCompatibilityLayer(schema);

    // autoselect first polymorphic options if undefined
    if (this.schema.kind === 'polymorphic') {
      const options = Object.keys(this.schema.attributes || {});
      if (options.indexOf(this.value) === -1) {
        this.value = options[0];
      }
    }

    this.children = buildChildren(this.path, this.schema);
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
        const fn = validatorFunctions[config.name] || noValidator;
        return fn(this.value, config);
      })
      .filter(Boolean);

    return this.errors;
  };
}

function buildChildren(path: string, schema: SchemaNodeDefinition) {
  const children = new Map<string, Node>();
  for (let key in schema.attributes) {
    const subPath = path ? [path, key].join('.') : key;
    children.set(key, new Node(subPath, schema.attributes[key]));
  }
  return children;
}

function SchemaNodeComponent({ node }: NodeProps) {
  const jsx: React.ReactNodeArray = [];

  node.children.forEach((childNode: Node) => {
    const key = childNode.path;

    const pluginName =
      plugins[childNode.schema.kind]
        ?.toString()
        .split('(')[0]
        .replace('function ', '') || childNode.schema?.kind;
    jsx.push(<div key={pluginName}>&lt;{pluginName} /&gt;</div>);

    if (!childNode.schema) {
      jsx.push(<div key={key}>"{key}" has no schema</div>);
      return;
    }

    const Plugin = plugins[childNode.schema.kind];

    if (Plugin) {
      jsx.push(<Plugin key={key} node={childNode} />);
      return;
    }

    childNode.children.forEach((child) => {
      jsx.push(<SchemaNodeComponent key={child.path} node={child} />);
    });
    return;
  });

  return <div>{jsx}</div>;
}

function useNode(node: Node) {
  if (!node) {
    throw new Error('no Node provided in useNode hook');
  }
  const [state, changeState] = React.useState({
    errors: [] as string[],
    onChange(val: any) {
      node.onChange(val);
      changeState({
        ...state,
        errors: node.validate(),
      });
    },
  });
  return state;
}

// DEMO

const legacyConfigWrappedInNodes = new Node('', {
  kind: 'group',
  attributes: SCHEMA,
});

export function App() {
  return (
    <div>
      <SchemaNodeComponent node={legacyConfigWrappedInNodes} />
    </div>
  );
}
