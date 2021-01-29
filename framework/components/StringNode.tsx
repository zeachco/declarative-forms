import React from 'react';
import { useNode } from '../utilities/hook';
import { NodeProps } from './RootNode';

export function StringNode({ node }: NodeProps) {
  const { onChange, errors, validate } = useNode(node);
  return (
    <label>
      {node.path}:{' '}
      <input value={node.value} onChange={handleChange} onBlur={handleBlur} />
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
    </label>
  );

  function handleChange(ev: any) {
    onChange(ev.target.value);
  }

  function handleBlur() {
    validate();
  }
}
