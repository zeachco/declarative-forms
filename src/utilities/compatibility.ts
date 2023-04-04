import {SchemaNode} from '../types';

/**
 * Ask yourself if you really should check for this.
 * This is a utility for the consumer code to understand
 * which repository is being used to render forms.
 * As there was many versions, all with similar structures, some utilities were
 * reused across the versions, hence the usage of this utility to allow dealing
 * with the slight API discrepancies during migrations.
 */
export function isSchemaNode<T = unknown>(node: any): node is SchemaNode<T> {
  return Boolean(node?.constructor === SchemaNode);
}
