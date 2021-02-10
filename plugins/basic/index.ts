import {FormContext} from '../../src';
import {BooleanNode} from './components/BooleanNode';
import {StringNode} from './components/StringNode';
import {PolymorphicNode} from './components/PolymorphicNode';

export function decorateWithBasicComponents(context: FormContext) {
  context.where(({schema}) => schema.type === 'string').replaceWith(StringNode);

  context
    .where(({schema}) => ['number', 'integer', 'float'].includes(schema.type))
    .replaceWith(StringNode);

  context
    .where(({schema}) => schema.type === 'boolean')
    .replaceWith(BooleanNode);

  context
    .where(({schema}) => schema.type === 'polymorphic')
    .replaceWith(PolymorphicNode);
}
