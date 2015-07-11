/*global giant */
giant.postpone(giant, 'Script', function () {
    "use strict";

    var base = giant.Asset,
        self = base.extend();

    /**
     * Creates a Script asset instance.
     * Script assets may also be created via conversion from string.
     * @example
     * var css = 'foo.js'.toAsset('js');
     * @name giant.Script.create
     * @function
     * @param {string} assetPath
     * @returns {giant.Script}
     */

    /**
     * The Script class represents a JavaScript asset file.
     * @class
     * @extends giant.Asset
     */
    giant.Script = self
        .addMethods(/** @lends giant.Script# */{
            /**
             * @param {string} assetPath
             * @ignore
             */
            init: function (assetPath) {
                base.init.call(this, assetPath, 'js');
            },

            /**
             * Generates a string based on the current script asset, for inclusion in HTML files.
             * @returns {string}
             */
            toString: function () {
                return '<script src="' + this.assetName + '"></script>';
            }
        });
});

giant.amendPostponed(giant, 'Asset', function () {
    "use strict";

    giant.Asset
        .addSurrogate(giant, 'Script', function (assetPath, assetType) {
            return assetType === 'js';
        });
});
