import { SchemaNode } from './SchemaNode';
import { ReactComponent } from './types';

interface DecoratorSlot {
  Node?: ReactComponent;
  props?: object;
}

type DecoratorKeys = 'Replace' | 'Before' | 'After' | 'Wrap' | 'Pack';
type TestFunction = (node: SchemaNode) => boolean;

export class Decorator {
  public Before: DecoratorSlot = {};
  public After: DecoratorSlot = {};
  public Wrap: DecoratorSlot = {};
  public Pack: DecoratorSlot = {};
  public Replace: DecoratorSlot = {};

  constructor(public test: TestFunction) {}

  public replaceWith(
    component: ReactComponent,
    props: typeof component['Props']
  ) {
    return this.store('Replace', component, props);
  }

  public prependWith(
    component: ReactComponent,
    props: typeof component['Props']
  ) {
    return this.store('Before', component, props);
  }

  public appendWith(
    component: ReactComponent,
    props: typeof component['Props']
  ) {
    return this.store('After', component, props);
  }

  public wrapWith(component: ReactComponent, props: typeof component['Props']) {
    return this.store('Wrap', component, props);
  }

  public packWith(component: ReactComponent, props: typeof component['Props']) {
    return this.store('Pack', component, props);
  }

  private store(
    slotName: DecoratorKeys,
    component: ReactComponent,
    props: object = {}
  ) {
    this[slotName] = { Node: component, props };
    return this;
  }
}
