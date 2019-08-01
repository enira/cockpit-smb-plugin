
function generate_tmpfilename() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return "script_" + s4() + s4() + s4() + s4() + s4() +".sh";
}

function load_globals(config) {
	var contents = "";
	for (var key in config['global']) {
		if (config['global'].hasOwnProperty(key)) {
			contents = contents + "<tr><td>" + key +  "</td><td>" + config['global'][key] + "</td></tr>";
		}
	}
	document.getElementById("settingspane").innerHTML = contents;
	
	var table = document.getElementById("properties_table");
	var rows = table.getElementsByTagName("tr");
	for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
		var createClickHandler = function(row) {
			return function() {
				var cell1 = row.getElementsByTagName("td")[0];
				
				var cell2 = row.getElementsByTagName("td")[1];
				try {
					var id = cell1.innerHTML;
					var prop = cell2.innerHTML;
					edit_property_share(id, prop);
				}catch(err) {
				}
			};
		
		};
		currentRow.onclick = createClickHandler(currentRow);
	}
}

function delete_share() {
	var config = read_config("stored_config");
	
	delete config[document.getElementById("share_name").value]
	
	store_config(config, "stored_config");
	load_shares(config);
	
	var x = document.getElementById("create_share_dialog");
	x.style.display = "none";
	
	// empty out all
	clear_create_share();
	
	var x = document.getElementById("applychanges");
	x.style.display = "none";
}

function edit_user(user) {
	document.getElementById("create_user_title").innerHTML = "Edit - " + user;

	document.getElementById("system_username").readOnly = true;
	document.getElementById("system_username").value = user;
		
	document.getElementById("create_user_accept").innerHTML = "Update";
	
	x = document.getElementById("create_user_dialog");
	x.style.display = "block";
}

function edit_property_share(id, prop) {
	document.getElementById("create_property_title").innerHTML = "Edit - " + id;
	document.getElementById("create_property_accept").innerHTML = "Update";

	document.getElementById("setting_setting").value = id;
	document.getElementById("setting_setting").readOnly = true;
	document.getElementById("setting_value").value = prop;
		
	x = document.getElementById("create_property_dialog");
	x.style.display = "block";
} 

function edit_samba_share(share) {
	var editobj = read_config("stored_config");
	var toedit = editobj[share];
	
	document.getElementById("create_share_title").innerHTML = "Edit - " + share;
	document.getElementById("create_share_accept").innerHTML = "Update";
	
	document.getElementById("share_path").value = toedit["path"];
	if(toedit.hasOwnProperty("valid users")) {
		document.getElementById("share_users").value = toedit["valid users"];
	}
	if(toedit.hasOwnProperty("comment")) {
		document.getElementById("share_comment").value = toedit["comment"];
	}
	if(toedit.hasOwnProperty("writeable")) {
		if(toedit["writeable"] == "yes") {
			document.getElementById("share_writeable").checked = true;
		}
		else {
			document.getElementById("share_writeable").checked = false;
		}
	}
	
	if(toedit.hasOwnProperty("browseable")) {
		if(toedit["writeable"] == "yes") {
			document.getElementById("share_browseable").checked = true;
		}
		else {
			document.getElementById("share_browseable").checked = false;
		}
	}
	
	if(toedit.hasOwnProperty("printable") ||
		toedit.hasOwnProperty("read only") ||
		toedit.hasOwnProperty("guest ok") || toedit.hasOwnProperty("create mask") ) {
			
		document.getElementById("advanced_share").checked = true;
		var x = document.getElementById("adv1");
		x.style.display = "";
		x = document.getElementById("adv2");
		x.style.display = "";
		x = document.getElementById("adv3");
		x.style.display = "";
		x = document.getElementById("adv4");
		x.style.display = "";	
	}
	
	if(toedit.hasOwnProperty("printable")) {
		if(toedit["printable"] == "yes") {
			document.getElementById("share_printable").checked = true;
		}
		else {
			document.getElementById("share_printable").checked = false;
		}
	}
	if(toedit.hasOwnProperty("guest ok")) {
		if(toedit["guest ok"] == "yes") {
			document.getElementById("share_guest").checked = true;
		}
		else {
			document.getElementById("share_guest").checked = false;
		}
	}
	if(toedit.hasOwnProperty("read only")) {
		if(toedit["read only"] == "yes") {
			document.getElementById("share_readonly").checked = true;
		}
		else {
			document.getElementById("share_readonly").checked = false;
		}
	}

	if(toedit.hasOwnProperty("create mask")) {	
		var mask = parseInt(toedit["create mask"]);
		
		var chmod = [4,2,1];
		for(var i=2; i >= 0;i--) {
			for(var j=0; j<3;j++) {
				var number = Math.pow(10,i)*chmod[j];
				if(mask >= number) {
					mask = mask - number;
					document.getElementById("share_" + number).checked = true;
				}	
			}
		}
	}
	document.getElementById("share_name").value = share;
	
	var x = document.getElementById("delete_share");
	x.style.display = "block";
	
	x = document.getElementById("create_share_dialog");
	x.style.display = "block";
}

