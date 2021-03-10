import {FormContext} from '../..';

import {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisStringNode,
  PolarisRangeSlider,
} from './components';

export {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisStringNode,
  PolarisRangeSlider,
};

export function decorateWithPolarisComponents(ctx: FormContext) {
  ctx
    .where(({type}) => type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode);
  ctx.where(({type}) => type === 'boolean').replaceWith(PolarisBooleanNode);
  ctx
    .where(({type}) => ['string', 'number', 'integer'].includes(type))
    .replaceWith(PolarisStringNode);
}
