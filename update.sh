((count = 60))                           # Maximum number to try.
while [[ $count -ne 0 ]] ; do
    ping -c 1 8.8.8.8                    # Try once. 8.8.8.8
    rc=$?
    if [[ $rc -eq 0 ]] ; then
        ((count = 1))                    # If okay, flag loop exit.
    else
        sleep 5                          # Minimise network storm.
    fi
    ((count = count - 1))                # So we don't go forever.
done

if [[ $rc -eq 0 ]] ; then                # Make final determination.
    #echo `say The internet is back up.`
    cd /home/ds/ds-fw-dist && /usr/bin/git fetch --all && /usr/bin/git reset --hard origin/master
    /usr/bin/yarn install && sudo chmod 755 ./init.sh && sudo chmod 755 ./update.sh && sudo chmod 755 ./wifi-connect/start-wifi-connect.sh
else
    #echo `say Timeout.`
fi

# https://www.freedesktop.org/wiki/Software/systemd/NetworkTarget/