function load_shares(config) {
	var contents = "";
	var properties = ["path", "comment", "browseable", "writeable", "valid users", "printable", "guest ok", "read only", "create mask"];
	
	for (var key in config) {
		if(key != 'global') {
			contents = contents + "<tr><td>" + key + "</td>";
			for (var i =0; i < 9; i++) {
				if (config[key].hasOwnProperty(properties[i])) {
					contents = contents + "<td>" + config[key][properties[i]]+"</td>";
				}
				else {
					contents = contents + "<td></td>";
				}
			}
			contents = contents + "</tr>";
		}
	}
	document.getElementById("sharespane").innerHTML = contents;
	
	var table = document.getElementById("shares_table");
	var rows = table.getElementsByTagName("tr");
	for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
		var createClickHandler = function(row) {
			return function() {
				var cell = row.getElementsByTagName("td")[0];
				try {
					var id = cell.innerHTML;
					edit_samba_share(id);
				}catch(err) {
				}
			};
		
		};
		currentRow.onclick = createClickHandler(currentRow);
	}
}

function load_users(users) {
	var contents = "";

	if(Object.keys(users).length == 0) {
		var x = document.getElementById("empty_samba_users");
		x.style.display = "";
		x = document.getElementById("samba_users_table");
		x.style.display = "none";
	}
	else {
		var x = document.getElementById("empty_samba_users");
		x.style.display = "none";
		x = document.getElementById("samba_users_table");
		x.style.display = "block";
	
		for (var key in users) {
			contents = contents + "<tr><td class=\"cockpit-account-pic pficon pficon-user\"></td><td style=\"width:100%\"><span class=\"col-md-12 storage-disk-name\">" + key +"</td></tr>";
		}
	}
	document.getElementById("userspane").innerHTML = contents;
	
	var table = document.getElementById("samba_users_table");
	var rows = table.getElementsByTagName("tr");
	for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
		var createClickHandler = function(row) {
		
			return function() {
				var cell = row.getElementsByTagName("td")[1];
				try {
					var id = cell.getElementsByTagName("span")[0].innerHTML;
					edit_user(id);
				}catch(err) {
				}
			};
		
		};
		currentRow.onclick = createClickHandler(currentRow);
	}
}

