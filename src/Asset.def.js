$oop.postpone($asset, 'Asset', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates an Asset instance.
     * Assets may also be created via conversion from string.
     * TODO: Rename assetName to assetPath.
     * @name $asset.Asset.create
     * @function
     * @param {string} assetName Asset name, usually a relative path.
     * @param {string} assetType Asset type, eg. 'css', 'js', etc.
     * @returns {$asset.Asset}
     * @see String#toAsset
     */

    /**
     * The Asset class represents a single asset (file) of the application.
     * @class
     * @extends $oop.Base
     */
    $asset.Asset = self
        .addMethods(/** @lends $asset.Asset# */{
            /**
             * @param {string} assetName
             * @param {string} assetType
             * @ignore
             */
            init: function (assetName, assetType) {
                $assertion
                    .isString(assetName, "Invalid asset name")
                    .isString(assetType, "Invalid asset type");

                /**
                 * Asset name, usually a path relative to the project root.
                 * @type {string}
                 */
                this.assetName = assetName;

                /**
                 * Asset type, eg. 'css', 'js', etc.
                 * @type {string}
                 */
                this.assetType = assetType;
            },

            /**
             * Adds prefix to the asset name.
             * @param {string} assetPrefix
             * @returns {$asset.Asset}
             */
            addPrefix: function (assetPrefix) {
                this.assetName = assetPrefix + this.assetName;
                return this;
            },

            /**
             * Extracts file name from asset name.
             * @returns {string}
             */
            getAssetFileName: function () {
                return this.assetName.split('/').pop();
            },

            /**
             * Extracts asset base name (file name without extension) from asset name.
             * @returns {string}
             */
            getAssetBaseName: function () {
                var assetParts = this.getAssetFileName().split('.');
                assetParts.pop();
                return assetParts.join('.');
            },

            /**
             * Extracts file extension from asset name.
             * @returns {string}
             */
            getAssetExtension: function () {
                return this.assetName.split('.').pop();
            }

            /**
             * Serializes the asset to string.
             * Typically used for inclusion in a project file, eg. index.html.
             * @name $asset.Asset#toString
             * @function
             * @returns {string}
             */
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to Asset, interpreting the string as asset name.
         * @param {string} assetType
         * @returns {$asset.Asset}
         */
        toAsset: function (assetType) {
            return $asset.Asset.create(this.valueOf(), assetType);
        }
    });
}());
