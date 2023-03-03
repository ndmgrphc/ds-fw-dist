See: https://planb.nicecupoftea.org/2019/01/11/balenas-wifi-connect-easy-wifi-for-raspberry-pis/

### Soquartz / 64 bit

You can't install with the above instructions on soquartz or probably anything other than old raspbian.

Question: is ```sudo nmcli radio wifi``` required?

```shell
# required now...or it will fail with "file not found" etc.
sudo apt install dnsmasq-base
```

```shell
curl -L https://github.com/balena-io/wifi-connect/raw/master/scripts/raspbian-install.sh | sed 's/\*rpi/*aarch64/' | bash
```

View debug/log:

```shell script
sudo journalctl -u wifi-connect-start
```

Move ./wifi-connect-start.service here:

```
sudo cp ./wifi-connect/wifi-connect-start.service /lib/systemd/system/wifi-connect-start.service

sudo systemctl enable wifi-connect-start.service

sudo chmod 755 /home/ds/ds-fw-dist/wifi-connect/start-wifi-connect.sh

bash <(curl -L https://github.com/balena-io/wifi-connect/raw/master/scripts/raspbian-install.sh)
```

# Customizing UI 

https://forums.balena.io/t/adding-custom-ui-raspios-buster-lite-armv61/174445/30

"I think you need to pass it as --ui-directory /home/pi/ui/build . 
The actual built UI directory is in the build folder."

