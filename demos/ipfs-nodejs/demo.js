var fs = require('fs');

var w_data = "I'm just a DEMO content. Don't mind me...\n";

fs.writeFileSync("/tmp/ipfs-demo-file.txt", w_data, function(err, w_data) {
  if (err) console.log(err);
});

const files = [
  {
    path: '/tmp/ipfs-demo-file.txt',
    content: fs.readFileSync('/tmp/ipfs-demo-file.txt')
  }
]

var ipfsClient = require('ipfs-http-client')

var ipfs = ipfsClient({ host: '127.0.0.1', port: '5001', protocol: 'http' })

ipfs.add(files, function (err, files) {
	var demo_hash = files[0].hash;
	console.log("Stored the file with hash " + demo_hash + " in IPFS");
	console.log("Let's try to retrieve " + demo_hash + " now...");
	ipfs.get(demo_hash, function (err, files) {
	  files.forEach((file) => {
	    console.log("Retrieved hash: " + file.path)
	    console.log("Retrieved content: " + file.content.toString('utf8'))
	  });
	});
});

