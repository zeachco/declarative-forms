import React from 'react';
import { NodeContext } from './NodeGlobalContext';

import { Node } from './Node';

export interface NodeProps {
  context: NodeContext;
  node: Node;
  children?: React.ReactNode;
}

export function SchemaNodeComponent({ node, context }: NodeProps) {
  if (!context || !node) {
    console.warn('missing node or context for SchemaNodeComponent');
    return null;
  }

  let jsx: React.ReactNodeArray = [];

  node.attributes.forEach((attribute) => {
    const childNode: Node = node.children[attribute];
    const key = childNode.path;

    const Plugin = node.isList
      ? context.plugins.list
      : context.plugins[childNode.schema.kind];

    const pluginName =
      Plugin?.toString().split('(')[0].replace('function ', '') ||
      childNode.schema?.kind;

    if (Plugin) {
      jsx.push(<Plugin key={key} context={context} node={childNode} />);
    }

    childNode.attributes.forEach((key) => {
      const child = childNode.children[key];
      jsx.push(
        <SchemaNodeComponent key={child.path} context={context} node={child} />
      );
    });

    if (context.debug) jsx = [<DebugPath name={pluginName}>{jsx}</DebugPath>];
  });

  const { Before, After, Replace, Wrap } = context.getDecorator(node.path);
  if (Replace) jsx = [<Replace key={node.path} />];
  if (Before) jsx.unshift(<Before key="_before" />);
  if (After) jsx.push(<After key="_after" />);
  if (Wrap) return <Wrap>{jsx}</Wrap>;
  return <React.Fragment>{jsx}</React.Fragment>;
}

function DebugPath({ children = null as React.ReactNode, name = 'unknown' }) {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const style = {
    boxShadow: `inset 0 0 3px 1px #${color}, inset -.5em 0 2em -.5em #${color}44`,
    backgroundColor: `#${color}08`,
    padding: '.1em 0 .1em .3em',
  };
  return (
    <div key={name} title={name} style={style}>
      <small style={{ color }}>&lt;{name} &gt;</small>
      {children}
      <small style={{ color }}>&lt;/{name} &gt;</small>
    </div>
  );
}
