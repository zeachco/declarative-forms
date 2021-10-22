import {useCallback, useContext, useEffect, useState} from 'react';
import {autorun, toJS} from 'mobx';

import {SchemaNode, ValidationError} from '../types';

import {isNodeV3} from './compatibility';

interface Options {
  forceSelection?: boolean;
}

export function useNode(node: SchemaNode, {forceSelection}: Options = {}) {
  if (!isNodeV3(node)) {
    throw new Error('bad node type received');
  }
  const declarativeFormsReactContext = useContext(node.context.ReactContext);

  const getInvalidChildren = useCallback(() => {
    const children = [] as string[];
    node.invalidChildren.forEach((_, child) => children.push(child));
    return children;
  }, [node.invalidChildren]);

  const [state, setState] = useState({
    value: toJS(node.value),
    errors: node.errors || [],
    serverErrors: [] as ValidationError[],
    contextErrors: declarativeFormsReactContext.errors,
    errorMessage: '',
    // node changes
    /** @deprecated use directly node.onChange() */
    onChange(value: any) {
      node.onChange(value);
    },
    setInitialValue,

    /** @deprecated use directly node.validate() */
    validate() {
      node.validate();
    },
    isValid: node.isValid(),
    invalidChildren: getInvalidChildren(),
    firstError: '',

    /** @deprecated use directly node.resetNodeValue() */
    reset() {
      node.resetNodeValue();
    },
    // shared context
    declarativeFormsReactContext,
  });

  useEffect(forceInitialSelection, [forceSelection, node]);

  useEffect(forceUpdateOnMobxState, [node, state, getInvalidChildren]);
  useEffect(updateOnServerErrors, [node, declarativeFormsReactContext.errors]);

  function setInitialValue(value: any) {
    setState({
      ...state,
      errors: node.onChange(value, undefined, true),
    });
  }

  function forceInitialSelection() {
    const [firstOptionValue] = node.attributes;
    if (
      forceSelection &&
      typeof node.value !== 'string' &&
      typeof firstOptionValue === 'string'
    ) {
      node.onChange(firstOptionValue);
    }
  }

  function updateOnServerErrors() {
    const serverPath = node.path.toFullWithoutVariants();
    const serverErrorNode = declarativeFormsReactContext.errors[serverPath];

    const serverErrors: ValidationError[] = Array.isArray(serverErrorNode)
      ? serverErrorNode.map((error) => new ValidationError('server', {error}))
      : [];

    node.setErrors(serverErrors);
  }

  function forceUpdateOnMobxState() {
    return autorun(() => {
      if (
        node.value !== state.value ||
        node.errors.length !== state.errors.length
      ) {
        setState({
          ...state,
          value: node.value,
          isValid: node.isValid(),
          errors: node.errors,
          errorMessage: node.errors.length
            ? node.translate('error', {error: node.errors[0]})
            : '',
        });
      }
    });
  }

  return state;
}
