import {RangeSlider} from '@shopify/polaris';
import React from 'react';

import {NodeProps, useNode} from '../../../src';

export function PolarisRangeSlider({node, ...props}: NodeProps) {
  const {onChange, errors} = useNode(node);
  const errorMessages = errors.map((error) => node.translate('error', {error}));
  return (
    <>
      <RangeSlider
        label={node.translate('label')}
        value={node.value || 0}
        onChange={onChange}
        output
        error={errorMessages.length ? errorMessages : ''}
        {...props}
      />
    </>
  );
}
