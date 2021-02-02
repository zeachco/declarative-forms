import React from 'react';

import {useNode} from '../utilities/hook';

import {NodeProps, RootNode} from './RootNode';

export function PolymorphicNode({node, context}: NodeProps) {
  const {onChange, errors} = useNode(node);
  const variant = node.children[node.value];

  return (
    <>
      <label>
        {node.translate(node.path, 'label')}:{' '}
        <select onChange={handleChange}>
          {node.attributes.map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>{' '}
      </label>
      {errors.map((err) => (
        <strong key={err}>{node.translate(err, 'error')}</strong>
      ))}
      {variant && <RootNode context={context} node={variant} />}
    </>
  );

  function handleChange(ev: any) {
    onChange(ev.target.value);
  }
}
