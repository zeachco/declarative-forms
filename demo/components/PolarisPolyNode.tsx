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

  if (wrap) {
    return (
      <React.Fragment>
        <Card title={node.path.split('.').reverse()[0]}>
          <Card.Section>
            <FormLayout>
              <Select
                label={node.path}
                onChange={handleChange}
                options={node.attributes}
                value={node.value}
              />
              {errors.map((err) => (
                <strong>{err}</strong>
              ))}
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
        label={node.path}
        onChange={handleChange}
        options={node.attributes}
        value={node.value}
      />
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {variant && <RootNode context={context} node={variant} />}
    </React.Fragment>
  );

  function handleChange(value: string) {
    onChange(value);
  }
}
