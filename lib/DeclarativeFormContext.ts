import {createContext} from 'react';

import {frameworkValidators, frameworkFormatters} from './defaults';
import {
  ContextErrors,
  Decorator,
  FormContext,
  SharedContext,
  DecorateFunction,
} from './types';

export interface DecorateFromConstructorFn<T = unknown> {
  decorate: DecorateFunction<T>;
}

/**
 * This class is used to pass down a shared context accessible
 * from all points of the framework and outside of it.
 */
export class DeclarativeFormContext<T = SharedContext> implements FormContext {
  public validators: FormContext['validators'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public debug = false;
  public decorators: Decorator[] = [];
  public sharedContext: FormContext<T>['sharedContext'];
  public ReactContext: FormContext<T>['ReactContext'];
  public nodes: FormContext<T>['nodes'] = new Map();
  public version = 3;

  constructor({
    decorate = () => {},
    validators = {},
    values = {},
    formatters = {},
    translators = {},
    sharedContext = {} as T,
  }: Partial<FormContext<T> & DecorateFromConstructorFn<T>>) {
    this.ReactContext = createContext({errors: {generic: []} as ContextErrors});
    this.validators = {
      ...frameworkValidators,
      ...validators,
    };

    this.values = values || {};
    this.formatters = {
      ...frameworkFormatters,
      ...formatters,
    };

    this.translators = translators || {};

    this.sharedContext = sharedContext;

    decorate(this as DeclarativeFormContext<T>);
  }

  /**
   * Decorations are applied once when the node is constructed later.
   * Normally, the `where` condition should not receive parameters from outside
   * the function scope if the value is dynamic
   * @returns chainable Decorator
   */
  public where(fn: Decorator['match']): Omit<Decorator, 'apply'> {
    const decorator = new Decorator(fn);
    this.decorators.push(decorator);
    return decorator;
  }

  public addInitialValuesAfterNode(
    nodeShortPath: string,
    values: FormContext['values'],
  ) {
    this.values[nodeShortPath] = values;
  }
}
