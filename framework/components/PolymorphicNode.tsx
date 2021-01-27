import React from 'react';
import { useNode } from '../hook';
import { NodeProps, SchemaNodeComponent } from '../SchemaNodeComponent';

export function PolymorphicNode({ node, context }: NodeProps) {
  const { onChange, errors, currentNode } = useNode(node);
  const current = currentNode();

  const optionsJsx: React.ReactNodeArray = [];

  for (const key in node.children) {
    optionsJsx.push(<option key={key}>{key}</option>);
  }

  return (
    <div>
      <label>
        {node.path} &gt; {current?.path || 'none'} :
      </label>
      <select onChange={onChange}>{optionsJsx}</select>
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {current && <SchemaNodeComponent context={context} node={current} />}
    </div>
  );
}
