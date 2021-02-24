import {useEffect, useState} from 'react';

import {SchemaNode} from '../types';

export function useNode(node?: SchemaNode) {
  const [state, setState] = useState({
    errors: node?.errors || [],
    onChange,
    validate,
    removeListItem,
    addListItem,
    refreshListItems,
  });

  const update = (merge: Partial<typeof state>) =>
    setState({...state, ...merge});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshListItems, [node?.value]);

  function onChange(value: any) {
    update({errors: node?.onChange(value)});
  }

  function validate() {
    update({errors: node?.validate()});
  }

  function refreshListItems() {
    if (!node?.isList || !Array.isArray(node?.value)) return;
    node.value.forEach((child: SchemaNode, newIndex: number) => {
      child.path = [node.path, newIndex].join('.');
      child.deleteSelf = () => removeListItem(newIndex);
    });
    update({errors: node.validate()});
  }

  function addListItem() {
    node?.addListItem();
    refreshListItems();
  }

  function removeListItem(index: number) {
    node?.removeListItem(index);
    refreshListItems();
  }

  return state;
}
