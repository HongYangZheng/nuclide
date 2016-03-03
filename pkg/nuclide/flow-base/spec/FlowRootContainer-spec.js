'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {FlowRootContainer as FlowRootContainerType} from '../lib/FlowRootContainer';

import {uncachedRequire} from '../../test-helpers';

import {array} from '../../commons';

describe('FlowRootContainer', () => {

  let flowRootContainer: FlowRootContainerType = (null: any);
  beforeEach(() => {
    waitsForPromise(async () => {
      spyOn(require('../lib/FlowHelpers'), 'findFlowConfigDir')
        .andReturn(Promise.resolve('/definitely/a/legit/path/'));

      const {FlowRootContainer} = ((uncachedRequire(require, '../lib/FlowRootContainer'): any));
      flowRootContainer = new FlowRootContainer();
    });
  });

  it('should return a new root', () => {
    waitsForPromise(async () => {
      const root = await flowRootContainer.getRootForPath('foo');
      expect(root).not.toBeNull();
    });
  });

  it('should run a command with the proper root', () => {
    waitsForPromise(async () => {
      const result = await flowRootContainer.runWithRoot('foo', async flowRoot => {
        expect(flowRoot).not.toBeNull();
        return 42;
      });
      expect(result).toBe(42);
    });
  });

  it('should return all roots', () => {
    waitsForPromise(async () => {
      expect(array.from(flowRootContainer.getAllRoots())).toEqual([]);
      const flowRoot = await flowRootContainer.getRootForPath('foo');
      expect(array.from(flowRootContainer.getAllRoots())).toEqual([flowRoot]);
    });
  });
});
