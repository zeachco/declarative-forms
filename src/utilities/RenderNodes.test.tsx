import {
  mountDeclarativeForm,
  decorate,
  ItemDeleteButton,
} from '../tests/utilities';
import {validatorsFixtures} from '../tests/fixtures';

describe('renderNodes / renderNode / useWatcher', () => {
  const schema = {
    attributes: {
      someText: {
        type: 'string',
        value: 'abc',
        validators: [validatorsFixtures.Presence],
      },
      someNumber: {
        type: 'integer',
      },
      someWatcher: {
        type: 'string',
        watch: 'someText',
        value: 'unknown',
      },
    },
  };

  it('renders nodes using decorator functions', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});
    expect(wrapper).toContainReactComponent('input', {
      name: 'someText',
      type: undefined,
    });
    expect(wrapper).toContainReactComponent('input', {
      name: 'someNumber',
      type: 'number',
    });
    expect(node.data()).toStrictEqual({
      someText: 'abc',
      someNumber: 0,
      someWatcher: 'abc',
    });
  });

  it('reacts when setting the focus to a field', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});

    const textInput = wrapper.find('input', {name: 'someText'})!;
    const numberInput = wrapper.find('input', {name: 'someNumber'})!;
    const textNode = node.getNodeByPath('someText')!;
    const numberNode = node.getNodeByPath('someNumber')!;

    // initial state
    expect(textNode.focused).toBe(false);
    expect(numberNode.focused).toBe(false);
    expect(textInput.domNode === document.activeElement).toBe(false);
    expect(numberInput.domNode === document.activeElement).toBe(false);

    // focus the string node
    await wrapper.act(() => node.context.focusField('someText'));

    expect(textNode.focused).toBe(true);
    expect(numberNode.focused).toBe(false);
    expect(textInput.domNode === document.activeElement).toBe(true);
    expect(numberInput.domNode === document.activeElement).toBe(false);

    // focus another field
    await wrapper.act(() => node.context.focusField('someNumber'));

    expect(textNode.focused).toBe(false);
    expect(numberNode.focused).toBe(true);
    expect(textInput.domNode === document.activeElement).toBe(false);
    expect(numberInput.domNode === document.activeElement).toBe(true);

    // focus nonexisting field
    await wrapper.act(() => node.context.focusField('nonexisting'));

    expect(textNode.focused).toBe(false);
    expect(numberNode.focused).toBe(false);
    expect(textInput.domNode === document.activeElement).toBe(false);
    expect(numberInput.domNode === document.activeElement).toBe(false);
  });

  it('watches value change with useWatcher', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});
    expect(wrapper).toContainReactComponent('input', {
      name: 'someText',
      type: undefined,
    });
    expect(wrapper).toContainReactComponent('input', {
      name: 'someWatcher',
      type: undefined,
    });
    expect(wrapper).toContainReactComponent('input', {
      name: 'someNumber',
      type: 'number',
    });
    expect(node.data()).toStrictEqual({
      someText: 'abc',
      someNumber: 0,
      someWatcher: 'abc',
    });
    wrapper.act(() => node.children.someText.onChange('def'));
    expect(node.data()).toStrictEqual({
      someText: 'def',
      someNumber: 0,
      someWatcher: 'def',
    });
  });

  it('useWatcher reacts when the context is updated using updateContext', async () => {
    const {wrapper, node} = await mountDeclarativeForm({schema});

    expect(wrapper).not.toContainReactComponent('strong');

    await wrapper.act(() =>
      node.context.sendErrorsToNode({
        generic: [],
        someText: ['Server error'],
      }),
    );

    expect(wrapper).toContainReactComponent('strong', {
      children: 'Server error',
    });
  });

  it('addListItem can take a value as first argument and hydrate the node', async () => {
    const initialListValue = [
      {name: 'John', staff: false},
      {name: 'Jane', staff: true},
    ];
    const {wrapper, node} = await mountDeclarativeForm({
      schema: {
        type: ['user'],
        value: initialListValue,
        attributes: {
          name: {type: 'string'},
          staff: {type: 'boolean'},
        },
      },
      customDecorator(context) {
        decorate(context);

        context
          .where(({isList, type}) => !isList && type === 'user')
          .appendWith(ItemDeleteButton);
      },
    });

    expect(node.data()).toStrictEqual(initialListValue);

    const itemAdditionValues = {
      name: 'Joe',
      staff: true,
    };

    expect(wrapper).toContainReactComponentTimes('div', 2, {
      className: 'list-item',
    });

    wrapper.act(() => {
      node.addListItem(itemAdditionValues);
    });

    expect(node.data()).toStrictEqual([
      ...initialListValue,
      itemAdditionValues,
    ]);

    expect(wrapper).toContainReactComponentTimes('div', 3, {
      className: 'list-item',
    });

    function deleteFirstItem() {
      const item1 = wrapper.find('div', {title: '0'})!;
      item1.find('button')!.trigger('onClick');
    }

    wrapper.act(() => {
      deleteFirstItem(); // item[0]
      deleteFirstItem(); // item[1]
    });

    expect(wrapper).toContainReactComponentTimes('div', 1, {
      className: 'list-item',
    });

    expect(node.data()).toStrictEqual([itemAdditionValues]);
  });

  it('binds the onChange to the instance of the node', async () => {
    const {wrapper} = await mountDeclarativeForm({schema});

    expect(wrapper).toContainReactComponent('input', {
      name: 'someText',
      value: 'abc',
    });

    wrapper.act(() =>
      wrapper
        .find('input', {name: 'someText'})!
        .trigger('onChange', {target: {value: 'def'}}),
    );

    expect(wrapper).toContainReactComponent('input', {
      name: 'someText',
      value: 'def',
    });
  });
});
