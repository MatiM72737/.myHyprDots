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

function convert_to_mov
    if test (count $argv) -eq 0
        echo "🔁 Converting all .mp4/.MP4 files in current directory..."
        for f in *.mp4 *.MP4
            if test -f "$f"
                set output (string replace -r '\.MP4$|\.mp4$' '.mov' -- $f)
                echo "🎬 Converting: $f → $output"
                ffmpeg -i "$f" -c:v copy -c:a pcm_s24le "$output"
            end
        end
    else
        for f in $argv
            if test -f "$f"
                set output (string replace -r '\.MP4$|\.mp4$' '.mov' -- $f)
                echo "🎬 Converting: $f → $output"
                ffmpeg -i "$f" -c:v copy -c:a pcm_s24le "$output"
            else
                echo "❌ File not found: $f"
            end
        end
    end
end
