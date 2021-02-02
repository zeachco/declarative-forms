import { TextField } from '@shopify/polaris';
import React from 'react';
import { NodeProps, useNode } from '../../framework';

export function PolarisStringNode({ node, ...props }: NodeProps & any) {
  const { onChange, errors, validate } = useNode(node);

  // HACK to avoid making to components
  if (node.schema.kind === 'integer') {
    props['type'] = 'number';
  }

  return (
    <TextField
      label={node.translate(node.path, 'label')}
      value={node.value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={errors.map((err) => node.translate(err, 'error')).join('. ')}
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
