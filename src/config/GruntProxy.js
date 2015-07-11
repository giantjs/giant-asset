/*global giant */
giant.postpone(giant, 'GruntProxy', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * Creates or retrieves a GruntProxy instance.
     * @name giant.GruntProxy.create
     * @function
     * @returns {giant.GruntProxy}
     */

    /**
     * The GruntProxy singleton provides a testable API to communicate with grunt.
     * @class
     * @extends giant.Base
     */
    giant.GruntProxy = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends giant.GruntProxy# */{
            /** @ignore */
            init: function () {
                /**
                 * Reference to the grunt object.
                 * @type {object}
                 */
                this.grunt = undefined;
            },

            /**
             * Sets grunt object. This must be called at least once in order to use
             * the config management part of giant.
             * @param {object} grunt
             * @returns {giant.GruntProxy}
             */
            setGruntObject: function (grunt) {
                giant.isObject(grunt, "Invalid grunt object");
                this.grunt = grunt;
                return this;
            },

            /**
             * Proxy for grunt.config.init().
             * @param {object} config Config object to be passed to grunt.
             * @returns {*}
             */
            configInit: function (config) {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.config.init(config);
            },

            /**
             * Proxy for grunt.config.merge().
             * @param {object} config Config object to be passed to grunt.
             * @returns {*}
             */
            configMerge: function (config) {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.config.merge(config);
            },

            /**
             * Proxy for grunt.config.set().
             * @param {string} propertyName
             * @param {*} config
             * @returns {*}
             */
            configSet: function (propertyName, config) {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.config.set(propertyName, config);
            },

            /**
             * @param {string} propertyName
             * @returns {string}
             */
            configEscape: function (propertyName) {
                return this.grunt.config.escape(propertyName);
            },

            /**
             * Proxy for grunt.registerTask().
             * @returns {*}
             */
            registerTask: function () {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.registerTask.apply(this.grunt, arguments);
            },

            /**
             * Proxy for grunt.registerMultiTask().
             * @returns {*}
             */
            registerMultiTask: function () {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.registerMultiTask.apply(this.grunt, arguments);
            },

            /**
             * Proxy for grunt.loadTasks().
             * returns {*}
             */
            loadTasks: function () {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.loadTasks.apply(this.grunt, arguments);
            },

            /**
             * Proxy for grunt.loadNpmTasks().
             * returns {*}
             */
            loadNpmTasks: function () {
                giant.assert(!!this.grunt, "Grunt reference not set");
                return this.grunt.loadNpmTasks.apply(this.grunt, arguments);
            }
        });
});
