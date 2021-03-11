import React from 'react';

import {SchemaNode} from '../types';
import {DebugNode} from '../debug/DebugNode';

export function renderNodes(nodes: {[key: string]: SchemaNode}, uid = '') {
  const keys = Object.keys(nodes);
  return keys.map((key) => renderNode(nodes[key], `${uid}_${key}`));
}

export function renderNode(node: SchemaNode, uid = '') {
  let jsx: React.ReactNodeArray = [];
  const nodeChildren: React.ReactNodeArray = [];

  node.attributes.forEach((key) => {
    const child = node.children[key];
    if (node.type !== 'polymorphic') {
      nodeChildren.push(...renderNode(child, child.uid));
    }
  });

  jsx.push(...nodeChildren);

  const {Before, After, Replace, Wrap, Pack} = node.decorator;
  const mergeProps = getPropsMerger(node);

  if (Replace) {
    const {Node, props} = Replace;
    jsx = [
      <Node key={`${uid}_r_${node.uid}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }
  if (Before) {
    const {Node, props} = Before;
    jsx.unshift(<Node key={`${uid}_b_${node.uid}`} {...mergeProps(props)} />);
  }
  if (After) {
    const {Node, props} = After;
    jsx.push(<Node key={`${uid}_a_${node.uid}`} {...mergeProps(props)} />);
  }
  if (Wrap) {
    const {Node, props} = Wrap;
    jsx = [
      <Node key={`${uid}_w_${node.uid}`} {...mergeProps(props)}>
        {jsx}
      </Node>,
    ];
  }

  if (node.context.debug) {
    jsx = [
      <DebugNode key={`${uid}_debug_${node.uid}`} node={node} name={node.type}>
        {jsx}
      </DebugNode>,
    ];
  }

  if (Pack) {
    const {Node, props} = Pack;
    return [
      <Node key={`${uid}_p_${node.uid}`} {...mergeProps(props)}>
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
