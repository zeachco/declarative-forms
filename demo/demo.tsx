import {
  AppProvider,
  Checkbox,
  FormLayout,
  Frame,
  Page,
  Card,
  Layout,
  Button,
} from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';

import React from 'react';

import {
  DeclarativeFormContext,
  RootNode,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '../src';

import {translateError, translateLabel} from './plugins/translators';
import {decorate} from './decorate';
import {V1} from './v1';
import {V2} from './v2';

const context = new DeclarativeFormContext({
  decorate,
  translators: {
    label: translateLabel,
    sectionTitle: translateLabel,
    path: translateLabel,
    error: translateError,
  },
});

const schema: SchemaNodeDefinitionLegacy = {
  type: 'group',
  attributes: V1,
};

const node = new SchemaNode(context, '', schema);
// for debugger
(window as any).node = node;

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
          <Layout>
            <Layout.Section>
              <RootNode node={node} key={debug.toString()} />
              <Card>
                <Card.Section>
                  <Button primary onClick={handleSubmit}>
                    Submit
                  </Button>
                  <pre>{JSON.stringify(json, null, 1)}</pre>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
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
