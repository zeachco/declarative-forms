import React from 'react';
import {FormLayout, Select, SelectOption} from '@shopify/polaris';

import {NodeProps, useNode} from '../../..';

export interface EnumNodeOption {
  label: string | null;
  value: string;
}

export interface Props extends NodeProps {
  labelHidden?: boolean;
  wrapInForm?: boolean;
}

/**
 * Displays a component to select a value from a list of options retrieved
 * from the EnumNode created by from the schema.
 */
export function PolarisOptionsNode({
  node,
  wrapInForm,
  labelHidden,
  ...props
}: Props) {
  const {onChange} = useNode(node);
  const translatedLabel: string = node.translate('label');
  const helpText: string = node.translate('helpText');
  const options: SelectOption[] =
    node.schema.options?.map((option) => ({
      label: node.translate(['options', option].join('.')) || option,
      value: option,
    })) || [];

  const content = (
    <Select
      placeholder={node.translate('select')}
      disabled={options.length === 1}
      label={translatedLabel}
      labelHidden={labelHidden}
      options={options}
      helpText={helpText}
      {...props}
      onChange={onChange}
      value={node.value}
    />
  );

  return wrapInForm ? (
    <FormLayout>
      <FormLayout.Group condensed>{content}</FormLayout.Group>
    </FormLayout>
  ) : (
    content
  );
}
