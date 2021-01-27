import React from 'react';
import {
  DeclarativeFormContext,
  Node,
  SchemaNodeComponent,
  SchemaNodeDefinitionLegacy,
} from '../framework';
import { ListNode, PolyNode, StringNode } from './plugins';
import { SCHEMA } from './schema';
import { FormatValidator, PresenceValidator } from './validators';

const context = new DeclarativeFormContext({
  plugins: {
    string: StringNode,
    date: StringNode,
    region: StringNode,
    list: ListNode,
    polymorphic: PolyNode,
  },
  validators: {
    Presence: PresenceValidator,
    Format: FormatValidator,
  },
});

const schema: SchemaNodeDefinitionLegacy = {
  kind: 'group',
  attributes: SCHEMA,
};

const legacyConfigWrappedInNodes = new Node(context, '', schema);

(window as any).config = legacyConfigWrappedInNodes;
(window as any).context = context;

export function App() {
  const [debug, setDebug] = React.useState(false);
  context.debug = debug;

  return (
    <div>
      <label>
        Debug:
        <input
          type="checkbox"
          value={context.debug ? 'checked' : 'unchecked'}
          onChange={handleSwitch}
        />
      </label>
      <hr />
      <SchemaNodeComponent
        context={context}
        node={legacyConfigWrappedInNodes}
        key={debug.toString()}
      />
    </div>
  );

  function handleSwitch() {
    setDebug(!context.debug);
  }
}
