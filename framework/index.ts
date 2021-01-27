import { PolymorphicNode } from './components/PolymorphicNode';
import { FormContext } from './DeclarativeFormContext';
export { FormContext };
export { Node } from './Node';
export {
  NodeKind,
  NodeValue,
  ReactComponent,
  Validator,
  ValidatorFn,
  SchemaNodeDefinitionLegacy,
  SchemaNodeDefinition,
} from './types';
export { SchemaNodeComponent, NodeProps } from './SchemaNodeComponent';
export { useNode } from './hook';
export { DeclarativeFormContext } from './DeclarativeFormContext';

export const frameworkPlugins: FormContext['plugins'] = {
  // librairy plugins
  polymorphic: PolymorphicNode,
};

export const frameworkValidators: FormContext['validators'] = {
  // librairy validators
};
