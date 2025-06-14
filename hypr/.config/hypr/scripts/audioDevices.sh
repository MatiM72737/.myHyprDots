if ! pactl list short sinks | grep -q SystemOut; then
    pactl load-module module-remap-sink sink_name=SystemOut channels=2 description="SystemOut"
fi

if ! pactl list short sources | grep -q SystemIn; then
    pactl load-module module-remap-source source_name=SystemIn channels=2 description="SystemIn"
fi
