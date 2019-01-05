# What does this plugin do?
It's allows you to manage your Samba shares through the Cockpit Project user interface.

# Before you begin (words of warning)
This plugin is written in one day. It is very rough around the edges, the code isn't that great (no I can't learn PatternFly and code this in one day.) However, it does seem to do what I want it to do. 

If you want to improve some pieces of code, or test it, just let me know. I am more than happy to test your changes and merge them in. The HTML code can use a serious cleanup though.

Use this plugin at your own risk.

# Requirements
## Compatibility
This plugin is tested on:
- Ubuntu 18.04 LTS

## Samba
You'll need Samba installed (duh).

```
sudo apt-get install samba
```

## Cockpit Project
As this is a Cockpit plugin, you'll need that as well.
Cockpit Project
```
sudo apt-get install cockpit
```

# Installation

## Disable sudo password
On Ubuntu 18.04 LTS you need to provide your sudo password at all times. This seems to be a problem for Cockpit. To disable this you can create an additional file in the '/etc/sudoers.d/' folder to allow this.
```
sudo sh -c 'echo "$(logname) ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/cockpit-smb'
```
Or if you want to create it yourself:
```
sudo nano /etc/sudoers.d/cockpit-smb
```

```
$USER ALL=(ALL) NOPASSWD: ALL
```

## Create and download the code
Create the Cockpit plugin folder and download the code.
```
sudo mkdir /usr/share/cockpit/smb

sudo wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/index.html -O /usr/share/cockpit/smb/index.html
sudo wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/manifest.json -O /usr/share/cockpit/smb/manifest.json
sudo wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/smb.js -O /usr/share/cockpit/smb/smb.js
```

# License
Simple, it's GNU General Public License v3.0
