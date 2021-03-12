import React from 'react';

import {NodeProps, SchemaNode} from '../types';

interface DebugProps extends NodeProps {
  children?: React.ReactNode;
}

const increment = 0.01;
let index = increment * 10;

function getNextColor() {
  index += increment;
  if (index >= 1 - increment * 10) index = increment * 10;
  return Math.floor(index * 16777215).toString(16);
}

export function DebugNode({children, node}: DebugProps) {
  const color = getNextColor();
  const style = {
    boxShadow: `inset 0 0 3px 1px #${color}, inset -.5em 0 2em -.5em #${color}44, 0 0 1em 1px #${color}44`,
    backgroundColor: `#${color}08`,
    padding: '.2em .7em .7em',
    margin: '.3em 0',
    borderRadius: '.5em',
  };
  return (
    <div
      key={`debug_${node.path}`}
      title={JSON.stringify(
        {...node, children: '?', schema: '?', context: '?'},
        null,
        2,
      )}
      style={style}
    >
      <small style={{color}}>
        {jsxAttr(node, ['type', 'name', 'depth', 'path', 'pathShort'])}
      </small>
      {children}
    </div>
  );
}

function jsxAttr(node: SchemaNode, attributes: (keyof SchemaNode)[]) {
  return attributes.map((key: keyof SchemaNode) => (
    <span key={key} style={{color: 'gray', fontSize: '.5em'}}>
      {key}=&quot;
      <i>
        <span style={{color: 'black'}}>{node[key]}</span>
      </i>
      &quot;{' '}
    </span>
  ));
}
