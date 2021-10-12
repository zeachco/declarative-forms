import {RangeSlider} from '@shopify/polaris';
import React from 'react';

import {NodeProps, useNode} from '../../..';
import {SpecialProps, GenericExcludedComponentProps} from '../../../types';

type Props = SpecialProps<
  typeof RangeSlider,
  GenericExcludedComponentProps | 'label'
> &
  NodeProps;

export function PolarisRangeSlider({node, ...props}: Props) {
  const {onChange, errors} = useNode(node);
  const errorMessages = errors.map((error) => node.translate('error', {error}));
  return (
    <>
      <RangeSlider
        label={node.translate('label')}
        value={node.value || 0}
        onChange={onChange}
        error={errorMessages.length ? errorMessages : ''}
        {...props}
      />
    </>
  );
}
