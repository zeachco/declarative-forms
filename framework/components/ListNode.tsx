import React from 'react';
import { useNode } from '../utilities/hook';
import { SchemaNode } from '../SchemaNode';
import { NodeProps, RootNode } from './RootNode';

export function ListNode({ node, context }: NodeProps) {
  const { validate, errors } = useNode(node);

  const jsx: React.ReactNodeArray = [];

  node.value.forEach((subNode: SchemaNode, index: number) => {
    const handleDelete = () => {
      node.removeListItem(index);
      validate();
    };
    jsx.push(
      <div>
        <button style={{ float: 'right' }} onClick={handleDelete}>
          X
        </button>
        <RootNode key={subNode.uid} context={context} node={subNode} />
      </div>
    );
  });

  return (
    <div>
      <label>{node.translate(node.path, 'label')}: </label>
      {errors.map((err) => (
        <strong key={err}>{node.translate(err, 'error')}</strong>
      ))}
      {jsx}
      <button onClick={handleAdd}>Add node</button>
    </div>
  );

  function handleAdd() {
    node.addListItem();
    validate();
  }
}
