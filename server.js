var server = require('@steedos/meteor-bundle-runner');
var objectql = require("@steedos/objectql");
var path = require('path');
import express from 'express';
import { initPlugin } from '@steedos/plugin-stimulsoft-report';
let app = express();

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        try {

            let objects = objectql.loadObjectFiles(path.resolve(__dirname, "./src"))
            let apps = objectql.loadAppFiles(path.resolve(__dirname, "./src"))

            objects.forEach(function(object){
                Creator.Objects[object.name] = object
            })

            apps.forEach(function(app){
                Creator.Apps[app._id] = app
            })

            require('./src/contracts.trigger')

        } catch (error) {
            console.log(error)
        }
        server.callStartupHooks();
        try {
            initPlugin(app);
            WebApp.connectHandlers.use(app);
        } catch (error) {
            console.log(error)
        }
        server.runMain();
    });
}).run();