export const SCHEMA = {
  legalEntity: {
    kind: {
      polymorphic: [
        "SoleProp",
        "Corporation",
        "LLC",
        "Partnership",
        "Nonprofit"
      ]
    },
    attributes: {
      SoleProp: {
        kind: "SoleProp",
        attributes: {
          businessDetails: {
            kind: "BusinessDetailsSoleProp",
            attributes: {
              businessTaxId: {
                kind: "string",
                validators: [
                  {
                    name: "Format",
                    format: "(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              provinceCode: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          personalDetails: {
            kind: "PersonalDetailsSoleProp",
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              dateOfBirth: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format:
                      "(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)"
                  }
                ]
              },
              ssnLast4: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          productDetails: {
            kind: "ProductDetails",
            attributes: {
              mccId: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              productDescription: {
                kind: "string",
                meta: {
                  multiline: true
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 500
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          billingDetails: {
            kind: "SimpleBillingDetails",
            attributes: {
              statementDescriptor: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 22
                  }
                ]
              },
              phoneNumber: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          bankAccountDetails: {
            kind: "BankAccountDetails",
            attributes: {
              routingNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              accountNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              shopifyBalance: {
                kind: "boolean"
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          }
        }
      },
      Corporation: {
        kind: "Corporation",
        attributes: {
          businessDetails: {
            kind: "BusinessDetailsCompany",
            attributes: {
              businessName: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              businessTaxId: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              provinceCode: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          personalDetails: {
            kind: "PersonalDetailsCompany",
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              jobTitle: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              dateOfBirth: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format:
                      "(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)"
                  }
                ]
              },
              ssnLast4: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A[0-9]{4}?\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              region: {
                kind: "Region",
                attributes: {
                  country: {
                    kind: "string",
                    validators: [
                      {
                        name: "Presence"
                      }
                    ]
                  },
                  provinceCode: {
                    kind: "string"
                  }
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          people: {
            kind: ["AdditionalOwner"],
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              email: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              ownershipPercentage: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Numericality",
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false
                    }
                  }
                ]
              }
            }
          },
          productDetails: {
            kind: "ProductDetails",
            attributes: {
              mccId: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              productDescription: {
                kind: "string",
                meta: {
                  multiline: true
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 500
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          billingDetails: {
            kind: "SimpleBillingDetails",
            attributes: {
              statementDescriptor: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 22
                  }
                ]
              },
              phoneNumber: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          bankAccountDetails: {
            kind: "BankAccountDetails",
            attributes: {
              routingNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              accountNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              shopifyBalance: {
                kind: "boolean"
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          }
        }
      },
      LLC: {
        kind: "LLC",
        attributes: {
          businessDetails: {
            kind: "BusinessDetailsCompany",
            attributes: {
              businessName: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              businessTaxId: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              provinceCode: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          personalDetails: {
            kind: "PersonalDetailsCompany",
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              jobTitle: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              dateOfBirth: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format:
                      "(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)"
                  }
                ]
              },
              ssnLast4: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A[0-9]{4}?\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              region: {
                kind: "Region",
                attributes: {
                  country: {
                    kind: "string",
                    validators: [
                      {
                        name: "Presence"
                      }
                    ]
                  },
                  provinceCode: {
                    kind: "string"
                  }
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          people: {
            kind: ["AdditionalOwner"],
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              email: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              ownershipPercentage: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Numericality",
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false
                    }
                  }
                ]
              }
            }
          },
          productDetails: {
            kind: "ProductDetails",
            attributes: {
              mccId: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              productDescription: {
                kind: "string",
                meta: {
                  multiline: true
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 500
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          billingDetails: {
            kind: "SimpleBillingDetails",
            attributes: {
              statementDescriptor: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 22
                  }
                ]
              },
              phoneNumber: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          bankAccountDetails: {
            kind: "BankAccountDetails",
            attributes: {
              routingNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              accountNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              shopifyBalance: {
                kind: "boolean"
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          }
        }
      },
      Partnership: {
        kind: "Partnership",
        attributes: {
          businessDetails: {
            kind: "BusinessDetailsCompany",
            attributes: {
              businessName: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              businessTaxId: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              provinceCode: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          personalDetails: {
            kind: "PersonalDetailsCompany",
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              jobTitle: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              dateOfBirth: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format:
                      "(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)"
                  }
                ]
              },
              ssnLast4: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A[0-9]{4}?\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              region: {
                kind: "Region",
                attributes: {
                  country: {
                    kind: "string",
                    validators: [
                      {
                        name: "Presence"
                      }
                    ]
                  },
                  provinceCode: {
                    kind: "string"
                  }
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          people: {
            kind: ["AdditionalOwner"],
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              email: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              ownershipPercentage: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Numericality",
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false
                    }
                  }
                ]
              }
            }
          },
          productDetails: {
            kind: "ProductDetails",
            attributes: {
              mccId: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              productDescription: {
                kind: "string",
                meta: {
                  multiline: true
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 500
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          billingDetails: {
            kind: "SimpleBillingDetails",
            attributes: {
              statementDescriptor: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 22
                  }
                ]
              },
              phoneNumber: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          bankAccountDetails: {
            kind: "BankAccountDetails",
            attributes: {
              routingNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              accountNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              shopifyBalance: {
                kind: "boolean"
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          }
        }
      },
      Nonprofit: {
        kind: "Nonprofit",
        attributes: {
          businessDetails: {
            kind: "BusinessDetailsCompany",
            attributes: {
              businessName: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              businessTaxId: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A([0-9]{2}-[0-9]{7}|[0-9]{9})\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              provinceCode: {
                kind: "string",
                meta: {
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          personalDetails: {
            kind: "PersonalDetailsCompany",
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line",
                  allowAutocomplete: "true"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              jobTitle: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              dateOfBirth: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format:
                      "(?-mix:\\A(19|20)[0-9]{2}-(01|02|03|04|05|06|07|08|09|10|11|12)-(0[1-9]|(1|2)[0-9]|(30|31))\\z)"
                  }
                ]
              },
              ssnLast4: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Format",
                    format: "(?-mix:\\A[0-9]{4}?\\z)"
                  }
                ]
              },
              address: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              city: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              postalCode: {
                kind: "string",
                meta: {
                  group: "city_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              region: {
                kind: "Region",
                attributes: {
                  country: {
                    kind: "string",
                    validators: [
                      {
                        name: "Presence"
                      }
                    ]
                  },
                  provinceCode: {
                    kind: "string"
                  }
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          people: {
            kind: ["AdditionalOwner"],
            attributes: {
              firstName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              lastName: {
                kind: "string",
                meta: {
                  group: "name_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              email: {
                kind: "string",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              ownershipPercentage: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Numericality",
                    format: {
                      greater_than: 0,
                      less_than: 101,
                      allow_nil: false
                    }
                  }
                ]
              }
            }
          },
          productDetails: {
            kind: "ProductDetails",
            attributes: {
              mccId: {
                kind: "integer",
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              productDescription: {
                kind: "string",
                meta: {
                  multiline: true
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 500
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          billingDetails: {
            kind: "SimpleBillingDetails",
            attributes: {
              statementDescriptor: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  },
                  {
                    name: "Length",
                    maximum: 22
                  }
                ]
              },
              phoneNumber: {
                kind: "string",
                meta: {
                  group: "billing_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          },
          bankAccountDetails: {
            kind: "BankAccountDetails",
            attributes: {
              routingNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              accountNumber: {
                kind: "string",
                meta: {
                  group: "bank_line"
                },
                validators: [
                  {
                    name: "Presence"
                  }
                ]
              },
              shopifyBalance: {
                kind: "boolean"
              }
            },
            validators: [
              {
                name: "Presence"
              }
            ]
          }
        }
      }
    },
    validators: [
      {
        name: "Presence"
      }
    ]
  }
};
