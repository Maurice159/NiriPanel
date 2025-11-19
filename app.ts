import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./windows/Bar"
import { createState } from "ags"
import niri from "./service/niri"

app.start({
  requestHandler(argv: string[], response: (response: string) => void) {
    const [cmd, arg, ...rest] = argv
    if (cmd == "niri-event") {
      try{
        const ev=JSON.parse(arg)
        niri.send_event(ev)
        return response("success")
      }catch(e){
        return response("invalid")
      }
    }
    return response("invalid")
  },
  css: style,
  main() {
    app.get_monitors().map(Bar)
  },
})
