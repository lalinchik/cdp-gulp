require('jquery');
require('bootstrap');

require('../bower_components/bootstrap/less/bootstrap.less');
require('./less/all.less');

document.addEventListener("DOMContentLoaded", function () {
    const utils = require('jsmp-infra-string-utils');
    const greeting = document.querySelector('#greeting');

    greeting.addEventListener('click', function () {
        console.log(utils.modify('hello, user!!!', 'upper'));
    });
});