function save_config() {
	var d = new Date();
	var stamp = d.toLocaleString().replace('/','').replace('/','').replace('-','').replace('-','').replace(',','').replace(' ','_').replace(':','').replace(':','')
	
	// get config
	var config = read_config("stored_config");
	var content = "[global]\n";
	
	for(var key in config["global"]) {
		content = content + key + " = " + config["global"][key] + "\n";
	}
	
	for (var key in config) {
		if(key != 'global') {
			content = content + "\n[" + key + "]\n";
			
			for (var property in config[key]) {
				content = content + property + " = " + config[key][property] + "\n";
			}
		}
	}
	
	// copy old config file
	var cmd_generate = ["cp", "/etc/samba/smb.conf", "/etc/samba/smb.conf." + stamp];
	cockpit.spawn(cmd_generate, { superuser: "try" })
		.done(function(data) {
			// copy done, create the new one
			cockpit.file("/etc/samba/smb.conf",  { superuser: "try" }).replace(content)
			.done(function (tag) {
				// restart service
				var cmd_restart = restartcmd;
				cockpit.spawn(cmd_restart, { superuser: "try" })
				.done(function(data) {
					// jobs done

					// now try to find which users need to be submitted
					var users = read_config("stored_users");
						
					for(var user in users) {
						if (users[user].hasOwnProperty("password")) {
							
							var scriptname = generate_tmpfilename();
							
							var script = "#!/bin/bash\n\nuser=\"" + user + "\"\npw=\"" + users[user]["password"] + "\"\n\n(echo $pw; echo $pw ) | smbpasswd -s -a $user\n";
							
							cockpit.file("/tmp/" + scriptname,  { superuser: "try" }).replace(script)
							.done(function (tag) {
								// done
								
								var cmd_execute = ["chmod", "+x", "/tmp/" + scriptname];
								cockpit.spawn(cmd_execute, { superuser: "try" })
								.done(function(data) {
									// run
									
									var cmd_smb_run = ["/tmp/" + scriptname];
									cockpit.spawn(cmd_smb_run, { superuser: "try" })
									.done(function(data) {
										// user added
										
										// delete script
										var cmd_smb_delete = ["rm", "/tmp/" + scriptname];
										cockpit.spawn(cmd_smb_delete, { superuser: "try" })
										.done(function(data) {
											// done	
										})
										.fail(function (error) {
											console.log(error);
										});	
										
									})
									.fail(function (error) {
										console.log(error);
										
										// delete script
										var cmd_smb_delete = ["rm", "/tmp/" + scriptname];
										cockpit.spawn(cmd_smb_delete, { superuser: "try" })
										.done(function(data) {
											// done	
										})
										.fail(function (error) {
											console.log(error);
										});	
									});	
									
								})
								.fail(function (error) {
									console.log(error);
									
									// delete script
									var cmd_smb_delete = ["rm", "/tmp/" + scriptname];
									cockpit.spawn(cmd_smb_delete, { superuser: "try" })
									.done(function(data) {
										// done	
									})
									.fail(function (error) {
										console.log(error);
									});	
										
									});	
								
							})
							.fail(function (error) {
								console.log(error);
							});	
							
							// clear password
							delete users[user]["password"];
							store_config(users, "stored_users");
						}
					}
					
					load_users(users);

					var x = document.getElementById("applychanges");
					x.style.display = "none";
				})
				.fail(function (error) {
					console.log(error);
				});
			})
			.fail(function (error) {
				console.log(error);
			});
		})
		.fail(function(error){
			console.log(error);
		}
	);
}

function parse_users(data) {
	lines = data.match(/[^\r\n]+/g); 
	users_config = {}
	if(data.trim() != "") {
		for (var i = 0; i < lines.length; i++) {
			parse = lines[i].trim();
			
			if(parse.startsWith("Unix")) {
				// comment line
				index = parse.indexOf(":")
				var str = [ parse.substring(0, index), parse.substring(index)]
				as = str[1].trim().substring(1).trim();

				users_config[as] = {};
			}
		}
	}
	return users_config;
}

function parse_smb(data) {
	lines = data.match(/[^\r\n]+/g); 
	configfile = lines;
	config = {}
	running = null;
	
	for (var i = 0; i < lines.length; i++) {
		parse = lines[i].trim();
		
		if(parse.startsWith("#")) {
			// comment line
		} else if(parse.startsWith(";")) {
			// comment line
		} else if(parse.startsWith("[")) {
			running = parse.substring(1);
			running = running.substring(0, running.length - 1)
		} else {
			index = parse.indexOf("=")
			var str = [ parse.substring(0, index), parse.substring(index)]

			if(running in config){
				config[running][str[0].trim()] = str[1].trim().substring(1).trim();
			}
			else {
				config[running] = {};
				config[running][str[0].trim()] = str[1].trim().substring(1).trim();
			}
		}
	}
	return config;
}

function read_config(variable) {
	return JSON.parse(document.getElementById(variable).innerHTML);
}

function store_config(config, variable) {
	document.getElementById(variable).innerHTML = JSON.stringify(config);
}

function add_share() {
	var x = document.getElementById("applychanges");
	x.style.display = "block";
}

function add_user() {
	var x = document.getElementById("applychanges");
	x.style.display = "block";
}

function create_user() {
	document.getElementById("system_username").readOnly = false;
	document.getElementById("create_user_accept").innerHTML = "Create";
	
	document.getElementById("system_username").value = "";
	document.getElementById("system_password").value = "";
	
	x = document.getElementById("create_user_dialog");
	x.style.display = "block";
}

function create_share() {
	document.getElementById("create_share_title").innerHTML = "Create New Share";
	
	var x = document.getElementById("create_share_dialog");
	x.style.display = "block";
}

