# Declarative-forms

A library helper to generate complex forms and offer a system to decorate them.

## Table of Contents

- [Mission](#mission)
- [Guidelines (WIP)](#guidelines-wip)
- [Contribution](#contribution)
- [Usage in code](#usage-in-code)
- [Shared context mechanics](#shared-context-mechanics)
- [Test library changes locally](#test-library-changes-locally)
- [Documentation](#documentation)
- [Understanding reactivity](//mobx.js.org/understanding-reactivity.html)
- [Jump in the code](#jump-in-the-code)

## Mission

To abstract as much as possible the hierarchy and functionality of data structures an interface wants to collect and allow constructing forms that have a sufficient flexibility to provide tailored UX on specific fields.

## Library consumer's guidelines (WIP)

1. Avoid as much as possible coupling logic between different nodes. If you do, ensure you fail fast throwing errors and isolate the coupling into hooks or utilities to make the relation obvious.
2. Try to type as much as possible objects such as the `sharedContext`, `SchemaNode` and schema's `meta` attributes.
3. Server should not be concerned with UX decisions nor relations between nodes if it does not need to. But it is responsible for providing the context necessary to recognize what's expected for each node and can pass configuration through the `meta` attribute if a spec does not fit the mission of the library directly.
4. If a feature is shoehorned into the library, there is a good chance it can also be made by building around the library.

## Library maintainer's guidelines (WIP)

1. Retro-compatibility is crucial, mark @deprecated functions if you want to remove them, create a new method if you want to change its behavior, use `features` from the {@link DeclarativeFormContext} if the behavior change's scope is too large or core to the library.
2. For defining the schema's structure, there are no DOs and DONTs but you can try to keep the schema as close as possible of the mission and place what doesn't fit right into `meta` if really needed (use good judgement).
3. The goal is to have a JSON that's as minimal as possible, but still offers enough information to structure an abstract layout that presents and collects information.
4. Right now, the schema is generated for web consumption but could be consumed by node process that run bots or other environments were we can integrate and collect data from users.

## Contribution

`dev up` or `yarn` to install dependencies
`dev build` or `yarn build` to create a consumable package

### Change logs

When creating a PR for this repo, `yarn changeset` or `yarn changelog` can be used to leave notes for the version release.

When creating a new release, `yarn changeset version` is invoked automatically and merge all changelogs into the CHANGELOG.md file. Then a tag is created and the package is deployed.

But in order to create a new version, just run `yarn deploy` from your computer

Here are some examples of things that can add noise and might not need to be documented in a release:

- implementation details
- ci / pipeline changes
- eslint or style without functionality changes
- internal notes or comments that do not appear in public js-doc

In order to create a new version, run `yarn deploy`

## Usage in code

### Schema structure

Create a context to be shared across the form

let say we work from this network request

```json
{
  "firstName": {
    "type": "string",
    "value": "John",
    "validators": [{"name": "Presence"}],
    "labels": {
      "label": "First name",
      "description": "Birth given first name"
    }
  },
  "lastName": {
    "type": "string",
    "value": "Smith",
    "validators": [{"name": "Presence"}],
    "labels": {
      "label": "Last name",
      "description": "Birth given last name"
    }
  },
  "age": {
    "type": "integer",
    "value": 30,
    "validators": [
      {"name": "Presence"},
      {"name": "Format", "format": "[1-9][0-9]"}
    ]
  },
  "medicalNumber": {
    "type": "string",
    "validators": [
      {
        "name": "Presence",
        "message": "We need your medical number to verify your identity"
      },
      {"name": "Format", "format": "[A-Z]{4}-?[0-9]{6}-?[0-9]{2}"}
    ],
    "labels": {
      "label": "Medical insurance number",
      "helpText": "This is the number at the top of your Medical card, 4 letters followed by 8 digits"
    }
  }
}
```

We can create our root `SchemaNode` from:

```typescript
import {DeclarativeFormContext} from '@zeachco/declarative-forms';
import {decorate} from 'decoratorFactory';
import request from 'request.json';

const {values, schema, labels} = request;

const context = new DeclarativeFormContext({
  values,
  decorate,
  translators,
  sharedContext,
});

const root = new SchemaNode(context, schema);
```

Now let's look at decorators.
decorators can be found at

```typescript
export function decorate(context) {
  context
    .where(({depth}) => depth === 0)
    .prependWith(HeaderBanner)
    .appendWith(FooterActions);

  context.where(({type}) => type === 'string').replaceWith(TextField);

  context.where(({type}) => type === 'boolean').replaceWith(CheckBoxComponent);

  context
    // Allows for granular selectors, everything from the SchemaNode is accessible to help filtering
    .where(({schema}: SchemaNode) => Boolean(schema.options?.length))
    // Additional props can receive a factory that read the current node
    .replaceWith(SelectComponent, ({schema}) => ({
      preselectFirstItem: !!schema.meta.preselect,
    }));
}
```

Once you have you have a node, you can simply render it with

```tsx
import {renderNodes} from '@zeachco/declarative-forms';

function ReactComponent({request}) {
  const root: SchemaNode = useMemoizedRootNodeFromRequest(request);

  return <Layout>{renderNodes(root)}</Layout>;
}
```

Or you can render sub parts of the schema

```tsx
import {renderNodes} from '@zeachco/declarative-forms';

function ReactComponent({request}) {
  const root: SchemaNode = useMemoizedRootNodeFromRequest(request);

  return <Layout>{renderNodes(root.children.medicalNumber)}</Layout>;
}
```

## Shared context mechanics

You can have a state-self-managed context shared across all the components and available at the consumer level, it's on the context object called `sharedContext`.

When creating a context

```tsx
const context = new DeclarativeFormContext({
  values,
  decorate,
  translators,
  sharedContext, // <---- this is the shared context
});

const root = new SchemaNode(context, schema);
```

it's structure is extendable with anything and `useWatcher` will expose this context and react to it's changes given the right watching function.

the watching function is just a function that matches which values we want to read from the observable

```tsx
const MINIMUM_VALUE = 3;
function watchValues({value, errorMessage}: SchemaNode) {
  return {
    enabled: value > MINIMUM_VALUE,
    errorMessage: errorMessage,
    // and watching sharedContext
    country: node.context.sharedContext.country,
  };
}

const {enabled, errorMessage, country} = useWatcher(node, watchValues);
```

or watching just the shared context

```tsx

const {country} = useWatcher(node.context, ({sharedContext}) => ({country: sharedContext.country})));
```

Sugar syntax tip: we can also pass a string array if they are only readable properties

```tsx
// this will react to `value`, `errors and `focused`
const {value, focused} = useWatcher(node, ['value', 'errors', 'focused']);
```

By passing a function that maps fields, we registers listeners on each of the {@link SchemaNode} attributes we care about limiting the reaction to only what we care about.

from anywhere in the code you can

```tsx
node.context.updateContext({
  anySortOfFlag: true,
});
```

then from any React component

```tsx
function watchContext({anySortofFlag, errors}}: SharedContext) {
  return {visible: anySortOfFlag && errors.length === 0}
}

function CustomComponent({node}: NodeProps) {
  const {visible} = useWatcher(node.context.sharedContext, watchContext);
  return <Modal visible={visible} />;
}
```

and the component will automatically react to the changes

## Test library changes locally

Assuming `web` is already cloned in the default `dev` location.

If not, refer to the package.json to manually reproduce the steps with the right paths.

1. clone the project & install dependencies `dev clone @zeachco/declarative-forms && yarn`

2. Make your changes to the library

3. Build a local version `yarn build:local`. This command runs build but also copy into `web`'s node modules and tries to restart `web`'s webpack (if on spin)

4. Test on web ✨

## Test library changes in Spin

These instructions are for testing against `web` utilizing the `business-platform` spin constellation. If you'd like to test against another repo in Spin, you'll need to create a spin config locally that extends the constellation you'd like to work with and add `declarative-forms` to the list of repos in your local spin config.

1. Run `spin up business-platform:with-pax`. This will create a spin instance that includes this repo alongside of `web` and `business-platform`.

2. Make your changes to `declarative-forms`

3. Run `yarn build:local` from within the `declarative-forms` repo

4. Verify your changes in `web` ✨

## Documentation

the full API documentation is available at <https://zeachco.github.io/declarative-forms/>
you can run a local version of this by simply running `yarn start` (make sure to have the dependencies installed before with `yarn`).

This will create a local folder `docs/` that you might want to clean up before committing some code changes, leaving the docs in place will not cause any harm but it will pollute the git diff on your next PR with autogenerated files.

## Jump in the code

If you can't click those links, it's probably because you are viewing the the README.md directly instead of browsing the advanced documentation at <https://zeachco.github.io/declarative-forms/>

### library features

- {@link DeclarativeFormContext.features}

### Frontend validation

- {@link SchemaNode.setErrors}
- {@link SchemaNode.validateAll}
- {@link presenceValidator}
- {@link formatValidator}
- {@link lengthValidator}

[Back to top](#declarative-forms)
