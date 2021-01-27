import * as React from 'react';
import {
  DeclarativeFormContext,
  Node,
  SchemaNodeComponent,
  SchemaNodeDefinitionLegacy,
} from '../framework';
import { GroupNode, ListNode, PolyNode, StringNode } from './plugins';
import { SCHEMA } from './schema';
import { FormatValidator, PresenceValidator } from './validators';

const context = new DeclarativeFormContext({
  plugins: {
    string: StringNode,
    date: StringNode,
    region: StringNode,
    list: ListNode,
    polymorphic: PolyNode,
    group: GroupNode,
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
  return (
    <div>
      <SchemaNodeComponent
        context={context}
        node={legacyConfigWrappedInNodes}
      />
    </div>
  );
}
