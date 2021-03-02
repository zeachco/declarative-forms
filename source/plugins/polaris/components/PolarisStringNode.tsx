import {TextField} from '@shopify/polaris';
import React from 'react';
import {ValidationError, NodeProps, useNode} from '../../..';

export function PolarisStringNode({node, ...props}: NodeProps & any) {
  const {onChange, errors, validate} = useNode(node);

  // HACK to avoid making two components
  if (node.schema.kind === 'integer') {
    props.type = 'number';
  }

  const allProps = {
    ...(node.schema.meta || {}),
    ...props,
  };

  return (
    <TextField
      label={node.translate('label')}
      value={node.value}
      onChange={onChange}
      onBlur={validate}
      error={errors
        .map((error: ValidationError) => node.translate('error', {error}))
        .join('. ')}
      {...allProps}
    />
  );
}
