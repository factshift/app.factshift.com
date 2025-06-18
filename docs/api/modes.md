# Stream Mode Web APIs

This document outlines the WebSocket message formats understood by each stream mode.

## Boon
Messages are JSON objects describing a "boon" node.
Example sent from the client:
```json
{
  "id": 123,
  "name": "Example Boon",
  "x": 0,
  "y": 0,
  "z": 0,
  "boonhonk": {"description": "text", "level": 1, "is_active": true},
  "image_id": null
}
```
The server echoes a similar structure when broadcasting boon updates.

## Boof
Boof messages contain textual content. Clients may send plain text or a JSON object `{ "content": "text" }` and receive a similar structure from the server.

## Focal
Used to update the focal point of the simulation.
```json
{
  "type": "focal-point",
  "position": {"x": 10, "y": 20},
  "bounds": {"x1": 0, "y1": 0, "x2": 20, "y2": 40}
}
```

## Passive
Passive mode receives streamed updates but does not send data. Any JSON object broadcast by the server will be displayed.

## Other Modes
Bane, Bone, Bonk, Honk and Lore share the same pattern as Passive mode. They may be extended later with specific message formats.

