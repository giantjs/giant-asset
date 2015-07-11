/*global giant */
giant.postpone(giant, 'AssetCollection', function () {
    "use strict";

    var base = giant.Collection.of(giant.Asset),
        self = base.extend();

    /**
     * @name giant.AssetCollection.create
     * @function
     * @param {Asset[]} items
     * @returns {giant.AssetCollection}
     */

    /**
     * The AssetCollection offers an API to perform uniform operations on a set of Asset instances.
     * @class
     * @extends giant.Base
     */
    giant.AssetCollection = self
        .addMethods(/** @lends giant.AssetCollection# */{
            /**
             * @param {Asset[]} items
             * @ignore
             */
            init: function (items) {
                giant.isArray(items, "Invalid asset list");
                base.init.call(this, items);
            },

            /**
             * Retrieves an array of asset names based on the assets in the collection.
             * @returns {string[]}
             */
            getAssetNames: function () {
                return this
                    .mapValues(function (/**giant.Asset*/asset) {
                        return asset.assetName;
                    })
                    .items;
            },

            /**
             * Retrieves a dictionary of asset paths associated with flattened asset file names.
             * @returns {giant.Dictionary}
             */
            getFlatAssetFileNameLookup: function () {
                var result = {},

                // assets identified by their (unique) asset names
                    assetNameByAsset = this
                        .mapKeys(function (/**giant.Asset*/asset) {
                            return asset.assetName;
                        }),

                // asset name lookup by asset file names (with extension)
                    assetFileNameToAssetName = assetNameByAsset
                        .mapValues(function (/**giant.Asset*/asset) {
                            return asset.getAssetFileName();
                        })
                        .toStringDictionary()
                        .reverse(),

                // asset data lookup by (unique) asset names
                    assetNameToAssetNameParts = assetNameByAsset
                        .mapValues(function (/**giant.Asset*/asset, assetName) {
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

                return giant.Dictionary.create(result);
            },

            /**
             * Serializes all assets in the collection.
             * @returns {string}
             * @see giant.Asset#toString
             */
            toString: function () {
                return this.items.join('\n');
            }
        });
});

giant.amendPostponed(giant, 'Hash', function () {
    "use strict";

    giant.Hash
        .addMethods(/** @lends giant.Hash# */{
            /**
             * Converts `Hash` instance with array items to `AssetCollection` instance.
             * @returns {giant.AssetCollection}
             */
            toAssetCollection: function () {
                return giant.AssetCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    giant.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * @param {string} assetType
             * @returns {giant.AssetCollection}
             */
            toAssetCollection: function (assetType) {
                return this.toCollection()
                    .callOnEachItem('toAsset', assetType)
                    .toAssetCollection();
            }
        },
        false, false, false
    );
}());
