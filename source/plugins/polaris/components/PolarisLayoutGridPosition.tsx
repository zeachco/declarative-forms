import React from 'react';
import {FormLayout} from '@shopify/polaris';

import {NodeProps, renderNodes, NodeChildrenMap} from '../../..';

interface Props {
  grid: string[][];
  condensed?: boolean;
}

/**
 * @description Allows to reorder children of a node
 * and assign them a position using a 2D matrix
 *
 * ie:
 * ```typescript
 * const grid = [
 *   ['position'],
 *   ['firstName', 'midName', 'lastName'],
 *   ['github', 'twitter'],
 * ];
 * ```
 *
 * Would create a 1 colum layout on the 1st row with the children listed
 * Would create a 3 colum layout on the 2nd row with the children listed
 * Would create a 2 colum layout on the 3rd row with the children listed
 * Would create a default layout on the 4th with all the remaining children
 *
 * if midName is not found, the 2nd row simply becomes a 2 columns layout
 * nothing is rendered after if no children are left after the selection
 *
 * the function is using object dynamic deconstruction for better performances
 * taking advantage of the js engine instead of destroying keys on an object or other costly operations
 * it's also less code unless we use lodash.pick (which comes with additionnal loops)
 *
 * ```typescript
 * const myKey = 'bbb';
 * const myObject = {aaa: 1, bbb: 2, ccc: 3}
 * const {[myKey]: extractedValue, ...otherValues} = myObject
 *
 * // extractedValue = 2
 * // otherValues = {aaa: 1, ccc: 3}
 * ```
 *
 * tripwire: if immutable objects were native to javascript, we would not need this
 */
export function PolarisLayoutGridPosition({
  node,
  grid,
  condensed,
}: NodeProps & Props) {
  let otherNodes: NodeChildrenMap = node.children;
  const jsx = [];

  for (const row of grid) {
    const selected: NodeChildrenMap = {};
    for (const col of row) {
      const {[col]: extract, ...unselected} = otherNodes;
      if (extract) Object.assign(selected, {[col]: extract});
      otherNodes = unselected;
    }
    jsx.push(
      <FormLayout.Group condensed={condensed}>
        {renderNodes(selected)}
      </FormLayout.Group>,
    );
  }

  return (
    <FormLayout>
      {jsx}
      {renderNodes(otherNodes as NodeChildrenMap)}
    </FormLayout>
  );
}
