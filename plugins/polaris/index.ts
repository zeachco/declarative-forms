import {FormContext} from '../../src';
import {PolarisBooleanNode} from './components/PolarisBooleanNode';
import {PolarisPolymorphicNode} from './components/PolarisPolymorphicNode';
import {PolarisStringNode} from './components/PolarisStringNode';

export function decorateWithPolarisComponents(context: FormContext) {
  context
    .where(({schema}) => schema.type === 'string' || schema.type === 'integer')
    .replaceWith(PolarisStringNode);

  context
    .where(({schema}) => schema.type === 'boolean')
    .replaceWith(PolarisBooleanNode);

  context
    .where(({schema}) => schema.type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode);
}
