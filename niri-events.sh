#!/bin/bash

# Start niri event stream
niri msg --json event-stream | while IFS= read -r line; do
    # Ignore empty lines
    [ -z "$line" ] && continue

    # Send to ags
    ags request niri-event $line
done
