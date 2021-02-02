export const SCHEMA = {
  legalEntity: {
    type: {
      polymorphic: [
        'SoleProp',
        'Corporation',
        'LLC',
        'Partnership',
        'Nonprofit',
      ],
    },
    attributes: {
      SoleProp: {
        type: 'SoleProp',
        attributes: {
          businessDetails: {
            type: 'BusinessDetailsSoleProp',
            attributes: {
              businessTaxId: {
                type: 'string',
                validators: [
                  {
                    name: 'Format',
                    format: '(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              provinceCode: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          personalDetails: {
            type: 'PersonalDetailsSoleProp',
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              dateOfBirth: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format:
                      '(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)',
                  },
                ],
              },
              ssnLast4: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          productDetails: {
            type: 'ProductDetails',
            attributes: {
              mccId: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              productDescription: {
                type: 'string',
                meta: {
                  multiline: true,
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 500,
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          billingDetails: {
            type: 'SimpleBillingDetails',
            attributes: {
              statementDescriptor: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 22,
                  },
                ],
              },
              phoneNumber: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          bankAccountDetails: {
            type: 'BankAccountDetails',
            attributes: {
              routingNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              accountNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              shopifyBalance: {
                type: 'boolean',
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
        },
      },
      Corporation: {
        type: 'Corporation',
        attributes: {
          businessDetails: {
            type: 'BusinessDetailsCompany',
            attributes: {
              businessName: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              businessTaxId: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              provinceCode: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          personalDetails: {
            type: 'PersonalDetailsCompany',
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              jobTitle: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              dateOfBirth: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format:
                      '(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)',
                  },
                ],
              },
              ssnLast4: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A[0-9]{4}?\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              region: {
                type: 'Region',
                attributes: {
                  country: {
                    type: 'string',
                    validators: [
                      {
                        name: 'Presence',
                      },
                    ],
                  },
                  provinceCode: {
                    type: 'string',
                  },
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          people: {
            type: ['AdditionalOwner'],
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              email: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              ownershipPercentage: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Numericality',
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false,
                    },
                  },
                ],
              },
            },
          },
          productDetails: {
            type: 'ProductDetails',
            attributes: {
              mccId: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              productDescription: {
                type: 'string',
                meta: {
                  multiline: true,
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 500,
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          billingDetails: {
            type: 'SimpleBillingDetails',
            attributes: {
              statementDescriptor: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 22,
                  },
                ],
              },
              phoneNumber: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          bankAccountDetails: {
            type: 'BankAccountDetails',
            attributes: {
              routingNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              accountNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              shopifyBalance: {
                type: 'boolean',
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
        },
      },
      LLC: {
        type: 'LLC',
        attributes: {
          businessDetails: {
            type: 'BusinessDetailsCompany',
            attributes: {
              businessName: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              businessTaxId: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              provinceCode: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          personalDetails: {
            type: 'PersonalDetailsCompany',
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              jobTitle: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              dateOfBirth: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format:
                      '(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)',
                  },
                ],
              },
              ssnLast4: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A[0-9]{4}?\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              region: {
                type: 'Region',
                attributes: {
                  country: {
                    type: 'string',
                    validators: [
                      {
                        name: 'Presence',
                      },
                    ],
                  },
                  provinceCode: {
                    type: 'string',
                  },
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          people: {
            type: ['AdditionalOwner'],
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              email: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              ownershipPercentage: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Numericality',
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false,
                    },
                  },
                ],
              },
            },
          },
          productDetails: {
            type: 'ProductDetails',
            attributes: {
              mccId: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              productDescription: {
                type: 'string',
                meta: {
                  multiline: true,
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 500,
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          billingDetails: {
            type: 'SimpleBillingDetails',
            attributes: {
              statementDescriptor: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 22,
                  },
                ],
              },
              phoneNumber: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          bankAccountDetails: {
            type: 'BankAccountDetails',
            attributes: {
              routingNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              accountNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              shopifyBalance: {
                type: 'boolean',
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
        },
      },
      Partnership: {
        type: 'Partnership',
        attributes: {
          businessDetails: {
            type: 'BusinessDetailsCompany',
            attributes: {
              businessName: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              businessTaxId: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              provinceCode: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          personalDetails: {
            type: 'PersonalDetailsCompany',
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              jobTitle: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              dateOfBirth: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format:
                      '(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)',
                  },
                ],
              },
              ssnLast4: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A[0-9]{4}?\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              region: {
                type: 'Region',
                attributes: {
                  country: {
                    type: 'string',
                    validators: [
                      {
                        name: 'Presence',
                      },
                    ],
                  },
                  provinceCode: {
                    type: 'string',
                  },
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          people: {
            type: ['AdditionalOwner'],
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              email: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              ownershipPercentage: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Numericality',
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false,
                    },
                  },
                ],
              },
            },
          },
          productDetails: {
            type: 'ProductDetails',
            attributes: {
              mccId: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              productDescription: {
                type: 'string',
                meta: {
                  multiline: true,
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 500,
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          billingDetails: {
            type: 'SimpleBillingDetails',
            attributes: {
              statementDescriptor: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 22,
                  },
                ],
              },
              phoneNumber: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          bankAccountDetails: {
            type: 'BankAccountDetails',
            attributes: {
              routingNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              accountNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              shopifyBalance: {
                type: 'boolean',
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
        },
      },
      Nonprofit: {
        type: 'Nonprofit',
        attributes: {
          businessDetails: {
            type: 'BusinessDetailsCompany',
            attributes: {
              businessName: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              businessTaxId: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              provinceCode: {
                type: 'string',
                meta: {
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          personalDetails: {
            type: 'PersonalDetailsCompany',
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                  allowAutocomplete: 'true',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              jobTitle: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              dateOfBirth: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format:
                      '(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)',
                  },
                ],
              },
              ssnLast4: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Format',
                    format: '(?-mix:\\A[0-9]{4}?\\z)',
                  },
                ],
              },
              address: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              city: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              postalCode: {
                type: 'string',
                meta: {
                  group: 'city_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              region: {
                type: 'Region',
                attributes: {
                  country: {
                    type: 'string',
                    validators: [
                      {
                        name: 'Presence',
                      },
                    ],
                  },
                  provinceCode: {
                    type: 'string',
                  },
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          people: {
            type: ['AdditionalOwner'],
            attributes: {
              firstName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              lastName: {
                type: 'string',
                meta: {
                  group: 'name_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              email: {
                type: 'string',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              ownershipPercentage: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Numericality',
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false,
                    },
                  },
                ],
              },
            },
          },
          productDetails: {
            type: 'ProductDetails',
            attributes: {
              mccId: {
                type: 'integer',
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              productDescription: {
                type: 'string',
                meta: {
                  multiline: true,
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 500,
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          billingDetails: {
            type: 'SimpleBillingDetails',
            attributes: {
              statementDescriptor: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                  {
                    name: 'Length',
                    maximum: 22,
                  },
                ],
              },
              phoneNumber: {
                type: 'string',
                meta: {
                  group: 'billing_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
          bankAccountDetails: {
            type: 'BankAccountDetails',
            attributes: {
              routingNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              accountNumber: {
                type: 'string',
                meta: {
                  group: 'bank_line',
                },
                validators: [
                  {
                    name: 'Presence',
                  },
                ],
              },
              shopifyBalance: {
                type: 'boolean',
              },
            },
            validators: [
              {
                name: 'Presence',
              },
            ],
          },
        },
      },
    },
    validators: [
      {
        name: 'Presence',
      },
    ],
  },
};
