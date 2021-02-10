import React from 'react';
import {Card} from '@shopify/polaris';

import {DeclarativeFormContext, NodeProps, SchemaNode} from '../src';
import {PeopleDeleteButton, PeopleListNode} from './components/PeopleListNode';
import {PolarisPolymorphicNode} from '../plugins/polaris/components/PolarisPolymorphicNode';
import {PolarisBooleanNode} from '../plugins/polaris/components/PolarisBooleanNode';
import {PolarisRangeSlider} from '../plugins/polaris/components/PolarisRangeSlider';
import {PolarisStringNode} from '../plugins/polaris/components/PolarisStringNode';

export function decorate(context: DeclarativeFormContext) {
  context
    .where(({schema}) => schema.type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, {wrap: true});

  context
    .where(({schema}) => ['string', 'integer'].includes(schema.type))
    .replaceWith(PolarisStringNode);

  context
    .where(({schema, isList}) => schema.type === 'AdditionalOwner' && isList)
    .replaceWith(PeopleListNode);

  context
    .where(({schema, isList}) => schema.type === 'AdditionalOwner' && !isList)
    .packWith(({children, node}: NodeProps) => {
      return (
        <Card title={node.translate('label')}>
          <Card.Section>{children}</Card.Section>
        </Card>
      );
    })
    .appendWith(PeopleDeleteButton);

  context
    .where(({schema}) => schema.type === 'boolean')
    .replaceWith(PolarisBooleanNode);

  context
    .where(({depth}) => depth === 2)
    .wrapWith(({children, node}: NodeProps) => {
      return (
        <Card title={node.translate('label')}>
          <Card.Section>{children}</Card.Section>
        </Card>
      );
    });

  context
    .where(({path}) => /ownershipPercentage$/.test(path))
    .replaceWith(PolarisRangeSlider, {min: 0, max: 100});
}
