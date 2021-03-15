import {Card} from '@shopify/polaris';
import {DeclarativeFormContext} from '../source';
import {
  decorateWithPolarisComponents,
  PolarisLayoutGridPosition,
} from '../source/plugins/polaris';
import {FormCardContainer} from './components';

export function decorateV2(context: DeclarativeFormContext) {
  decorateWithPolarisComponents(context);

  context
    .where(({depth}) => depth === 0)
    .prependWith(Card, {title: 'V2 form', sectioned: true})
    .wrapWith(FormCardContainer)
    .replaceWith(PolarisLayoutGridPosition, {
      grid: [['address'], ['city', 'postalCode']],
    });
}
