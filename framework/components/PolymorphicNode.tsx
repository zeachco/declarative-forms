import React from 'react';
import { useNode } from '../hook';
import { NodeProps, RootNode } from './RootNode';

export function PolymorphicNode({ node, context }: NodeProps) {
  const { onChange, errors } = useNode(node);
  const variant = node.children[node.value];

  return (
    <React.Fragment>
      <label>{node.path}: </label>
      <select onChange={onChange}>
        {node.attributes.map((key) => (
          <option key={key}>{key}</option>
        ))}
      </select>
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {variant && <RootNode context={context} node={variant} />}
    </React.Fragment>
  );
}
