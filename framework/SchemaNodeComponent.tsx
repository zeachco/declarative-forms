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

    const Plugin = node.isList
      ? context.plugins.list
      : context.plugins[
          childNode.schema.kind as keyof DeclarativeFormContext['plugins']
        ];

    if (Plugin) {
      jsx.push(<Plugin key={key} context={context} node={childNode} />);
      return;
    }

    const Group = context.plugins.group;

    childNode.attributes.forEach((key) => {
      const child = childNode.children[key];
      jsx.push(
        <Group node={child} context={context}>
          <SchemaNodeComponent
            key={child.path}
            context={context}
            node={child}
          />
        </Group>
      );
    });
    return;
  });

  return <div>{jsx}</div>;
}
