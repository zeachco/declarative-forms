import {Card, FormLayout, Select} from '@shopify/polaris';
import React from 'react';
import {NodeProps, RootNode, useNode} from '../../..';

interface Props {
  wrap?: boolean;
}

export function PolarisPolymorphicNode({node, wrap}: NodeProps & Props) {
  const {onChange, errors} = useNode(node);
  const variant = node.children[node.value];
  const options = node.attributes.map((key) => {
    const child = node.children[key];
    return {
      value: key,
      label: child.translate('path'),
    };
  });
  const title = node.translate('sectionTitle');
  const label = node.translate('label');
  const errorMessages = errors.map((error) => (
    <strong key={error.type}>{node.translate('error', {error})}</strong>
  ));

  if (wrap) {
    return (
      <>
        <Card title={title}>
          <Card.Section>
            <FormLayout>
              <Select
                label={label}
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
        label={label}
        onChange={onChange}
        options={options}
        value={node.value}
      />
      {errorMessages}
      {variant && <RootNode node={variant} />}
    </>
  );
}
