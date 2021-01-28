import React from 'react';
import { useNode } from '../hook';
import { SchemaNode } from '../SchemaNode';
import { NodeProps, RootNode } from './RootNode';

export function ListNode({ node, context }: NodeProps) {
  const { onChange, errors } = useNode(node);

  const jsx: React.ReactNodeArray = [];

  node.value.forEach((subNode: SchemaNode) => {
    jsx.push(<RootNode key={subNode.uid} context={context} node={subNode} />);
  });

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
    node.value.push(new SchemaNode(context, subPath, node.schema));
    onChange(node.value);
  }
}
