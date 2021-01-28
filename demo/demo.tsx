import React from 'react';
import {
  DeclarativeFormContext,
  getNodeChildren,
  Node,
  NodeProps,
  SchemaNodeComponent,
  SchemaNodeDefinitionLegacy,
} from '../framework';
import { StringNode } from './plugins';
import { SCHEMA } from './schema';
import { SCHEMA_SANDBOX } from './schemaSandbox';
import {
  formatValidator,
  lengthValidator,
  presenceValidator,
} from './validators';

const context = new DeclarativeFormContext({
  plugins: {
    string: StringNode,
    date: StringNode,
    region: StringNode,
    BusinessDetailsSoleProp({ node, context }: NodeProps) {
      return (
        <div key={'BusinessDetailsSoleProp'}>
          <h3>hahahaha I intercepted BusinessDetailsSoleProp</h3>
          {JSON.stringify(node)}
          {getNodeChildren({ node, context })}
        </div>
      );
    },
  },
  validators: {
    Presence: presenceValidator,
    Format: formatValidator,
    Length: lengthValidator,
  },
});

const schema: SchemaNodeDefinitionLegacy = {
  kind: 'group',
  attributes: SCHEMA_SANDBOX || SCHEMA,
};

const legacyConfigWrappedInNodes = new Node(context, '', schema);

export function App() {
  const [debug, setDebug] = React.useState(context.debug);

  return (
    <div>
      <label>
        Debug:
        <input type="checkbox" checked={debug} onChange={handleSwitch} />
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
    context.debug = !debug;
    setDebug(context.debug);
  }
}

// for debugger
(window as any).config = legacyConfigWrappedInNodes;
(window as any).context = context;
