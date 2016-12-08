'use strict'; // eslint-disable-line strict

const express = require('express');
const router = express.Router({ strict: true }); // eslint-disable-line new-cap
const request = require('request');

module.exports = (config) => {
  const buildJenkins = (crumb, epicBotText) => {
    console.log(`Triggering jenkins build with botText: ${epicBotText}`)
    const urlOptions = {
      url: `https://${config.jenkins.userId}:${config.jenkins.userApiToken}@jenkins.dkandu.me/view/web/job/web-courselenium/buildWithParameters?token=${config.jenkins.projectToken}&VERSION=master&cause=${epicBotText}`,
      crumb: crumb
    }
    request.get(urlOptions, function (error, response, body) {
      console.log('Request to jenkins finished');
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
          buildJenkins(JSON.parse(body).crumb, epicBotText);
        }
      });
    }
    res.send('');
  });

  return router;
};
