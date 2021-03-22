import React from 'react';

import {SchemaNode, NodeChildrenMap} from '../types';
import {DebugNode} from '../debug/DebugNode';

export function renderNodes(nodes: NodeChildrenMap, uid = '') {
  const keys = Object.keys(nodes);
  return keys.map((key) => renderNode(nodes[key], `${uid}_${key}`));
}

export function renderNode(node: SchemaNode, uid = '') {
  const reactKey = `${node.uid}_${uid}`;
  let jsx: React.ReactNodeArray = [];
  const nodeChildren: React.ReactNodeArray = [];

  node.attributes.forEach((key) => {
    const child = node.children[key];
    if (node.type !== 'polymorphic') {
      nodeChildren.push(...renderNode(child, reactKey));
    }
  });

  jsx.push(...nodeChildren);

  const {Before, After, Replace, Wrap, Pack} = node.decorator;
  const mergeProps = getPropsMerger(node);

  if (Replace) {
    const {Node, props} = Replace;
    jsx = [
      <Node key={`_r_${reactKey}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Wrap) {
    const {Node, props} = Wrap;
    jsx = [
      <Node key={`_w_${reactKey}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Before) {
    const {Node, props} = Before;
    jsx.unshift(<Node key={`_b_${reactKey}`} {...mergeProps(props)} />);
  }
  if (After) {
    const {Node, props} = After;
    jsx.push(<Node key={`_a_${reactKey}`} {...mergeProps(props)} />);
  }

  if (node.context.debug) {
    jsx = [
      <DebugNode key={`_debug_${reactKey}`} node={node}>
        {jsx}
      </DebugNode>,
    ];
  }

  if (Pack) {
    const {Node, props} = Pack;
    return [
      <Node key={`_p_${reactKey}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  return jsx;
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
