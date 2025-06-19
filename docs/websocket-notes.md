# Stream Container Notes

This interface exposes nine narrative modes: **Boon**, **Bane**, **Bone**, **Bonk**, **Honk**, **Boof**, **Lore**, **Focal**, and **Passive**.

Each mode's settings are stored locally in `localStorage` and may be transmitted to a backend when the `Send to Backend` button is pressed. To hook in real-time updates, listen to stream messages of the form `{type: '<mode>-settings', data: {...}}` and update the UI using the `handleStreamMessage` method of each handler.

The container uses a `DataManager` abstraction to source data either from static arrays or from a live WebSocket feed. Extend `modeConfig` in `stream-container.js` to point a mode at a live URL when the backend is available.

Stream mode can now be changed from the **Debug Mode** menu via a dropdown labeled "Stream Mode". This dispatches a `stream-mode-change` event that updates the active handler.

`LiveDataSource` now exposes a `close()` method. `ModeHandler.cleanup()` invokes this when present so switching modes or stream strategies cleans up the previous connection and callbacks.

For detailed message formats see [Stream Mode Web APIs](api/modes.md).
