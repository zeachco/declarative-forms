import React from 'react';
import { DeclarativeFormContext } from '../DeclarativeFormContext';
import { useNode } from '../utilities/hook';
import { SchemaNode } from '../SchemaNode';
import { ReactComponent } from '../types';
import { getFunctionName } from '../debug/utils';
import { DebugNode } from '../debug/DebugNode';

export interface NodeProps {
  context: DeclarativeFormContext;
  node: SchemaNode;
  children?: React.ReactNode;
}

export function RootNode({ node, context }: NodeProps) {
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
        key={'plugin_' + node.uid}
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

  const {
    Before,
    BeforeArgs,
    After,
    AfterArgs,
    Replace,
    ReplaceArgs,
    Wrap,
    WrapArgs,
  } = context.getDecorator(node.path);
  const mergeProps = getPropsMerger({ node, context });

  if (Replace) jsx = [<Replace {...mergeProps('r_', ReplaceArgs)} />];
  if (Before) jsx.unshift(<Before {...mergeProps('b_', BeforeArgs)} />);
  if (After) jsx.push(<After {...mergeProps('a_', AfterArgs)} />);
  if (Wrap) return <Wrap.Node children={jsx} {...mergeProps('w_', WrapArgs)} />;
  return <React.Fragment>{jsx}</React.Fragment>;
}

function getPropsMerger(props: NodeProps) {
  return (key: string, slotProps: object = {}) => ({
    key,
    ...slotProps,
    ...props,
  });
}

function getPlugin(
  ctx: DeclarativeFormContext,
  node: SchemaNode
): ReactComponent {
  return node.isList ? ctx.plugins.list : ctx.plugins[node.schema.kind];
}
