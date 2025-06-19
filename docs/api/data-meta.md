# Data Meta Registry

Slices registered via `registerSlice` now expose metadata describing the mode, phase and optional slice name used to store the slice.

```javascript
import { registerSlice, getMeta } from '../src/js/simulation/data';

registerSlice('nodes', { mode: 'spw', phase: 'boot', sliceName: 'example' });

const meta = getMeta('nodes', { mode: 'spw', phase: 'boot', sliceName: 'example' });
// meta = { query: { mode: 'spw', phase: 'boot', slice: 'example' }, data: <slice> }
```

The `QueryState` service exposes a `getCurrentQuery()` helper that returns the
active `{mode, phase, slice}` object used across the app. The same values can be
retrieved via the `getCurrentStatus()` alias.

The `query` object mirrors the `{ mode, phase, slice }` parameters used during registration. The `data` field references the slice instance containing the dataset.
