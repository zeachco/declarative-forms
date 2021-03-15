export const V2 = {
  kind: 'business_address_verification',
  requestId: 'some_unique_id',
  schema: JSON.stringify({
    address: {
      type: 'string',
      validators: [
        {name: 'Presence'},
        {name: 'Format', format: '^[0-9]+$', message: 'Only number alowed'},
      ],
    },
    city: {
      type: 'string',
      validators: [{name: 'Presence'}],
    },
    postalCode: {
      type: 'string',
      validators: [{name: 'Presence'}],
    },
    provinceCode: {
      type: 'string',
      validators: [{name: 'Presence'}],
    },
  }),
  labels: JSON.stringify({
    address: {label: 'Street'},
    city: {label: 'City'},
    postalCode: {label: 'ZIP code'},
    provinceCode: {label: 'State'},
  }),
  values: JSON.stringify({
    address: '123 Street',
    city: 'Montréal',
    postalCode: 'J4V0H0',
    provinceCode: 'AL',
  }),
  title: 'Business Address',
};
