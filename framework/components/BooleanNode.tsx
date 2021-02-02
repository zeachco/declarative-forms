import React from 'react';
import { useNode } from '../utilities/hook';
import { NodeProps } from './RootNode';

export function BooleanNode({ node }: NodeProps) {
  const { onChange, errors, validate } = useNode(node);
  return (
    <label>
      {node.translate(node.path, 'label')}:{' '}
      <input type="checkbox" onChange={handleChange} checked={!!node.value} />
      {errors.map((err) => (
        <strong key={err}>{node.translate(err, 'error')}</strong>
      ))}
    </label>
  );

  function handleChange(ev: any) {
    onChange(!!ev.target.checked);
    validate();
  }
}
