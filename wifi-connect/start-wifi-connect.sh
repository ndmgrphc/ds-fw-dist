#!/usr/bin/env bash

# export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket
# ^^^ this can cause barfing and isn't needed

sleep 20

# Choose a condition for running WiFi Connect according to your use case:

# 1. Is there a default gateway?
# ip route | grep default

# 2. Is there Internet connectivity?
# nmcli -t g | grep full

# 3. Is there Internet connectivity via a google ping?
# wget --spider http://google.com 2>&1

# 4. Is there an active WiFi connection?
iwgetid -r

if [ $? -eq 0 ]; then
    printf 'Skipping WiFi Connect, has active connection...\n'
else
    printf 'Starting WiFi Connect\n'
    wifi-connect
fi

# do this with /etc/environment UI_DIRECTORY instead... --ui-directory /home/ds/ds-fw-dist/wifi-connect/build

# Start your application here.