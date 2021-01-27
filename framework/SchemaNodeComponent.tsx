import React from 'react';
import { DeclarativeFormContext } from './DeclarativeFormContext';

import { Node } from './Node';

export interface NodeProps {
  context: DeclarativeFormContext;
  node: Node;
}

export function SchemaNodeComponent({ node, context }: NodeProps) {
  if (!context || !node) {
    console.warn('missing node or context for SchemaNodeComponent');
    return null;
  }

  const jsx: React.ReactNodeArray = [];

  node.children.forEach((childNode: Node) => {
    const key = childNode.path;

    // Allows to show components being used
    if (context.debug) {
      const pluginName =
        context.plugins[
          childNode.schema.kind as keyof DeclarativeFormContext['plugins']
        ]
          ?.toString()
          .split('(')[0]
          .replace('function ', '') || childNode.schema?.kind;
      jsx.push(<div key={pluginName}>&lt;{pluginName} /&gt;</div>);
    }

    if (!childNode.schema) {
      jsx.push(<div key={key}>"{key}" has no schema</div>);
      return;
    }

    const Plugin =
      context.plugins[
        childNode.schema.kind as keyof DeclarativeFormContext['plugins']
      ];

    if (Plugin) {
      jsx.push(<Plugin key={key} context={context} node={childNode} />);
      return;
    }

    childNode.children.forEach((child) => {
      jsx.push(
        <SchemaNodeComponent key={child.path} context={context} node={child} />
      );
    });
    return;
  });

  return <div>{jsx}</div>;
}
