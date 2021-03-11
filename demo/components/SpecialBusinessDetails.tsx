import {FormLayout} from '@shopify/polaris';
import React from 'react';
import {NodeProps, renderNodes} from '../../source';

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
      <FormLayout.Group>{renderNodes({address, city})}</FormLayout.Group>
      <FormLayout.Group>
        {renderNodes({provinceCode, postalCode})}
      </FormLayout.Group>
      {renderNodes(otherNodes)}
    </FormLayout>
  );
}