function create_property() {
	document.getElementById("create_property_title").innerHTML = "Create Global Property";
	
	var x = document.getElementById("create_property_dialog");
	x.style.display = "block";
}

function cancel_share() {
	var x = document.getElementById("create_share_dialog");
	x.style.display = "none";
	
	// empty out all
	clear_create_share();
}

function cancel_property() {
	var x = document.getElementById("create_property_dialog");
	x.style.display = "none";
	
	// empty out all
	clear_create_property();
}

function cancel_user() {
	var x = document.getElementById("create_user_dialog");
	x.style.display = "none";
}

function create_user_accept() {
	var saveobj = read_config("stored_users");
	var user = document.getElementById("system_username").value;
	saveobj[user] = {};
	saveobj[user]["password"] = document.getElementById("system_password").value;

	store_config(saveobj, "stored_users");
	
	contents = document.getElementById("userspane").innerHTML;

	contents = contents + "<tr><td class=\"cockpit-account-pic pficon pficon-user\"></td><td style=\"width:100%\"><span class=\"col-md-12 storage-disk-name\">" + user +"</td></tr>";
	document.getElementById("userspane").innerHTML = contents;
	
	load_users(saveobj);
	
	var x = document.getElementById("create_user_dialog");
	x.style.display = "none";
	x = document.getElementById("applychanges");
	x.style.display = "block";
}

function create_property_accept() {
	var saveobj = read_config("stored_config");
	saveobj["global"][document.getElementById("setting_setting").value] = document.getElementById("setting_value").value;
	store_config(saveobj, "stored_config");
	
	var x = document.getElementById("create_property_dialog");
	x.style.display = "none";
	x = document.getElementById("applychanges");
	x.style.display = "block";
	
	// reload properties
	load_globals(saveobj);
	
	clear_create_property();
}

function toggle_advanced_share() {
	var x = document.getElementById("adv1");
	if (x.style.display === "none") {
		x.style.display = "";
	} else {
		x.style.display = "none";
	}
	
	x = document.getElementById("adv2");
	if (x.style.display === "none") {
		x.style.display = "";
	} else {
		x.style.display = "none";
	}
	
	x = document.getElementById("adv3");
	if (x.style.display === "none") {
		x.style.display = "";
	} else {
		x.style.display = "none";
	}
	
	x = document.getElementById("adv4");
	if (x.style.display === "none") {
		x.style.display = "";
	} else {
		x.style.display = "none";
	}
}

function clear_create_share() {
	document.getElementById("share_path").value = "";
	document.getElementById("share_users").value = "";
	document.getElementById("share_comment").value = "";
	document.getElementById("share_browseable").checked = false;
	document.getElementById("share_printable").checked = false;
	document.getElementById("share_guest").checked = false;
	document.getElementById("share_readonly").checked = false;
	document.getElementById("share_name").value = "";
	document.getElementById("share_writeable").checked = false;
	
	document.getElementById("advanced_share").checked = false;
	var chmod = [1,2,4];
	for(var i=0; i<3;i++) {
		for(var j=0; j<3;j++) {
			var number = Math.pow(10,i)*chmod[j];
			document.getElementById("share_" + number).checked = false; 
		}
	}
	
	document.getElementById("create_share_accept").innerHTML = "Create";
	
	var x = document.getElementById("adv1");
	x.style.display = "none";
	x = document.getElementById("adv2");
	x.style.display = "none";
	x = document.getElementById("adv3");
	x.style.display = "none";
	x = document.getElementById("adv4");
	x.style.display = "none";
	
}

function clear_create_property() {
	document.getElementById("setting_setting").value = "";
	document.getElementById("setting_value").value = "";
	document.getElementById("setting_setting").readOnly = false;
	
	document.getElementById("create_property_accept").innerHTML = "Create";
}



