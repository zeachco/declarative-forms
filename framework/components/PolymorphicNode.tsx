import React from 'react';
import { useNode } from '../hook';
import { NodeProps, SchemaNodeComponent } from '../SchemaNodeComponent';

export function PolymorphicNode({ node, context }: NodeProps) {
  const { onChange, errors, currentNode } = useNode(node);
  const current = currentNode();

  return (
    <div>
      <label>{node.path}:</label>
      <select onChange={onChange}>
        {node.attributes.map((key) => (
          <option key={key}>{key}</option>
        ))}
      </select>
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {current && <SchemaNodeComponent context={context} node={current} />}
    </div>
  );
}
