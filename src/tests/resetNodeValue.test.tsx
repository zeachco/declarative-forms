import {cloneDeep} from 'lodash';
import {DeclarativeFormContext} from 'src/DeclarativeFormContext';
import {SchemaNodeServerDefinition} from 'src/types';
import {addToSchema, compose, setup} from './utilities';

type Spec = SchemaNodeServerDefinition & {
  expectType?: string;
  expectData?: any;
  expectNull?: any;
};

const variantSchema: Spec = {
  attributes: {
    variantA: {attributes: {name: {}}},
    variantB: {attributes: {name: {}}},
  },
  value: 'variantB',
  expectType: 'object',
  expectNull: {},
  expectData: {someNodeType: 'variantB', name: undefined},
};

const specs: Spec[] = [
  {type: 'boolean', value: true},
  {type: 'string', value: 'apple'},
  {type: 'integer', expectType: 'number', value: 3},
  {type: 'number', value: 4},
  {type: 'other', expectType: 'undefined', value: 'orange'},
  {
    type: 'object',
    attributes: {optIn: {type: 'boolean'}, optValue: {type: 'string'}},
    value: {optIn: true, optValue: 'Always'},
    expectType: 'object',
  },
  {
    type: ['fruits'],
    value: ['apple', 'orange'],
    expectType: 'object',
    expectNull: [],
  },
  {...variantSchema, type: 'polymorphic'},
  {...variantSchema, type: {polymorphic: ['variantA', 'variantB']}},
  {...variantSchema, type: 'polymorphic-with-suffix'},
  // Should be treated the same as 'other' since it's not a valid polymorphic selection
  {type: 'polymorphicaly-wrong', expectType: 'undefined', value: 'orange'},
  {type: 'notpolymorphic', expectType: 'undefined', value: 'orange'},
];

describe.each(specs)(
  `when the node's type is "$type"`,
  ({
    type,
    value,
    attributes = {},
    expectType = type,
    expectData = value,
    expectNull = null,
  }) => {
    it(`returns a value of type "${expectType}" when initial value is undefined`, () => {
      const schema = {someNode: {type, attributes}};
      const {root} = setup({schema});
      expect(typeof root.data().someNode).toBe(expectType);
    });

    it('does not converts if the context value is null', () => {
      const schema = {someNode: {type, attributes}};
      const {root} = setup({schema, values: {someNode: null}});
      expect(root.data().someNode).toStrictEqual(expectNull);
    });

    it('still converts if the schema value is null', () => {
      const schema = {someNode: {type, value: null, attributes}};
      const {root} = setup({schema, values: {}});
      expect(root.data().someNode).not.toBe(null);
    });

    // Does not apply to list and variant nodes
    if (typeof type !== 'object' && type !== 'polymorphic') {
      it('prioritize schema value over context value', () => {
        const schema = {someNode: {type, value: 'X', attributes}};
        const {root} = setup({schema, values: {someNode: value}});
        expect(root.data().someNode).toStrictEqual(expectData);
      });
    }

    it(`sets the value from context`, () => {
      const schema = {someNode: {type, attributes}};
      const {root} = setup({schema, values: {someNode: value}});
      expect(root.data().someNode).toStrictEqual(expectData);
    });

    it(`sets the value from schema`, () => {
      const schema = {someNode: {type, value, attributes}};
      const {root} = setup({schema, values: {}});
      expect(root.data().someNode).toStrictEqual(expectData);
    });
  },
);

