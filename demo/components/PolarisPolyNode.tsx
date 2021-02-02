import {Card, FormLayout, Select} from '@shopify/polaris';
import React from 'react';

import {NodeProps, RootNode, useNode} from '../../framework';

interface Props {
  wrap: boolean;
}

export function PolarisPolymorphicNode({
  node,
  context,
  wrap,
}: NodeProps & Props) {
  const {onChange, errors} = useNode(node);
  const variant = node.children[node.value];
  const options = node.attributes.map((key) => ({
    value: key,
    label: node.translate([node.path, key].join('.'), 'label'),
    disabled: key === node.value,
  }));
  const title = node.translate(node.path, 'label');
  const errorMessages = errors.map((err) => (
    <strong key={err}>{node.translate(err, 'error')}</strong>
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
        {variant && <RootNode context={context} node={variant} />}
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
      {variant && <RootNode context={context} node={variant} />}
    </>
  );
}
