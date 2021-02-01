import { Button } from '@shopify/polaris';
import React from 'react';

import { NodeProps, RootNode, SchemaNode, useNode } from '../../framework';

export function PeopleListNode({ node, context }: NodeProps) {
  const { validate, errors } = useNode(node);

  const additionnalOwnersJsx: React.ReactNodeArray = [];

  node.value.forEach((subNode: SchemaNode, index: number) => {
    const handleDelete = () => {
      node.removeListItem(index);
      validate();
    };
    additionnalOwnersJsx.push(
      <React.Fragment key={subNode.uid}>
        <RootNode context={context} node={subNode} />
        <Button destructive onClick={handleDelete}>
          X
        </Button>
      </React.Fragment>
    );
  });

  return (
    <div>
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
      {additionnalOwnersJsx}
      <Button onClick={handleAdd}>Add an owner</Button>
    </div>
  );

  function handleAdd() {
    node.addListItem();
    validate();
  }
}
