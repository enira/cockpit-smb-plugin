#!/bin/bash

# Colors to use for output
YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color


if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit
fi

if ! which apt > /dev/null; then
   if rpm -q samba
   then
      echo -e "${GREEN}Samba found, continue installation.${NC}"
   else
      echo -e "${RED}Samba is not installed, please install Samba first.${NC}"
      exit
   fi
else
   PKG_OK=$(dpkg-query -W --showformat='${Status}\n' samba | grep "install ok installed")
   
   if [ "" == "$PKG_OK" ]; then
      echo -e "${RED}Samba is not installed, please install Samba first.${NC}"
      exit  
   else
      echo -e "${GREEN}Samba found, continue installation.${NC}"
   fi
fi

if ! which apt > /dev/null; then
   if rpm -q cockpit
   then
	  echo -e "${GREEN}RPM based operating system selected.${NC}"
	  
      version=`yum info cockpit | grep -i "Version" | awk '{ print $3 }' | awk -F'.' '{ print $1 }'`
      echo -e "${GREEN}Installed Cockpit version: $version${NC}"
	  
      mkdir /usr/share/cockpit/smb
	  
      if [ "$version" -ge "201" ]; then
         echo -e "${GREEN}Based on version branch 2.x selected${NC}"
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/manifest.json -O /usr/share/cockpit/smb/manifest.json 2>/dev/null || curl https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/manifest.json --output /usr/share/cockpit/smb/manifest.json
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/smb.js -O /usr/share/cockpit/smb/smb.js 2>/dev/null || curl https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/smb.js --output /usr/share/cockpit/smb/smb.js
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/index.html -O /usr/share/cockpit/smb/index.html 2>/dev/null || curl https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/index.html --output /usr/share/cockpit/smb/index.html
	  else
         echo -e "${GREEN}Based on version branch 1.x selected${NC}"	  
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/manifest.json -O /usr/share/cockpit/smb/manifest.json 2>/dev/null || curl https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/manifest.json --output /usr/share/cockpit/smb/manifest.json
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/smb.js -O /usr/share/cockpit/smb/smb.js 2>/dev/null || curl https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/smb.js --output /usr/share/cockpit/smb/smb.js
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/index.html -O /usr/share/cockpit/smb/index.html 2>/dev/null || curl https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/index.html --output /usr/share/cockpit/smb/index.html 
	  
	     if [ "$version" -ge "196" ]; then
            echo -e "${CYAN}Latest 1.x version installed.${NC}"
	     else
	        # all versions below 196 still use old gui, small fix for top spacer
		    sed -i 's/pagecontent/topspacer/g' /usr/share/cockpit/smb/index.html
            echo -e "${CYAN}Small css fix applied: version < 196.${NC}"
        fi
      fi
   else
      echo -e "${RED}Cockpit is not installed, please install cockpit first.${NC}"
      exit
   fi
else
   PKG_OK=$(dpkg-query -W --showformat='${Status}\n' cockpit | grep "install ok installed")
   
   if [ "" == "$PKG_OK" ]; then
      echo -e "${RED}Cockpit is not installed, please install cockpit first.${NC}"
      exit
   else
	  echo -e "${GREEN}APT based operating system found.${NC}"
	  
      version=`apt-cache policy cockpit | grep -i "Installed" | awk '{ print $2 }' | awk -F'-' '{ print $1 }' | awk -F'.' '{ print $1 }'`
      echo -e "${GREEN}Installed Cockpit version: $version${NC}"
	  
      mkdir /usr/share/cockpit/smb
	  
      if [ "$version" -ge "201" ]; then
         echo -e "${GREEN}Based on version branch 2.x selected${NC}"
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/manifest.json -O /usr/share/cockpit/smb/manifest.json
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/smb.js -O /usr/share/cockpit/smb/smb.js
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/2.x/index.html -O /usr/share/cockpit/smb/index.html
      else
         echo -e "${GREEN}Based on version branch 1.x selected${NC}"
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/manifest.json -O /usr/share/cockpit/smb/manifest.json
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/smb.js -O /usr/share/cockpit/smb/smb.js
         wget https://raw.githubusercontent.com/enira/cockpit-smb-plugin/1.x/index.html -O /usr/share/cockpit/smb/index.html
		 
         if [ "$version" -ge "196" ]; then
            echo -e "${CYAN}Latest 1.x version installed.${NC}"
         else
	        # all versions below 196 still use old gui, small fix for top spacer
		    sed -i 's/pagecontent/topspacer/g' /usr/share/cockpit/smb/index.html
            echo -e "${CYAN}Small css fix applied: version < 196.${NC}"
         fi
      fi
   fi
fi

echo -e "${GREEN}Installed...${NC}"