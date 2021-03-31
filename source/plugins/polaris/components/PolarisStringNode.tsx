import {TextField} from '@shopify/polaris';
import React from 'react';

import {NodeProps, useNode, SpecialProps} from '../../..';

type Props = SpecialProps<typeof TextField> & NodeProps;

export function PolarisStringNode({node, ...props}: Props) {
  const {onChange, errors, validate} = useNode(node);
  const {multiline, ...otherProps} = props;
  const {meta = {}} = node.schema;

  // Polaris accepts only numbers
  if (meta.multiline === true) meta.multiline = 5;

  const allProps = {
    // Workaround to avoid making two components.
    type: node.schema.type === 'integer' ? 'number' : props.type || undefined,
    // Schema and decoration props
    ...(node.schema.meta || {}),
    ...otherProps,
  };
  const error = errors[0];
  const errorMessage = error ? node.translate('error', {error}) : '';

  return (
    <TextField
      label={node.translate('label')}
      helpText={node.translate('helpText')}
      {...allProps}
      value={node.value}
      onChange={onChange}
      onBlur={validate}
      error={errorMessage}
    />
  );
}
