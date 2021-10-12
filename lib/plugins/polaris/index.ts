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

export function decorateWithPolarisComponents(context: FormContext) {
  context.where(({isVariant}) => isVariant).replaceWith(PolarisPolymorphicNode);
  context.where(({type}) => type === 'boolean').replaceWith(PolarisBooleanNode);
  context
    .where(({type}) => ['string', 'number', 'integer'].includes(type))
    .replaceWith(PolarisStringNode);
  context
    .where(({schema}) => Boolean(schema.options?.length))
    .replaceWith(PolarisOptionsNode);
}
