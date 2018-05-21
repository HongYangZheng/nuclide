/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  Device,
  DeviceProcessesProvider,
  Process,
} from 'nuclide-debugger-common/types';
import type {NuclideUri} from 'nuclide-commons/nuclideUri';

import {Observable} from 'rxjs';
import {getSdbServiceByNuclideUri} from '../../../nuclide-remote-connection';

export class TizenDeviceProcessesProvider implements DeviceProcessesProvider {
  getType(): string {
    return 'Tizen';
  }

  observe(host: NuclideUri, device: Device): Observable<Process[]> {
    const intervalTime = 3000;
    return Observable.interval(intervalTime)
      .startWith(0)
      .switchMap(() =>
        getSdbServiceByNuclideUri(host)
          .getProcesses(device, intervalTime)
          .refCount()
          .catch(() => Observable.of([])),
      );
  }
}
