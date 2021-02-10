import {DeclarativeFormContext} from '../src';
import {PeopleDeleteButton, PeopleListNode} from './components/PeopleListNode';
import {PolarisPolymorphicNode} from '../plugins/polaris/components/PolarisPolymorphicNode';
import {PolarisBooleanNode} from '../plugins/polaris/components/PolarisBooleanNode';
import {PolarisRangeSlider} from '../plugins/polaris/components/PolarisRangeSlider';
import {PolarisStringNode} from '../plugins/polaris/components/PolarisStringNode';
import {FormCardContainer} from './components/FormCardContainer';

export function decorate(context: DeclarativeFormContext) {
  context
    .where(({schema}) => schema.type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, {wrap: true});

  context
    .where(({schema}) => ['string', 'integer'].includes(schema.type))
    .replaceWith(PolarisStringNode);

  context
    .where(({schema, isList}) => schema.type === 'AdditionalOwner' && isList)
    .replaceWith(PeopleListNode);

  context
    .where(({schema, isList}) => schema.type === 'AdditionalOwner' && !isList)
    .packWith(FormCardContainer)
    .appendWith(PeopleDeleteButton);

  context
    .where(({schema}) => schema.type === 'boolean')
    .replaceWith(PolarisBooleanNode);

  context.where(({depth, schema}) => depth === 2).wrapWith(FormCardContainer);

  context
    .where(({path}) => /ownershipPercentage$/.test(path))
    .replaceWith(PolarisRangeSlider, {min: 0, max: 100});
}
