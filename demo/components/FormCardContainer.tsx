import React from 'react';
import {Card} from '@shopify/polaris';
import {NodeProps} from '../../source';

interface Props extends NodeProps {
  customTitle?: string;
}

export function FormCardContainer({children, node, customTitle}: Props) {
  return (
    <Card title={customTitle || node.translate('label')}>
      <Card.Section>{children}</Card.Section>
    </Card>
  );
}
