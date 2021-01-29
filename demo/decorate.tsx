import React from 'react';
import { TextField } from '@shopify/polaris';
import { DeclarativeFormContext, NodeProps, SchemaNode } from '../framework';
import { PolarisPolymorphicNode } from './components/PolarisPolyNode';
import { PolarisRangeSlider } from './components/PolarisRangeSlider';

export function decorate(context: DeclarativeFormContext) {
  context
    .where((node) => node.schema.kind === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, {});

  context
    .where((node: SchemaNode) => /ownershipPercentage$/.test(node.path))
    .replaceWith(PolarisRangeSlider, { min: 0, max: 100 })
    // .wrapWith(Card, { condensed: true })
    // .packWith(FormLayout, { condensed: true })
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

  const BeforeArgs = { country: 'CA' };
  const AfterArgs = { country: 'US' };

  context
    .where((node: SchemaNode) =>
      /legalEntity\..*\.personalDetails\.dateOfBirth/.test(node.path)
    )
    .prependWith(({ node, country }: NodeProps & typeof BeforeArgs) => {
      return (
        <div
          style={{
            borderRadius: '1em 1em 0 0',
            marginTop: 10,
            padding: 5,
            backgroundColor: '#ff0000aa',
          }}
        >
          <p>before dateOfBirth node, for country {country}</p>
          <p>path: {node.path}</p>
        </div>
      );
    }, BeforeArgs)
    .appendWith(({ node, country }: NodeProps & typeof AfterArgs) => {
      return (
        <div
          style={{
            borderRadius: '0 0 1em 1em',
            marginBottom: 10,
            padding: 5,
            backgroundColor: '#00ff00aa',
          }}
        >
          <p>after dateOfBirth node, for country {country}</p>
          <p>path: {node.path}</p>
        </div>
      );
    }, AfterArgs);
}
