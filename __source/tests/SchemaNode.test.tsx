import {DeclarativeFormContext, SchemaNode} from '..';
import {DecorateFromConstructorFn} from '../DeclarativeFormContext';
import {SharedContext} from '../types';

const validatorsFixtures = {
  Presence: {name: 'Presence'},
  Format: {name: 'Format', format: '[A-Z]{2}'},
  Length: {name: 'Length', minimum: 3, maximum: 5},
};

const defaultSchema = {
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
    type: {polymorphic: ['...']},
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
            type: ['...'],
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

const neutralFixture = {
  someGroup: {
    someNumberNested: 0,
    someStringNested: '',
  },
  someBool: false,
  someNumber: 0,
  someString: '',
  someVariant: {},
};

interface SetupProps extends DeclarativeFormContext {
  decorate: DecorateFromConstructorFn<SharedContext>['decorate'];
  schema: any;
}

function setup({
  values,
  decorate = (_: DeclarativeFormContext) => {},
  schema = defaultSchema,
}: Partial<SetupProps> = {}) {
  const context = new DeclarativeFormContext({
    values,
    decorate,
  });
  const root = new SchemaNode(context, {type: '', attributes: schema});
  return {root};
}

describe('SchemaNode', () => {
  it('creates a root node all fields having a value', () => {
    const {root} = setup();

    expect(root.value).toStrictEqual(neutralFixture);
  });

  it('names fields based of their path tail value', () => {
    const {root} = setup();

    expect(root.name).toBe('');

    const {
      someGroup,
      someNumber,
      someString,
      someBool,
      someVariant,
    } = root.children;

    expect(someGroup.name).toBe('someGroup');
    expect(someNumber.name).toBe('someNumber');
    expect(someString.name).toBe('someString');
    expect(someBool.name).toBe('someBool');
    expect(someVariant.name).toBe('someVariant');

    const {someNumberNested, someStringNested} = someGroup.children;

    expect(someNumberNested.name).toBe('someNumberNested');
    expect(someStringNested.name).toBe('someStringNested');
  });

  it('hydrates node by their field name', () => {
    const values = {
      someNumberNested: 14,
      someStringNested: 'abc',
      someNumber: 42,
      someString: 'xyz',
      someBool: true,
      someVariant: 'asString',
      someVariantString: 'variant',
      someVariantNumber: -99,
      someVariantBool: true,
    };
    const {root} = setup({
      values,
    });

    const expected = {
      someGroup: {
        someNumberNested: 14,
        someStringNested: 'abc',
      },
      someNumber: 42,
      someString: 'xyz',
      someBool: true,
      someVariant: {
        someVariantType: 'asString',
        someVariantString: 'variant',
      },
    };

    expect(root.value).toStrictEqual(expected);
  });

  it('converts node values according to their types', () => {
    const values = {
      someNumberNested: '14',
      someStringNested: 14,
      someNumber: '42',
      someString: 42,
      someBool: 1,
      someVariant: 'asString',
      someVariantString: 13,
    };
    const {root} = setup({values});

    const expected = {
      ...neutralFixture,
      someGroup: {
        someNumberNested: 14,
        someStringNested: '14',
      },
      someNumber: 42,
      someString: '42',
      someBool: true,
      someVariant: {
        someVariantType: 'asString',
        someVariantString: '13',
      },
    };

    expect(root.value).toStrictEqual(expected);

    // Try with delinquent components changes
    root.children.someString.onChange(42);
    root.children.someNumber.onChange('42');
    root.children.someBool.onChange(1);

    expect(root.data()).toStrictEqual(expected);
  });

  describe('calling `onChange` propagates in both direction', () => {
    it('changes the value of parents until it reaches the root', () => {
      const {root} = setup();

      const {someNumberNested} = root.children.someGroup.children;
      const {someVariant} = root.children;
      const {someVariantNumber} = someVariant.children.asInt.children;

      someNumberNested.onChange(42);
      someVariant.onChange('asInt');
      someVariantNumber.onChange(10);

      const expected = {
        ...neutralFixture,
        someGroup: {
          ...neutralFixture.someGroup,
          someNumberNested: 42,
        },
        someVariant: {
          someVariantType: 'asInt',
          someVariantNumber: 10,
        },
      };

      expect(root.value).toStrictEqual(expected);
    });

    it('changes the value of children', () => {
      const values = {someNumberNested: 0, someStringNested: ''};
      const {root} = setup({values});
      const {someGroup} = root.children;
      const {someNumberNested, someStringNested} = someGroup.children;

      expect(someGroup.value).toStrictEqual(values);
      expect(someNumberNested.value).toStrictEqual(0);
      expect(someStringNested.value).toStrictEqual('');

      someGroup.onChange({
        someNumberNested: 123,
        someStringNested: 'abc',
      });

      const expected = {
        ...neutralFixture,
        someGroup: {
          ...neutralFixture.someGroup,
          someNumberNested: 123,
          someStringNested: 'abc',
        },
      };

      expect(root.value).toStrictEqual(expected);
      expect(someGroup.value).toStrictEqual(expected.someGroup);
      expect(someNumberNested.value).toStrictEqual(123);
      expect(someStringNested.value).toStrictEqual('abc');
    });
  });

  it('shows full path', () => {
    const {root} = setup();

    expect(root.path.toString()).toBe('');

    const {someGroup, someVariant} = root.children;

    expect(someGroup.path.toString()).toBe('someGroup');
    expect(someVariant.path.toString()).toBe('someVariant');

    const {someNumberNested} = someGroup.children;

    expect(someNumberNested.path.toString()).toBe('someGroup.someNumberNested');

    someVariant.onChange('asList');
    const {asList} = someVariant.children;

    expect(asList.path.toString()).toBe('someVariant.asList');

    const {someVariantList} = asList.children;

    expect(someVariantList.path.toString()).toBe(
      'someVariant.asList.someVariantList',
    );

    someVariantList.addListItem();
    const [index0] = someVariantList.value;

    expect(index0.path.toString()).toBe('someVariant.asList.someVariantList.0');

    const {someNameNode} = index0.children;

    expect(someNameNode.path.toString()).toBe(
      'someVariant.asList.someVariantList.0.someNameNode',
    );
  });

  it('shows truncated paths', () => {
    const {root} = setup();

    expect(root.path.toStringShort()).toBe('');

    const {someVariant} = root.children;

    expect(someVariant.path.toStringShort()).toBe('someVariant');

    someVariant.onChange('asList');
    const {asList} = someVariant.children;

    expect(asList.path.toStringShort()).toBe('someVariant');
    expect(asList.path.toStringShort(true)).toBe('someVariant[asList]');

    const {someVariantList} = asList.children;

    expect(someVariantList.path.toStringShort()).toBe(
      'someVariant.someVariantList',
    );
    expect(someVariantList.path.toStringShort(true)).toBe(
      'someVariant[asList].someVariantList',
    );

    someVariantList.addListItem();
    const {someNameNode} = someVariantList.value[0].children;

    expect(someNameNode.path.toStringShort()).toBe(
      'someVariant.someVariantList.someNameNode',
    );
    // show lists
    expect(someNameNode.path.toStringShort(false, true)).toBe(
      'someVariant.someVariantList[0].someNameNode',
    );
    // show variants
    expect(someNameNode.path.toStringShort(true, false)).toBe(
      'someVariant[asList].someVariantList.someNameNode',
    );
    // show variants and lists
    expect(someNameNode.path.toStringShort(true, true)).toBe(
      'someVariant[asList].someVariantList[0].someNameNode',
    );
  });

  it('does not convert to type if the initial value is null', () => {
    const values = {
      someNumber: null,
      someString: null,
      someBool: null,
      someGroup: null,
    };
    const {root} = setup({values});

    const expected = {
      ...neutralFixture,
      someNumber: null,
      someString: null,
      someBool: null,
      someGroup: null,
    };

    expect(root.value).toStrictEqual(expected);
  });

  it('keeps track of the dirty state', () => {
    const values = {someNumber: 50};
    const {root} = setup({values});

    const {someNumber} = root.children;

    expect(someNumber.dirty).toBe(false);

    someNumber.onChange(25);

    expect(someNumber.dirty).toBe(true);

    someNumber.resetNodeValue();

    expect(someNumber.dirty).toBe(false);
  });

  it('preselects the first option when the value is not valid', () => {
    const values = {someOptionNode: 'not_found'};
    const {root} = setup({values});
    const {someVariant} = root.children;

    someVariant.onChange('asOption');

    expect(root.value.someVariant.someOptionNode).toBe('a');
  });

  describe('fields validation', () => {
    it('does not report validation errors for Format', () => {
      const {root} = setup({
        values: {
          stringNode: 'AAA',
        },
        schema: {
          stringNode: {
            type: 'string',
            validators: [{name: 'Format', format: 'ZZZZZ'}],
          },
        },
      });

      expect(root.children.stringNode.validate()).toStrictEqual([]);
    });

    it('marks valid when created with the right values', () => {
      const {root} = setup({
        values: {
          someStringNested: '',
          someString: 'AZ',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);
    });

    it('marks invalid when created with the wrong values', () => {
      const {root} = setup({
        values: {
          someStringNested: 'z',
          someString: '',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      expect(someString.isValid()).toBe(false);
      expect(someStringNested.isValid()).toBe(false);
      expect(root.isValid()).toBe(false);
    });

    it('marks valid when changed with the right values', () => {
      const {root} = setup({
        values: {
          someStringNested: 'z',
          someString: 'w',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      someString.onChange('AZ');
      someStringNested.onChange('');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);
      expect(someString.validate()).toStrictEqual([]);
      expect(someStringNested.validate()).toStrictEqual([]);
    });

    it('marks invalid when changed with the wrong values', () => {
      const {root} = setup({
        values: {
          someStringNested: '',
          someString: 'AZ',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      someString.onChange('a');
      someStringNested.onChange('a');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(false);
      expect(root.isValid()).toBe(false);
    });

    describe('when changed from a non leaf node', () => {
      it('marks invalid when changed with the wrong values', () => {
        const {root} = setup({
          values: {
            someStringNested: '',
            someString: 'AZ',
          },
        });

        const {someString, someGroup} = root.children;
        const {someStringNested} = someGroup.children;
        someGroup.onChange({
          someNumberNested: 'a',
          someStringNested: 'a',
        });

        expect(someString.isValid()).toBe(true);
        expect(someStringNested.isValid()).toBe(false);
        expect(root.isValid()).toBe(false);
      });

      it('marks valid when changed with the right values', () => {
        const {root} = setup({
          values: {
            someStringNested: 'a',
            someString: 'a',
          },
        });

        const {someString, someGroup} = root.children;
        const {someStringNested} = someGroup.children;
        someGroup.onChange({
          someNumberNested: 3,
          someStringNested: 'AZF',
        });

        expect(someString.isValid()).toBe(true);
        expect(someStringNested.isValid()).toBe(true);
        expect(root.isValid()).toBe(true);
      });
    });
  });

  describe('data manipulation for `isList`', () => {
    const values = {
      someNameNode: 'Jerry',
      someLastNameNode: 'Smith',
      someAgeNode: null,
    };

    it('hydrates list items with default intial values', () => {
      const {root} = setup({values});
      const {someVariant} = root.children;
      someVariant.onChange('asList');
      const {someVariantList} = someVariant.children.asList.children;
      someVariantList.addListItem();
      const [item0] = someVariantList.value;
      const {someNameNode, someLastNameNode, someAgeNode} = item0.children;

      const expectedItem = {
        someNameNode: 'Jerry',
        someLastNameNode: 'Smith',
        someAgeNode: null,
      };

      expect(someNameNode.value).toBe(expectedItem.someNameNode);
      expect(someNameNode.value).toBe(expectedItem.someNameNode);
      expect(someLastNameNode.value).toBe(expectedItem.someLastNameNode);
      expect(someAgeNode.value).toBe(expectedItem.someAgeNode);
      expect(item0.value).toStrictEqual(expectedItem);
      expect(item0.data()).toStrictEqual(expectedItem);

      const expected = {
        ...neutralFixture,
        someVariant: {
          someVariantType: 'asList',
          someVariantList: [expectedItem],
        },
      };

      expect(root.value).toStrictEqual(expected);
    });

    it('hydrates list items with specific node intial values, excluding global values', () => {
      const decorate = (context: DeclarativeFormContext) =>
        context.addInitialValuesAfterNode('someVariantList', {
          someNameNode: 'Tom',
          someAgeNode: 0,
        });

      const {root} = setup({values, decorate});
      const {someVariant} = root.children;
      someVariant.onChange('asList');
      const {someVariantList} = someVariant.children.asList.children;
      someVariantList.addListItem();
      const [item0] = someVariantList.value;
      const {someNameNode, someLastNameNode, someAgeNode} = item0.children;

      const expectedItem = {
        someNameNode: 'Tom',
        someLastNameNode: '',
        someAgeNode: 0,
      };

      expect(someNameNode.value).toBe(expectedItem.someNameNode);
      expect(someLastNameNode.value).toBe(expectedItem.someLastNameNode);
      expect(someAgeNode.value).toBe(expectedItem.someAgeNode);
      expect(item0.value).toStrictEqual(expectedItem);
      expect(item0.data()).toStrictEqual(expectedItem);

      const expected = {
        ...neutralFixture,
        someVariant: {
          someVariantType: 'asList',
          someVariantList: [expectedItem],
        },
      };

      expect(root.value).toStrictEqual(expected);
    });
  });
});
