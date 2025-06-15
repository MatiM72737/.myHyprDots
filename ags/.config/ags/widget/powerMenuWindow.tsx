import { Widget, Astal } from "astal/gtk4";
import GLib from "gi://GLib";

export const powerMenuWindow = Widget.Window({
  name:"power-menu",
  cssName: "power-menu",
  anchor: Astal.WindowAnchor.BOTTOM,
  css_classes: ["PowerMenu"],
  child: Widget.Box(
    { css_classes: ["PowerActions"],
      vertical: false },
    ...[
      { name: "lock", icon: "system-lock-screen-symbolic", command: "hyprlock" },
      { name: "refresh", icon: "system-log-out-symbolic", command: "hyprctl dispatch exit" },
      { name: "reboot", icon: "system-reboot-symbolic", command: "systemctl reboot" },
      { name: "shutdown", icon: "system-shutdown-symbolic", command: "systemctl poweroff" },
      { name: "suspend", icon: "system-suspend-symbolic", command: "hyprctl dispatch exec 'hyprlock & systemctl suspend'" },
    ].map(({ name, icon, command }) =>
      Widget.Button(
        {
          css_classes: ["PowerAction"],
          onClicked: () => GLib.spawn_command_line_async(command),
        },
        Widget.Image({ iconName: icon }),
        Widget.Label({ label: name })
      )
    )
  ),
});
