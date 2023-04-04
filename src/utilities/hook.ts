import {useEffect, useState} from 'react';
import isEqual from 'lodash/isEqual';
import {autorun, trace} from 'mobx';

import {NodeValue, SchemaNode, SharedContext} from '../types';

import {isSchemaNode} from './compatibility';
import {ValidationError} from '../classes/ValidationError';

interface Features {
  forceSelection?: boolean;
}
interface GroupError {
  fields: string[];
  message: string;
  unresolved: boolean;
}

/**
 * This hook tells react when an instance of {@link SchemaNode} changes including
 * external factors such as the {@link DeclarativeFormContext} containing the `sharedContext`.
 * @param node instance of {@link SchemaNode} to watch for changes
 */
export function useNode<
  T extends NodeValue = NodeValue,
  C extends SharedContext = SharedContext,
>(node: SchemaNode<T>, {forceSelection}: Features = {}) {
  if (!isSchemaNode<T>(node)) throw new Error('bad node type received');

  const [state, setState] = useState({
    focused: false,
    value: node.value as T,
    errors: node.errors || [],
    serverErrors: [] as ValidationError[],
    errorMessage: node.errorMessage,
    isValid: node.isValid,
    sharedContext: node.context.sharedContext as C,
    /** @private used to keep track of the state change*/
    remoteErrors: node.context.sharedContext.errors,
  });

  useEffect(forceInitialSelectionEffect, [forceSelection, node]);
  useEffect(refreshStateFromObservableEffect, [node]);

  useEffect(
    function maybeUpdateErrorsFromContext() {
      return autorun(() => {
        const remoteErrors = node.context.sharedContext.errors;

        if (remoteErrors && Object.keys(remoteErrors).length > 1) {
          const serverPath = node.path.toFullWithoutVariants();
          const serverErrorsTarget = remoteErrors
            ? remoteErrors[serverPath]
            : null;
          const externalErrors =
            mapContextErrorsToValidationErrors(serverErrorsTarget);
          const areErrorsEqual = isEqual(externalErrors, state.serverErrors);
          if (externalErrors.length && !areErrorsEqual) {
            node.setErrors(externalErrors);
          }
        }
      });
    },
    [node],
  );

  useEffect(
    function maybeUpdateErrorsFromGroupErrors() {
      const groupErrors = node.parentNode()?.schema?.meta?.groupErrors;
      if (groupErrors && groupErrors.length) {
        const groupError = groupErrors.find((groupError: GroupError) =>
          groupError.fields.includes(node.name),
        );
        if (groupError && !node.dirty) {
          node.setErrors([{type: 'Presence'}]);
        }
      }
    },
    [node],
  );

  useEffect(
    function maybeUpdateFromWatchedNode() {
      return autorun(() => {
        const target =
          node.schema.watch && node.getNodeByPath(node.schema.watch);
        if (target && target.value !== node.value) node.onChange(target.value);
      });
    },
    [node],
  );

  return {
    ...state,
    onChange: node.onChange,
    setInitialValue: node.setInitialValue,
  };

  function forceInitialSelectionEffect() {
    const [firstOptionValue] = node.attributes;
    if (
      forceSelection &&
      typeof node.value !== 'string' &&
      typeof firstOptionValue === 'string'
    ) {
      node.onChange(firstOptionValue as T);
    }
  }

  function refreshStateFromObservableEffect() {
    return autorun(() => {
      // this triggers a debugger on the next reaction
      if (node.context.sharedContext._debug_next_reaction) trace(true);

      const serverPath = node.path.toFullWithoutVariants();
      const focused = node.context.sharedContext.focusedNode === serverPath;
      const value = node.value;
      const isValid = node.isValid;
      const errors = node.errors;
      const errorMessage = node.errorMessage;
      const sharedContext = node.context.sharedContext as C;
      const remoteErrors = node.context.sharedContext.errors;

      setState((previousState) => {
        return {
          ...previousState,
          focused,
          remoteErrors,
          sharedContext,
          value,
          isValid,
          errors,
          errorMessage,
        };
      });
    });
  }
}

function mapContextErrorsToValidationErrors(
  stringErrors: string[] | null,
): ValidationError[] {
  return Array.isArray(stringErrors)
    ? stringErrors.map((error) => new ValidationError('server', {error}))
    : [];
}
