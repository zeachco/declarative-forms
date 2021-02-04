import React from 'react';

import {NodeProps, SchemaNode} from '../types';
import {useNode} from '../utilities/hook';

import {RootNode} from './RootNode';

export function ListNode({node}: NodeProps) {
  const {errors, addListItem} = useNode(node);

  const jsx: React.ReactNodeArray = [];
  // HACK deleting a node < max length shift the dom elements and cause fields to be irresponsive
  const uid = Math.random();

  node.value.forEach((subNode: SchemaNode) => {
    jsx.push(
      <div key={uid}>
        <button
          type="button"
          style={{float: 'right'}}
          onClick={subNode.deleteSelf}
        >
          Remove item
        </button>
        <RootNode key={subNode.uid} node={subNode} />
      </div>,
    );
  });

  return (
    <div>
      <h4>{node.translate('label')}: </h4>
      {errors.map((error) => (
        <strong key={error}>{node.translate('error', {error})}</strong>
      ))}
      {jsx}
      <button type="button" onClick={addListItem}>
        Add item
      </button>
    </div>
  );
}
