import {Button} from '@shopify/polaris';
import React from 'react';

import {NodeProps, RootNode, SchemaNode, useNode} from '../../framework';

export function PeopleListNode({node, context}: NodeProps) {
  const {errors, addListItem} = useNode(node);

  const additionnalOwnersJsx: React.ReactNodeArray = [];

  node.value.forEach((child: SchemaNode) => {
    // HACK to avoid react key collisions when deleting nodes
    const uid = Math.random();
    additionnalOwnersJsx.push(
      <RootNode key={uid} context={context} node={child} />,
    );
  });

  return (
    <div>
      {errors.map((err) => (
        <strong key={err}>{node.translate(err, 'error')}</strong>
      ))}
      {additionnalOwnersJsx}
      <Button onClick={addListItem}>Add an owner</Button>
    </div>
  );
}

export function PeopleDeleteButton({node}: NodeProps) {
  return (
    <Button destructive onClick={node.deleteSelf}>
      Delete
    </Button>
  );
}
