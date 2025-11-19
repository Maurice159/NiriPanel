# Niri AGS Status Bar (WIP)

This project is a custom status bar for  **Niri Wayland**, built with **AGS v3** and **GTK4**.  
It uses the **Niri event stream** to update the bar whenever Niri changes state.

---

## Current Features

### Workspaces
- Shows all workspaces for each monitor
- Highlights the active workspace
- Updates automatically using Niri’s event stream

### Event Stream Integration
A small script (`niri-events.sh`) forwards Niri IPC events to AGS so the bar reacts immediately to changes.

## How to Run

1. Start the Niri event stream forwarder:
   ```sh
   ./niri-events.sh
   ```

2. Copy or symlink this project to `~/.config/niri/`

3. Start AGS:

    ```sh
    ags run
    ```
