'use strict';

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

var _createPackage;

function _load_createPackage() {
  return _createPackage = _interopRequireDefault(require('nuclide-commons-atom/createPackage'));
}

var _passesGK;

function _load_passesGK() {
  return _passesGK = _interopRequireDefault(require('../../commons-node/passesGK'));
}

var _OCamlLaunchProvider;

function _load_OCamlLaunchProvider() {
  return _OCamlLaunchProvider = require('./OCamlLaunchProvider');
}

var _PythonLaunchAttachProvider;

function _load_PythonLaunchAttachProvider() {
  return _PythonLaunchAttachProvider = _interopRequireDefault(require('./PythonLaunchAttachProvider'));
}

var _NodeLaunchAttachProvider;

function _load_NodeLaunchAttachProvider() {
  return _NodeLaunchAttachProvider = _interopRequireDefault(require('./NodeLaunchAttachProvider'));
}

var _ReactNativeLaunchAttachProvider;

function _load_ReactNativeLaunchAttachProvider() {
  return _ReactNativeLaunchAttachProvider = _interopRequireDefault(require('./ReactNativeLaunchAttachProvider'));
}

var _PrepackLaunchAttachProvider;

function _load_PrepackLaunchAttachProvider() {
  return _PrepackLaunchAttachProvider = _interopRequireDefault(require('./PrepackLaunchAttachProvider'));
}

var _NativeLaunchAttachProvider;

function _load_NativeLaunchAttachProvider() {
  return _NativeLaunchAttachProvider = _interopRequireDefault(require('./NativeLaunchAttachProvider'));
}

var _UniversalDisposable;

function _load_UniversalDisposable() {
  return _UniversalDisposable = _interopRequireDefault(require('nuclide-commons/UniversalDisposable'));
}

var _fsPromise;

function _load_fsPromise() {
  return _fsPromise = _interopRequireDefault(require('nuclide-commons/fsPromise'));
}

var _utils;

function _load_utils() {
  return _utils = require('./utils');
}

var _path = _interopRequireDefault(require('path'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Activation {

  constructor() {
    this._subscriptions = new (_UniversalDisposable || _load_UniversalDisposable()).default((0, (_utils || _load_utils()).listenToRemoteDebugCommands)());

    (_fsPromise || _load_fsPromise()).default.exists(_path.default.join(__dirname, 'fb-marker')).then(exists => {
      const isOpenSource = !exists;

      // TODO(most): Remove when fully migrated to VSP (`nuclide-debugger-new`).
      if (isOpenSource) {
        // Enable `nuclide-debugger` for OSS while `nuclide-debugger-new`
        // is being iterated on to replace `nuclide-debugger`.
        atom.packages.triggerActivationHook('!nuclide_vsp_debugger_core:gk:nuclide');
      }

      this._registerPythonDebugProvider();
      this._registerNodeDebugProvider();
      this._registerReactNativeDebugProvider(isOpenSource);
      this._registerPrepackDebugProvider(isOpenSource);
      this._registerOcamlDebugProvider();
      this._registerGdbDebugProvider();
    });
  }

  _registerPythonDebugProvider() {
    this._registerDebugProvider({
      name: 'Python',
      getLaunchAttachProvider: connection => {
        return new (_PythonLaunchAttachProvider || _load_PythonLaunchAttachProvider()).default(connection);
      }
    });
  }

  _registerNodeDebugProvider() {
    this._registerDebugProvider({
      name: 'Node',
      getLaunchAttachProvider: connection => {
        return new (_NodeLaunchAttachProvider || _load_NodeLaunchAttachProvider()).default(connection);
      }
    });
  }

  _registerDebugProvider(provider) {
    this._subscriptions.add(atom.packages.serviceHub.provide('nuclide-debugger.provider', '0.0.0', provider));
  }

  _registerReactNativeDebugProvider(isOpenSource) {
    var _this = this;

    return (0, _asyncToGenerator.default)(function* () {
      if ((yield (0, (_passesGK || _load_passesGK()).default)('nuclide_debugger_reactnative')) || isOpenSource) {
        _this._registerDebugProvider({
          name: 'React Native',
          getLaunchAttachProvider: function (connection) {
            return new (_ReactNativeLaunchAttachProvider || _load_ReactNativeLaunchAttachProvider()).default(connection);
          }
        });
      }
    })();
  }

  _registerPrepackDebugProvider(isOpenSource) {
    var _this2 = this;

    return (0, _asyncToGenerator.default)(function* () {
      if ((yield (0, (_passesGK || _load_passesGK()).default)('nuclide_debugger_prepack')) || isOpenSource) {
        _this2._registerDebugProvider({
          name: 'Prepack',
          getLaunchAttachProvider: function (connection) {
            return new (_PrepackLaunchAttachProvider || _load_PrepackLaunchAttachProvider()).default(connection);
          }
        });
      }
    })();
  }

  _registerOcamlDebugProvider() {
    var _this3 = this;

    return (0, _asyncToGenerator.default)(function* () {
      if (yield (0, (_passesGK || _load_passesGK()).default)('nuclide_debugger_ocaml')) {
        _this3._registerDebugProvider({
          name: 'OCaml',
          getLaunchAttachProvider: function (connection) {
            return new (_OCamlLaunchProvider || _load_OCamlLaunchProvider()).OcamlLaunchProvider(connection);
          }
        });
      }
    })();
  }

  _registerGdbDebugProvider() {
    var _this4 = this;

    return (0, _asyncToGenerator.default)(function* () {
      if (yield (0, (_passesGK || _load_passesGK()).default)('nuclide_debugger_native_vsp')) {
        _this4._registerDebugProvider({
          name: 'Native (VSP)',
          getLaunchAttachProvider: function (connection) {
            return new (_NativeLaunchAttachProvider || _load_NativeLaunchAttachProvider()).default(connection);
          }
        });
      }
    })();
  }

  dispose() {
    this._subscriptions.dispose();
  }
}
// eslint-disable-next-line rulesdir/prefer-nuclide-uri
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */

(0, (_createPackage || _load_createPackage()).default)(module.exports, Activation);