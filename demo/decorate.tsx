import React from 'react';
import {
  Button,
  Card,
  Checkbox,
  FormLayout,
  TextField,
} from '@shopify/polaris';
import {
  DeclarativeFormContext,
  NodeProps,
  SchemaNode,
  useNode,
} from '../framework';
import { PolarisPolymorphicNode } from './components/PolarisPolyNode';
import { PolarisRangeSlider } from './components/PolarisRangeSlider';
import {
  PeopleDeleteButton,
  PeopleListNode,
} from './components/PeopleListNode';

export function decorate(context: DeclarativeFormContext) {
  context
    .where((node) => node.schema.type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, { wrap: true });

  context
    .where((node) => node.schema.type === 'AdditionalOwner' && node.isList)
    .replaceWith(PeopleListNode);

  context
    .where((node) => node.schema.type === 'AdditionalOwner' && !node.isList)
    .packWith(({ children, node }: NodeProps) => {
      return (
        <Card title={node.translate(node.path, 'label')}>
          <Card.Section>{children}</Card.Section>
        </Card>
      );
    })
    .appendWith(PeopleDeleteButton);

  context
    .where((node) => node.schema.type === 'boolean')
    .replaceWith(({ node }: NodeProps) => {
      const { onChange, validate } = useNode(node);
      return (
        <Checkbox
          label={node.translate(node.path, 'label')}
          onChange={update}
          checked={node.value}
        />
      );

      function update() {
        onChange(!node.value);
        validate();
      }
    });

  context
    .where((node) => node.depth === 3)
    .wrapWith(({ children, node }: NodeProps) => {
      return (
        <Card title={node.translate(node.path, 'label')}>
          <Card.Section>{children}</Card.Section>
        </Card>
      );
    });

  context
    .where((node: SchemaNode) => /ownershipPercentage$/.test(node.path))
    .replaceWith(PolarisRangeSlider, { min: 0, max: 100 });

  context
    .where((node: SchemaNode) =>
      /legalEntity\..*\.personalDetails\.dateOfBirth/.test(node.path)
    )
    .wrapWith(Card, { condensed: true })
    .packWith(FormLayout.Group, { condensed: true })
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
