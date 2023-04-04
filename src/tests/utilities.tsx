import React, {useEffect, useRef} from 'react';
import {createMount} from '@shopify/react-testing';
import '@shopify/react-testing/matchers';

import {
  NodeProps,
  SchemaNode,
  SharedContext,
  SchemaNodeDecoratorSafeAttributes,
  SchemaNodeServerDefinition,
} from '../types';
import {renderNodes} from '../utilities/RenderNode';
import {
  DeclarativeFormContext,
  DecorateFunction,
} from '../DeclarativeFormContext';
import {useWatcher} from '../utilities/useWatcher';
import {defaultSchema} from './fixtures';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

export const translators = {
  label: translateLabel,
  error: translateError,
} as DeclarativeFormContext['translators'];

interface Options {}

interface Context {}

export const mountWithContext = createMount<Options, Context, true>({
  context() {
    return {};
  },

  render(element) {
    return element;
  },

  async afterMount() {},
});

export function ListNode({node}: NodeProps) {
  const {value, errorMessage} = useWatcher(node, ['value', 'errorMessage']);
  return (
    <section className="list-container">
      {value.map((item: SchemaNode) => {
        return (
          <div
            key={item.uid}
            className="list-item"
            title={item.path.toString()}
          >
            {renderNodes({item}, `list_child_${item.uid}`)}
          </div>
        );
      })}
      {errorMessage}
    </section>
  );
}

export function ItemDeleteButton({node}: NodeProps) {
  return (
    <button name={node.name} onClick={handleDelete}>
      Delete
    </button>
  );

  function handleDelete() {
    const index = +node.name;
    node.parentNode()?.removeListItem(index);
  }
}

export function decorate(context: DeclarativeFormContext<SharedContext>) {
  context
    .where(({type}: SchemaNodeDecoratorSafeAttributes) => type === 'string')
    .replaceWith(StringNode);

  context
    .where(({type}: SchemaNodeDecoratorSafeAttributes) => type === 'integer')
    .replaceWith(StringNode, {type: 'number'});

  context
    .where(({isList}: SchemaNodeDecoratorSafeAttributes) => Boolean(isList))
    .replaceWith(ListNode);
}

/**
 * Fake component to handle field nodes
 */
interface TextNodeProps extends NodeProps {
  type: React.InputHTMLAttributes<HTMLInputElement>['type'];
}

export function StringNode({node, type}: TextNodeProps) {
  const {errorMessage, focused} = useWatcher(node, [
    'focused',
    'value',
    'errorMessage',
  ]);
  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputElement.current) return;
    inputElement.current[focused ? 'focus' : 'blur']();
  }, [focused]);

  return (
    <>
      <input
        name={node.path.toString()}
        ref={inputElement}
        value={node.value}
        onChange={handleChange}
        type={type}
      />
      {errorMessage ? <strong>{errorMessage}</strong> : null}
    </>
  );

  function handleChange(ev: any) {
    // this simulate passing directly `onChange` into a component prop
    // if the onChange is not correctly binded, it crashes with an undefined `this`
    const {onChange} = node;
    onChange(ev.target.value);
  }
}

export function translateError(_: SchemaNode, {error = null}: any) {
  return error.type === 'server' ? error.data?.error : error.type;
}
export function translateLabel(node: SchemaNode) {
  return node.name;
}

export async function mountDeclarativeForm({
  schema = {},
  customDecorator = decorate,
  customTranslators = translators,
  values = {},
  features = {} as DeclarativeFormContext['features'],
}) {
  const context = new DeclarativeFormContext({
    decorate: customDecorator,
    translators: customTranslators,
    features,
    values,
  });
  const node = new SchemaNode(context, schema);
  const wrapper = await mountWithContext(
    <section>{renderNodes({node})}</section>,
  );

  return {wrapper, node};
}

interface SetupProps extends DeclarativeFormContext {
  decorate: DecorateFunction;
  schema: any;
}

export function setup({
  values,
  decorate = (() => {}) as DecorateFunction,
  schema = defaultSchema,
  features = {},
  validators = {},
}: Partial<SetupProps> = {}) {
  const context = new DeclarativeFormContext({
    translators,
    values,
    decorate,
    features,
    validators,
  });
  const root = new SchemaNode(context, {type: '', attributes: schema});
  return {root};
}

/**
 * Composable factory function that augment the schema
 * with a specific path and value.
 * ie:
 * ```tsx
 * const addSomePath = addToSchema('some.path', 'value');
 * const newSchema = addSomePath(oldSchema)
 * ``` *
 * @param path path to add attribute to
 * @param value
 * @returns cloned schema object
 */
export function addToSchema(path: string, value: any = {}) {
  return (accSchema: any = {}) => {
    const schema = cloneDeep(accSchema);
    const objectPath = path.split('.').join('.attributes.');
    const old = get(schema, objectPath, {});
    if (typeof old === 'object' && !Array.isArray(old))
      set(schema, objectPath, {...old, ...value});
    else set(schema, objectPath, value);
    return schema as SchemaNodeServerDefinition;
  };
}

export function compose(...fns: Function[]) {
  return fns.reduce((acc, fn) => fn(acc), undefined);
}
