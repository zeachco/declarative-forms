import {FormContext} from '../..';
import {
  BooleanNode,
  PolymorphicNode,
  StringNode,
  ListNode,
  NumericNode,
} from './components';

export {BooleanNode, PolymorphicNode, StringNode, ListNode, NumericNode};

export function decorateWithBasicComponents(ctx: FormContext) {
  ctx.where(({type}) => 'string' === type).replaceWith(StringNode);
  ctx.where(({type}) => 'boolean' === type).replaceWith(BooleanNode);
  ctx.where(({isList}) => isList).replaceWith(ListNode);
  ctx.where(({type}) => 'polymorphic' === type).replaceWith(PolymorphicNode);
  ctx.where(({type}) => 'boolean' === type).replaceWith(BooleanNode);
  ctx
    .where(({type}) => ['number', 'integer'].includes(type))
    .replaceWith(NumericNode);
}
