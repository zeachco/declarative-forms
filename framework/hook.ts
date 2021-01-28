import React from 'react';
import { Node } from './SchemaNode';

export function useNode(node: Node) {
  if (!node) {
    throw new Error('no Node provided in useNode hook');
  }

  /**
   * Node selected by polymorphic structure
   */
  function currentNode(): Node {
    return node.children[node.value] || node.children[node.attributes[0]];
  }

  const [state, changeState] = React.useState({
    errors: [] as string[],
    onChange(val: any) {
      node.onChange(val);
      changeState({
        ...state,
        errors: node.validate(),
      });
    },
    currentNode,
  });
  return state;
}
