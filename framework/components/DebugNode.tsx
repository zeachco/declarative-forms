import React from 'react';
import { SchemaNode } from '../SchemaNode';

interface DebugProps {
  children: React.ReactNode;
  name: string;
  node: SchemaNode;
}

export function DebugNode({ children, node, name = '' }: DebugProps) {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const style = {
    boxShadow: `inset 0 0 3px 1px #${color}, inset -.5em 0 2em -.5em #${color}44`,
    backgroundColor: `#${color}08`,
    padding: '.1em 0 .1em .3em',
  };
  return (
    <div key={'debug_' + node.path} title={name} style={style}>
      <small style={{ color }}>
        &lt;{name} path="{node.path}" kind="{node.schema.kind}" &gt;
      </small>
      {children}
      <small style={{ color }}>&lt;/{name} &gt;</small>
    </div>
  );
}
