import { TextField } from '@shopify/polaris';
import React from 'react';
import { NodeProps, useNode } from '../../framework';

export function PolarisStringNode({ node, ...props }: NodeProps) {
  const { onChange, errors, validate } = useNode(node);
  return (
    <TextField
      label={node.path}
      value={node.value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={errors.join(';')}
      {...props}
    />
  );

  function handleChange(value: string) {
    onChange(value);
  }

  function handleBlur() {
    validate();
  }
}
