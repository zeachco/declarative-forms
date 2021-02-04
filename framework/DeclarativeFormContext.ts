import {
  frameworkPlugins,
  frameworkValidators,
  frameworkFormatters,
} from './defaults';
import {Decorator, FormContext} from './types';

interface WithDecoratorFn {
  decorate(ctx: DeclarativeFormContext): void;
}

export class DeclarativeFormContext implements FormContext {
  public plugins: FormContext['plugins'];
  public validators: FormContext['plugins'];
  public labels: FormContext['labels'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public debug = false;
  public decorators: Decorator[] = [];

  constructor({
    plugins = {},
    decorate = () => {},
    validators = {},
    labels = {},
    values = {},
    formatters = {},
    translators = {},
  }: Partial<FormContext & WithDecoratorFn>) {
    this.plugins = {
      ...frameworkPlugins,
      ...plugins,
    };

    this.validators = {
      ...frameworkValidators,
      ...validators,
    };

    this.labels = labels || {};
    this.values = values || {};
    this.formatters = {
      ...frameworkFormatters,
      ...formatters,
    };

    this.translators = translators || [];

    decorate(this as FormContext);
  }

  public where(fn: Decorator['test']) {
    const decorator = new Decorator(fn);
    this.decorators.push(decorator);
    return decorator;
  }
}
