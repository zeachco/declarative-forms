import React from 'react';

import {NodeProps} from '../../../src/types';
import {useNode} from '../../../src/utilities/hook';

export function NumericNode({node}: NodeProps) {
  const {onChange, errors, validate} = useNode(node);
  return (
    <label>
      {node.translate('label')}:{' '}
      <input
        type="number"
        value={node.value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.map((error) => (
        <strong key={error}>{node.translate('error', {error})}</strong>
      ))}
    </label>
  );

  function handleChange(ev: any) {
    onChange(Number(ev.target.value));
  }

  function handleBlur() {
    validate();
  }
}
