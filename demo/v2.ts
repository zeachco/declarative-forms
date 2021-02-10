export const V2 = {
  kind: 'business_address_verification',
  requestId: 'us_business_address_verification_2',
  description:
    'To continue using Shopify Payments, you need to supply some additional details about your business. If you do not submit these details, you will be unable to accept payments from your customers.',
  labels:
    '{"address":{"label":"Street"},"city":{"label":"City"},"postalCode":{"label":"ZIP code"},"provinceCode":{"label":"State"}}',
  values:
    '{"address":"150 Elgin","city":"Ottawa","postalCode":"K2P1L4","provinceCode":"ON"}',
  schema:
    '{"address":{"type":"string","validators":[{"name":"Presence"}]},"city":{"type":"string","validators":[{"name":"Presence"}]},"postalCode":{"type":"string","validators":[{"name":"Presence"}]},"provinceCode":{"type":"string","validators":[{"name":"Presence"}]}}',
  title: 'Business Address',
  __typename: 'ShopifyPaymentsInformationRequest',
};
