# Data Meta Registry

Slices registered via `registerSlice` now expose metadata describing the mode and phase used to store the slice.

```javascript
import { registerSlice, getMeta } from '../src/js/simulation/data';

registerSlice('nodes', { mode: 'spw', phase: 'boot' });

const meta = getMeta('nodes', { mode: 'spw', phase: 'boot' });
// meta = { query: { mode: 'spw', phase: 'boot' }, data: <slice> }
```

The `query` object mirrors the `{ mode, phase }` parameters used during registration. The `data` field references the slice instance containing the dataset.
