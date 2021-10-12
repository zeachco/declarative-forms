import {SchemaNode} from '../types';

export function isNodeV3(node: SchemaNode | any): node is SchemaNode {
  return node?.context?.version === 3;
}
