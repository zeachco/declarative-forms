import {Card, FormLayout, Select} from '@shopify/polaris';
import React from 'react';

import {NodeProps, renderNodes, useNode} from '../../..';

interface Props {
  wrap?: boolean;
  nestWithChildren?: string;
}

export function PolarisPolymorphicNode({
  node,
  wrap,
  nestWithChildren,
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

  if (nestWithChildren && variant) {
    const {[nestWithChildren]: nestedNode, ...otherNodes} = variant.children;
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
          <Card.Section>
            <FormLayout>{renderNodes({nestedNode})}</FormLayout>
          </Card.Section>
        </Card>
        {renderNodes(otherNodes)}
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
        {variant && renderNodes({variant})}
      </>
    );
  }

  return (
    <FormLayout>
      <Select
        label={label}
        onChange={onChange}
        options={options}
        value={node.value}
      />
      {errorMessages}
      {variant && renderNodes({variant})}
    </FormLayout>
  );
}
