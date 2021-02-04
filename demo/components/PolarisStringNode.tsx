import {TextField} from '@shopify/polaris';
import React from 'react';

import {NodeProps, useNode} from '../../framework';

export function PolarisStringNode({node, ...props}: NodeProps & any) {
  const {onChange, errors, validate} = useNode(node);

  // HACK to avoid making two components
  if (node.schema.kind === 'integer') {
    props.type = 'number';
  }

  return (
    <TextField
      label={node.translate('label')}
      value={node.value}
      onChange={onChange}
      onBlur={validate}
      error={errors.map((error) => node.translate('error', {error})).join('. ')}
      {...props}
    />
  );
}
