/* eslint-disable jest/prefer-strict-equal */
import {SchemaNode, SchemaValidator, ValidatorFn} from '../types';
import {DeclarativeFormContext} from '../DeclarativeFormContext';
import {ValidationError} from '../classes/ValidationError';
import {
  expectedValues,
  expectedValuesWithNewSchema,
  newSchema,
  ssnPassportSchema,
} from './fixtures';

import {
  presenceValidator,
  formatValidator,
  lengthValidator,
  rangeValidator,
} from '../utilities/validators';
import {mountDeclarativeForm, setup} from './utilities';

describe('SchemaNode', () => {
  it('creates a root node all fields having a value', () => {
    const {root} = setup();

    expect(root.value).toStrictEqual(expectedValues);
  });

  it('parses the new schema with default values relative to each nodes', () => {
    const {root} = setup({schema: newSchema, values: {}});
    expect(root.data()).toStrictEqual(expectedValuesWithNewSchema);
  });

  it('adds variant flag on detected polymorphic nodes', () => {
    const {root} = setup({
      schema: {
        node1: {
          type: {polymorphic: ['a', 'b']},
          attributes: {a: {}, b: {}},
        },
        node2: {
          type: 'polymorphic',
          attributes: {c: {}, d: {}},
        },
      },
      values: {},
    });
    const {node1, node2} = root.children;
    expect(node1.isVariant).toBe(true);
    expect(node2.isVariant).toBe(true);
    expect(node1.attributes).toStrictEqual(['a', 'b']);
    expect(node2.attributes).toStrictEqual(['c', 'd']);
  });

  it('parses the new schema with default values relative to each nodes', () => {
    const expectedData = [
      {
        someNameNode: 'John',
        someAgeNode: 50,
      },
      {
        someNameNode: 'Jane',
        someAgeNode: 40,
      },
    ];

    const {root} = setup({
      schema: {
        someForm: {
          attributes: {
            someList: {
              type: ['list'],
              value: expectedData,
              attributes: {
                someNameNode: {type: 'string'},
                someAgeNode: {type: 'integer'},
              },
            },
          },
        },
      },
    });

    const nodeValue = root.children.someForm.children.someList.data();
    const rootValue = root.data();

    expect(nodeValue).toHaveLength(2);

    // checks the value on the list node
    expect(nodeValue).toStrictEqual(expectedData);

    // checks that the value is bubbled up to the root
    expect(rootValue).toStrictEqual({
      someForm: {
        someList: expectedData,
      },
    });
  });

  it('parses the new schema with values relative to root', () => {
    const expectedData = [
      {
        someNameNode: 'John',
        someAgeNode: 50,
      },
      {
        someNameNode: 'Jane',
        someAgeNode: 40,
      },
    ];

    const {root} = setup({
      schema: {
        someForm: {
          attributes: {
            someList: {
              type: ['list'],
              attributes: {
                someNameNode: {type: 'string'},
                someAgeNode: {type: 'integer'},
              },
            },
          },
        },
      },
      values: {
        someForm: {
          someList: expectedData,
        },
      },
    });

    const nodeValue = root.children.someForm.children.someList.data();
    const rootValue = root.data();

    expect(nodeValue).toHaveLength(2);

    // checks the value on the list node
    expect(nodeValue).toStrictEqual(expectedData);

    // checks that the value is bubbled up to the root
    expect(rootValue).toStrictEqual({
      someForm: {
        someList: expectedData,
      },
    });
  });

  it('node.subscribe listen to changes and can be unsuscribed from', () => {
    const {root} = setup({schema: newSchema, values: {}});
    const callback = jest.fn();
    const {someNumber} = root.children;
    const unsubscribe = someNumber.subscribe(({value}) => callback(value));

    someNumber.onChange(7);
    expect(callback).toHaveBeenCalledWith(7);

    // try again
    someNumber.onChange(9);
    expect(callback).toHaveBeenCalledWith(9);

    // stop listening
    unsubscribe();
    someNumber.onChange(3);
    expect(callback).not.toHaveBeenCalledWith(3);
  });

  it('names fields based of their path tail value', () => {
    const {root} = setup();

    expect(root.name).toBe('');

    const {someGroup, someNumber, someString, someBool, someVariant} =
      root.children;

    expect(someGroup.name).toBe('someGroup');
    expect(someNumber.name).toBe('someNumber');
    expect(someString.name).toBe('someString');
    expect(someBool.name).toBe('someBool');
    expect(someVariant.name).toBe('someVariant');

    const {someNumberNested, someStringNested} = someGroup.children;

    expect(someNumberNested.name).toBe('someNumberNested');
    expect(someStringNested.name).toBe('someStringNested');
  });

  it('defines path for list using the index as a name', () => {
    const expectedData = [
      {someString: 'abc', someNumber: 1},
      {someString: 'def', someNumber: 2},
    ];
    const {root} = setup({
      schema: {
        someList: {
          value: expectedData,
          type: ['list'],
          attributes: {
            someString: {type: 'string'},
            someNumber: {type: 'integer'},
          },
        },
      },
    });
    expect(root.children.someList.value[0].path.toString()).toBe('someList.0');
    expect(root.children.someList.value[1].path.toString()).toBe('someList.1');
  });

  it('hydrates node by their field name', () => {
    const values = {
      someText: 'abc',
      someNumber: 123,
    };
    const schema = {
      level1: {
        attributes: {
          level2: {
            attributes: {
              someText: {type: 'string'},
              someNumber: {type: 'integer'},
            },
          },
        },
      },
    };
    const {root} = setup({
      schema,
      values,
    });

    const expected = {
      level1: {
        level2: {
          someText: 'abc',
          someNumber: 123,
        },
      },
    };

    expect(root.data()).toStrictEqual(expected);
  });

  it('hydrates node by their shortPath in priority', () => {
    const values = {
      level1: {
        level2: {someText: 'good'},
        someText: 'bad 1',
      },
      someText: 'bad 2',
      level2: {someText: 'bad 3'},
      'level1.level2.someText': 'bad 4',
      'level2.someText': 'bad 5',
    };
    const schema = {
      level1: {
        attributes: {
          level2: {
            attributes: {
              someText: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    const {root} = setup({
      schema,
      values,
    });

    const expected = {
      level1: {
        level2: {
          someText: 'good',
        },
      },
    };

    expect(root.data()).toStrictEqual(expected);
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
      ...expectedValues,
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
        ...expectedValues,
        someGroup: {
          ...expectedValues.someGroup,
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
        ...expectedValues,
        someGroup: {
          ...expectedValues.someGroup,
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
      ...expectedValues,
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

  it('does not preselects the first option when the value is not valid', () => {
    const values = {someOptionNode: 'not_found'};
    const {root} = setup({
      values,
    });
    const {someVariant} = root.children;

    someVariant.onChange('asOption');

    expect(root.value.someVariant.someOptionNode).toBe('not_found');
  });

  it('does not preselects the first option when the value is not valid', () => {
    const values = {someOptionNode: 'not_found'};
    const {root} = setup({
      values,
      features: {preventInvalidValues: true},
    });
    const {someVariant} = root.children;

    someVariant.onChange('asOption');

    expect(root.value.someVariant.someOptionNode).toBe(null);
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
            validators: [{name: 'Format', format: '0x[a-f0-8]{6}'}],
          },
        },
      });

      expect(root.children.stringNode.validate()).toHaveLength(0);
    });

    it('reports validation errors for Format if the feature is enabled', () => {
      const {root} = setup({
        features: {enableFormatValidator: true},
        values: {
          stringNode: 'AAA',
        },
        schema: {
          stringNode: {
            type: 'string',
            validators: [{name: 'Format', format: '0x[a-f0-8]{6}'}],
          },
        },
      });

      expect(root.children.stringNode.validate()).toStrictEqual([
        expect.objectContaining({
          type: 'Format',
        }),
      ]);

      root.children.stringNode.onChange('0xaef234');

      expect(root.children.stringNode.validate()).toHaveLength(0);
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

      expect(someString.isValid).toBe(true);
      expect(someStringNested.isValid).toBe(true);
      expect(root.isValid).toBe(true);
    });

    it('getInvalidChildren returns only invalid children of itself, excluding cloned nodes with similar paths', () => {
      const {root} = setup({
        schema: {
          name: {
            type: 'string',
            validators: [{name: 'Presence'}],
          },
        },
      });

      root.validateAll();
      const clone = root.clone();

      // by default, both structures are invalid
      expect(root.isValid).toBe(false);
      expect(clone.isValid).toBe(false);
      expect(root.getInvalidChildren()).toHaveLength(1);
      expect(clone.getInvalidChildren()).toHaveLength(1);

      // we make valid only the root node, not the clone
      root.children.name.onChange('John');

      // the root node is valid, but the clone is not
      expect(root.isValid).toBe(true);
      expect(clone.isValid).toBe(false);
      expect(root.getInvalidChildren()).toHaveLength(0);
      expect(clone.getInvalidChildren()).toHaveLength(1);

      // now lets reverse the roles
      root.children.name.onChange('');
      clone.children.name.onChange('aa');

      expect(root.isValid).toBe(false);
      expect(clone.isValid).toBe(true);
      expect(root.getInvalidChildren()).toHaveLength(1);
      expect(clone.getInvalidChildren()).toHaveLength(0);
    });

    it('does not set errorsMessage immediatly when asyncValidation is true', () => {
      const {root} = setup({
        values: {
          someStringNested: 'four',
          someString: 'AZ',
        },
        features: {
          asyncValidation: true,
          enableFormatValidator: true,
        },
      });

      expect(root.isValid).toBe(true);

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      // triggers a Format validation error
      someString.onChange('a');
      // triggers a Length validation error
      someStringNested.onChange('a');
      expect(root.isValid).toBe(false);

      expect(someString.errorMessage).toBe('');
      expect(someString.isValid).toBe(false);
      expect(someStringNested.errorMessage).toBe('');
      expect(someStringNested.isValid).toBe(false);
    });

    it('shows errors message only after validateAll is used when asyncValidation is true', () => {
      const expected = {
        errors: expect.arrayContaining([
          {
            type: 'MinimumLength',
            data: {
              message: undefined,
              minimum: 3,
            },
          },
        ]),
        isValid: false,
      };

      const {root} = setup({
        values: {
          someStringNested: 'four',
          someString: 'AZ',
        },
        features: {
          asyncValidation: true,
          enableFormatValidator: true,
        },
      });

      expect(root.isValid).toBe(true);

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      // triggers a Format validation error
      someString.onChange('a');
      // triggers a Length validation error
      someStringNested.onChange('a');
      expect(root.isValid).toBe(false);
      expect(someString.isValid).toBe(false);
      expect(someStringNested.isValid).toBe(false);
      expect(someString.errorMessage).toBe('');
      expect(someStringNested.errorMessage).toBe('');

      const validationResults = root.validateAll();

      expect(root.isValid).toBe(false);
      expect(someString.isValid).toBe(false);
      expect(someStringNested.isValid).toBe(false);
      expect(someString.errorMessage).toBe('Format');
      expect(someStringNested.errorMessage).toBe('MinimumLength');
      expect(validationResults).toEqual(expected);

      someString.onChange('AZ');
      someStringNested.onChange('four');

      expect(someString.isValid).toBe(true);
      expect(someString.errorMessage).toBe('');
      expect(someStringNested.isValid).toBe(true);
      expect(someStringNested.errorMessage).toBe('');
      expect(root.isValid).toBe(true);
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

      expect(someString.isValid).toBe(false);
      expect(someStringNested.isValid).toBe(false);
      expect(root.isValid).toBe(false);
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

      expect(someString.isValid).toBe(true);
      expect(someStringNested.isValid).toBe(true);
      expect(root.isValid).toBe(true);
      expect(someString.validate()).toStrictEqual([]);
      expect(someStringNested.validate()).toStrictEqual([]);
    });

    it('marks parent nodes invalid when a child is changed with `setErrors`', () => {
      const {root} = setup({
        schema: {
          someGroup: {
            attributes: {
              someStringNested: {
                value: 'four',
                type: 'string',
                validators: [{name: 'Presence'}],
              },
            },
          },
        },
        features: {
          asyncValidation: true,
        },
      });

      const {someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      expect(root.isValid).toBe(true);
      expect(someGroup.isValid).toBe(true);
      expect(someStringNested.isValid).toBe(true);

      // setting the error on the leaf node
      someStringNested.setErrors([{type: 'Format'}]);
      expect(root.isValid).toBe(false);
      expect(someGroup.isValid).toBe(false);
      expect(someStringNested.isValid).toBe(false);

      // changing the value to trigger a reevaluation
      someStringNested.onChange('AZ');
      expect(root.isValid).toBe(true);
      expect(someGroup.isValid).toBe(true);
      expect(someStringNested.isValid).toBe(true);
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

      expect(someString.isValid).toBe(true);
      expect(someStringNested.isValid).toBe(false);
      expect(root.isValid).toBe(false);
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

        expect(someString.isValid).toBe(true);
        expect(someStringNested.isValid).toBe(false);
        expect(root.isValid).toBe(false);
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

        expect(someString.isValid).toBe(true);
        expect(someStringNested.isValid).toBe(true);
        expect(root.isValid).toBe(true);
      });

      it('does not crash when calling onChange with a non object map', () => {
        const {root} = setup();
        const {someGroup} = root.children;

        // Does nothing as it's an invalid call
        someGroup.onChange('test');
        expect(someGroup.data()).toStrictEqual({
          someNumberNested: 0,
          someStringNested: '',
        });

        someGroup.onChange(null);
        expect(someGroup.data()).toStrictEqual(null);

        someGroup.onChange(undefined);
        expect(someGroup.data()).toStrictEqual({
          someNumberNested: null,
          someStringNested: null,
        });
      });
    });
  });

  describe('isClone()', () => {
    it('returns true if node was created through cloning', () => {
      const {clonedNode, originalNode} = setupClones();
      expect(clonedNode.isClone()).toBe(true);
      expect(originalNode.isClone()).toBe(false);
    });
  });

  describe('getOriginalNode()', () => {
    it('returns the original node from which this one was cloned', () => {
      const {clonedNode, originalNode} = setupClones();
      expect(clonedNode.getOriginalNode()).toBe(originalNode);
    });
  });

  describe('getRelativeNodeByPath()', () => {
    it('returns the relative node from another node', () => {
      const {root} = setup();
      const {someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      expect(root.getRelativeNodeByPath('someGroup.someStringNested')).toBe(
        someStringNested,
      );
      expect(someGroup.getRelativeNodeByPath('someStringNested')).toBe(
        someStringNested,
      );
      expect(someGroup.getRelativeNodeByPath('')).toBe(someGroup);
    });
  });

  describe('isSameValueAsCloned()', () => {
    it('returns true if the cloned node has the same value as the original one', () => {
      const {clonedNode} = setupClones();
      expect(clonedNode.isSameValueAsCloned()).toBe(true);
    });

    it("returns false if the cloned node's value differ from the original one", () => {
      const {clonedNode, originalNode} = setupClones();
      clonedNode.onChange('a');

      expect(clonedNode.isSameValueAsCloned()).toBe(false);
      clonedNode.onChange(originalNode.value);
      expect(clonedNode.isSameValueAsCloned()).toBe(true);
      originalNode.onChange('a');
      expect(clonedNode.isSameValueAsCloned()).toBe(false);
    });
  });

  describe(`methods restricted to cloned nodes`, () => {
    ['isClone', 'getOriginalNode', 'isSameValueAsCloned'].forEach((method) => {
      it(`throws for SchemaNode.${method}()`, () => {
        const {clonedNode, originalNode} = setupClones();
        expect(() => originalNode.isSameValueAsCloned()).toThrow(Error);
        expect(() => clonedNode.isSameValueAsCloned()).not.toThrow(Error);
      });
    });
  });

  describe('.clone()', () => {
    it('creates a new node', () => {
      const {clonedNode, originalNode} = setupClones();
      expect(clonedNode).not.toBe(originalNode);
    });

    it('copies errors as well', async () => {
      const {root} = setup();
      const originalNode = root.children.someString;
      const error = new ValidationError('server', {error: 'test'});
      originalNode.setErrors([error]);

      const clonedNode = originalNode.clone();
      expect(clonedNode).not.toBe(originalNode);
      expect(clonedNode.errors).toStrictEqual(originalNode.errors);
    });

    it('does not have effect on the origin node', () => {
      const {clonedNode, originalNode} = setupClones();
      const spy = jest.fn((node) => node.value);
      originalNode.subscribe(spy);
      spy.mockReset();
      expect(spy).not.toHaveBeenCalled();
      clonedNode.onChange('changed_value');
      expect(spy).not.toHaveBeenCalled();
      originalNode.onChange('changed_value');
      expect(spy).toHaveBeenCalled();
    });

    it('sharedContext is shared between clones and originals', () => {
      const {clonedNode, originalNode} = setupClones();

      originalNode.context.updateContext('a', 1);
      expect(originalNode.context.sharedContext.a).toBe(1);
      expect(clonedNode.context.sharedContext.a).toBe(1);

      clonedNode.context.updateContext({a: 3});
      expect(clonedNode.context.sharedContext.a).toBe(3);
      expect(originalNode.context.sharedContext.a).toBe(3);
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
        ...expectedValues,
        someVariant: {
          someVariantType: 'asList',
          someVariantList: [expectedItem],
        },
      };

      expect(root.value).toStrictEqual(expected);
    });

    it('updates the index on node removal', () => {
      const schema = {
        list: {
          type: [],
          attributes: {
            name: {},
          },
        },
      };

      const {root} = setup({schema});
      const {list} = root.children;

      list.addListItem({name: 'Bob'});
      list.addListItem({name: 'Marco'});
      list.addListItem({name: 'Polo'});

      const [item1, item2, item3] = list.value;

      expect(item1.data().name).toBe('Bob');
      expect(item2.data().name).toBe('Marco');
      expect(item3.data().name).toBe('Polo');

      expect(item1.children.name.path.toString()).toBe('list.0.name');
      expect(item2.children.name.path.toString()).toBe('list.1.name');
      expect(item3.children.name.path.toString()).toBe('list.2.name');

      list.removeListItem(1); // Bye Marco

      const [updatedItem1, updatedItem2] = list.value;

      expect(updatedItem1.data()).toStrictEqual(item1.data());
      expect(updatedItem2.data()).toStrictEqual(item3.data());

      expect(updatedItem1.value).toStrictEqual(item1.value);
      expect(updatedItem2.value).toStrictEqual(item3.value);

      expect(updatedItem1.isDirty).toStrictEqual(item1.isDirty);
      expect(updatedItem2.isDirty).toStrictEqual(item3.isDirty);

      expect(updatedItem1.data().name).toBe('Bob');
      expect(updatedItem2.data().name).toBe('Polo');

      expect(updatedItem1.children.name.path.toString()).toBe('list.0.name');
      expect(updatedItem2.children.name.path.toString()).toBe('list.1.name');
    });

    it('hydrates list items with specific node intial values, excluding global values', () => {
      function decorate(context: DeclarativeFormContext) {
        context.addInitialValuesAfterNode('someVariantList', {
          someNameNode: 'Tom',
          someAgeNode: 0,
        });
      }

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
        ...expectedValues,
        someVariant: {
          someVariantType: 'asList',
          someVariantList: [expectedItem],
        },
      };

      expect(root.value).toStrictEqual(expected);
    });

    it('hydrates polymorphic children of a list item', () => {
      const schema = ssnPassportSchema();

      const {root} = setup({schema});

      expect(
        root.children.equity_details.children.equityOwnersList.value,
      ).toHaveLength(2);

      const ownersList = root.children.equity_details.children.equityOwnersList;
      ownersList.addListItem({
        firstName: 'Bob',
        lastName: 'Bernard',
        ssnOrPassport: {
          ssnOrPassportType: 'variantSsn',
          ssn: '****1111',
        },
      });

      expect(ownersList.value).toHaveLength(3);
      expect(ownersList.value[2].children.ssnOrPassport.value).toBe(
        'variantSsn',
      );
      expect(
        ownersList.value[2].children.ssnOrPassport.children.variantSsn.children
          .ssn.value,
      ).toBe('****1111');
    });
  });

  describe('hydrates child values of a polymorphic node', () => {
    const schema = {
      transport: {
        type: 'polymorphic',
        attributes: {
          Plane: {
            attributes: {
              airport: {type: 'string'},
              boarding: {
                attributes: {
                  gate: {type: 'integer'},
                  section: {type: 'string'},
                },
              },
            },
          },
        },
      },
    };

    const forwardedData = {
      transport: {
        transportType: 'Plane',
        airport: 'YUL',
        boarding: {
          section: 'A',
          gate: 78,
        },
      },
    };

    it('receives an object at the polymorphic level', async () => {
      const {root} = setup({schema});
      root.children.transport.onChange(forwardedData.transport);
      expect(root.data()).toStrictEqual(forwardedData);
    });

    it("receives an object at the polymorphic's parent level", async () => {
      const {root} = setup({schema});
      root.onChange(forwardedData);
      expect(root.data()).toStrictEqual(forwardedData);
    });
  });

  describe('hydrates child values of a polymorphic node', () => {
    const schema = {
      transport: {
        type: 'polymorphic',
        attributes: {
          Plane: {
            attributes: {
              airport: {type: 'string'},
              boarding: {
                attributes: {
                  gate: {type: 'integer'},
                  section: {type: 'string'},
                },
              },
            },
          },
        },
      },
    };

    const forwardedData = {
      transport: {
        transportType: 'Plane',
        airport: 'YUL',
        boarding: {
          section: 'A',
          gate: 78,
        },
      },
    };

    it('receives an object at the polymorphic level', async () => {
      const {root} = setup({schema});
      root.children.transport.onChange(forwardedData.transport);
      expect(root.data()).toStrictEqual(forwardedData);
    });

    it("receives an object at the polymorphic's parent level", async () => {
      const {root} = setup({schema});
      root.onChange(forwardedData);
      expect(root.data()).toStrictEqual(forwardedData);
    });
  });

  describe('isList', () => {
    describe('nested value initialization', () => {
      const value = [
        {
          name: {
            first: 'Matt',
            last: 'Hagner',
          },
          address: {
            address1: '1 Fake St',
            address2: '#23',
            city: 'Minneapolis',
            province: 'MN',
            country: 'US',
            zip: '55555',
          },
        },
      ];
      const schema = {
        list: {
          type: ['person'],
          attributes: {
            name: {
              attributes: {
                first: {
                  type: 'string',
                },
                last: {
                  type: 'string',
                },
              },
            },
            address: {
              attributes: {
                address1: {
                  type: 'string',
                },
                address2: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                zip: {
                  type: 'string',
                },
                province: {
                  type: 'string',
                },
                country: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      it('initializes nested values from list value array (with values directly on the schema)', () => {
        const {root} = setup({
          schema: {
            ...schema,
            list: {
              ...schema.list,
              value,
            },
          },
        });

        expect(root.children.list.data()).toStrictEqual(value);
      });

      it('initializes nested values from list value array (with values from the context)', () => {
        const {root} = setup({
          schema,
          values: {list: value},
        });

        expect(root.children.list.data()).toStrictEqual(value);
      });
    });
  });
});

describe('validateAll()', () => {
  describe('when variant', () => {
    it('only validates the currently selected tree', () => {
      const {root} = setup({
        schema: {
          form: {
            attributes: {
              polymorphic: {
                type: 'polymorphic',
                value: 'one',
                attributes: {
                  one: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'One is required'},
                    ],
                  },
                  two: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'Two is required'},
                    ],
                  },
                },
              },
            },
          },
        },
      });

      const form = root.children.form;

      const {isValid, errors} = form.validateAll();

      expect(isValid).toStrictEqual(false);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toStrictEqual('Presence');
      expect(errors[0].data?.message).toStrictEqual('One is required');
    });

    it('still validates all non-descendants', () => {
      const {root} = setup({
        schema: {
          form: {
            attributes: {
              siblingA: {
                type: 'string',
                validators: [
                  {name: 'Presence', message: 'siblingA is required'},
                ],
              },
              siblingB: {
                type: 'address',
                attributes: {
                  street: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'street is required'},
                    ],
                  },
                },
              },
              polymorphic: {
                type: 'polymorphic-example',
                value: 'one',
                attributes: {
                  one: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'One is required'},
                    ],
                  },
                  two: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'Two is required'},
                    ],
                  },
                },
              },
            },
          },
        },
      });

      const form = root.children.form;
      const {isValid, errors} = form.validateAll();
      expect(isValid).toStrictEqual(false);
      expect(errors).toHaveLength(3);

      const messages = errors.map((error) => error.data?.message ?? '');

      expect(messages).toContain('siblingA is required');
      expect(messages).toContain('street is required');
      expect(messages).toContain('One is required');
    });
  });

  describe('validators', () => {
    it('accepts all the default validators and custom ones [TS]', () => {
      interface CustomValidatorOptions {
        even: boolean;
        validZero?: boolean;
      }

      // this test is mostly a sanity check for TS Types usage

      const customValidator: ValidatorFn = (
        value: number,
        {even, validZero = true}: SchemaValidator<CustomValidatorOptions>,
        _node: SchemaNode,
      ): ValidationError | null => {
        if (!validZero && value === 0) {
          return new ValidationError('Custom', {message: 'Must not be zero'});
        }
        if (even && value % 2 !== 0)
          return new ValidationError('Custom', {message: 'Must be even'});

        if (!even && value % 2 === 0)
          return new ValidationError('Custom', {message: 'Must be odd'});

        return null;
      };

      const {root} = setup({
        validators: {
          Presence: presenceValidator,
          Format: formatValidator,
          Length: lengthValidator,
          Range: rangeValidator,
          EvenNumber: customValidator,
        },
      });

      expect(root.context.validators.EvenNumber).toBe(customValidator);
    });
  });

  describe('translate', () => {
    const customTranslators = {
      default: (_: SchemaNode) => `Default`,
      label: (_: SchemaNode) => `Label`,
      error: (node: SchemaNode, {error}: {error: ValidationError}) =>
        `Errors.${error?.type} error on ${node.translate('label')}`,
    } as DeclarativeFormContext['translators'];

    it('translate using translators namespace', async () => {
      const {node} = await mountDeclarativeForm({customTranslators});
      expect(node.translate('label')).toBe('Label');
    });

    it('translate uses `default` for unknown translators namespace', async () => {
      const {node} = await mountDeclarativeForm({customTranslators});
      expect(node.translate('label2')).toBe('Default');
    });

    it('getErrorMessage uses translate("error", {error})', async () => {
      const {node} = await mountDeclarativeForm({customTranslators});
      const error = new ValidationError('Custom', {message: 'Error'});
      const expected = `Errors.Custom error on Label`;
      node.setErrors([error]);
      expect(node.translate('error', {error})).toBe(expected);
      expect(node.errorMessage).toBe(expected);
    });
  });
});

function setupClones() {
  const {root} = setup();
  const originalNode = root.children.someString;
  const clonedNode = originalNode.clone();
  return {originalNode, clonedNode};
}
