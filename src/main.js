/**
 * Created by Artem.Malieiev on 6/10/2015.
 */
define(function (require) {
    var MainRouter = require('router/MainRouter'),
        ConnectionsCollection = require('collection/ConnectionsCollection');

    require('config/underscore.config');

    window.Tamanoir = {};
    Tamanoir.router = new MainRouter();
});