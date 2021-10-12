import {Card, FormLayout, Select} from '@shopify/polaris';
import {SchemaNode} from '../../../types';
import React, {ReactNode} from 'react';

import {NodeProps, renderNodes, useNode} from '../../..';

interface Props {
  nestWithChild?: string;
  labelTranslationKey?: string;
  wrapWithCard?: boolean;
  beforeSelector?: ReactNode;
  afterSelector?: ReactNode;
  renderUnselected?: (_node: SchemaNode) => ReactNode;
  forceSelection?: boolean;
  labelHidden?: boolean;
  disabled?: boolean;
}

export function PolarisPolymorphicNode({
  node,
  nestWithChild,
  labelTranslationKey = 'label',
  wrapWithCard,
  beforeSelector = null,
  afterSelector = null,
  renderUnselected = () => null,
  forceSelection = true,
  labelHidden = true,
  disabled = false,
}: NodeProps & Props) {
  const {
    onChange,
    errors: [error],
  } = useNode(node, {forceSelection});
  const variant = node.children[node.value];
  const options = node.attributes.map((key) => {
    const child = node.children[key];
    return {
      value: key,
      label: child.translate('path'),
    };
  });

  const title = node.translate('sectionTitle');
  const label = node.translate(labelTranslationKey);
  const errorMsg = error ? node.translate('error', {error}) : '';
  const selectProps = {
    // when the selection is not forced, we need a placeholder
    // to avoid the first element to be wrongly selected while it's not the node value
    placeholder: forceSelection
      ? ''
      : node.translate('placeholder') || label || '---',
    label,
    onChange,
    options,
    value: typeof node.value === 'string' ? node.value : undefined,
    error: errorMsg,
    disabled,
  };

  if (nestWithChild && variant) {
    const {[nestWithChild]: nestedNode, ...otherNodes} = variant.children;
    const children = variant ? renderNodes(otherNodes) : renderUnselected(node);
    const childTitle = nestedNode.translate('sectionTitle') || title;
    return (
      <>
        <Card title={childTitle}>
          <Card.Section>
            <FormLayout>
              {beforeSelector}
              <Select {...selectProps} />
              {afterSelector}
            </FormLayout>
          </Card.Section>
          <Card.Section>
            <FormLayout>{renderNodes({nestedNode})}</FormLayout>
          </Card.Section>
        </Card>
        {children}
      </>
    );
  }

  const children = variant
    ? renderNodes(variant.children)
    : renderUnselected(node);

  if (wrapWithCard) {
    return (
      <>
        <Card title={label}>
          <Card.Section>
            <FormLayout>
              {beforeSelector}
              <Select {...selectProps} labelHidden={labelHidden} />
              {afterSelector}
            </FormLayout>
          </Card.Section>
        </Card>
        {children}
      </>
    );
  }

  return (
    <FormLayout>
      {beforeSelector}
      <Select {...selectProps} labelHidden={labelHidden} />
      {afterSelector}
      {children}
    </FormLayout>
  );
}
