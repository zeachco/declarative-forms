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

  const jsx: React.ReactNodeArray = [];

  node.attributes.forEach((attribute) => {
    const childNode: Node = node.children[attribute];
    const key = childNode.path;

    const Plugin = node.isList
      ? context.plugins.list
      : context.plugins[
          childNode.schema.kind as keyof DeclarativeFormContext['plugins']
        ];

    // Allows to show components being used
    if (context.debug) {
      const pluginName =
        Plugin?.toString().split('(')[0].replace('function ', '') ||
        childNode.schema?.kind;
      jsx.push(<div key={pluginName}>&lt;{pluginName} /&gt;</div>);
    }

    if (Plugin) {
      jsx.push(<Plugin key={key} context={context} node={childNode} />);
    }

    childNode.attributes.forEach((key) => {
      const child = childNode.children[key];
      jsx.push(
        <SchemaNodeComponent key={child.path} context={context} node={child} />
      );
    });
    return;
  });

  const { Before, After, Replace, Wrap } = context.getDecorator(node.path);
  if (Replace) jsx.splice(0, jsx.length, <Replace key={node.path} />);
  if (Before) jsx.unshift(<Before key="_before" />);
  if (After) jsx.push(<After key="_after" />);
  if (Wrap) return <Wrap>{jsx}</Wrap>;
  return <React.Fragment>{jsx}</React.Fragment>;
}
