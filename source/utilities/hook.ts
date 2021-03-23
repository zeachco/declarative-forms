import {useContext, useEffect, useState} from 'react';

import {SchemaNode, ValidationError} from '../types';

import {isNodeV3} from './compatibility';

export function useNode(node: SchemaNode) {
  if (!isNodeV3(node)) {
    throw new Error('bad node type received');
  }

  const reactContext = useContext(node.context.ReactContext);

  const [state, setState] = useState({
    errors: node.errors || [],
    serverErrors: [] as ValidationError[],
    onChange,
    validate,
    removeListItem,
    addListItem,
    refreshListItems,
    reactContext,
  });

  const update = (merge: Partial<typeof state>) =>
    setState({...state, ...merge});

  // FIXME resolve useEffect dependencies so they are not circular
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshListItems, [node.value]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshFromContext, [reactContext, node.pathShort]);

  function onChange(value: any) {
    update({errors: node.onChange(value)});
  }

  function validate() {
    update({errors: node.validate()});
  }

  function refreshListItems() {
    if (!node.isList || !Array.isArray(node.value)) return;
    node.value.forEach((child: SchemaNode, newIndex: number) => {
      child.path = [node.path, newIndex].join('.');
      child.deleteSelf = () => removeListItem(newIndex);
    });

    update({
      errors: node.validate().concat(state.serverErrors),
    });
  }

  function refreshFromContext() {
    const serverErrorNode = reactContext.errors[node.pathShort];
    const serverErrors: ValidationError[] = Array.isArray(serverErrorNode)
      ? serverErrorNode.map((error) => new ValidationError('server', {error}))
      : [];

    update({
      errors: serverErrors.length ? serverErrors : node.errors,
      serverErrors,
    });
  }

  function addListItem() {
    node.addListItem();
    refreshListItems();
  }

  function removeListItem(index: number) {
    node.removeListItem(index);
    refreshListItems();
  }

  return state;
}
