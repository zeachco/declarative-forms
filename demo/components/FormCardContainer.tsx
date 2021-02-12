import React from 'react';
import {Card} from '@shopify/polaris';
import {NodeProps} from '../../source';

export function FormCardContainer({children, node}: NodeProps) {
  return (
    <Card title={node.translate('label')}>
      <Card.Section>{children}</Card.Section>
    </Card>
  );
}
