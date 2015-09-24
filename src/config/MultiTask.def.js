/*global giant */
$oop.postpone(giant, 'MultiTask', function () {
    "use strict";

    var base = giant.GruntTask,
        self = base.extend(),
        validators = $assertion.validators;

    /**
     * Creates a MultiTask instance.
     * MultiTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name giant.MultiTask.create
     * @function
     * @param {string} taskName Name of multi task.
     * @param {object|function} [configNode]
     * @returns {giant.MultiTask}
     */

    /**
     * The MultiTask implements a 'multi' grunt task.
     * Multi grunt tasks are loaded via plugins and are configurable.
     * @class
     * @extends giant.GruntTask
     * @see http://gruntjs.com/creating-tasks#multi-tasks
     */
    giant.MultiTask = self
        .addPrivateMethods(/** @lends giant.MultiTask# */{
            /**
             * @returns {object}
             * @private
             */
            _getConfigNode: function () {
                return typeof this.configNode === 'function' ?
                    this.configNode() :
                    this.configNode;
            }
        })
        .addMethods(/** @lends giant.MultiTask# */{
            /**
             * @param {string} taskName
             * @param {object|function} [configNode]
             * @ignore
             */
            init: function (taskName, configNode) {
                $assertion.assert(
                    !configNode || validators.isFunction(configNode) || validators.isObject(configNode),
                    "Invalid task config node");

                base.init.call(this, taskName);

                /**
                 * Grunt plugin associated with multi task.
                 * @type {giant.GruntPlugin}
                 */
                this.gruntPlugin = undefined;

                /**
                 * Relative path to file that implements the task.
                 * @type {string}
                 */
                this.taskPath = undefined;

                /**
                 * Config node object or function that generates it.
                 * @type {object|function}
                 */
                this.configNode = configNode || {};
            },

            /**
             * Applies task by either loading the plugin or registering it with the provided handler.
             * @param {string} [description]
             * @returns {giant.MultiTask}
             */
            applyTask: function (description) {
                var gruntPlugin = this.gruntPlugin,
                    taskPath = this.taskPath,
                    taskHandler = this.taskHandler;

                $assertion.assert(!!gruntPlugin || !!taskPath || !!taskHandler,
                    "Task has no associated plugin, path, or handler");

                if (gruntPlugin) {
                    gruntPlugin.loadPlugin();
                } else if (taskPath) {
                    giant.GruntProxy.create()
                        .loadTasks(taskPath);
                } else {
                    giant.GruntProxy.create()
                        .registerMultiTask(this.taskName, description, this.taskHandler);
                }

                return this;
            },

            /**
             * Sets NPM package name for the plugin associated with the current task.
             * @param {string} packageName Name of NPM package for the plugin.
             * @returns {giant.MultiTask}
             */
            setPackageName: function (packageName) {
                $assertion.isString(packageName, "Invalid packahe name");
                this.gruntPlugin = packageName.toGruntPlugin();
                return this;
            },

            /**
             * Sets task path, so that it can be loaded from an external javascript file.
             * Overwrites previously set task path.
             * @param {string} taskPath
             * @returns {giant.MultiTask}
             */
            setTaskPath: function (taskPath) {
                $assertion.isString(taskPath, "Invalid task path");
                this.taskPath = taskPath;
                return this;
            },

            /**
             * Fetches config node for the whole task, with each target prefixed optionally.
             * @param {string} [targetPrefix] Optional prefix for targets.
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                $assertion.isStringOptional(targetPrefix, "Invalid target prefix");

                var configNode = this._getConfigNode();

                if (targetPrefix) {
                    return giant.Collection.create(configNode)
                        .mapKeys(function (targetConfig, targetName) {
                            return targetPrefix + targetName;
                        })
                        .items;
                } else {
                    return configNode;
                }
            },

            /**
             * Adds task to the specified GruntConfig instance.
             * @param {giant.GruntConfig} config Config to add the task to.
             * @returns {giant.MultiTask}
             */
            addToConfig: function (config) {
                $assertion.isGruntConfig(config, "Invalid grunt config");
                config.addMultiTask(this);
                return this;
            },

            /**
             * Adds current multi task to a collection of multi tasks.
             * @param {giant.MultiTaskCollection} multiTaskCollection Collection to add the task to.
             * @returns {giant.MultiTask}
             */
            addToCollection: function (multiTaskCollection) {
                $assertion.isMultiTaskCollection(multiTaskCollection, "Invalid multi task collection");
                multiTaskCollection.setItem(this.taskName, this);
                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to MultiTask, treating the string as the plugin name.
         * @param {object} [configNode] Optional task config.
         * @returns {giant.MultiTask}
         */
        toMultiTask: function (configNode) {
            return giant.MultiTask.create(this.valueOf(), configNode);
        }
    });

    $assertion.addTypes(/** @lends giant */{
        /** @param {giant.MultiTask} expr */
        isMultiTask: function (expr) {
            return giant.MultiTask.isBaseOf(expr);
        },

        /** @param {giant.MultiTask} expr */
        isMultiTaskOptional: function (expr) {
            return typeof expr === 'undefined' ||
                giant.MultiTask.isBaseOf(expr);
        }
    });
}());
