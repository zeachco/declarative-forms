import {FormContext} from '../..';
import {
  BooleanNode,
  PolymorphicNode,
  StringNode,
  ListNode,
  NumericNode,
} from './components';

export {BooleanNode, PolymorphicNode, StringNode, ListNode, NumericNode};

export function decorateWithBasicComponents(context: FormContext) {
  Object.assign(context.plugins, {
    string: StringNode,
    number: NumericNode,
    integer: StringNode,
    boolean: BooleanNode,
    polymorphic: PolymorphicNode,
  });
}
