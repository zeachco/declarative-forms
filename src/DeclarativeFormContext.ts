import {makeObservable, observable, action} from 'mobx';
import {ValidationError} from './classes/ValidationError';

import {frameworkValidators, frameworkFormatters} from './defaults';
import {ContextErrors, Decorator, FormContext, SharedContext} from './types';

export type DecorateFunction<T extends SharedContext = SharedContext> = (
  context: DeclarativeFormContext<T>,
) => void;
export interface ConstructorProps<T> extends Partial<FormContext<T>> {
  decorate?: DecorateFunction<T>;
}

export const defaultSharedContext: SharedContext = {
  errors: {generic: []},
  debug: false,
};

/**
 * This class is used to pass down a shared context accessible
 * from all points of the framework and outside of it.
 * The instance being shared is simply passed down through a {@link SchemaNode}'s parameter
 * so it's accessible at every level.
 */
export class DeclarativeFormContext<T extends SharedContext = SharedContext>
  implements FormContext {
  /**
   * Here is where we pass validators used for the frontend validation process.
   * by nature a validator returns instantly a validation error or null but since
   * it receives the node as an argument, it's also possible to act asynchronously
   * on the node if the validation process requires an external api or network call.
   * ```tsx
   * validators: {
   *  ...defaultValidators,
   *  customValidator,
   * }
   * ```
   * A few examples validators that come with the lib are {@link presenceValidator}, {@link lengthValidator} and {@link formatValidator}
   */
  public validators: FormContext['validators'];
  public values: FormContext['values'];
  public data: FormContext['data'] = {};
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public features: FormContext['features'];
  public decorators: Decorator[] = [];
  public sharedContext: FormContext<T>['sharedContext'];
  public nodes: FormContext<T>['nodes'] = new Map();
  public focusedNode: undefined | string;

  constructor({
    decorate = () => {},
    validators = {},
    values = {},
    formatters = {},
    translators = {},
    sharedContext = {} as T,
    features,
  }: ConstructorProps<T>) {
    this.validators = {
      ...frameworkValidators,
      ...validators,
    };

    this.values = values || {};
    this.data = values;
    this.formatters = {
      ...frameworkFormatters,
      ...formatters,
    };

    this.translators = translators || {};
    this.features = features || {};

    this.sharedContext = sharedContext;

    decorate(this as DeclarativeFormContext<T>);

    makeObservable(this, {
      data: observable,
      sharedContext: observable,
      updateContext: action,
      focusField: action,
    });
  }

  /**
   * Updating passing a single object as the first argument merges the object
   * and retriggers every watcher on {@link sharedContext} while using a key/value retriggers only
   * watchers that looks for the changed value.
   * It's safer to use the key/value syntax to create less unwanted reactions.
   * ie:
   * ```tsx
   * context.updateContext('debug', false)
   * ```
   */
  public updateContext<K extends keyof FormContext<T>['sharedContext']>(
    key: K | Partial<FormContext<T>['sharedContext']>,
    value?: Partial<FormContext<T>['sharedContext'][K]>,
  ): void {
    if (value === undefined) {
      this.oldUpdateContext(key as Partial<FormContext<T>['sharedContext']>);
    } else {
      this.actualUpdateContext(key as string, value);
    }
  }

  /**
   * This is used to define which {@link SchemaNode} should be flagged as behing in focus
   * Usefull when a list of input fields are displayed and we want to bring the cursor programatically
   * to a certain node.
   */
  public focusField(nodePath?: string) {
    const getNode = (path?: string) =>
      typeof path === 'string' ? this.nodes.get(path) : null;

    const old = getNode(this.focusedNode);
    const next = getNode(nodePath);

    if (old) old.setFocused(false);
    if (next) next.setFocused(true);

    this.focusedNode = nodePath;
  }

  /**
   * Shorthand to send an error to a specific node
   * can also be done directly on the node with {@link setErrors}
   * it automaticaly creates instances of {@link ValidationError} based on the received {@link ContextErrors} received.
   */
  public sendErrorsToNode(errorsMap: ContextErrors) {
    Object.keys(errorsMap).forEach(path => {
      if (path === 'generic') return;
      const target = this.nodes.get(path);
      const errors = errorsMap[path];
      if (!target) {
        console.warn(
          `tried to send error to node "${path}" but it was not found in the current context`,
        );
        return;
      }
      target.setErrors(
        errors.map(err => new ValidationError(err, {message: err})),
      );
    });
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

  private oldUpdateContext(
    value: Partial<FormContext<T>['sharedContext']>,
  ): void {
    this.sharedContext = {
      ...this.sharedContext,
      ...value,
    };
  }

  private actualUpdateContext<K extends keyof FormContext<T>['sharedContext']>(
    key: K,
    value: Partial<FormContext<T>['sharedContext'][K]>,
  ): void {
    (this.sharedContext as FormContext<any>['sharedContext'])[key] = value;
  }
}
