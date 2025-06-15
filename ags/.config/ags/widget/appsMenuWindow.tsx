import { Widget,Astal, App, Gtk } from "astal/gtk4";
import GLib from "gi://GLib";
import Apps from "gi://AstalApps"
import { Variable} from "astal";

export const appsWindow = appsMenuWindow();

function hide() {
    appsWindow.visible=false;
}
function show() {
    appsWindow.visible=true;
    console.log(appsWindow.visible);
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        css_classes={["AppButton"]}
        onClicked={() => {app.launch(); hide();}}
        hexpand>
        <box spacing={8}>
            <image icon_name={app.get_icon_name()} pixelSize={64} />
            <box vertical>
                <label
                    css_classes={["name"]}
                    xalign={0}
                    label={app.name}
                />
                {app.description && <label
                    css_classes={["description"]}
                    wrap
                    xalign={0}
                    label={app.description}
                />}
            </box>
        </box>
    </button>;
}



export function appsMenuWindow() 
{
  const apps = new Apps.Apps({
      nameMultiplier: 2,
      entryMultiplier: 0,
      executableMultiplier: 2,
  })

    let txt = Variable('');
    const list = txt(text => apps.fuzzy_query(text))
    return <window
        name="launcher"
        widthRequest={700}
        heightRequest={500}
        //anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        onShow={(self) => {
           
        }}>
        <box>
            <box hexpand={false} vexpand={true} vertical>
                <box widthRequest={700} css_classes={["Applauncher"]} vertical>
                    <entry
                        placeholderText="Search"
                        onLegacy={self => txt.set(self.text)}
                    />
                    <Gtk.ScrolledWindow vexpand>
                        <box vertical spacing={6}>
                            {list.as(list => list.map(app => (
                            <AppButton app={app} />
                        )))}
                        </box>
                    </Gtk.ScrolledWindow>
                </box>
            </box>
        </box>
    </window>
}