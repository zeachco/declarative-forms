import React from 'react'
import { Node } from './Node';

export function useNode(node: Node) {
  if (!node) {
    throw new Error('no Node provided in useNode hook');
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
  });
  return state;
}