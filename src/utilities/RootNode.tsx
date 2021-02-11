import React from 'react';

import {useNode} from './hook';
import {NodeProps, SchemaNode} from '../types';
import {DebugNode} from '../debug/DebugNode';

export function RootNode({node}: NodeProps) {
  const {errors} = useNode(node);

  let jsx: React.ReactNodeArray = [];
  const nodeChildren: React.ReactNodeArray = [];

  node.attributes.forEach((key) => {
    const child = node.children[key];
    if (node.type !== 'polymorphic') {
      nodeChildren.push(<RootNode key={child.uid} node={child} />);
    }
  });

  jsx.push(...nodeChildren, ...errors);

  if (node.context.debug) {
    jsx = [
      <DebugNode key={`debug_${node.uid}`} node={node} name={node.type}>
        {jsx}
      </DebugNode>,
    ];
  }

  const {Before, After, Replace, Wrap, Pack} = node.decorator;
  const mergeProps = getPropsMerger(node);

  if (Replace) {
    const {Node, props} = Replace;
    jsx = [
      <Node key={`r_${node.uid}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Wrap) {
    const {Node, props} = Wrap;
    jsx = [
      <Node key={`w_${node.uid}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Before) {
    const {Node, props} = Before;
    jsx.unshift(<Node key={`b_${node.uid}`} {...mergeProps(props)} />);
  }
  if (After) {
    const {Node, props} = After;
    jsx.push(<Node key={`a_${node.uid}`} {...mergeProps(props)} />);
  }
  if (Pack) {
    const {Node, props} = Pack;
    return (
      <Node key={`p_${node.uid}`} {...mergeProps(props)}>
        {jsx}
      </Node>
    );
  }
  return <>{jsx}</>;
}

function getPropsMerger(node: SchemaNode) {
  return (add: object = {}) => {
    const base = typeof add === 'function' ? add(node) : add;
    return {
      ...base,
      node,
    };
  };
}
