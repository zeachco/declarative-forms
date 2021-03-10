import {Card, FormLayout, Select} from '@shopify/polaris';
import React from 'react';

import {NodeProps, RenderNode, RenderNodes, useNode} from '../../..';

interface Props {
  wrap?: boolean;
  sectionnedWithValue?: string;
}

export function PolarisPolymorphicNode({
  node,
  wrap,
  sectionnedWithValue,
}: NodeProps & Props) {
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

  if (sectionnedWithValue && variant) {
    const {[sectionnedWithValue]: _extracted, ...otherNodes} = variant.children;
    return (
      <>
        <Card title={title}>
          <Card.Section>
            <Select
              label={label}
              onChange={onChange}
              options={options}
              value={node.value}
            />
            {errorMessages}
          </Card.Section>
          <Card.Section>
            <RenderNode node={_extracted} />
          </Card.Section>
        </Card>
        <RenderNodes nodes={otherNodes} />
      </>
    );
  }

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
        {variant && <RenderNode node={variant} />}
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
      {variant && <RenderNode node={variant} />}
    </>
  );
}
