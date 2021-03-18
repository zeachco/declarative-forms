import {Card} from '@shopify/polaris';
import {DeclarativeFormContext} from '../source';
import {
  decorateWithPolarisComponents,
  PolarisPolymorphicNode,
  PolarisRangeSlider,
} from '../source/plugins/polaris';
import {
  FormCardContainer,
  PeopleDeleteButton,
  PeopleListNode,
  SpecialBusinessDetails,
} from './components';

export function decorateV1(context: DeclarativeFormContext) {
  decorateWithPolarisComponents(context);

  context
    .where(({pathShort}) => pathShort === 'legalEntity.businessDetails')
    .replaceWith(SpecialBusinessDetails);

  context
    .where(({type, depth}) => type === 'polymorphic' && depth === 1)
    .prependWith(Card, {title: 'V1 form', sectioned: true})
    .replaceWith(PolarisPolymorphicNode, {nestWithChildren: 'businessDetails'});

  context
    .where(({type, depth}) => type === 'polymorphic' && depth !== 1)
    .prependWith(Card, {sectioned: true})
    .replaceWith(PolarisPolymorphicNode);

  context
    .where(({type, isList}) => type === 'AdditionalOwner' && isList)
    .replaceWith(PeopleListNode);

  context
    .where(({type, isList}) => type === 'AdditionalOwner' && !isList)
    .packWith(FormCardContainer)
    .appendWith(PeopleDeleteButton);

  context
    .where(({depth, name}) => depth === 3 && name !== 'businessDetails')
    .wrapWith(FormCardContainer);

  context
    .where(({path}) => /ownershipPercentage$/.test(path))
    .replaceWith(PolarisRangeSlider, {min: 0, max: 100, output: true});
}
