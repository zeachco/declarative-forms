import {Card, FormLayout, Select} from '@shopify/polaris';
import React from 'react';

import {NodeProps, RootNode, useNode} from '../../framework';

interface Props {
  wrap?: boolean;
}

export function PolarisPolymorphicNode({node, wrap}: NodeProps & Props) {
  const {onChange, errors} = useNode(node);
  const variant = node.children[node.value];
  const options = node.attributes.map((key) => ({
    value: key,
    label: node.translate('label'),
    disabled: key === node.value,
  }));
  const title = node.translate('label');
  const errorMessages = errors.map((error) => (
    <strong key={error}>{node.translate('error', {error})}</strong>
  ));

  if (wrap) {
    return (
      <>
        <Card title={title}>
          <Card.Section>
            <FormLayout>
              <Select
                label=""
                onChange={onChange}
                options={options}
                value={node.value}
              />
              {errorMessages}
            </FormLayout>
          </Card.Section>
        </Card>
        {variant && <RootNode node={variant} />}
      </>
    );
  }

  return (
    <>
      <Select
        label={title}
        onChange={onChange}
        options={options}
        value={node.value}
      />
      {errorMessages}
      {variant && <RootNode node={variant} />}
    </>
  );
}
