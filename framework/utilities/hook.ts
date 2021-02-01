import React from 'react';
import { SchemaNode } from '../SchemaNode';

export function useNode(node: SchemaNode) {
  if (!node) {
    throw new Error('no Node provided in useNode hook');
  }

  const [state, changeState] = React.useState({
    errors: [] as string[],
    onChange,
    validate,
    removeListItem,
    addListItem,
  });

  function onChange(value: any) {
    changeState({
      ...state,
      errors: node.onChange(value),
    });
  }

  function validate() {
    changeState({
      ...state,
      errors: node.validate(),
    });
  }

  function addListItem() {
    const child = node.addListItem();
    child.deleteSelf = () => {
      removeListItem(+child.path.split('.').reverse()[0]);
    };
    changeState({
      ...state,
      errors: node.validate(),
    });
  }

  function removeListItem(index: number) {
    node.removeListItem(index);
    changeState({
      ...state,
      errors: node.validate(),
    });
  }

  return state;
}
