import { Gdk, Gtk } from "ags/gtk4";
import niri, { currentWorkspaceByMonitor, workspacesByMonitor } from "../service/niri";
import { Accessor, FCProps, For } from "gnim";

interface WorkSpaceListProps {
        gdkmonitor: Gdk.Monitor
}


export default function WorkspaceIndicator({gdkmonitor}: WorkSpaceListProps) {

    const monitorName=niri.gdkmonitor_to_niri(gdkmonitor)
    const currentWorkspace= currentWorkspaceByMonitor((arr) => arr[monitorName] ?? 0)    
  
    const workspaces= workspacesByMonitor((arr)=>{
        const workspaces=arr[monitorName]
        if(workspaces){
            return workspaces.slice().sort((a, b) => a.idx - b.idx)
        }
        return []
    })

    return (
        <box>
            <For each={workspaces}>
                {(ws,index: Accessor<number>)=>(
                    <Gtk.Button
                        class={currentWorkspace((cw)=>
                            cw==ws.idx? "active" : "")}
                        onClicked={()=>niri.focus_workspace(ws.idx)}
                    >
                        <Gtk.Label label={index(()=> `${ws.idx}`)} ></Gtk.Label>
                    </Gtk.Button>
                )}
            </For>
        </box>
    )
}