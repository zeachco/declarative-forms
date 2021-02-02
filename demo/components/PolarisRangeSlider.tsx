import { RangeSlider } from '@shopify/polaris';
import React from 'react';
import { NodeProps, useNode } from '../../framework';

export function PolarisRangeSlider({ node, ...props }: NodeProps) {
  const { onChange, errors } = useNode(node);
  return (
    <React.Fragment>
      <RangeSlider
        label={node.translate(node.path, 'label')}
        value={node.value || 0}
        onChange={onChange}
        output
        {...props}
      />
      {errors.map((e) => node.translate(e, 'error'))}
    </React.Fragment>
  );

  function handleChange(val: number) {
    onChange(val);
  }
}
