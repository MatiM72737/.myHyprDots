pkill -f vesktop;
pkill -f qpwgraph;

sleep 0.1;

qpwgraph --minimized &
qpwgraph --minimized &
vesktop --start-minimized &