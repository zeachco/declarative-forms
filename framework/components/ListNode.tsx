import React from 'react';

import { useNode } from '../utilities/hook';
import { SchemaNode } from '../SchemaNode';

import { NodeProps, RootNode } from './RootNode';

export function ListNode({ node, context }: NodeProps) {
  const { errors, addListItem } = useNode(node);

  const jsx: React.ReactNodeArray = [];
  // HACK deleting a node < max length shift the dom elements and cause fields to be irresponsive
  const uid = Math.random();

  node.value.forEach((subNode: SchemaNode) => {
    jsx.push(
      <div key={uid}>
        <button
          type="button"
          style={{ float: 'right' }}
          onClick={subNode.deleteSelf}
        >
          X
        </button>
        <RootNode key={subNode.uid} context={context} node={subNode} />
      </div>
    );
  });

  return (
    <div>
      <h4>{node.translate(node.path, 'label')}: </h4>
      {errors.map((err) => (
        <strong key={err}>{node.translate(err, 'error')}</strong>
      ))}
      {jsx}
      <button type="button" onClick={addListItem}>
        Add node
      </button>
    </div>
  );
}
