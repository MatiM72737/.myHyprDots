#!/bin/bash
## Set GTK Themes, Icons, Cursor and Fonts

THEME='Dracula'
ICONS='Sweet-Purple'
FONT='Noto Sans 11'
CURSOR='Bibata-Modern-Classic'
CURSOR_SIZE=22
SCHEMA='gsettings set org.gnome.desktop.interface'

apply_themes() {
    $SCHEMA gtk-theme "$THEME"
    $SCHEMA icon-theme "$ICONS"
    $SCHEMA cursor-theme "$CURSOR"
    $SCHEMA font-name "$FONT"
    gsettings set org.gnome.desktop.interface cursor-size "$CURSOR_SIZE"
}

apply_themes
