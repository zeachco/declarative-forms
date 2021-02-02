import { Card, FormLayout, Select } from '@shopify/polaris';
import React from 'react';
import { NodeProps, RootNode, useNode } from '../../framework';

interface Props {
  wrap: boolean;
}

export function PolarisPolymorphicNode({
  node,
  context,
  wrap,
}: NodeProps & Props) {
  const { onChange, errors } = useNode(node);
  const variant = node.children[node.value];
  const options = node.attributes.map((key) =>
    node.translate([node.path, key].join('.'), 'label')
  );
  const title = node.translate(node.path, 'label');
  const errorMessages = errors.map((err) => (
    <strong>{node.translate(err, 'error')}</strong>
  ));

  console.log(options);

  if (wrap) {
    return (
      <React.Fragment>
        <Card title={title}>
          <Card.Section>
            <FormLayout>
              <Select
                label={''}
                onChange={handleChange}
                options={options}
                value={node.value}
              />
              {errorMessages}
            </FormLayout>
          </Card.Section>
        </Card>
        {variant && <RootNode context={context} node={variant} />}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Select
        label={title}
        onChange={handleChange}
        options={options}
        value={node.value}
      />
      {errorMessages}
      {variant && <RootNode context={context} node={variant} />}
    </React.Fragment>
  );

  function handleChange(value: string) {
    onChange(value);
  }
}
