import React from 'react';

import {NodeProps} from '../../../types';
import {useNode} from '../../../utilities/hook';

export function BooleanNode({node}: NodeProps) {
  const {onChange, errors, validate} = useNode(node);
  return (
    <label>
      {node.translate('label')}:{' '}
      <input
        type="checkbox"
        onChange={handleChange}
        checked={Boolean(node.value)}
      />
      {errors.map((error) => (
        <strong key={error}>{node.translate('error', {error})}</strong>
      ))}
    </label>
  );

  function handleChange(ev: any) {
    onChange(Boolean(ev.target.checked));
    validate();
  }
}
