# tcpip-mon
This is a simple proxy that logs TCP/IP REST requests and responses before forwarding.  It currently only supports JSON inputs and outputs.  It's implemented as a CLI, and it takes in the following inputs...
* `localPort`:  The port that this CLI proxy will listen to on the local machine.
* `destinationUrl`:  The location of the REST API where we want inputs and outputs logged.

# Installation
To install, you need to have `npm` installed.  This was tested on Node `v17.0.1` and NPM `8.1.0`.  Once you have NPM, run the following:  `npm install -g @jlarge11/tcpip-mon`.

# Usage
`tcpip-mon <localPort> <destinationUrl>`.  When you're finished, just use `Ctrl-C`.

# Publishing a new version
To publish a new version, run `./deploy <versionType>`, where `versionType` is `major`, `minor`, or `patch`.  This script will do the following...
* Modify, commit, and push the version change to `package.json` and `package-lock.json`.
* Create and push a tag for the new version.
* Publish the new version to NPM under `@jlarge11/tcpip-mon`.

