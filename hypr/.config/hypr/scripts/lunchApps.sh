pkill -f AyuGram;
pkill -f vesktop;
pkill -f qpwgraph;

sleep 0.3;

qpwgraph --minimized &
qpwgraph --minimized &
vesktop --start-minimized &
AyuGram -startintray&
