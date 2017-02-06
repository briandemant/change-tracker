#change-tracker
change-tracker receives outgoing webhooks from slack and triggers jenkins build

### current configuration
it receives messages from slack on all epic experiment changes and triggers web-courselenium build on jenkins

# install

## npm

install the package directly from github with npm

```
npm install git@github.com:coursera/change-tracker.git
```

## configure change-tracker 

copy config.js.template.txt into your module and add in your own parameters to authenticate to jenkins and slack

below are the params you will need to define

```
module.exports = {
  jenkins: {
    userId: '', //Check with jenkins credentials
    userApiToken: '', //You can get one from jenkins user page
    projectToken: '', //You can set one while configuring remote build trigger
  },
  slack: {
    token: '', //Generated on slack
  }
};
```

## wire up this router to an existing express server

this module exposes a modular express router that can be wired up to any existing express router. 

here is an example of how to do that:

```
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var fs = require('fs');
  var path = require('path');
  var vhost = require('vhost');
  var changeTracker = require('change-tracker');
  var changeTrackerConfig = require('./config.changeTracker.js');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/change-tracker', changeTracker(changeTrackerConfig));

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
  });
```
