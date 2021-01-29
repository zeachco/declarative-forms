import React from 'react';
import { Card, Checkbox, FormLayout, Page, TextField } from '@shopify/polaris';
import {
  DeclarativeFormContext,
  NodeProps,
  SchemaNode,
  useNode,
} from '../framework';
import { PolarisPolymorphicNode } from './components/PolarisPolyNode';
import { PolarisRangeSlider } from './components/PolarisRangeSlider';

export function decorate(context: DeclarativeFormContext) {
  context
    .where((node) => node.schema.kind === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, {});

  context
    .where((node) => node.schema.kind === 'boolean')
    .replaceWith(({ node }: NodeProps) => {
      const { onChange, validate } = useNode(node);
      return (
        <Checkbox label={node.path} onChange={update} checked={node.value} />
      );

      function update() {
        onChange(!node.value);
        validate();
      }
    });

  context
    .where((node) => node.depth === 3)
    .replaceWith(
      ({ children }: NodeProps) => (
        <Page>
          <Card>
            <Page>
              <FormLayout>{children}</FormLayout>
            </Page>
          </Card>
        </Page>
      ),
      {}
    );

  context
    .where((node: SchemaNode) => /ownershipPercentage$/.test(node.path))
    .replaceWith(PolarisRangeSlider, { min: 0, max: 100 });

  const BeforeArgs = { country: 'CA' };
  const AfterArgs = { country: 'US' };

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
