import React from 'react';
import { SchemaNode } from '../SchemaNode';

export function useNode(node: SchemaNode) {
  if (!node) {
    throw new Error('no Node provided in useNode hook');
  }

  const [state, changeState] = React.useState({
    errors: [] as string[],
    onChange(value: any) {
      node.onChange(value);
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
