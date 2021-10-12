import React from 'react';

import {NodeProps} from '../../../types';
import {useNode} from '../../../utilities/hook';

export function BooleanNode({node}: NodeProps) {
  const {onChange, errors, validate} = useNode(node);
  return (
    <label>
      <div id={node.uid}>{node.translate('label')}</div>
      <input
        type="checkbox"
        onChange={handleChange}
        checked={Boolean(node.value)}
        aria-invalid={errors.length > 0}
        aria-describedby={node.uid}
      />
      <div role="alert">
        {errors.map((error) => (
          <strong key={error.type}>{node.translate('error', {error})}</strong>
        ))}
      </div>
    </label>
  );

  function handleChange(ev: any) {
    onChange(Boolean(ev.target.checked));
    validate();
  }
}
