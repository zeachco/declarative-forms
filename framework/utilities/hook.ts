import React from 'react';
import { SchemaNode } from '../SchemaNode';

export function useNode(node: SchemaNode) {
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
    validate() {
      changeState({
        ...state,
        errors: node.validate(),
      });
    },
  });
  return state;
}
