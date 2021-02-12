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
  RootNode,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '../src';
import {V1} from './v1';
import {V2} from './v2';
import {FormCardContainer} from './components/FormCardContainer';
import {
  decorateWithPolarisComponents,
  PolarisPolymorphicNode,
  PolarisRangeSlider,
} from '../src/plugins/polaris';
import {PeopleDeleteButton, PeopleListNode} from './components';
import {
  translateError,
  translateLabel,
  translateLabelsForV2,
} from './demo-utilities';

const context1 = new DeclarativeFormContext({
  decorate(ctx) {
    decorateWithPolarisComponents(ctx);

    ctx
      .where(({type}) => type === 'polymorphic')
      .replaceWith(PolarisPolymorphicNode, ({depth}) => ({
        wrap: depth === 1,
      }));

    ctx
      .where(({type, isList}) => type === 'AdditionalOwner' && isList)
      .replaceWith(PeopleListNode);

    ctx
      .where(({type, isList}) => type === 'AdditionalOwner' && !isList)
      .packWith(FormCardContainer)
      .appendWith(PeopleDeleteButton);

    ctx.where(({depth}) => depth === 3).wrapWith(FormCardContainer);

    ctx
      .where(({path}) => /ownershipPercentage$/.test(path))
      .replaceWith(PolarisRangeSlider, {min: 0, max: 100});
  },
  translators: {
    label: translateLabel,
    sectionTitle: translateLabel,
    path: translateLabel,
    error: translateError,
  },
});

const context2 = new DeclarativeFormContext({
  decorate(ctx) {
    decorateWithPolarisComponents(ctx);

    ctx.where(({depth}) => depth === 0).wrapWith(FormCardContainer, {});
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

const node1 = new SchemaNode(context1, schema1);
const node2 = new SchemaNode(context2, schema2);
// for debugger
(window as any).node1 = node1;
(window as any).node2 = node2;

export function App() {
  const [debug, setDebug] = React.useState(context1.debug);
  const [json, setJson] = React.useState<any>({});

  const formV1Jsx = (
    <Layout.Section oneHalf>
      <RootNode node={node1} />
    </Layout.Section>
  );

  const formV2Jsx = (
    <Layout.Section oneHalf>
      <RootNode node={node2} />
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
          <Form onSubmit={handleSubmit}>
            <Layout>
              {formV1Jsx}
              {formV2Jsx}
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

    const errors = [
      {
        message: "Postal/ZIP code can't be blank",
        field: ['legalEntity', 'businessDetails', 'postalCode'],
      },
    ];

    const a = {
      [['legalEntity', 'businessDetails', 'postalCode'].join('.')]: '',
    };

    // errors[this.path]

    // node2.setErrors(errors);
  }
}
