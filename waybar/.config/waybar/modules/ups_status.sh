#!/bin/bash

# Odczytaj dane z UPS-a
UPS=$(upsc voltups)

# Wydobądź potrzebne informacje
CHARGE=$(echo "$UPS" | grep 'battery.charge:' | awk '{ print $2 }')
STATUS=$(echo "$UPS" | grep 'ups.status:' | awk '{ print $2 }')

# Ikona w zależności od statusu
ICON=""  # domyślnie zasilanie z sieci
if [[ "$STATUS" == "OB" ]]; then
  ICON=""  # bateria aktywna
fi

# Wyjście JSON dla Waybara
echo "{\"text\": \"$ICON $CHARGE%\", \"tooltip\": \"UPS status: $STATUS\"}"
