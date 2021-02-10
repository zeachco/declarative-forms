import {FormContext} from '../../src';
import {PolarisBooleanNode} from './components/PolarisBooleanNode';
import {PolarisPolymorphicNode} from './components/PolarisPolymorphicNode';
import {PolarisStringNode} from './components/PolarisStringNode';

export function decorateWithPolarisComponents(context: FormContext) {
  Object.assign(context.plugins, {
    string: PolarisStringNode,
    number: PolarisStringNode,
    integer: PolarisStringNode,
    boolean: PolarisBooleanNode,
    polymorphic: PolarisPolymorphicNode,
  });
}
