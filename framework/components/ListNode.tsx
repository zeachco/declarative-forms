import React from 'react';
import { useNode } from '../hook';
import { SchemaNode } from '../SchemaNode';
import { NodeProps } from './RootNode';

// this will be moved internal to framework
export function ListNode({ node, context }: NodeProps) {
  const { onChange, errors } = useNode(node);

  const jsx: React.ReactNodeArray = ['[ListNode...]'];

  for (const key in node.children) {
    const child = node.children[key];
    jsx.push(<pre key={key}>{JSON.stringify({ [key]: child })}</pre>);
  }

  return (
    <div>
      <label>{node.path}: </label>

      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
      {jsx}
      <button onClick={handleAddNew}>Add node</button>
    </div>
  );

  function handleAddNew() {
    const subPath = [node.path, node.value.length].join('.');
    onChange(node.value.push(new SchemaNode(context, subPath, node.schema)));
  }
}
