'use strict'; // eslint-disable-line strict

const express = require('express');
const router = express.Router({ strict: true }); // eslint-disable-line new-cap
const request = require('request');

module.exports = (config) => {
  console.dir(config);
  const buildJenkins = (crumb) => {
    const urlOptions = {
      url: `https://${config.jenkins.userId}:${config.jenkins.userApiToken}@jenkins.dkandu.me/view/web/job/web-courselenium/build?token=${config.jenkins.projectToken}&cause=priyanks+experiment`,
      crumb: crumb
    }
    request.get(urlOptions, function (error, response, body) {
      console.dir(body);
    });
  }

  router.post('/', (req, res) => {
    const params = req.body;
    const requestToken = params.token;
    const epicBotText = params.text;

    // force this to be false right now
    if (requestToken !== config.slack.token) {
      res.status(403).send('Invalid request token ' + requestToken);
    } else {
      const crumbUrlOptions = {
        url: `https://${config.jenkins.userId}:${config.jenkins.userApiToken}@jenkins.dkandu.me/crumbIssuer/api/json`,
        headers: {
          'Content-Type': 'Application/Json'
        }
      };
      request.get(crumbUrlOptions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
          buildJenkins(JSON.parse(body).crumb);
        }
      });
    }
    res.send('');
  });

  return router;
};
