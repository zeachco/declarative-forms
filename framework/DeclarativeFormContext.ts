import { ReactComponent, ValidatorFn } from './types';

export interface FormContext {
  plugins: Record<string, ReactComponent>;
  validators: Record<string, ValidatorFn>;
  values: Record<string, any>;
  labels: Record<string, string>;
  translators: any[];
}

interface DecoratorsForPath {
  Before?: ReactComponent;
  After?: ReactComponent;
  Wrap?: ReactComponent;
  Replace?: ReactComponent;
}

const frameworkPlugins: FormContext['plugins'] = {};
const frameworkValidators: FormContext['validators'] = {};

export class DeclarativeFormContext implements FormContext {
  public plugins: FormContext['plugins'];
  public validators: FormContext['plugins'];
  public labels: FormContext['labels'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public debug = true;

  private decoratorsByPath: Record<string, DecoratorsForPath> = {};

  constructor({
    plugins = {},
    validators = {},
    labels = {},
    values = {},
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

    this.translators = translators || [];
  }

  public getDecorator(path: string): DecoratorsForPath {
    return this.decoratorsByPath[path] || [];
  }
}
