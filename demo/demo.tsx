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
  RenderNode,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
} from '@zeachco/declarative-form/source';
import {V1} from './v1';
import {V2} from './v2';
import {FormCardContainer} from './components/FormCardContainer';
import {
  decorateWithPolarisComponents,
  PolarisPolymorphicNode,
  PolarisRangeSlider,
} from '@zeachco/declarative-form/source/plugins/polaris';
import {PeopleDeleteButton, PeopleListNode} from './components';
import {
  translateError,
  translateLabel,
  translateLabelsForV2,
} from './demo-utilities';
import {SpecialBusinessDetails} from './components/SpecialBusinessDetails';

const context1 = new DeclarativeFormContext({
  decorate(ctx) {
    decorateWithPolarisComponents(ctx);

    ctx
      .where(({pathShort}) => pathShort === 'legalEntity.businessDetails')
      .replaceWith(SpecialBusinessDetails);

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
      <Provider1 value={{errors}}>
        <RenderNode node={node1} />
      </Provider1>
    </Layout.Section>
  );

  const formV2Jsx = (
    <Layout.Section oneHalf>
      <Provider2 value={{errors}}>
        <RenderNode node={node2} />
      </Provider2>
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
