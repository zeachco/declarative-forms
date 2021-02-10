import {
  AppProvider,
  Checkbox,
  FormLayout,
  Frame,
  Page,
  Card,
  Layout,
  Button,
  Form,
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
import {FormCardContainer} from './components/FormCardContainer';
import {get} from 'lodash';
import {PolarisBooleanNode, PolarisStringNode} from '../src/plugins/polaris';

const context1 = new DeclarativeFormContext({
  decorate,
  translators: {
    label: translateLabel,
    sectionTitle: translateLabel,
    path: translateLabel,
    error: translateError,
  },
});

const labelsForV2 = JSON.parse(V2.labels);
function translateLabelsForV2(key: string) {
  return (node: SchemaNode) =>
    get<string>(labelsForV2, [node.path, key].join('.'), '');
}

const context2 = new DeclarativeFormContext({
  decorate(ctx) {
    Object.assign(ctx.plugins, {
      string: PolarisStringNode,
      integer: PolarisStringNode,
      number: PolarisStringNode,
      boolean: PolarisBooleanNode,
    });

    ctx
      .where(({schema}) => schema.type === 'business_address_verification')
      .wrapWith(FormCardContainer, {});
  },
  translators: {
    label: translateLabelsForV2('label'),
    sectionTitle: translateLabelsForV2('sectionTitle'),
    path: translateLabelsForV2('path'),
    error: translateError,
  },
  values: JSON.parse(V2.values),
});

const schema1: SchemaNodeDefinitionLegacy = {
  type: 'group',
  attributes: V1,
};
const schema2: SchemaNodeDefinitionLegacy = {
  type: V2.kind,
  attributes: JSON.parse(V2.schema),
};

const node1 = new SchemaNode(context1, '', schema1);
const node2 = new SchemaNode(context2, '', schema2);
// for debugger
(window as any).node1 = node1;
(window as any).node2 = node2;

export function App() {
  const [debug, setDebug] = React.useState(context1.debug);
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
          <Form onSubmit={handleSubmit}>
            <Layout>
              <Layout.Section oneHalf>
                <RootNode node={node1} />
              </Layout.Section>
              <Layout.Section oneHalf>
                <RootNode node={node2} />
              </Layout.Section>
              <Layout.Section>
                <Card>
                  <Card.Section>
                    <Button primary submit>
                      Submit
                    </Button>
                    <pre>{JSON.stringify(json, null, 1)}</pre>
                  </Card.Section>
                </Card>
              </Layout.Section>
            </Layout>
          </Form>
        </Page>
      </Frame>
    </AppProvider>
  );

  function handleSwitch(checked: boolean) {
    context1.debug = checked;
    context2.debug = checked;
    setDebug(context1.debug);
  }

  function handleSubmit() {
    const data = {
      v1: node1.data(),
      v2: node2.data(),
    };
    console.log(data);
    setJson(data);
  }
}
