import { App, Astal, Gtk, Gdk, Widget } from "astal/gtk4";
import { Variable, GLib, bind } from "astal";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";

const time = Variable("").poll(1000, "date");

function SysTray() {
  const tray = Tray.get_default();
  return (
    <box css_classes={["SysTray"]} >
      {bind(tray, "items").as((items) =>
        items.map((item) => (
          <menubutton
            setup={(self) => {
              self.insert_action_group("dbusmenu", item.actionGroup);
              const popover = Gtk.PopoverMenu.new_from_model(item.menuModel) as Gtk.Popover;
              self.set_popover(popover);
            }}
            tooltipText={bind(item, "tooltipMarkup")}
          >
            <image gicon={bind(item, "gicon")} />
          </menubutton>
        )),
      )}
    </box>
  );
}


function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker;

  if (!speaker) return null;

  return (
    <box css_classes={["AudioSlider"]} css="min-width: 140px">
      <icon icon={bind(speaker, "volumeIcon")} />
      <slider
        hexpand
        onDragged={({ value }) => (speaker.volume = value)}
        value={bind(speaker, "volume")}
      />
    </box>
  );
}


function Media() {
  const mpris = Mpris.get_default();
  return (
    <box css_classes={["Media"]}>
      {bind(mpris, "players").as((ps) =>
        ps[0] ? (
          <box>
            <box
              css_classes={["Cover"]}
              valign={Gtk.Align.CENTER}
              css={bind(ps[0], "coverArt").as(
                (cover) => `background-image: url('${cover}');`,
              )}
            />
            <label
              label={bind(ps[0], "metadata").as(
                () => `${ps[0].title} - ${ps[0].artist}`,
              )}
            />
          </box>
        ) : (
          <label label="Nothing Playing" />
        ),
      )}
    </box>
  );
}

function Time({ format = "%H:%M:%S" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!,
  );

  return (
    <label css_classes={["Time"]} onDestroy={() => time.drop()} label={time()} />
  );
}

function Workspaces({ monitorName }: { monitorName: string }) {
  const hypr = Hyprland.get_default();
  return (
    <box cssClasses={["Workspaces"]}>
      {bind(hypr, "workspaces").as((wss) => {
        const WORKSPACES_PER_MONITOR = 15; // Nadal ważne, jeśli plugin jest aktywny
        
        const currentMonitor = hypr.monitors.find(m => m.name === monitorName);
        let monitorIndex = 0; 
        if (currentMonitor) {
            monitorIndex = currentMonitor.id; 
        }
        console.log(`[DEBUG] Monitor '${monitorName}' ma indeks Hyprland: ${monitorIndex}`);

        const filtered = wss
          .filter(ws => ws.monitor?.name === monitorName)
          .sort((a, b) => a.id - b.id);

        // KLUCZOWA ZMIANA: focusedId teraz dynamicznie reaguje na ZMIANY w hypr.focusedWorkspace
        // i dodatkowo filtruje tylko te, które są na RENDEROWANYM monitorze
        const focusedIdOnThisMonitor = bind(hypr, "focusedWorkspace").as(fw => {
            // Sprawdzamy, czy w ogóle mamy aktywny workspace i czy jest na tym monitorze
            if (fw && fw.monitor?.name === monitorName) {
                // Zwracamy LOKALNE ID workspace'a na tym monitorze
                return fw.id - (monitorIndex * WORKSPACES_PER_MONITOR);
            }
            return -1; // Brak aktywnego workspace'a na tym monitorze
        });


        return filtered.map((ws) => {
          // isFocused teraz sprawdza lokalny numer workspace'a
          const localWorkspaceNumber = ws.id - (monitorIndex * WORKSPACES_PER_MONITOR);
          
          // isFocused będzie true, jeśli localWorkspaceNumber pasuje do focusedIdOnThisMonitor
          const isFocused = bind(focusedIdOnThisMonitor).as(activeLocalId => {
              return activeLocalId === localWorkspaceNumber;
          });
          let focusedH = false;
          return (
            <button
              cssClasses={isFocused.as(focused => {
                const classes = ["WorkspaceButton"];
                focusedH = focused;
                if (focused) {
                  classes.push("WorkspaceButton--focused");
                }
                //console.log(`[DEBUG CLASS] Przestrzeń global: ${ws.id}, lokal: ${localWorkspaceNumber}, focused: ${focused}: ${classes.join(' ')}`);
                return classes;
              })}
              onClicked={() => {
                if (!focusedH) { 
                  console.log(`[CLICK] Przełączam na przestrzeń global: ${ws.id}, lokal: ${localWorkspaceNumber}`);
                  // Użyj ws.focus(), jeśli AstalHyprland działa poprawnie i plugin to obsługuje.
                  // Jeśli nadal masz 'dispatch error: Previous workspace doesn't exist', 
                  // to może trzeba wrócić do hypr.exec("hyprctl dispatch split-workspace ...")
                  ws.focus(); 
                  } else {
                  console.log(`[CLICK] Przestrzeń global: ${ws.id}, lokal: ${localWorkspaceNumber} jest już aktywna. Nie przełączam.`);
                }
              }}
              label={localWorkspaceNumber.toString()}
            >
            </button>
          );
        });
      })}
    </box>
  );
}



export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  
  // Get Hyprland service
  const hypr = Hyprland.get_default();
  
  // Find matching Hyprland monitor by geometry
  const gdkGeometry = gdkmonitor.geometry;
  const hyprMonitor = hypr.monitors.find(m => 
    m.x === gdkGeometry.x && 
    m.y === gdkGeometry.y && 
    m.width === gdkGeometry.width && 
    m.height === gdkGeometry.height
  );
  
  console.log(`[Bar] GdkMonitor: ${gdkmonitor.model} (${gdkGeometry.width}x${gdkGeometry.height})`);
  console.log(`[Bar] HyprMonitor: ${hyprMonitor?.name || "NOT FOUND"}`);
  
  // If no matching monitor found, skip rendering
  if (!hyprMonitor) {
    console.error(`[Bar] No matching Hyprland monitor found for GdkMonitor!`);
    return null;
  }

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox>
        <box hexpand halign={Gtk.Align.START}>
          <Media />
        </box>
        <box>
          <Workspaces monitorName={hyprMonitor.name} />
        </box>
        <box hexpand halign={Gtk.Align.END}>
          <SysTray />   
          <Time />
        </box>
      </centerbox>
    </window>
  );
}