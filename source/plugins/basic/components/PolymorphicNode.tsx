import React from 'react';

import {NodeProps} from '../../../types';
import {useNode} from '../../../utilities/hook';
import {RenderNode} from '../../../utilities/RenderNode';

export function PolymorphicNode({node}: NodeProps) {
  const {onChange, errors} = useNode(node);
  const variant = node.children[node.value];

  return (
    <>
      <label>
        {node.translate('label')}:{' '}
        <select onChange={handleChange}>
          {node.attributes.map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>{' '}
      </label>
      {errors.map((error) => (
        <strong key={error.type}>{node.translate('error', {error})}</strong>
      ))}
      {variant && <RenderNode node={variant} />}
    </>
  );

  function handleChange(ev: any) {
    onChange(ev.target.value);
  }
}
