import {DeclarativeFormContext} from '../src';
import {
  PeopleDeleteButton,
  PeopleListNode,
  FormCardContainer,
} from './components';
import {
  PolarisBooleanNode,
  PolarisPolymorphicNode,
  PolarisRangeSlider,
  PolarisStringNode,
} from '../src/plugins/polaris';

export function decorate(context: DeclarativeFormContext) {
  Object.assign(context.plugins, {
    string: PolarisStringNode,
    integer: PolarisStringNode,
    number: PolarisStringNode,
    boolean: PolarisBooleanNode,
  });

  context
    .where(({schema}) => schema.type === 'polymorphic')
    .replaceWith(PolarisPolymorphicNode, {wrap: true});

  context
    .where(({schema, isList}) => schema.type === 'AdditionalOwner' && isList)
    .replaceWith(PeopleListNode);

  context
    .where(({schema, isList}) => schema.type === 'AdditionalOwner' && !isList)
    .packWith(FormCardContainer)
    .appendWith(PeopleDeleteButton);

  context.where(({depth}) => depth === 2).wrapWith(FormCardContainer);

  context
    .where(({path}) => /ownershipPercentage$/.test(path))
    .replaceWith(PolarisRangeSlider, {min: 0, max: 100});
}
