import { Widget } from "astal/gtk4";
import GLib from "gi://GLib";

export default Widget.Window({
  name: "power-menu",
  // usuwamy anchor i margins, bo ustawimy ręcznie pozycję poniżej
  exclusivity: "ignore",
  // dodamy klasę do stylu
  className: "PowerMenu",
    
  child: Widget.Box(
    { className: "PowerActions", vertical: true },
    ...[
      { name: "lock", icon: "system-lock-screen-symbolic", command: "hyprlock" },
      { name: "logout", icon: "system-log-out-symbolic", command: "hyprctl dispatch exit" },
      { name: "reboot", icon: "system-reboot-symbolic", command: "systemctl reboot" },
      { name: "shutdown", icon: "system-shutdown-symbolic", command: "systemctl poweroff" },
      { name: "suspend", icon: "system-suspend-symbolic", command: "systemctl suspend" },
    ].map(({ name, icon, command }) =>
      Widget.Button(
        {
          className: "PowerAction",
          onClicked: () => GLib.spawn_command_line_async(command),
        },
        Widget.Image({ iconName: icon }),
        Widget.Label({ label: name })
      )
    )
  ),
});
