/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'src/namespace.js',
            'src/manifest/ClassPathParser.js',
            'src/manifest/Asset.js',
            'src/manifest/Script.js',
            'src/manifest/Css.js',
            'src/manifest/AssetCollection.js',
            'src/manifest/Module.js',
            'src/manifest/Manifest.js',
            'src/config/GruntProxy.js',
            'src/config/GruntTask.js',
            'src/config/GruntTaskCollection.js',
            'src/config/AliasTask.js',
            'src/config/MultiTask.js',
            'src/config/MultiTaskCollection.js',
            'src/config/TaskConfig.js',
            'src/config/GruntConfig.js',
            'src/config/GruntPlugin.js',
            'src/exports.js'
        ],

        test: [
            'src/manifest/jsTestDriver.conf',
            'src/config/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
