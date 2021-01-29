import { RangeSlider } from '@shopify/polaris';
import React from 'react';
import { NodeProps, useNode } from '../../framework';

export function PolarisRangeSlider({ node, ...props }: NodeProps) {
  const { onChange } = useNode(node);
  return (
    <RangeSlider
      label={node.path}
      value={node.value}
      onChange={handleChange}
      output
      {...props}
    />
  );

  function handleChange(val: number) {
    onChange(val);
  }
}
