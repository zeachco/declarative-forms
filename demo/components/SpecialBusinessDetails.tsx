import {FormLayout} from '@shopify/polaris';
import React from 'react';
import {NodeProps, RootNode, RootNodes} from '../../source';

export function SpecialBusinessDetails({node}: NodeProps) {
  const {address, city, postalCode, provinceCode, ...other} = node.children;
  return (
    <FormLayout>
      <FormLayout.Group>
        <RootNode node={address} />
        <RootNode node={city} />
      </FormLayout.Group>
      <FormLayout.Group>
        <RootNode node={provinceCode} />
        <RootNode node={postalCode} />
      </FormLayout.Group>
      <RootNodes nodes={other} />
    </FormLayout>
  );
}
