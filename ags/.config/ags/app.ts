import { App, Astal } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar";
import { powerMenuWindow } from "./widget/powerMenuWindow";
import { appsWindow } from "./widget/appsMenuWindow";
import Hyprland from "gi://AstalHyprland";

const hypr = Hyprland.get_default();



let powerMenuVisible = false;

App.start({
  instanceName:"ta",
  css: style,
  requestHandler(request: string, res: (response: any) => void) {
    if (request == "togglePowerMenu") {
      powerMenuVisible = !powerMenuVisible;
      console.log("dick");

      powerMenuWindow.set_margin_bottom(20);
      powerMenuWindow.set_monitor(hypr.focusedMonitor.id);
      powerMenuWindow.visible = powerMenuVisible;

      return res("OK")
    }
    if (request == "toggleAppsMenu") {
      //console.log(appsMenuVisible);
      if(appsWindow.visible)
      {
        appsWindow.hide();
      }
      else{
        appsWindow.show();
      }
      console.log("dick");
      return res("OK")
    }
    res("unknown command")
  },
  main: async (app) => {
    App.add_window(powerMenuWindow);
    App.add_window(appsWindow);
    App.get_monitors().map(Bar);
  },
});
