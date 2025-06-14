#!/bin/bash

WALLPAPER_DIR="$HOME/wallpapers"

# Uruchom swww-daemon jeśli nie działa
if ! pgrep -x "swww-daemon" > /dev/null; then
    swww-daemon &>/dev/null &
    sleep 1
fi

declare -A monitor_workspaces  # monitorName -> workspaceID (aktualny workspace)

# Funkcja wybierająca losową tapetę z całego katalogu (rekurencyjnie)
choose_random_wallpaper() {
    find "$WALLPAPER_DIR" -type f \( -iname '*.jpg' -o -iname '*.png' -o -iname '*.gif' -o -iname '*.mp4' \) | shuf -n1
}

# Funkcja losująca losową pozycję dla animacji
choose_pos_for_monitor() {
    local monitor="$1"
    case "$monitor" in
        "HDMI-A-1")
            echo "0,0"
            ;;
        "DVI-I-1")
            echo "0.5,0"
            ;;
        "DVI-D-1")
            echo "1,0"
            ;;
        *)
            echo "0,0"
            ;;
    esac
}

# Funkcja ustawienia tapety z animacją na start (łagodna, z delayem)
set_wallpaper_startup() {
    local monitor="$1"
    local wp_path
    wp_path=$(choose_random_wallpaper)
    trans_pos=$(choose_pos_for_monitor "$monitor")

    if [[ -n "$wp_path" && -f "$wp_path" ]]; then
        echo "🖼️ [STARTUP] Ustawiam tapetę dla monitora [$monitor]: $wp_path"
        sleep 1  # opóźnienie dla łagodnego efektu

        swww img "$wp_path" \
            --transition-type "fade" \
            --transition-pos "$trans_pos" \
            --transition-fps 60 \
            --transition-step 90 \
            --outputs "$monitor"
    else
        echo "⚠️ [STARTUP] Nie znaleziono żadnej tapety w $WALLPAPER_DIR"
    fi
}

# Funkcja ustawienia tapety z losową, ale przyjemną animacją podczas zmiany workspace
set_wallpaper_dynamic() {
    local monitor="$1"
    local wp_path
    local trans_pos
    trans_pos=$(choose_pos_for_monitor "$monitor")
    wp_path=$(choose_random_wallpaper)

    # Ograniczona lista animacji i parametrów
    local filtered_types=("grow" "fade" "wipe")
    local filtered_steps=(30 60 90)
    local filtered_fps=(30 60)

    local trans_type=${filtered_types[$RANDOM % ${#filtered_types[@]}]}
    local trans_step=${filtered_steps[$RANDOM % ${#filtered_steps[@]}]}
    local trans_fps=${filtered_fps[$RANDOM % ${#filtered_fps[@]}]}

    echo "DEBUG: Animacja = $trans_type, kroków = $trans_step, fps = $trans_fps"

    if [[ -n "$wp_path" && -f "$wp_path" ]]; then
        echo "🖼️ [DYNAMIC] Ustawiam tapetę dla monitora [$monitor]: $wp_path"
        echo "   → Animacja: $trans_type, kroków: $trans_step, fps: $trans_fps"

        swww img "$wp_path" \
            --transition-type "$trans_type" \
            --transition-pos "$trans_pos" \
            --transition-fps "$trans_fps" \
            --transition-step "$trans_step" \
            --outputs "$monitor"
    else
        echo "⚠️ [DYNAMIC] Nie znaleziono żadnej tapety w $WALLPAPER_DIR"
    fi
}

handle_event() {
    local line="$1"

    # Przetwarzamy tylko eventy workspacev2>>
    if [[ "$line" == workspacev2* ]]; then
        local data="${line#workspacev2>>}"
        local ws_id="${data%%,*}"

        # Pobierz info o workspace z hyprctl, żeby wiedzieć który monitor
        local json
        json=$(hyprctl -j workspaces 2>/dev/null)
        if ! echo "$json" | jq empty 2>/dev/null; then
            echo "❌ Błąd: nieprawidłowy JSON z hyprctl -j workspaces"
            return
        fi

        local mon_name
        mon_name=$(echo "$json" | jq -r ".[] | select(.id == $ws_id) | .monitor")

        # Jeśli workspace na monitorze się zmienił, ustaw losową tapetę z dynamiczną animacją
        if [[ "${monitor_workspaces[$mon_name]}" != "$ws_id" ]]; then
            monitor_workspaces["$mon_name"]="$ws_id"
            set_wallpaper_dynamic "$mon_name"
        fi
    fi
}

echo "🟢 Inicjalizacja tapet na starcie..."

# Na starcie ustawiamy tapety z łagodną animacją i opóźnieniem
hyprctl -j workspaces 2>/dev/null | jq -c '.[]' | while read -r ws; do
    ws_id=$(echo "$ws" | jq '.id')
    mon=$(echo "$ws" | jq -r '.monitor')
    monitor_workspaces["$mon"]="$ws_id"
    set_wallpaper_startup "$mon"
done

echo "🟢 Nasłuchiwanie eventów hyprland..."

socat -U - UNIX-CONNECT:"$XDG_RUNTIME_DIR/hypr/$HYPRLAND_INSTANCE_SIGNATURE/.socket2.sock" | while read -r line; do
    handle_event "$line"
done
