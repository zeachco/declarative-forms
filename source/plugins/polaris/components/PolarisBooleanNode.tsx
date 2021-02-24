import React from 'react';
import {Checkbox} from '@shopify/polaris';

import {NodeProps, useNode} from '../../..';

export function PolarisBooleanNode({node}: NodeProps) {
  const {onChange, validate, errors} = useNode(node);
  return (
    <Checkbox
      label={node.translate('label')}
      onChange={update}
      checked={node.value}
      error={
        errors.length
          ? errors.map((error) => node.translate('error', {error}))
          : ''
      }
    />
  );

  function update() {
    onChange(!node.value);
    validate();
  }
}
