import React from 'react';
import {Card} from '@shopify/polaris';
import {NodeProps} from '../../source';

interface Props {
  customTitle?: string;
}

export function FormCardContainer({
  children,
  node,
  customTitle,
}: NodeProps & Props) {
  return (
    <Card title={customTitle || node.translate('label')}>
      <Card.Section>{children}</Card.Section>
    </Card>
  );
}
