See: https://planb.nicecupoftea.org/2019/01/11/balenas-wifi-connect-easy-wifi-for-raspberry-pis/

Systemd

Move ./wifi-connect-start.service here:

```
sudo cp ./wifi-connect/wifi-connect-start.service /lib/systemd/system/wifi-connect-start.service

sudo systemctl enable wifi-connect-start.service

sudo chmod 755 /home/ds/ds-firmware/wifi-connect/start-wifi-connect.sh

bash <(curl -L https://github.com/balena-io/wifi-connect/raw/master/scripts/raspbian-install.sh)
```

# Customizing UI 

https://forums.balena.io/t/adding-custom-ui-raspios-buster-lite-armv61/174445/30

"I think you need to pass it as --ui-directory /home/pi/ui/build . 
The actual built UI directory is in the build folder."

