import {FormLayout} from '@shopify/polaris';
import React from 'react';
import {NodeProps, RenderNode, RenderNodes} from '../../source';

export function SpecialBusinessDetails({node}: NodeProps) {
  const {
    address,
    city,
    postalCode,
    provinceCode,
    ...otherNodes
  } = node.children;
  return (
    <FormLayout>
      <FormLayout.Group>
        <RenderNode node={address} />
        <RenderNode node={city} />
      </FormLayout.Group>
      <FormLayout.Group>
        <RenderNode node={provinceCode} />
        <RenderNode node={postalCode} />
      </FormLayout.Group>
      <RenderNodes nodes={otherNodes} />
    </FormLayout>
  );
}
