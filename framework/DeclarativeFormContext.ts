import {
  frameworkPlugins,
  frameworkValidators,
  frameworkFormatters,
} from './defaults';
import { FormatterFn, ReactComponent, ValidatorFn } from './types';

export interface FormContext {
  plugins: Record<string, ReactComponent>;
  validators: Record<string, ValidatorFn>;
  values: Record<string, any>;
  labels: Record<string, string>;
  formatters:
    | {
        local: FormatterFn;
        remote: FormatterFn;
      }
    | Record<string, FormatterFn>;
  translators: any[];
}

interface DecoratorsForPath {
  Before?: ReactComponent;
  After?: ReactComponent;
  Wrap?: ReactComponent;
  Replace?: ReactComponent;
  BeforeArgs?: object;
  AfterArgs?: object;
  WrapArgs?: object;
  ReplaceArgs?: object;
}

export class DeclarativeFormContext implements FormContext {
  public plugins: FormContext['plugins'];
  public validators: FormContext['plugins'];
  public labels: FormContext['labels'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public debug = false;

  private decoratorsByPath: Record<string, DecoratorsForPath> = {};

  constructor({
    plugins = {},
    validators = {},
    labels = {},
    values = {},
    formatters = {},
    translators = [],
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
  }

  public getDecorator(path: string): DecoratorsForPath {
    return this.decoratorsByPath[path] || {};
  }
}
