import React from 'react';

import {NodeProps, SchemaNode} from '../types';

interface DebugProps extends NodeProps {
  name: string;
}

const increment = 0.01;
let index = increment * 10;

function getNextColor() {
  index += increment;
  if (index >= 1 - increment * 10) index = increment * 10;
  return Math.floor(index * 16777215).toString(16);
}

export function DebugNode({children, node, name = ''}: DebugProps) {
  const color = getNextColor();
  const style = {
    boxShadow: `inset 0 0 3px 1px #${color}, inset -.5em 0 2em -.5em #${color}44, 0 0 1em 1px #${color}44`,
    backgroundColor: `#${color}08`,
    padding: '.2em .7em',
    margin: '.3em 0',
    borderRadius: '.5em',
  };
  return (
    <div
      key={`debug_${node.path}`}
      title={JSON.stringify(
        {...node, children: '...', schema: '...', context: '...'},
        null,
        2,
      )}
      style={style}
    >
      <small style={{color}}>
        &lt;{name} {jsxAttr(node, ['name', 'depth', 'path', 'pathShort'])} &gt;
      </small>
      {children}
      <small style={{color}}>&lt;/{name} &gt;</small>
    </div>
  );
}

function jsxAttr(node: SchemaNode, attributes: (keyof SchemaNode)[]) {
  return attributes.map((attr) => `${attr}="${node[attr]}"`).join(' ');
}
