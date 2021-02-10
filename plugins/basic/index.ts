import {FormContext} from '../../src';
import {BooleanNode} from './components/BooleanNode';
import {StringNode} from './components/StringNode';
import {PolymorphicNode} from './components/PolymorphicNode';

export function decorateWithBasicComponents(context: FormContext) {
  Object.assign(context.plugins, {
    string: StringNode,
    number: StringNode,
    integer: StringNode,
    boolean: BooleanNode,
    polymorphic: PolymorphicNode,
  });
}
