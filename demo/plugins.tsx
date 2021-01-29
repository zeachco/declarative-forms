import React from 'react';
import { NodeProps, useNode } from '../framework';

export function StringNode({ node }: NodeProps) {
  const { onChange, errors, validate } = useNode(node);
  return (
    <div>
      <label>{node.path} : </label>
      <input value={node.value} onChange={handleChange} onBlur={handleBlur} />
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
    </div>
  );

  function handleChange(ev: any) {
    onChange(ev.target.value);
  }

  function handleBlur() {
    validate();
  }
}

export function BillingDetails({ node, children }: NodeProps) {
  return (
    <div
      key={'BusinessDetailsSoleProp'}
      style={{
        padding: '1em',
        border: '1px dashed black',
        borderRadius: '.5em',
      }}
    >
      <h3>hahahaha I intercepted SimpleBillingDetails</h3>
      <div style={{ padding: '.5em', backgroundColor: '#0044ffaa' }}>
        {children}
      </div>
      <small>path: {node.path}</small>
    </div>
  );
}
