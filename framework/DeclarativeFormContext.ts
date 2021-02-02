import { Decorator } from './Decorator';
import {
  frameworkPlugins,
  frameworkValidators,
  frameworkFormatters,
} from './defaults';
import {
  FormatterFn,
  ReactComponent,
  ValidatorFn,
  TranslatorFn,
} from './types';

export interface FormContext {
  plugins: Record<string, ReactComponent>;
  decorate?: (context: DeclarativeFormContext) => void;
  validators: Record<string, ValidatorFn>;
  values: Record<string, any>;
  labels: Record<string, string>;
  formatters:
    | {
        local: FormatterFn;
        remote: FormatterFn;
      }
    | Record<string, FormatterFn>;
  translators: {
    label?: TranslatorFn;
    error?: TranslatorFn;
  };
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
  }: Partial<FormContext>) {
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

    decorate(this);
  }

  public where(fn: Decorator['test']) {
    const decorator = new Decorator(fn);
    this.decorators.push(decorator);
    return decorator;
  }
}
