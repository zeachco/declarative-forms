import React from 'react';
import { useNode } from '../utilities/hook';
import { NodeProps } from './RootNode';

export function NumericNode({ node }: NodeProps) {
  const { onChange, errors, validate } = useNode(node);
  return (
    <label>
      {node.translate(node.path, 'label')}:{' '}
      <input
        type="number"
        value={node.value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.map((err) => (
        <strong key={err}>{node.translate(err, 'error')}</strong>
      ))}
    </label>
  );

  function handleChange(ev: any) {
    onChange(+ev.target.value);
  }

  function handleBlur() {
    validate();
  }
}
