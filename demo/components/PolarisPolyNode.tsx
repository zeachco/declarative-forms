import { Select } from '@shopify/polaris';
import React from 'react';
import { NodeProps, RootNode, useNode } from '../../framework';

export function PolarisPolymorphicNode({ node, context }: NodeProps) {
  const { onChange, errors } = useNode(node);
  const variant = node.children[node.value];

  return (
    <React.Fragment>
      <Select
        label={node.path}
        onChange={handleChange}
        options={node.attributes}
        value={node.value}
      />
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {variant && <RootNode context={context} node={variant} />}
    </React.Fragment>
  );

  function handleChange(value: string) {
    onChange(value);
  }
}
