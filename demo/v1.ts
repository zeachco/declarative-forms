export const V1 = {
  legalEntity: {
    type: {
      polymorphic: [
        'Variant1',
        'Variant2',
        'Variant3',
        'Variant4',
        'Variant5',
      ],
    },
    attributes: {
      Variant1: {
        type: 'Variant1',
        attributes: {
          businessDetails: {
            type: 'BusinessDetailsVariant1',
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
            type: 'PersonalDetailsVariant1',
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
            type: {
              polymorphic: ['BankAccountDetailsCA', 'BankAccountDetailsUS'],
            },
            attributes: {
              BankAccountDetailsCA: {
                type: 'BankAccountDetailsCA',
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
                  institutionNumber: {
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
                  currency: {
                    type: 'string',
                    options: ['CAD', 'USD'],
                    validators: [
                      {
                        name: 'Presence',
                      },
                    ],
                  },
                },
              },
              BankAccountDetailsUS: {
                type: 'BankAccountDetailsUS',
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
                  currency: {
                    type: 'string',
                    options: ['USD'],
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
        },
      },
      Variant2: {
        type: 'Variant2',
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
              useThisOption: {
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
      Variant3: {
        type: 'Variant3',
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
              useThisOption: {
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
      Variant4: {
        type: 'Variant4',
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
              useThisOption: {
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
      Variant5: {
        type: 'Variant5',
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
              useThisOption: {
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
