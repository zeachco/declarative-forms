import {useContext, useEffect, useState} from 'react';

import {SchemaNode, ValidationError} from '../types';

import {isNodeV3} from './compatibility';

export function useNode(node: SchemaNode) {
  if (!isNodeV3(node)) {
    throw new Error('bad node type received');
  }

  const declarativeFormsReactContext = useContext(node.context.ReactContext);

  const [state, setState] = useState({
    errors: node.errors || [],
    serverErrors: [] as ValidationError[],
    onChange,
    validate,
    removeListItem,
    addListItem,
    refreshListItems,
    declarativeFormsReactContext,
  });

  const update = (merge: Partial<typeof state>) =>
    setState({...state, ...merge});

  // To~do will resolve useEffect dependencies so they are not circular later
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshListItems, [node.value]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshContextErrors, [declarativeFormsReactContext, node.path]);

  function onChange(value: any) {
    update({errors: node.onChange(value)});
  }

  function validate() {
    update({errors: node.validate()});
  }

  // in order to detect changes from children nodes,
  // we assign them a hook removal callback for removal
  // gotcha: if we render the same node structure
  // into two different react components, only one (the latest)
  // would be updated in real time
  function refreshListItems() {
    if (!node.isList || !Array.isArray(node.value)) return;
    node.value.forEach((child: SchemaNode, newIndex: number) => {
      child.path = node.path.add(newIndex.toString(), true);
      child.deleteSelf = () => removeListItem(newIndex);
    });

    update({
      errors: node.validate().concat(state.serverErrors),
    });
  }

  function refreshContextErrors() {
    const serverErrorNode =
      declarativeFormsReactContext.errors[node.path.toStringShort()];
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
