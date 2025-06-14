sudo pacman -Syu
sudo pacman -S base-devel git linux-headers nano --needed


git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si

cd ~

paru -Syu

paru -S firefox egl-wayland vesktop ayugram-desktop pipewire pipewire-alsa pipewire-jack pipewire-pulse wireplumber nautilus-admin-gtk4 qpwgraph nautilus nautilus-empty-file nautilus-gnome-disks nautilus-mediainfo-gtk4 nwg-look ghostty code wget curl fish nvidia nvidia-utils lib32-nvidia-utils nvidia-settings gtk4 gtk3 aylurs-gtk-shell ninja gcc cmake meson libxcb xcb-proto xcb-util xcb-util-keysyms libxfixes libx11 libxcomposite libxrender libxcursor pixman wayland-protocols cairo pango libxkbcommon xcb-util-wm xorg-xwayland libinput libliftoff libdisplay-info cpio tomlplusplus hyprlang-git hyprcursor-git hyprwayland-scanner-git xcb-util-errors hyprutils-git glaze hyprgraphics-git aquamarine-git re2 hyprland-qtutils aquamarine hyprpolkitagent qbittorrent wl-clip-persist wl-clipboard sweet-gtk-theme-dark sweet-folders-icons-git hyprlock hypridle hyprpicker obs-studio xdg-desktop-portal xdg-desktop-portal-hyprland xdg-desktop-portal-gtk stow fastfetch hyprsunset hyprlang hyprcursor hyprutils hyprgraphics hyprwayland-scanner

git clone --recursive https://github.com/hyprwm/Hyprland
cd Hyprland
make all && sudo make install

cd ~

hyprpm update

hyprpm add https://github.com/shezdy/hyprsplit
hyprpm enable hyprsplit

hyprpm add https://github.com/KZDKM/Hyprspace
hyprpm enable Hyprspace

git clone https://github.com/MatiM72737/.myHyprDots.git MyHyprDots