import {TextField} from '@shopify/polaris';
import React from 'react';

import {ValidationError, NodeProps, useNode} from '../../..';

export function PolarisStringNode({node, ...props}: NodeProps & any) {
  const {onChange, errors, validate} = useNode(node);

  const allProps = {
    ...(node.schema.meta || {}),
    ...props,

    // Workaround to avoid making two components.
    type: node.schema.kind === 'integer' ? 'number' : props.type,
    multiline: props.multiline === true ? 5 : null,
  };

  return (
    <TextField
      label={node.translate('label')}
      helpText={node.translate('helpText')}
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
