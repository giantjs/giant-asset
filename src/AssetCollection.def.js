$oop.postpone($asset, 'AssetCollection', function () {
    "use strict";

    var base = $data.Collection.of($asset.Asset),
        self = base.extend();

    /**
     * @name $asset.AssetCollection.create
     * @function
     * @param {Asset[]} items
     * @returns {$asset.AssetCollection}
     */

    /**
     * The AssetCollection offers an API to perform uniform operations on a set of Asset instances.
     * @class
     * @extends $oop.Base
     */
    $asset.AssetCollection = self
        .addMethods(/** @lends $asset.AssetCollection# */{
            /**
             * @param {Asset[]} items
             * @ignore
             */
            init: function (items) {
                $assertion.isArray(items, "Invalid asset list");
                base.init.call(this, items);
            },

            /**
             * Retrieves an array of asset names based on the assets in the collection.
             * @returns {string[]}
             */
            getAssetNames: function () {
                return this
                    .mapValues(function (/**$asset.Asset*/asset) {
                        return asset.assetName;
                    })
                    .items;
            },

            /**
             * Retrieves a dictionary of asset paths associated with flattened asset file names.
             * @returns {$data.Dictionary}
             */
            getFlatAssetFileNameLookup: function () {
                var result = {},

                // assets identified by their (unique) asset names
                    assetNameByAsset = this
                        .mapKeys(function (/**$asset.Asset*/asset) {
                            return asset.assetName;
                        }),

                // asset name lookup by asset file names (with extension)
                    assetFileNameToAssetName = assetNameByAsset
                        .mapValues(function (/**$asset.Asset*/asset) {
                            return asset.getAssetFileName();
                        })
                        .toStringDictionary()
                        .reverse(),

                // asset data lookup by (unique) asset names
                    assetNameToAssetNameParts = assetNameByAsset
                        .mapValues(function (/**$asset.Asset*/asset, assetName) {
                            return {
                                name: assetName,
                                base: asset.getAssetBaseName(),
                                ext : asset.getAssetExtension()
                            };
                        })
                        .toDictionary();

                // obtaining flat asset file names associated with asset name
                assetFileNameToAssetName
                    .combineWith(assetNameToAssetNameParts)
                    .toCollection()
                    .forEachItem(function (assetData) {
                        var i, assetParts;
                        if (assetData instanceof Array) {
                            for (i = 0; i < assetData.length; i++) {
                                assetParts = assetData[i];
                                result[assetParts.name] = assetParts.base + i + '.' + assetParts.ext;
                            }
                        } else {
                            assetParts = assetData;
                            result[assetParts.name] = assetParts.base + '.' + assetParts.ext;
                        }
                    });

                return $data.Dictionary.create(result);
            },

            /**
             * Serializes all assets in the collection.
             * @returns {string}
             * @see $asset.Asset#toString
             */
            toString: function () {
                return this.items.join('\n');
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash
        .addMethods(/** @lends $data.Hash# */{
            /**
             * Converts `Hash` instance with array items to `AssetCollection` instance.
             * @returns {$asset.AssetCollection}
             */
            toAssetCollection: function () {
                return $asset.AssetCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * @param {string} assetType
         * @returns {$asset.AssetCollection}
         */
        toAssetCollection: function (assetType) {
            return this.toCollection()
                .callOnEachItem('toAsset', assetType)
                .toAssetCollection();
        }
    });
}());
