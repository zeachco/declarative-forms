import React from 'react';

import {NodeProps, SchemaNode} from '../../../lib/types';
import {useNode} from '../../../lib/utilities/hook';
import {renderNodes} from '../../../lib/utilities/RenderNode';

export function ListNode({node}: NodeProps) {
  const {errors} = useNode(node);

  const jsx: React.ReactNodeArray = [];
  node.value.forEach((subNode: SchemaNode, index: number) => {
    jsx.push(
      <div key={node.uid}>
        <button
          type="button"
          style={{float: 'right'}}
          onClick={handleRemoveForIndex(index)}
        >
          Remove item
        </button>
        {renderNodes({subNode})}
      </div>,
    );
  });

  return (
    <div>
      <h4>{node.translate('label')}: </h4>
      {errors.map((error) => (
        <strong key={error.type}>{node.translate('error', {error})}</strong>
      ))}
      {jsx}
      <button type="button" onClick={handleAddItem}>
        Add item
      </button>
    </div>
  );

  function handleAddItem() {
    node.addListItem();
  }

  function handleRemoveForIndex(index: number) {
    return () => node.removeListItem(index);
  }
}
