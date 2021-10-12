import React from 'react';

import {NodeProps} from '../../../types';
import {useNode} from '../../../utilities/hook';

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
        autoComplete="off"
      />
      {errors.map((error) => (
        <strong key={error.type}>{node.translate('error', {error})}</strong>
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
