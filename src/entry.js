require('jquery'); //eslint-disable-line
require('bootstrap'); // eslint-disable-line

require('../bower_components/bootstrap/less/bootstrap.less');
require('./less/all.less');

const utils = require('jsmp-infra-string-utils');

document.addEventListener('DOMContentLoaded', () => {
  const greeting = document.querySelector('#greeting');

  greeting.addEventListener('click', () => {
    console.log(utils.modify('hello, user!!!', 'upper')); //eslint-disable-line
  });
});

