# Changelog

## 2.1.0

### Minor Changes

- 631f33e: Add: `suppressWarnings` to features
  Fix: wrong value on a variant node will result in null instead of the initial server value

### Patch Changes

- 631f33e: Fixes polymorphic node initial value when set from parent nodes
  Renamed internal methods for clarity

## 2.0.3

### Patch Changes

- 81ba7ce: Moved documentation scripts into the `scripts` folder
- cfe1c23: Removes unused files from the repo
- b75f3b8: Removes [Skip CI] and Adds information to deploy script

## 2.0.1

### Patch Changes

- cb9ef43: Fixed CI auto deployment

## 2.0.0

### Major Changes

- e1bf2a9: Removed `exists` from `useNode`. `useWatcher` is to be used to verify the existance of a `SchemaNode`
- 7a5c89f: Changed type: Translator Functions can return undefined, this allows for more control over missing translation from the consuming code

### Minor Changes

- cfc4b90: Adds flexible polymorphic types

### Patch Changes

- d311e47: Simplified type for ValidationError

## 1.6.14

### Patch Changes

- ae691d8: Change deployement script to bash

## 1.6.13

### Patch Changes

- e2dd98d: Added documentation

### Minor Changes

- dc5db68: Added some feature

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.6.8]

### Added

- Type for `ValidationError` to allow custom translator properties
- Maintenance and usage documentation

### Removed

- Deprecated `defaultOptionToFirstValue`

### Fixed

- initial values from context when the first node is a list type node

## [1.6.3]

### Added

- SchemaNode.getRelativeNodeByPath

### Fixed

- Suppress mobx console.warn
- Fixes a bug with tests and decorators being auto observed

## [1.6.1]

### Added

- console.warning when setting a value on a parent node for children that does not exist

### Removed

- SchemaNode.proxy (Deprecated)

### Changed

- SchemaNode.value now is the proxy
- SchemaNode is now fully an observable with `makeAutoObservable`
- SchemaNode.value is now readonly for the consumer

## [1.6.0] - 2022-05-18

### Added

- `useWatcher` hook for more granular reactivity
- documentation and examples
- DeclarativeFormContext `sendErrorsToNode`
- tests on `onChange` binding
- SchemaNode `proxy` as `schema.watch` value
- SchemaNode `focused` and `setFocused()`
- SchemaNode `getInvalidChildren()`

## Changed

- moved functionalities (`setInitialValue` and `schema.watch`) from `useNode` into `SchemaNode`
- SchemaNode `isClone`, features don't need a namespace anymore
- reworked DeclarativeFormContext `focusNode`
- reworked external errors
- Convert methods into getters for SchemaNode `isValid()` > `isValid`, `getErrorMessage()` > `errorMessage`

## Fixed

- SchemaNode `onChange`, `setInitialValue` and `validate` are autobinded to their instances
- updated browser-list depedencies
- SchemaNode `schema.watch` no longer requires `useHook` to work

## Removed

- `useNode` options `allowUndefined`, `contextOnly` and `cloneName`
- Schemanode `onChange` no longer publicly accepts 3 arguments (internal args)
- External error management and reactions from `useNode`
- `useNode` is no longer usable to watch only the `sharedContext`
- `invalidChildren` from `useNode`

## [1.5.20] - 2022-05-04

### Added

- changelog file to keep track of changes
