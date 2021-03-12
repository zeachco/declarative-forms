import {FormContext} from '../..';

import {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisStringNode,
  PolarisRangeSlider,
  PolarisLayoutGridPosition,
} from './components';

export {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisStringNode,
  PolarisRangeSlider,
  PolarisLayoutGridPosition,
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
