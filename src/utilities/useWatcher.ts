import {useEffect, useState} from 'react';
import {autorun} from 'mobx';

import {SchemaNode} from '../types';
import {DeclarativeFormContext} from '../DeclarativeFormContext';
import isEqual from 'lodash/isEqual';

type WatchFn = (value: any) => {[key: string]: any};

const watcherFunctionFactoryFromArray =
  (keys: string[]): typeof defaultWatcher =>
  (observable) =>
    keys.reduce((acc, key) => {
      acc[key] = observable[key];
      return acc;
    }, {} as any);

const defaultWatcher: WatchFn = ({
  focused,
  value,
  errors,
  errorMessage,
  isValid,
}) => ({focused, value, errors, errorMessage, isValid});

/**
 * This hook triggers react render when the passed observable changes according to the mapWatchable function
 * an observable can be {@link SchemaNode} or {@link DeclarativeFormContext}
 *
 * Sugar syntax tip: It's possible to just pass an array of attributes we want to map
 * ```tsx
 * const {errors, value} = useWatcher(node, ['errors', 'value'])
 * ```
 * here is the equivalent of
 * ```tsx
 * const {errors, value} = useWatcher(node, ({errors, value}) => ({errors, value}))
 * ```
 *
 * Changing the array of dependencies or the instance of the function itself might not retrigger a reaction and is discouraged
 */
export function useWatcher<T = SchemaNode | DeclarativeFormContext>(
  observable: T,
  mapWatchable: WatchFn | string[] = defaultWatcher,
) {
  const attributeFn: typeof defaultWatcher = Array.isArray(mapWatchable)
    ? watcherFunctionFactoryFromArray(mapWatchable)
    : mapWatchable;
  const [state, setState] = useState(attributeFn(observable));
  useEffect(
    () =>
      autorun(() => {
        const nextState = attributeFn(observable);
        setState((prevState) =>
          isEqual(prevState, nextState) ? prevState : nextState,
        );
      }),
    [observable],
  );

  return state;
}
