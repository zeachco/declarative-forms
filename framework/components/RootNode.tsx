import React from 'react';
import { DeclarativeFormContext } from '../DeclarativeFormContext';
import { useNode } from '../hook';
import { SchemaNode } from '../SchemaNode';
import { ReactComponent } from '../types';
import { getFunctionName } from '../utils';
import { DebugNode } from './DebugNode';

export interface NodeProps {
  context: DeclarativeFormContext;
  node: SchemaNode;
  children?: React.ReactNode;
}

export function RootNode({ node, context }: NodeProps) {
  if (!context || !node) {
    throw new Error('missing node or context for SchemaNodeComponent');
  }

  const { errors } = useNode(node);

  const Plugin = getPlugin(context, node);
  let jsx: React.ReactNodeArray = [];
  const nodeChildren: React.ReactNodeArray = [];

  node.attributes.forEach((key) => {
    const child = node.children[key];
    if (node.schema.kind !== 'polymorphic') {
      nodeChildren.push(
        <RootNode key={child.uid} context={context} node={child} />
      );
    }
  });

  if (Plugin) {
    jsx.push(
      <Plugin
        key={node.uid}
        context={context}
        node={node}
        children={nodeChildren}
      />
    );
  } else {
    jsx.push(...nodeChildren, errors);
  }

  if (context.debug) {
    const pluginName = getFunctionName(
      getPlugin(context, node),
      node.schema.kind
    );
    jsx = [
      <DebugNode
        key={'debug_' + node.uid}
        node={node}
        name={pluginName}
        children={jsx}
      />,
    ];
  }

  const { Before, After, Replace, Wrap } = context.getDecorator(node.path);
  if (Replace) jsx = [<Replace key={'replace_' + node.uid} node={node} />];
  if (Before) jsx.unshift(<Before key={'before_' + node.uid} />);
  if (After) jsx.push(<After key={'after_' + node.uid} />);
  if (Wrap) return <Wrap>{jsx}</Wrap>;
  return <React.Fragment>{jsx}</React.Fragment>;
}

function getPlugin(
  ctx: DeclarativeFormContext,
  node: SchemaNode
): ReactComponent {
  return node.isList ? ctx.plugins.list : ctx.plugins[node.schema.kind];
}
