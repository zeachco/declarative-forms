import {FormContext} from '../..';

import {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisStringNode,
  PolarisRangeSlider,
  PolarisLayoutGridPosition,
  PolarisOptionsNode,
} from './components';

export {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisStringNode,
  PolarisRangeSlider,
  PolarisLayoutGridPosition,
  PolarisOptionsNode,
};

export function decorateWithPolarisComponents(ctx: FormContext) {
  ctx.where(({isVariant}) => isVariant).replaceWith(PolarisPolymorphicNode);
  ctx.where(({type}) => type === 'boolean').replaceWith(PolarisBooleanNode);
  ctx
    .where(({type}) => ['string', 'number', 'integer'].includes(type))
    .replaceWith(PolarisStringNode);
  ctx
    .where(({schema}) => Boolean(schema.options?.length))
    .replaceWith(PolarisOptionsNode);
}
