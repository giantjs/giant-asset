/*global $asset */
$oop.postpone($asset, 'GruntConfig', function () {
    "use strict";

    var base = $data.Tree,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * Creates a GruntConfig instance.
     * @name $asset.GruntConfig.create
     * @function
     * @param {object} [items]
     * @returns {$asset.GruntConfig}
     */

    /**
     * The GruntConfig class represents and manages grunt config objects, including adding tasks to,
     * applying, merging configs.
     * @class
     * @extends $data.Tree
     */
    $asset.GruntConfig = self
        .addPrivateMethods(/** @lends $asset.GruntConfig# */{
            /**
             * Returns a dictionary of unique targets as task names associated with task names for each target.
             * @returns {$data.StringDictionary}
             * @private
             */
            _getAliasTaskAssociations: function () {
                var args = slice.call(arguments),
                    query = ['|'.toKVP(), (args.length ? args : '|').toKVP()].toQuery();

                return this.queryPathValuePairsAsHash(query)
                    .toCollection()
                    .mapValues(function (targetNode, path) {
                        return path.toPath().getLastKey();
                    })
                    .mapKeys(function (targetNode, path) {
                        return path.toPath().asArray.join(':');
                    })
                    .toStringDictionary()
                    .reverse();
            }
        })
        .addMethods(/** @lends $asset.GruntConfig# */{
            /**
             * Adds a (multi-)task to the config.
             * @param {$asset.MultiTask} multiTask Task to be added to config.
             * @returns {$asset.GruntConfig}
             */
            addMultiTask: function (multiTask) {
                $assertion.isMultiTask(multiTask, "Invalid multi task");

                this.toCollection()
                    .setItem(multiTask.taskName, multiTask.getConfigNode());

                return this;
            },

            /**
             * Fetches the config node for the specified task.
             * @param {string} taskName
             * @returns {Object|Array}
             */
            getTaskConfig: function (taskName) {
                return this.toCollection().getItem(taskName);
            },

            /**
             * Applies config via the grunt API. Overwrites tasks in the current config.
             * When the optional `wipe` argument is set, it also removes all other tasks leaving only those
             * being applied.
             * @param {boolean} [wipe] Whether to remove tasks not in current config.
             * @returns {$asset.GruntConfig}
             */
            applyConfig: function (wipe) {
                var gruntProxy = $asset.GruntProxy.create();
                if (wipe) {
                    gruntProxy.configInit(this.items);
                } else {
                    this.queryPathValuePairsAsHash('|>|'.toQuery())
                        .toCollection()
                        .forEachItem(function (targetConfigNode, targetPath) {
                            var prop = targetPath.toPath().asArray
                                .toCollection()
                                .mapValues(gruntProxy.configEscape, gruntProxy)
                                .items
                                .join('.');

                            gruntProxy.configSet(prop, targetConfigNode);
                        });
                }
                return this;
            },

            /**
             * Applies config by merging current config to previously applied config(s) via the grunt API.
             * @returns {$asset.GruntConfig}
             */
            mergeConfig: function () {
                var gruntProxy = $asset.GruntProxy.create();
                gruntProxy.configMerge(this.items);
                return this;
            },

            /**
             * Returns a typed collection with alias tasks for the specified targets (as arguments),
             * or all targets (no arguments).
             * @returns {$asset.GruntTaskCollection}
             */
            getAliasTasksGroupedByTarget: function () {
                var groupedTasks = this._getAliasTaskAssociations.apply(this, arguments);

                return groupedTasks
                    .toCollection()
                    .mapValues(function (taskNames, targetName) {
                        var aliasTask = targetName.toAliasTask();

                        if (taskNames instanceof Array) {
                            aliasTask.addSubTasks.apply(aliasTask, taskNames);
                        } else {
                            aliasTask.addSubTask(taskNames);
                        }

                        return aliasTask;
                    }, undefined, $asset.GruntTaskCollection);
            },

            /**
             * Merges current config with remote config on the target level.
             * In case of conflict re. task/target combinations, the current config will win.
             * (Unless a suitable conflict resolver function is passed.)
             * @param {$asset.GruntConfig} remoteConfig
             * @param {function} [conflictResolver]
             * @returns {$asset.GruntConfig}
             * @see $data.Collection#mergeWith
             */
            mergeWith: function (remoteConfig, conflictResolver) {
                $assertion.isGruntConfig(remoteConfig, "Invalid grunt config");

                var targetQuery = '|>|'.toQuery(),

                // obtaining flattened targets for current config
                    currentTargets = this.queryPathValuePairsAsHash(targetQuery).toCollection(),

                // obtaining flattened targets for remote config
                    remoteTargets = remoteConfig.queryPathValuePairsAsHash(targetQuery).toCollection(),

                // merging target collections
                    mergedTargets = currentTargets.mergeWith(remoteTargets, conflictResolver),
                    mergedConfig = this.getBase().create();

                // inflating merged flattened target structure back into tree
                mergedTargets.forEachItem(function (targetConfigNode, targetPath) {
                    mergedConfig.setNode(targetPath.toPath(), targetConfigNode);
                });

                return mergedConfig;
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $asset */{
        /** @param {$asset.GruntConfig} expr */
        isGruntConfig: function (expr) {
            return $asset.GruntConfig.isBaseOf(expr);
        },

        /** @param {$asset.GruntConfig} expr */
        isGruntConfigOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   $asset.GruntConfig.isBaseOf(expr);
        }
    });
}());
