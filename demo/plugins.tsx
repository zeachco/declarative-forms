import React from 'react';
import { Node, NodeProps, SchemaNodeComponent, useNode } from '../framework';

export function StringNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  return (
    <div>
      <label>{node.path} : </label>
      <input value={node.value?.toString() || ''} onChange={onChange} />
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
    </div>
  );
}
