import { ListNode } from './components/ListNode';
import { PolymorphicNode } from './components/PolymorphicNode';
import { FormContext } from './DeclarativeFormContext';

export { RootNode, NodeProps } from './components/RootNode';
export { FormContext };
export { SchemaNode } from './SchemaNode';
export {
  NodeKind,
  NodeValue,
  ReactComponent,
  Validator,
  ValidatorFn,
  SchemaNodeDefinitionLegacy,
  SchemaNodeDefinition,
  FormatterFn,
} from './types';
export { useNode } from './hook';
export { DeclarativeFormContext } from './DeclarativeFormContext';

export const frameworkPlugins: FormContext['plugins'] = {
  // librairy plugins
  polymorphic: PolymorphicNode,
  list: ListNode,
};

export const frameworkValidators: FormContext['validators'] = {
  // librairy validators
};
