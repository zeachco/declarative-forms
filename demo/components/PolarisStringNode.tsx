import { TextField } from '@shopify/polaris';
import React from 'react';
import { NodeProps, useNode } from '../../framework';

export function PolarisStringNode({ node, ...props }: NodeProps) {
  const { onChange, errors, validate } = useNode(node);
  const label = node.path.split('.'); // hack instead of i18n
  return (
    <TextField
      label={label[label.length - 1]}
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
