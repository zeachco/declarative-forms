import React from 'react';
import { DeclarativeFormContext } from './DeclarativeFormContext';

import { Node } from './Node';

export interface NodeProps {
  context: DeclarativeFormContext;
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
    const keyName = childNode.schema.kind;

    const Plugin = node.isList
      ? context.plugins.list
      : context.plugins[childNode.schema.kind];

    if (Plugin) {
      jsx.push(<Plugin key={keyName} context={context} node={childNode} />);
    } else {
      childNode.attributes.forEach((key) => {
        const child = childNode.children[key];
        jsx.push(
          <SchemaNodeComponent key={keyName} context={context} node={child} />
        );
      });
    }

    if (context.debug) {
      const pluginName = Plugin?.toString()
        .split('(')[0]
        .replace('function ', '');

      jsx = [<DebugPath node={node} name={pluginName} children={jsx} />];
    }
  });

  const { Before, After, Replace, Wrap } = context.getDecorator(node.path);
  if (Replace) jsx = [<Replace key={node.path} />];
  if (Before) jsx.unshift(<Before key="_before" />);
  if (After) jsx.push(<After key="_after" />);
  if (Wrap) return <Wrap>{jsx}</Wrap>;
  return <React.Fragment>{jsx}</React.Fragment>;
}

interface DebugProps {
  children: React.ReactNode;
  name: string;
  node: Node;
}

function DebugPath({ children, node, name = '' }: DebugProps) {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const style = {
    boxShadow: `inset 0 0 3px 1px #${color}, inset -.5em 0 2em -.5em #${color}44`,
    backgroundColor: `#${color}08`,
    padding: '.1em 0 .1em .3em',
  };
  return (
    <div key={name} title={name} style={style}>
      <small style={{ color }}>
        &lt;{name}{' '}
        <span color="white">path="{[node.path, name].join('.')}"</span> &gt;
      </small>
      {children}
      <small style={{ color }}>&lt;/{name} &gt;</small>
    </div>
  );
}
