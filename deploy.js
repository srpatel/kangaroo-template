// TODO : Find an alternative for windows...or require that they install rsync?
const Rsync = require('rsync');

const gameTag = 'template';

{
	// Deploy client
	const rsync = new Rsync()
		.shell('ssh -p 64389')
		.flags('rvz')
		.source('./client/dist/')
		.destination('joey@xikka.com:' + gameTag + '/client');
	
	rsync.execute(function(error, code, cmd) {
		console.log("Client deploy");
		console.log("Error: ", error);
		console.log("Code: ", code);
		console.log("Cmd: ", cmd);
	});
}

{
	// Deploy server
	const rsync = new Rsync()
		.shell('ssh -p 64389')
		.flags('rvz')
		.source('./server/dist/')
		.destination('joey@xikka.com:' + gameTag + '/server');
	
	rsync.execute(function(error, code, cmd) {
		console.log("Server deploy");
		console.log("Error: ", error);
		console.log("Code: ", code);
		console.log("Cmd: ", cmd);
	});
}

{
	// Deploy manifest
	const rsync = new Rsync()
		.shell('ssh -p 64389')
		.flags('rvz')
		.source('./manifest.json')
		.destination('joey@xikka.com:' + gameTag);
	
	rsync.execute(function(error, code, cmd) {
		console.log("Manifest deploy");
		console.log("Error: ", error);
		console.log("Code: ", code);
		console.log("Cmd: ", cmd);
	});
}

// If both successful, unpack...? Do this automatically whenever manifest changes?