import { TextField } from '@shopify/polaris';
import React from 'react';
import { NodeProps, useNode } from '../../framework';

export function PolarisStringNode({ node, ...props }: NodeProps & any) {
  const { onChange, errors, validate } = useNode(node);
  // HACK instead of i18n
  const label = node.path.split('.');

  // HACK to avoid making to components
  if (node.schema.kind === 'integer') {
    props['type'] = 'number';
  }

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
