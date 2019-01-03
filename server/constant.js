var path = require('path');

var extensionPath = path.join(process.env.HOMEDRIVE,process.env.HOMEPATH,'.code-story');
exports.dbPath = path.join(extensionPath,'record','local','.record.db');