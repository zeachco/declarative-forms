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

  const { Before, After, Replace, Wrap, Pack } = node.decorator || {};
  const mergeProps = getPropsMerger({ node, context, children: jsx });

  if (Replace?.Node)
    jsx = [<Replace.Node {...mergeProps('r_', Replace.props)} />];
  if (Wrap?.Node) jsx = [<Wrap.Node {...mergeProps('w_', Wrap.props)} />];
  if (Before?.Node)
    jsx.unshift(<Before.Node {...mergeProps('b_', Before.props)} />);
  if (After?.Node) jsx.push(<After.Node {...mergeProps('a_', After.props)} />);
  if (Pack?.Node) return <Pack.Node {...mergeProps('p_', Pack.props)} />;
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
