import {
  AppProvider,
  Checkbox,
  FormLayout,
  Frame,
  Page,
  Card,
} from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';

import React from 'react';
import {
  DeclarativeFormContext,
  RootNode,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '../framework';
import { PolarisStringNode } from './components/PolarisStringNode';
import { formatValidator, lengthValidator } from './plugins/validators';
import { SCHEMA } from './schema';
import { decorate } from './decorate';

const context = new DeclarativeFormContext({
  decorate,
  plugins: {
    string: PolarisStringNode,
    integer: PolarisStringNode, // HACK
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

// decorate(context);

const node = new SchemaNode(context, '', schema);

export function App() {
  const [debug, setDebug] = React.useState(context.debug);
  const [json, setJson] = React.useState<any>({});

  return (
    <AppProvider i18n={undefined as any}>
      <Frame
        topBar={
          <Card>
            <Page>
              <FormLayout>
                <Checkbox
                  label="Debug structure"
                  checked={debug}
                  onChange={handleSwitch}
                />
              </FormLayout>
            </Page>
          </Card>
        }
      >
        <Page title="Demo">
          <FormLayout>
            <RootNode context={context} node={node} key={debug.toString()} />
            <hr />
            <button onClick={handleSubmit}>Submit</button>
            <pre>{JSON.stringify(json, null, 1)}</pre>
          </FormLayout>
        </Page>
      </Frame>
    </AppProvider>
  );

  function handleSwitch(checked: boolean) {
    context.debug = checked;
    setDebug(context.debug);
  }

  function handleSubmit() {
    setJson(node.data());
  }
}

// for debugger
(window as any).node = node;
(window as any).context = context;
