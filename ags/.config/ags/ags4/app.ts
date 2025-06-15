import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widget/Bar";
import powerMenuWindow from "./widget/powerMenuWindow";
import Tray from "gi://AstalTray"


App.start({
  css: style,
  main: async (app) => {


const tray = Tray.get_default()

for (const item of tray.get_items()) {
    print(item.title)
}

    // pokazujemy pasek na wszystkich monitorach
    App.get_monitors().map(Bar);

    // Znajdź monitor o nazwie DVI-D-1
    const monitor = App.get_monitors().find(m => m.name === "DVI-D-1");

    if (monitor) {
      // Ustaw okno na środku prawej strony monitora DVI-D-1
      powerMenuWindow.set_size_request(200, 240); // ustaw odpowiedni rozmiar okna

      // Pozycjonowanie okna - na środku wysokości i po prawej stronie monitora
      const x = monitor.x + monitor.width - powerMenuWindow.get_allocated_width() - 20; // 20px margines od prawej
      const y = monitor.y + Math.floor((monitor.height - powerMenuWindow.get_allocated_height()) / 2);

      powerMenuWindow.move(x, y);
    }

    // Otwieramy okno i pokazujemy je od razu (domyślnie widoczne)
    powerMenuWindow.visible = true;
  },
});
