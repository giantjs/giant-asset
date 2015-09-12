/*global giant */
giant.postpone(giant, 'Manifest', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * Creates a Manifest instance.
     * See the sample manifest file included in the repo. (/manifest/manifest-sample.json)
     * @name giant.Manifest.create
     * @function
     * @param {object} manifestNode Object that holds the manifest in a pre-defined format.
     * @returns {giant.Manifest}
     */

    /**
     * The Manifest class describes the modularity and assets of an application.
     * Organizes assets (usually JS and CSS files that make up the application) into modules.
     * @class
     * @extends giant.Base
     */
    giant.Manifest = self
        .addMethods(/** @lends giant.Manifest# */{
            /**
             * @param {object} manifestNode
             * @ignore
             */
            init: function (manifestNode) {
                giant.isObject(manifestNode, "Invalid manifest node");

                /**
                 * Defines and maintains the modules of the application.
                 * Collection holds Module instances.
                 * @type {giant.Collection}
                 */
                this.modules = giant.Collection.create(manifestNode)
                    .mapValues(function (moduleNode, moduleName) {
                        return giant.Module.create(moduleName, moduleNode);
                    });
            },

            /**
             * Fetches the specified Module instance from the manifest.
             * @param {string} moduleName Name of module to be retrieved.
             * @returns {giant.Module}
             */
            getModule: function (moduleName) {
                giant.isString(moduleName, "Invalid module name");
                return this.modules.getItem(moduleName);
            },

            /**
             * Retrieves all modules as single assets of the specified asset type.
             * Only those modules will be included in the result that have such assets.
             * Generally used to generate production asset list.
             * @param {string} assetType Type of assets to be retrieved.
             * @returns {giant.AssetCollection}
             */
            getModulesAsAssets: function (assetType) {
                return this.modules
                    .callOnEachItem('toAsset', assetType)
                    .getValuesAsHash()
                    .toAssetCollection();
            },

            /**
             * Retrieves all assets of the specified asset type for the specified module.
             * @param {string} moduleName Name of module to retrieve assets from.
             * @param {string} assetType Type of assets to be retrieved.
             * @returns {giant.AssetCollection}
             */
            getAssetsForModule: function (moduleName, assetType) {
                var module = this.getModule(moduleName);
                return module ?
                       module.getAssets(assetType) :
                       undefined;
            },

            /**
             * Retrieves assets from all modules matching the specified asset type.
             * @param {string} assetType Type of assets to be retrieved.
             * @returns {giant.AssetCollection}
             */
            getAssets: function (assetType) {
                var result = [];

                this.modules
                    .callOnEachItem('getAssets', assetType)
                    .forEachItem(function (assetCollection) {
                        if (assetCollection) {
                            result = result.concat(assetCollection.items);
                        }
                    });

                return result.toHash().toAssetCollection();
            },

            /**
             * Retrieves assets from all modules matching the specified asset type,
             * with all returned paths flattened out. (So that assets may go in the same folder.)
             * @param {string} assetType
             * @returns {giant.AssetCollection}
             */
            getFlatAssets: function (assetType) {
                return this.getAssets(assetType)
                    .getFlatAssetFileNameLookup()
                    .getValuesAsHash()
                    .toCollection()
                    .callOnEachItem('toAsset', assetType)
                    .toAssetCollection();
            },

            /**
             * Filters manifest down to a set of modules. Returns a new manifest instance
             * containing only the specified modules.
             * @example
             * manifest.filterByModuleNames('third-party', 'common', 'login')
             * @returns {giant.Manifest}
             */
            filterByModuleNames: function () {
                var filteredModules = this.modules
                        .filterByKeys(slice.apply(arguments)),
                    filteredManifestNode = filteredModules
                        .callOnEachItem('getModuleNode')
                        .items;

                return this.getBase().create(filteredManifestNode);
            }
        });
});