import { Button } from '@shopify/polaris';
import React from 'react';

import { NodeProps, RootNode, SchemaNode, useNode } from '../../framework';

export function PeopleListNode({ node, context }: NodeProps) {
  const { errors, addListItem } = useNode(node);

  const additionnalOwnersJsx: React.ReactNodeArray = [];

  node.value.forEach((subNode: SchemaNode, index: number) => {
    // HACK to avoid react key collisions when deleting nodes
    const uid = Math.random();
    additionnalOwnersJsx.push(
      <React.Fragment key={uid}>
        <RootNode context={context} node={subNode} />
      </React.Fragment>
    );
  });

  return (
    <div>
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
      {additionnalOwnersJsx}
      <Button onClick={addListItem}>Add an owner</Button>
    </div>
  );
}