describe('special list nodes value assignments', () => {
  describe('with array of nodes', () => {
    const schema = {
      fruits: {
        type: [],
        attributes: {
          name: {},
        },
      },
    };
    const fruits = [
      {name: 'banana'},
      {name: 'strawberry'},
      {name: 'blueberry'},
      {name: 'pineapple'},
    ];

    it('initialize with empty array', () => {
      const {root} = setup({schema});
      expect(root.data()).toStrictEqual({
        fruits: [],
      });
    });

    it("hydrates from context's values", () => {
      const {root} = setup({schema, values: {fruits}});
      expect(root.data()).toStrictEqual({
        fruits,
      });
    });

    it("hydrates from schema's values", () => {
      const schema2 = cloneDeep(schema);
      Object.assign(schema2.fruits, {value: fruits});
      const {root} = setup({schema: schema2});
      expect(root.data()).toStrictEqual({
        fruits,
      });
    });
  });

  describe('with primitive array values', () => {
    const schema = {
      fruits: {
        type: [],
      },
    };
    const fruits = ['banana', 'strawberry', 'blueberry', 'pineapple'];

    it('initialize with empty array', () => {
      const {root} = setup({schema});
      expect(root.data()).toStrictEqual({
        fruits: [],
      });
    });

    it("hydrates from context's values", () => {
      const {root} = setup({schema, values: {fruits}});
      expect(root.data()).toStrictEqual({
        fruits,
      });
    });

    it("hydrates from schema's values", () => {
      const schema2 = cloneDeep(schema);
      Object.assign(schema2.fruits, {value: fruits});
      const {root} = setup({schema: schema2});
      expect(root.data()).toStrictEqual({
        fruits,
      });
    });
  });

  describe('with nested object arrays values', () => {
    const schema = {
      documents: {
        type: [],
        attributes: {
          name: {},
          pages: {
            type: [],
            attributes: {
              name: {},
            },
          },
        },
      },
    };

    const documents = [
      {
        name: 'Driver License',
        pages: [{name: 'front'}, {name: 'back'}],
      },
      {
        name: 'Passport',
        pages: [{name: 'front'}],
      },
    ];

    it('initialize with empty array', () => {
      const {root} = setup({schema});
      expect(root.data()).toStrictEqual({documents: []});
    });

    describe("hydrates from context's values", () => {
      it('with empty nested values', () => {
        const {root} = setup({
          schema,
          values: {documents: [{name: 'Passport'}]},
        });

        expect(root.data()).toStrictEqual({
          documents: expect.arrayContaining([{name: 'Passport', pages: []}]),
        });
      });

      it('with nested values', () => {
        const {root} = setup({schema, values: {documents}});

        expect(root.data()).toStrictEqual({
          documents,
        });
      });

      it('skips list items with null or undefined', () => {
        const {root} = setup({
          schema,
          values: {documents: [{name: 'id1'}, null, {name: 'id3'}]},
        });
        const {root: root2} = setup({
          schema,
          values: {documents: [{name: 'id1'}, undefined, {name: 'id3'}]},
        });

        const target = {
          documents: [
            {name: 'id1', pages: []},
            {name: undefined, pages: []},
            {name: 'id3', pages: []},
          ],
        };

        expect(root.data()).toStrictEqual(target);
        expect(root2.data()).toStrictEqual(target);
      });
    });

    describe("hydrates from schema's values", () => {
      it('with empty nested values', () => {
        const cloneSchema = cloneDeep(schema);
        Object.assign(cloneSchema.documents, {value: [{name: 'Passport'}]});
        const {root} = setup({schema: cloneSchema});

        expect(root.data()).toStrictEqual({
          documents: expect.arrayContaining([{name: 'Passport', pages: []}]),
        });
      });

      it('with nested values', () => {
        const cloneSchema = compose(
          () => schema,
          addToSchema('documents', {value: documents}),
        );

        const {root} = setup({schema: cloneSchema});

        expect(root.data()).toStrictEqual({
          documents,
        });
      });

      it('skips list items with null or undefined', () => {
        const schemaWithNull = compose(
          () => schema,
          addToSchema('documents', {
            value: [{name: 'id1'}, null, {name: 'id3'}],
          }),
        );
        const schemaWithUndefined = compose(
          () => schema,
          addToSchema('documents', {
            value: [{name: 'id1'}, undefined, {name: 'id3'}],
          }),
        );
        const {root} = setup({schema: schemaWithNull});
        const {root: root2} = setup({schema: schemaWithUndefined});

        const target = {
          documents: [
            {name: 'id1', pages: []},
            {name: undefined, pages: []},
            {name: 'id3', pages: []},
          ],
        };

        expect(root.data()).toStrictEqual(target);
        expect(root2.data()).toStrictEqual(target);
      });
    });
  });
});

describe('addInitialValuesAfterNode', () => {
  const schema = compose(
    addToSchema('fruits', {type: [], attributes: {name: {}}}),
    addToSchema('veggies', {type: [], attributes: {name: {}}}),
    addToSchema('veggies.categories.healty', {type: 'boolean'}),
  );

  function decorate(ctx: DeclarativeFormContext) {
    ctx.addInitialValuesAfterNode('fruits', {name: 'new fruit'});
  }

  it('initializes scoped children with passed values', () => {
    const {root} = setup({schema, decorate});
    const {fruits} = root.children;
    fruits.addListItem();
    expect(root.getNodeByPath('fruits.0.name')?.value).toBe('new fruit');
  });

  it('does not affect children outside of the scope with passed values', () => {
    const {root} = setup({schema, decorate});
    const {veggies} = root.children;
    veggies.addListItem();
    expect(root.getNodeByPath('veggies.0.name')?.value).toBeUndefined();
  });

  it('initializes with passed values using partial path', () => {
    const affectedPath = 'depth1.depth2.depth3.depth4';
    const unaffectedPath = 'depth1.other2.depth3.depth4';

    const schema2 = compose(
      addToSchema(affectedPath),
      addToSchema(unaffectedPath),
    );

    const {root} = setup({
      schema: schema2,
      decorate(ctx: DeclarativeFormContext) {
        ctx.addInitialValuesAfterNode('depth2', {depth4: 'hello'});
      },
    });

    expect(root.getNodeByPath(affectedPath)?.value).toBe('hello');
    expect(root.getNodeByPath(unaffectedPath)?.value).not.toBe('hello');
  });
});
