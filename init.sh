#!/bin/sh
# This should be run on a newly born dropstation.  To RESET, just remove any /DSID.env
# run with sudo ./init.sh
# It assumes that you're starting with a base image with wifi-connect installed.
#

# conf files copied from ./conf?

# Samba
SMB_CONF_SRC=/home/ds/ds-fw-dist/conf/smb.conf
if test -f "$SMB_CONF_SRC"; then
    sudo cp -fr "$SMB_CONF_SRC" /etc/samba/smb.conf
fi

# Swap
SWAP_CONF_SRC=/home/ds/ds-fw-dist/conf/swap.conf
if test -f "$SWAP_CONF_SRC"; then
    sudo cp -fr "$SWAP_CONF_SRC" /etc/dphys-swapfile
fi

if uname -a | grep -q 'armv7l'; then
    echo "init detected JUNE"
    # raspbery pi
    raspi-gpio set 23 op pn dh && raspi-gpio set 24 op pn dh && raspi-gpio set 25 op pn dh
    sleep 2
    raspi-gpio set 23 op pn dl && raspi-gpio set 24 op pn dl && raspi-gpio set 25 op pn dl
else
    echo "init detected SOQ2023"
    if [ ! -d "/sys/class/gpio/gpio126" ]
    then
      echo "echo 126 > /sys/class/gpio/export && echo out > /sys/class/gpio/gpio126/direction" | sudo su
    fi

    echo "echo 1 > /sys/class/gpio/gpio126/value" | sudo su
    sleep 2
    echo "echo 0 > /sys/class/gpio/gpio126/value" | sudo su
fi

# first hello


echo "RUNNING init.sh...to build new dropstation."

FILE=/DSID.env
if test -f "$FILE"; then
    echo "$FILE exists, starting node..."
    exit
fi

echo "Generating random DSID..."

# bash generate random 32 character alphanumeric string (upper and lowercase) and
# BAD, will hang: randomString=`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`
# see https://askubuntu.com/questions/1124748/etc-rc-local-run-via-systemd-hangs-when-cating-dev-urandom
RANDOMID=$(head -80 /dev/urandom | tr -dc 'A-Z0-9' | fold -w 5 | head -n 1)

echo "Saving /DSID.env for $RANDOMID"
echo "$RANDOMID" >> /DSID.env

echo "Modifying /etc/environment for $RANDOMID"
# overwrite contents of /etc/environment
echo "PORTAL_SSID=Dropstation-$RANDOMID" > /etc/environment
echo "UI_DIRECTORY=/home/ds/ds-fw-dist/wifi-connect/build" >> /etc/environment

# replace current hostname with new hostname

echo "Adding Dropstation-$RANDOMID.local to /etc/hosts"
cat >/etc/hosts <<EOL
127.0.0.1	localhost
::1		localhost ip6-localhost ip6-loopback
ff02::1		ip6-allnodes
ff02::2		ip6-allrouters

127.0.0.1	Dropstation-${RANDOMID}.local
EOL

#sed -i "s/$HOSTNAME/Dropstation-$RANDOMID.local/g" /etc/hosts

echo "Setting hostname to Dropstation-$RANDOMID.local"
echo "Dropstation-$RANDOMID.local" > /etc/hostname

# this is to update the current hostname without restarting
hostname "Dropstation-$RANDOMID.local"

# Ignore below this line:

# Copy the startup script, replace "PORTAL_SSID" with this random one.
# do not do this anymore...saved here for reference
#sed "s/PORTAL_SSID/Dropstation-$RANDOMID/" ./wifi-connect/start-wifi-connect.sh > ~/start-wifi-connect.sh

# IMPORTANT TODO: You need a pm2 save because of environmental vars being saved to pm2...which need to pick up
# ./DSID ?

# run this?

# cd /home/ds/ds-fw-dist

echo "$RANDOMID is born."

exit 0