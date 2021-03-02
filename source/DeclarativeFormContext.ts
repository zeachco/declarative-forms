import {createContext} from 'react';
import {frameworkValidators, frameworkFormatters} from './defaults';
import {ContextErrors, Decorator, FormContext} from './types';

interface WithDecoratorFn {
  decorate(ctx: DeclarativeFormContext): void;
}

export class DeclarativeFormContext implements FormContext {
  public validators: FormContext['validators'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public debug = false;
  public decorators: Decorator[] = [];
  public ReactContext = createContext({errors: {} as ContextErrors});

  constructor({
    decorate = () => {},
    validators = {},
    values = {},
    formatters = {},
    translators = {},
  }: Partial<FormContext & WithDecoratorFn>) {
    this.validators = {
      ...frameworkValidators,
      ...validators,
    };

    this.values = values || {};
    this.formatters = {
      ...frameworkFormatters,
      ...formatters,
    };

    this.translators = translators || [];

    decorate(this as DeclarativeFormContext);
  }

  public where(fn: Decorator['test']) {
    const decorator = new Decorator(fn);
    this.decorators.push(decorator);
    return decorator;
  }
}
