# Definicja prompta
set -U fish_greeting ""
oh-my-posh init fish --config ~/.config/oh-my-posh/themes/montys.omp.json | source
# Twój istniejący kod
if status is-interactive
    if test (tty) = "/dev/tty1"
        exec Hyprland > ~/.hyprland.log
    end
end

function y
    set tmp (mktemp -t "yazi-cwd.XXXXXX")
    yazi $argv --cwd-file="$tmp"
    if read -z cwd < "$tmp"; and [ -n "$cwd" ]; and [ "$cwd" != "$PWD" ]
        builtin cd -- "$cwd"
    end
    rm -f -- "$tmp"
end

set -x EDITOR nano
fastfetch