function create_share_accept() {
	var newshare = {};
	
	newshare["path"] = document.getElementById("share_path").value;
	newshare["valid users"] = document.getElementById("share_users").value;
	newshare["comment"] = document.getElementById("share_comment").value;
	
	if(document.getElementById("share_browseable").checked == true) {
		newshare["browseable"] = "yes";
	}else {
		newshare["browseable"] = "no";
	}
	if(document.getElementById("share_writeable").checked == true) {
			newshare["writeable"] = "yes";
		} else {
			newshare["writeable"] = "no";
		}
		
	if(document.getElementById("advanced_share").checked == true) {
		if(document.getElementById("share_printable").checked == true) {
			newshare["printable"] = "yes";
		} else {
			newshare["printable"] = "no";
		}
		
		if(document.getElementById("share_guest").checked == true) {
			newshare["guest ok"] = "yes";
		} else {
			newshare["guest ok"] = "no";
		}
		
		if(document.getElementById("share_readonly").checked == true) {
			newshare["read only"] = "yes";
		} else {
			newshare["read only"] = "no";
		}
		
		var mask = 0;
		var chmod = [1,2,4];
		for(var i=0; i<3;i++) {
			for(var j=0; j<3;j++) {
				var number = Math.pow(10,i)*chmod[j];
				if(document.getElementById("share_" + number).checked == true) {
					mask = mask + number;
				} 
			}
		}
		newshare["create mask"] = mask;
	}
	
	var properties = ["path", "comment", "browseable", "writeable", "valid users", "printable", "guest ok", "read only", "create mask"];
	
	contents = document.getElementById("sharespane").innerHTML;
	contents = contents + "<tr><td>" + document.getElementById("share_name").value + "</td>";
	for (var i =0; i < 9; i++) {
		if (newshare.hasOwnProperty(properties[i])) {
			contents = contents + "<td>" + newshare[properties[i]]+"</td>";
		}
		else {
			contents = contents + "<td></td>";
		}
	}
	contents = contents + "</tr>";
	document.getElementById("sharespane").innerHTML = contents;
	
	var saveobj = read_config("stored_config");
	saveobj[document.getElementById("share_name").value] = newshare;
	store_config(saveobj, "stored_config");
	
	// reload properties
	load_globals(saveobj);
	
	// reload shares
	load_shares(saveobj);
	
	var x = document.getElementById("create_share_dialog");
	x.style.display = "none";
	x = document.getElementById("applychanges");
	x.style.display = "block";
	
	// empty out all
	clear_create_share();
}

// find all info
var cmd = ["cat", "/etc/samba/smb.conf"];
cockpit.spawn(cmd, { superuser: "try" }).done(function(data) {
		insts = new String(data);
		config = parse_smb(data); 
	
		store_config(config, "stored_config");
		
		// load properties
		load_globals(config);
		load_shares(config);

	}).fail(function(error){
       console.log(error);
    }
);

var cmd_users = ["pdbedit", "-L", "-v"];
cockpit.spawn(cmd_users, { superuser: "try" }).done(function(data) {
		insts = new String(data);
		config = parse_users(data);
		
		store_config(config, "stored_users");
		
		load_users(config);
		
	}).fail(function(error){
       console.log(error);
	   load_users({});
    }
);

var restartcmd = ["service", "smbd", "restart"];
var cmd_os = ["hostnamectl"];
cockpit.spawn(cmd_os, { superuser: "try" }).done(function(data) {
		insts = new String(data);
		if ( insts.includes("centos")) {
			restartcmd = ["systemctl", "restart", "smb"];		
		}else {
			restartcmd = ["service", "smbd", "restart"];			
		}
	}).fail(function(error){
       console.log(error);
    }
);

document.getElementById("apply_changes").addEventListener("click", save_config);
document.getElementById("create_user").addEventListener("click", create_user);
document.getElementById("create_share").addEventListener("click", create_share);
document.getElementById("create_property").addEventListener("click", create_property);
document.getElementById("cancel_share").addEventListener("click", cancel_share);
document.getElementById("cancel_user").addEventListener("click", cancel_user);
document.getElementById("cancel_property").addEventListener("click", cancel_property);
document.getElementById("create_property_accept").addEventListener("click", create_property_accept);
document.getElementById("create_user_accept").addEventListener("click", create_user_accept);
document.getElementById("create_share_accept").addEventListener("click", create_share_accept)
document.getElementById("advanced_share").addEventListener("click", toggle_advanced_share);
document.getElementById("delete_share").addEventListener("click", delete_share);

document.getElementById("system_password").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    create_user_accept();
  }
});

// UI fix for versions < 196
if(parseInt(cockpit.info["version"]) < 196) {
     var elem  = document.getElementById("pagecontent");
     elem.setAttribute("style", "margin-top: 30px;");
}

cockpit.transport.wait(function() { });
