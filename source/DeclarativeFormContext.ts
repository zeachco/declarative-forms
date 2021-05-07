import {createContext} from 'react';

import {frameworkValidators, frameworkFormatters} from './defaults';
import {Decorator, FormContext} from './types';

interface WithConstructionProps {
  decorate(ctx: DeclarativeFormContext): void;
}

/**
 * This class is used to pass down a shared context accessible
 * from all points of the framework and outside of it.
 */
export class DeclarativeFormContext implements FormContext {
  public validators: FormContext['validators'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public debug = false;
  public decorators: Decorator[] = [];
  public sharedContext: any;
  public ReactContext: FormContext['ReactContext'];
  public version = 3;

  constructor({
    decorate = () => {},
    validators = {},
    values = {},
    formatters = {},
    translators = {},
  }: Partial<FormContext & WithConstructionProps>) {
    this.ReactContext = createContext({errors: {}});
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

    decorate(this as DeclarativeFormContext);
  }

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
