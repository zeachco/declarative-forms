import React from 'react';
import {
  DeclarativeFormContext,
  NodeProps,
  RootNode,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '../framework';
import { formatValidator, lengthValidator } from './formatValidator';
import { BillingDetails, StringNode } from './plugins';
import { SCHEMA } from './schema';

const context = new DeclarativeFormContext({
  plugins: {
    string: StringNode,
    date: StringNode,
    region: StringNode,
    SimpleBillingDetails: BillingDetails,
  },
  validators: {
    Format: formatValidator,
    Length: lengthValidator,
  },
});

const schema: SchemaNodeDefinitionLegacy = {
  kind: 'group',
  attributes: SCHEMA,
};

const legacyConfigWrappedInNodes = new SchemaNode(context, '', schema);

const BeforeArgs = { country: 'CA' };
const AfterArgs = { country: 'US' };

context.decoratorsByPath['legalEntity.Corporation.personalDetails.ssnLast4'] = {
  Before: ({ node, children, country }: NodeProps & typeof BeforeArgs) => {
    return (
      <div style={{ padding: 3, backgroundColor: '#ff0000aa' }}>
        <p>before ssnLast4 node, for country {country}</p>
        {children}
        <p>path: {node.path}</p>
      </div>
    );
  },
  BeforeArgs,
  After: ({ node, children, country }: NodeProps & typeof BeforeArgs) => {
    return (
      <div style={{ margin: 1, padding: 2, backgroundColor: '#ff00ffaa' }}>
        <p>after ssnLast4 node, for country {country}</p>
        {children}
        <p>path: {node.path}</p>
      </div>
    );
  },
  AfterArgs,
};

context.decoratorsByPath[
  'legalEntity.Corporation.personalDetails.dateOfBirth'
] = {
  Before: ({ node, children, country }: NodeProps & typeof BeforeArgs) => {
    return (
      <div style={{ padding: 3, backgroundColor: '#ff0000aa' }}>
        <p>before dateOfBirth node, for country {country}</p>
        {children}
        <p>path: {node.path}</p>
      </div>
    );
  },
  BeforeArgs,
  After: ({ node, children, country }: NodeProps & typeof BeforeArgs) => {
    return (
      <div style={{ margin: 1, padding: 2, backgroundColor: '#ff00ffaa' }}>
        <p>after dateOfBirth node, for country {country}</p>
        {children}
        <p>path: {node.path}</p>
      </div>
    );
  },
  AfterArgs,
};

export function App() {
  const [debug, setDebug] = React.useState(context.debug);
  const [json, setJson] = React.useState<any>({});

  return (
    <div>
      <label className="debug">
        <input type="checkbox" checked={debug} onChange={handleSwitch} /> Show
        groups
      </label>

      <RootNode
        context={context}
        node={legacyConfigWrappedInNodes}
        key={debug.toString()}
      />

      <hr />
      <button onClick={handleSubmit}>Submit</button>
      <pre>{JSON.stringify(json, null, 1)}</pre>
    </div>
  );

  function handleSwitch() {
    context.debug = !debug;
    setDebug(context.debug);
  }

  function handleSubmit() {
    setJson(legacyConfigWrappedInNodes.data());
  }
}

// for debugger
(window as any).config = legacyConfigWrappedInNodes;
(window as any).context = context;
