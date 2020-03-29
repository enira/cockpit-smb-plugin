# What does this plugin do?
This plugin is an extension to the [Cockpit Project](https://cockpit-project.org/). It allows you to manage your Samba shares through the Cockpit Project user interface.

# Before you begin (words of warning)
This plugin is very rough around the edges. It's written in a short amount of time, by someone that has not coded in a very long time and is not familiar with the structure and internal workings of the Cockpit Project GUI. However, it does seem to do what I want it to do. 

If you want to improve some pieces of code, or test it, just let me know, or request a merge of your code. I am more than happy to test your changes and merge them in. The HTML code can use a serious cleanup though.

Use this plugin at your own risk.

# Requirements

## Compatibility

This plugin is tested on:

| os                                       | version cockpit | version samba | test date  | notes                                |
|------------------------------------------|-----------------|---------------|------------|--------------------------------------|
| Centos 7                                 | 176-4           | 4.8.3         | 2020-03-28 | only compatible with plugin v1.1     |
| Ubuntu 16.04                             | 178-1           | 4.3.11        | 2020-03-28 |                                      |
| Ubuntu 18.04                             | 164-1           | 4.7.6         | 2020-03-28 |                                      |
| ~~Ubuntu 19.04~~                             | ~~189-1~~           | ~~4.10.0~~        | ~~2019-08-01~~ | ~~(deprecated)~~                         |
| Ubuntu 19.10                             | 202.1-1         | 4.10.7        | 2020-03-28 |                                      |
| Debian 9.1 (stretch)                     | 188-1           | 4.5.16        | 2020-03-28 | backports enabled                    |
| Debian 10 (buster)                       | 188-1           | 4.9.5         | 2020-03-28 |                                      |
| ~~Raspbian Stretch (2018-11-13) (Debian 9)~~ | ~~180-1~~           | ~~4.5.15~~        | ~~2019-07-11~~ | ~~(deprecated) backports enabled~~       |
| Raspbian Buster (2019-06-20) (Debian 10) | 196-1           | 4.9.11        | 2019-07-23 | unstable version (see install notes) |

Note: this software is also tested on animals, they did not seem to be able to login. 

## Samba
You will need Samba installed.

```
sudo apt-get install samba
```

## Cockpit Project
As this is a Cockpit plugin, you will need that as well. (The automatic install script will check this.)

```
sudo apt-get install cockpit
```

# Installation

## Disable sudo password
On Ubuntu 18.04 LTS you need to provide your sudo password at all times. This seems to be a problem for Cockpit. To disable this you can create an additional file in the '/etc/sudoers.d/' folder to allow this.
```
sudo sh -c 'echo "$(logname) ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/cockpit-smb'
```
Or if you want to create these yourself:
```
sudo nano /etc/sudoers.d/cockpit-smb
```
Add the following line:
```
$USER ALL=(ALL) NOPASSWD: ALL
```

## Raspbian buster (July 2019)
When I was looking at the Raspberry Pi 4, I noticed that the base operating system of Raspbian is bumped to Debian Buster. By default the Project Cockpit version is still 188-1 (July 2019), installing this version will break Raspbian. Version 196-1 will work, but at the moment of writing this version is still only found in [unstable / testing](https://packages.debian.org/search?keywords=cockpit).

To enable this version add the following line to the repository and update.
```
sudo sh -c 'echo "deb http://ftp.it.debian.org/debian unstable main contrib non-free" >> /etc/apt/sources.list'
sudo apt update
```
If you recieve an error about keys, you can request the keys from pgpkeys.mit.edu.
```
gpg --keyserver pgpkeys.mit.edu --recv-key  04EE7237B7D453EC
gpg -a --export 04EE7237B7D453EC | sudo apt-key add -
```
To verify that you will install the correct version, you can query the cache policy. 
```
apt-cache policy cockpit
```
This should show version 198-1 as being a candidate to be installed.
```
pi@raspberrypi:~ $ apt-cache policy cockpit
cockpit:
  Installed: (none)
  Candidate: 198-1
  Version table:
     198-1 500
        500 http://ftp.it.debian.org/debian unstable/main armhf Packages
     188-1 500
        500 http://raspbian.raspberrypi.org/raspbian buster/main armhf Packages
```
If the version works out, you can install cockpit.
```
sudo apt install cockpit
```

## Automatic install 
Just run the following command to let a script to download the files and install the software.
```
wget -O - https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/install.sh | sudo bash
```

## Manual install
Create the Cockpit plugin folder and download the code. The manual install only works with the last tested version of Project Cockpit.
The automatic install script will figure out if you are running a previous version and which files to apply.
```
sudo mkdir /usr/share/cockpit/smb

sudo wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/index.html -O /usr/share/cockpit/smb/index.html
sudo wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/manifest.json -O /usr/share/cockpit/smb/manifest.json
sudo wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/smb.js -O /usr/share/cockpit/smb/smb.js
```

# Version 

Version log:
- 1.1: current
- 1.0: first release

# License
Simple, it's GNU General Public License v2.1
