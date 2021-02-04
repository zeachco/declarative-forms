import React from 'react';
import {Card, FormLayout, TextField} from '@shopify/polaris';

import {DeclarativeFormContext, NodeProps, SchemaNode} from '../framework';

import {
  PolarisPolymorphicNode,
  PolarisRangeSlider,
  PeopleDeleteButton,
  PeopleListNode,
  PolarisBooleanNode,
} from './components';

export function decorate(context: DeclarativeFormContext) {
  context
    .where((node) => node.schema.type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, {wrap: true});

  context
    .where((node) => node.schema.type === 'AdditionalOwner' && node.isList)
    .replaceWith(PeopleListNode);

  context
    .where((node) => node.schema.type === 'AdditionalOwner' && !node.isList)
    .packWith(({children, node}: NodeProps) => {
      return (
        <Card title={node.translate('label')}>
          <Card.Section>{children}</Card.Section>
        </Card>
      );
    })
    .appendWith(PeopleDeleteButton);

  context
    .where((node) => node.schema.type === 'boolean')
    .replaceWith(PolarisBooleanNode);

  context
    .where((node) => node.depth === 3)
    .wrapWith(({children, node}: NodeProps) => {
      return (
        <Card title={node.translate('label')}>
          <Card.Section>{children}</Card.Section>
        </Card>
      );
    });

  context
    .where((node: SchemaNode) => /ownershipPercentage$/.test(node.path))
    .replaceWith(PolarisRangeSlider, {min: 0, max: 100});

  context
    .where((node: SchemaNode) =>
      /legalEntity\..*\.personalDetails\.dateOfBirth/.test(node.path),
    )
    .wrapWith(Card, {subdued: true})
    .packWith(FormLayout.Group, {condensed: true})
    .prependWith(TextField, {
      disabled: true,
      value: 'before',
      label: 'position',
    })
    .appendWith(TextField, {
      disabled: true,
      value: 'after',
      label: 'position',
    });
}
