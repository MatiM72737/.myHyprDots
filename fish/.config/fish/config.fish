# Definicja prompta
set -U fish_greeting ""
oh-my-posh init fish --config ~/.config/oh-my-posh/themes/montys.omp.json | source
# Twój istniejący kod
if status is-interactive
    if test (tty) = "/dev/tty1"
        exec Hyprland > ~/.hyprland.log
    end
end
set -x EDITOR nano
fastfetch
function host
    if test (count $argv) -eq 1
        set port $argv[1]
    else
        echo "Użycie: host <port>"
        return 1
    end
    exec caddy file-server --browse --listen :$port
end
