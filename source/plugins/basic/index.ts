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
  ctx.where(({type}) => type === 'string').replaceWith(StringNode);
  ctx.where(({type}) => type === 'boolean').replaceWith(BooleanNode);
  ctx.where(({isList}) => isList).replaceWith(ListNode);
  ctx.where(({type}) => type === 'polymorphic').replaceWith(PolymorphicNode);
  ctx.where(({type}) => type === 'boolean').replaceWith(BooleanNode);
  ctx
    .where(({type}) => ['number', 'integer'].includes(type))
    .replaceWith(NumericNode);
}
