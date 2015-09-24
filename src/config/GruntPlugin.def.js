/*global $asset */
$oop.postpone($asset, 'GruntPlugin', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a GruntPlugin instance.
     * GruntPlugin instances may also be created via conversion from String,
     * treating the string as the name of the package.
     * @example
     * $asset.GruntPlugin.create('grunt-contrib-copy')
     * @name $asset.GruntPlugin.create
     * @function
     * @param {string} packageName Name of the NPM package associated with the grunt plugin.
     * @returns {$asset.GruntPlugin}
     * @see String#toGruntPlugin
     */

    /**
     * The GruntPlugin class represents a grunt plugin.
     * @class
     * @extends $oop.Base
     */
    $asset.GruntPlugin = self
        .addMethods(/** @lends $asset.GruntPlugin# */{
            /**
             * @param {string} packageName
             * @ignore
             */
            init: function (packageName) {
                $assertion.isString(packageName, "Invalid package name");

                /**
                 * Name of the NPM package associated with the grunt plugin.
                 * @type {string}
                 */
                this.packageName = packageName;
            },

            /**
             * Loads the grunt plugin via the grunt API.
             * @returns {$asset.GruntPlugin}
             */
            loadPlugin: function () {
                $asset.GruntProxy.create().loadNpmTasks(this.packageName);
                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to GruntPlugin, treating the string as the name of an NPM package.
         * @returns {$asset.AliasTask}
         */
        toGruntPlugin: function () {
            return $asset.GruntPlugin.create(this.valueOf());
        }
    });
}());
