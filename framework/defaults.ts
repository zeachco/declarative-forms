import {BooleanNode} from './components/BooleanNode';
import {ListNode} from './components/ListNode';
import {NumericNode} from './components/NumericNode';
import {PolymorphicNode} from './components/PolymorphicNode';
import {StringNode} from './components/StringNode';
import {localFormatter, remoteFormatter} from './utilities/formatters';
import {
  formatValidator,
  lengthValidator,
  presenceValidator,
} from './utilities/validators';
import {FormContext} from './types';

export const frameworkPlugins: FormContext['plugins'] = {
  polymorphic: PolymorphicNode,
  list: ListNode,
  string: StringNode,
  boolean: BooleanNode,
  number: NumericNode,
  float: NumericNode,
  integer: NumericNode,
};

export const frameworkValidators: FormContext['validators'] = {
  Presence: presenceValidator,
  Format: formatValidator,
  Length: lengthValidator,
};

export const frameworkFormatters: FormContext['formatters'] = {
  // remote: remoteFormatter,
  // local: localFormatter,
};
