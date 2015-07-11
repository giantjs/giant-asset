/*global giant, giant, giant, giant */
giant.postpone(giant, 'Css', function () {
    "use strict";

    var base = giant.Asset,
        self = base.extend();

    /**
     * Creates a Css asset instance.
     * Css assets may also be created via conversion from string.
     * @example
     * var css = 'foo.css'.toAsset('css');
     * @name giant.Css.create
     * @function
     * @param {string} assetPath
     * @returns {giant.Css}
     */

    /**
     * The Css class represents a style sheet asset file.
     * @class
     * @extends giant.Asset
     */
    giant.Css = self
        .addMethods(/** @lends giant.Css# */{
            /**
             * @param {string} assetPath
             * @ignore
             */
            init: function (assetPath) {
                base.init.call(this, assetPath, 'css');
            },

            /**
             * Generates a string based on the current CSS asset, for inclusion in HTML files.
             * @returns {string}
             */
            toString: function () {
                return '<link rel="stylesheet" href="' + this.assetName + '" />';
            }
        });
});

giant.amendPostponed(giant, 'Asset', function () {
    "use strict";

    giant.Asset
        .addSurrogate(giant, 'Css', function (assetPath, assetType) {
            return assetType === 'css';
        });
});
