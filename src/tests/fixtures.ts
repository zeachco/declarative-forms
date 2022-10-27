export const validatorsFixtures = {
  Presence: {name: 'Presence'},
  Format: {name: 'Format', format: '[A-Z]{2}'},
  Length: {name: 'Length', minimum: 3, maximum: 5},
};

export const expectedValuesWithNewSchema = {
  someGroup: {
    someNumberNested: 3,
    someStringNested: 'abc',
  },
  someBool: true,
  someNumber: 4,
  someString: 'def',
  someVariant: {
    someVariantType: 'asString',
    someVariantString: 'xyz',
  },
};

export const newSchema = {
  someString: {
    value: 'def',
    type: 'string',
    validators: [validatorsFixtures.Presence, validatorsFixtures.Format],
  },
  someNumber: {
    value: 4,
    type: 'integer',
  },
  someBool: {
    value: true,
    type: 'boolean',
  },
  someGroup: {
    attributes: {
      someStringNested: {
        value: 'abc',
        validators: [validatorsFixtures.Length],
        type: 'string',
      },
      someNumberNested: {
        value: 3,
        type: 'integer',
      },
    },
  },
  someVariant: {
    type: {polymorphic: ['list']},
    value: 'asString',
    attributes: {
      asString: {
        attributes: {
          someVariantString: {
            value: 'xyz',
            type: 'string',
          },
        },
      },
      asInt: {
        attributes: {
          someVariantNumber: {
            value: 3,
            type: 'integer',
          },
        },
      },
      asBool: {
        attributes: {
          someVariantBool: {
            type: 'boolean',
          },
        },
      },
      asList: {
        attributes: {
          someVariantList: {
            type: ['list'],
            value: [
              {
                someNameNode: 'John',
                someLastNameNode: 'Smith',
                someAgeNode: 50,
              },
              {
                someNameNode: 'Jane',
                someLastNameNode: 'Smith',
                someAgeNode: 40,
              },
            ],
            attributes: {
              someNameNode: {
                type: 'string',
              },
              someLastNameNode: {
                type: 'string',
              },
              someAgeNode: {
                type: 'integer',
              },
            },
          },
        },
      },
      asOption: {
        attributes: {
          someOptionNode: {
            type: 'string',
            options: ['a', 'b', 'c'],
          },
        },
      },
    },
  },
};

export const defaultSchema = {
  someString: {
    type: 'string',
    validators: [validatorsFixtures.Presence, validatorsFixtures.Format],
  },
  someNumber: {
    type: 'integer',
  },
  someBool: {
    type: 'boolean',
  },
  someGroup: {
    attributes: {
      someStringNested: {
        validators: [validatorsFixtures.Length],
        type: 'string',
      },
      someNumberNested: {
        type: 'integer',
      },
    },
  },
  someVariant: {
    type: {polymorphic: ['list']},
    attributes: {
      asString: {
        attributes: {
          someVariantString: {
            type: 'string',
          },
        },
      },
      asInt: {
        attributes: {
          someVariantNumber: {
            type: 'integer',
          },
        },
      },
      asBool: {
        attributes: {
          someVariantBool: {
            type: 'boolean',
          },
        },
      },
      asList: {
        attributes: {
          someVariantList: {
            type: ['list'],
            attributes: {
              someNameNode: {
                type: 'string',
              },
              someLastNameNode: {
                type: 'string',
              },
              someAgeNode: {
                type: 'integer',
              },
            },
          },
        },
      },
      asOption: {
        attributes: {
          someOptionNode: {
            type: 'string',
            options: ['a', 'b', 'c'],
          },
        },
      },
    },
  },
};

export const expectedValues = {
  someGroup: {
    someNumberNested: 0,
    someStringNested: '',
  },
  someBool: false,
  someNumber: 0,
  someString: '',
  someVariant: {},
};

// Snapshot of a structure for regression testing
export const ssnPassportValues = [
  {
    firstName: 'Alfonso',
    lastName: 'Astor',
    ssnOrPassport: {
      ssnOrPassportType: 'variantPassport',
      // warning values are overwritten in the full schema bellow
      passport: {
        passportId: 'ginghihnihnhn',
        country: 'US',
      },
    },
  },
  {
    firstName: 'Bob',
    lastName: 'Bernard',
    ssnOrPassport: {
      ssnOrPassportType: 'variantSsn',
      ssn: '****1111',
    },
  },
];

export const ssnPassportSchema = {
  equity_details: {
    attributes: {
      equityOwnersList: {
        type: [],
        value: ssnPassportValues,
        attributes: {
          firstName: {
            name: 'first_name',
            type: 'string',
            labels: {
              label: 'First name',
            },
            validators: [
              {
                name: 'Presence',
                message: 'First name is required',
              },
            ],
          },
          lastName: {
            name: 'last_name',
            type: 'string',
            labels: {
              label: 'Last name',
            },
            validators: [
              {
                name: 'Presence',
                message: 'Last name is required',
              },
            ],
          },
          ssnOrPassport: {
            name: 'ssnOrPassport',
            type: 'polymorphic',
            value: 'variantSsn',
            labels: {
              label: 'This person has a Social Security number (SSN)',
            },
            attributes: {
              variantSsn: {
                name: 'variantSsn',
                type: 'polymorphicVariant',
                labels: {},
                attributes: {
                  ssn: {
                    name: 'ssn',
                    type: 'ssn',
                    labels: {
                      label: 'Social Security number',
                    },
                    validators: [
                      {
                        name: 'Presence',
                        message: 'Social Security number is required',
                      },
                    ],
                  },
                },
                validators: [
                  {
                    name: 'Presence',
                    message: 'variantSsn is required',
                  },
                ],
              },
              variantPassport: {
                name: 'variantPassport',
                type: 'polymorphicVariant',
                labels: {},
                attributes: {
                  passport: {
                    name: 'Passport',
                    type: 'passportNumber',
                    // purposely set overwriting values
                    value: {
                      passportId: null,
                      country: null,
                    },
                    labels: {},
                    attributes: {
                      passportId: {
                        name: 'passport_id',
                        type: 'string',
                        labels: {
                          label: 'Passport number',
                        },
                        validators: [
                          {
                            name: 'Presence',
                            message: 'Passport number is required',
                          },
                        ],
                      },
                      country: {
                        name: 'country',
                        type: 'string',
                        labels: {
                          label: 'Country/region',
                        },
                        validators: [
                          {
                            name: 'Presence',
                            message: 'Country/region is required',
                          },
                        ],
                      },
                    },
                    validators: [
                      {
                        name: 'Presence',
                        message: 'Passport is required',
                      },
                    ],
                  },
                },
                validators: [
                  {
                    name: 'Presence',
                    message: 'variantPassport is required',
                  },
                ],
              },
            },
            validators: [
              {
                name: 'Presence',
                message:
                  'This person has a Social Security number (SSN) is required',
              },
            ],
            meta: {
              optIn: 'variantSsn',
              optOut: 'variantPassport',
            },
          },
        },
      },
    },
  },
};
