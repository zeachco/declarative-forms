import React from 'react';
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
import {
  DeclarativeFormContext,
  renderNodes,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '../source';
import {V1} from './v1';
import {V2} from './v2';
import {decorateV1} from './demo-decoration-v1';
import {decorateV2} from './demo-decoration-v2';
import {
  translateError,
  translateLabel,
  translateLabelsForV2,
} from './demo-utilities';

const context1 = new DeclarativeFormContext({
  decorate: decorateV1,
  translators: {
    label: translateLabel,
    sectionTitle: translateLabel,
    path: translateLabel,
    error: translateError,
  },
});

const context2 = new DeclarativeFormContext({
  decorate: decorateV2,
  translators: {
    label: translateLabelsForV2('label'),
    sectionTitle: translateLabelsForV2('sectionTitle'),
    path: translateLabelsForV2('path'),
    error: translateError,
  },
  values: JSON.parse(V2.values),
});

const {Provider: Provider1} = context1.ReactContext;
const {Provider: Provider2} = context2.ReactContext;

const schema1: SchemaNodeDefinitionLegacy = {
  type: 'group',
  attributes: V1,
};

const schema2: SchemaNodeDefinitionLegacy = {
  type: V2.kind,
  attributes: JSON.parse(V2.schema),
};

const node1 = new SchemaNode(context1, schema1);
const node2 = new SchemaNode(context2, schema2);

// for debugger
(window as any).node1 = node1;
(window as any).node2 = node2;

export function App() {
  const [debug, setDebug] = React.useState(context1.debug);
  const [json, setJson] = React.useState<any>({});
  const [errors, setErrors] = React.useState<any>({});

  const formV1Jsx = (
    <Layout.Section oneHalf>
      <Provider1 value={{errors}}>{renderNodes({node1})}</Provider1>
    </Layout.Section>
  );

  const formV2Jsx = (
    <Layout.Section oneHalf>
      <Provider2 value={{errors}}>{renderNodes({node2})}</Provider2>
    </Layout.Section>
  );

  const formSubmitJsx = (
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
  );

  return (
    <AppProvider i18n={undefined as any}>
      <Frame
        topBar={
          <Layout>
            <Card>
              <Card.Section>
                <FormLayout>
                  <Checkbox
                    label="Debug structure"
                    checked={debug}
                    onChange={handleSwitch}
                  />
                </FormLayout>
              </Card.Section>
            </Card>
          </Layout>
        }
      >
        <Page title="Demo">
          <Form onSubmit={handleSubmit} autoComplete={false}>
            <Layout>
              {formV2Jsx}
              {formV1Jsx}
              {formSubmitJsx}
            </Layout>
          </Form>
        </Page>
      </Frame>
    </AppProvider>
  );

  function handleSwitch(checked: boolean) {
    context1.debug = checked;
    context2.debug = checked;
    setDebug(checked);
  }

  function handleSubmit() {
    const data = {
      v1: node1.data(),
      v2: node2.data(),
    };
    console.log(data);
    setJson(data);

    setErrors({
      legalEntity: {
        businessDetails: {
          address: ['Something wrong'],
        },
      },
    });

    // we could even have validation from multiple
    // sources and just merge the errors
    setTimeout(() => {
      setErrors({
        ...errors,
        address: [
          'Error on context 2',
          `Time is ${new Date().toLocaleTimeString()}`,
        ],
        provinceCode: ['Decorate with a custom component'],
        legalEntity: {
          businessDetails: {
            address: ['Something wrong delayed'],
          },
        },
      });
    }, 1000);
  }
}
