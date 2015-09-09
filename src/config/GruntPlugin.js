/*global giant */
giant.postpone(giant, 'GruntPlugin', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * Creates a GruntPlugin instance.
     * GruntPlugin instances may also be created via conversion from String,
     * treating the string as the name of the package.
     * @example
     * giant.GruntPlugin.create('grunt-contrib-copy')
     * @name giant.GruntPlugin.create
     * @function
     * @param {string} packageName Name of the NPM package associated with the grunt plugin.
     * @returns {giant.GruntPlugin}
     * @see String#toGruntPlugin
     */

    /**
     * The GruntPlugin class represents a grunt plugin.
     * @class
     * @extends giant.Base
     */
    giant.GruntPlugin = self
        .addMethods(/** @lends giant.GruntPlugin# */{
            /**
             * @param {string} packageName
             * @ignore
             */
            init: function (packageName) {
                giant.isString(packageName, "Invalid package name");

                /**
                 * Name of the NPM package associated with the grunt plugin.
                 * @type {string}
                 */
                this.packageName = packageName;
            },

            /**
             * Loads the grunt plugin via the grunt API.
             * @returns {giant.GruntPlugin}
             */
            loadPlugin: function () {
                giant.GruntProxy.create().loadNpmTasks(this.packageName);
                return this;
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to GruntPlugin, treating the string as the name of an NPM package.
         * @returns {giant.AliasTask}
         */
        toGruntPlugin: function () {
            return giant.GruntPlugin.create(this.valueOf());
        }
    });
}());
