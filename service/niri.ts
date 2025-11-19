
import { createState } from "ags"
import { Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"

// Workspaces grouped by monitor
export const [workspacesByMonitor, setWorkspacesByMonitor] =
    createState<Record<string, any[]>>({})

// Active workspaces grouped by monitor
export const [currentWorkspaceByMonitor, setCurrentWorkspaceByMonitor] =
    createState<Record<string, number>>({})

class NiriService {
    constructor(){
        this.on_workspace_activated()
    }

    normalize_niri_event(event: any) {
        const rawKey = Object.keys(event)[0]
        const eventName = rawKey.trim()
        const rawData = event[rawKey]

        const data: any = {}
        for (const key of Object.keys(rawData)) {
            data[key.trim()] = rawData[key]
        }

        return { eventName, data }
    }

    send_event(event: any) {
        const {eventName}=this.normalize_niri_event(event)    
        if(eventName==="WorkspaceActivated"){
            this.on_workspace_activated()
        }
        else if(eventName==="WorkspacesChanged"){
            this.on_workspace_activated()
        }
    }

    gdkmonitor_to_niri(monitor: Gdk.Monitor) : string{
        const parts = monitor.get_description()?.split(" - ")
        return parts[parts?.length-1].trim()
    }

    async on_workspace_activated(){
        try {
            const json = await execAsync("niri msg --json workspaces")
            const arr = JSON.parse(json)

            const grouped: Record<string, any[]> = {}
            const current: Record<string, number> = {}

            for (const ws of arr) {
                const monitor = ws.output

                if (!grouped[monitor]) grouped[monitor] = []
                grouped[monitor].push(ws)

                if (ws.is_active) current[monitor] = ws.idx
            }

            setWorkspacesByMonitor(grouped)
            setCurrentWorkspaceByMonitor(current)

        } catch (e) {
            console.log("workspace parse error: " + e)
        }
    }

    async focus_workspace(idx: number){
        await execAsync(`niri msg action focus-workspace ${idx}`)
    }
}

export default new NiriService()