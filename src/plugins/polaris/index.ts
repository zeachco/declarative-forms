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

export function decorateWithPolarisComponents(context: FormContext) {
  Object.assign(context.plugins, {
    string: PolarisStringNode,
    number: PolarisStringNode,
    integer: PolarisStringNode,
    boolean: PolarisBooleanNode,
    polymorphic: PolarisPolymorphicNode,
  });
}
