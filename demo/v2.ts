export const V2 = {
  kind: 'business_address_verification',
  requestId: 'some_unique_id',
  description:
    'To continue using this, you need to supply some additional details about your business. If you do not submit these details, you might regret it.',
  labels:
    '{"address":{"label":"Street"},"city":{"label":"City"},"postalCode":{"label":"ZIP code"},"provinceCode":{"label":"State"}}',
  values:
    '{"address":"123 Street","city":"Montréal","postalCode":"J4V0H0","provinceCode":"AL"}',
  schema:
    '{"address":{"type":"string","validators":[{"name":"Presence"}]},"city":{"type":"string","validators":[{"name":"Presence"}]},"postalCode":{"type":"string","validators":[{"name":"Presence"}]},"provinceCode":{"type":"string","validators":[{"name":"Presence"}]}}',
  title: 'Business Address',
  __typename: 'ShopifyPaymentsInformationRequest',
};
