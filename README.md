# What does this plugin do?
This plugin is an extension to the Cockpit Project(https://cockpit-project.org/). It allows you to manage your Samba shares through the Cockpit Project user interface.

# Before you begin (words of warning)
This plugin is very rough around the edges. It's written in a short amount of time, by someone that has not coded in a very long time and is not familiar with the structure and internal workings of the Cockpit Project GUI. However, it does seem to do what I want it to do. 

If you want to improve some pieces of code, or test it, just let me know, or request a merge of your code. I am more than happy to test your changes and merge them in. The HTML code can use a serious cleanup though.

Use this plugin at your own risk.

# Requirements
## Compatibility
This plugin is tested on:
- Ubuntu 18.04 LTS
- Debian 9: Raspbian Stretch Lite (2018-11-13)

## Samba
You will need Samba installed.

```
sudo apt-get install samba
```

## Cockpit Project
As this is a Cockpit plugin, you will need that as well.
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
Simple, it's GNU General Public License v2.1
