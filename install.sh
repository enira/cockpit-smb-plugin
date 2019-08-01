#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit
fi

if ! which apt > /dev/null; then
   if rpm -q samba
   then
      echo "Samba: OK"
   else
      echo "Samba is not installed, please install samba first."
      exit
   fi
else
   PKG_OK=$(dpkg-query -W --showformat='${Status}\n' samba | grep "install ok installed")
   
   if [ "" == "$PKG_OK" ]; then
      echo "Samba is not installed, please install samba first."
      exit  
   else
      echo "Samba: OK"
   fi
fi

if ! which apt > /dev/null; then
   if rpm -q cockpit
   then
      version=`yum info cockpit | grep -i "Version" | awk '{ print $3 }'`
      echo "Installed version: $version"
	  
      mkdir /usr/share/cockpit/smb
      wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/manifest.json -O /usr/share/cockpit/smb/manifest.json
      wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/smb.js -O /usr/share/cockpit/smb/smb.js
	  wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/index.html -O /usr/share/cockpit/smb/index.html
	  
      if [ "$version" -ge "196" ]; then
         echo "Latest version installed."
      else
	     # all versions below 196 still use old gui, small fix for top spacer
		 sed -i 's/pagecontent/topspacer/g' /usr/share/cockpit/smb/index.html
         echo "Small css fix applied."
      fi
   else
      echo "Cockpit is not installed, please install cockpit first."
      exit
   fi
else
   PKG_OK=$(dpkg-query -W --showformat='${Status}\n' cockpit | grep "install ok installed")
   
   if [ "" == "$PKG_OK" ]; then
      echo "Cockpit is not installed, please install cockpit first."
      exit
   else
      version=`apt-cache policy cockpit | grep -i "Installed" | awk '{ print $2 }' | awk -F'-' '{ print $1 }'`
      echo "Installed version: $version"
      mkdir /usr/share/cockpit/smb
      wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/manifest.json -O /usr/share/cockpit/smb/manifest.json
      wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/smb.js -O /usr/share/cockpit/smb/smb.js
	  wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/master/index.html -O /usr/share/cockpit/smb/index.html
	  
      if [ "$version" -ge "196" ]; then
         echo "Latest version installed."
      else
	     # all versions below 196 still use old gui, small fix for top spacer
		 sed -i 's/pagecontent/topspacer/g' /usr/share/cockpit/smb/index.html
         echo "Small css fix applied."
      fi
   fi
fi
