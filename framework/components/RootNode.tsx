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
    if (node.schema.type !== 'polymorphic') {
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
      node.schema.type
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

  const { Before, After, Replace, Wrap, Pack } = node.decorator;
  const mergeProps = getPropsMerger({ node, context });

  if (Replace) {
    const { Node, props } = Replace;
    jsx = [<Node {...mergeProps('replace_', props)} children={jsx} />];
  }
  if (Wrap) {
    const { Node, props } = Wrap;
    jsx = [<Node {...mergeProps('wrap_', props)} children={jsx} />];
  }
  if (Before) {
    const { Node, props } = Before;
    jsx.unshift(<Node {...mergeProps('before_', props)} />);
  }
  if (After) {
    const { Node, props } = After;
    jsx.push(<Node {...mergeProps('after_', props)} />);
  }
  if (Pack) {
    const { Node, props } = Pack;
    return <Node {...mergeProps('pack_', props)} children={jsx} />;
  }
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
  return node.isList ? ctx.plugins.list : ctx.plugins[node.schema.type];
}
