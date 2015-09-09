/*global giant */
giant.postpone(giant, 'GruntTask', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * Creates a GruntTask instance.
     * GruntTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name giant.CustomTask.create
     * @function
     * @param {string} taskName Name of the task.
     * @returns {giant.GruntTask}
     * @see String#toGruntTask
     */

    /**
     * The GruntTask implements a basic grunt task.
     * Basic tasks allow the user to implement tasks with a custom task handler.
     * @class
     * @extends giant.Base
     * @see http://gruntjs.com/creating-tasks#basic-tasks
     * @see http://gruntjs.com/creating-tasks#custom-tasks
     */
    giant.GruntTask = self
        .addMethods(/** @lends giant.GruntTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                giant.isString(taskName, "Invalid task name");

                /**
                 * Name of the grunt task.
                 * @type {string}
                 */
                this.taskName = taskName;

                /**
                 * Function that implements the task.
                 * @type {function}
                 */
                this.taskHandler = undefined;
            },

            /**
             * Applies task by registering it via the grunt API.
             * @param {string} [description]
             * @returns {giant.GruntTask}
             */
            applyTask: function (description) {
                giant.GruntProxy.create()
                    .registerTask(this.taskName, description, this.taskHandler);
                return this;
            },

            /**
             * Sets task handler. Overwrites previously set handler.
             * @param {function} taskHandler Function that implements the task.
             * @returns {giant.GruntTask}
             */
            setTaskHandler: function (taskHandler) {
                giant.isFunction(taskHandler, "Invalid task handler");
                this.taskHandler = taskHandler;
                return this;
            },

            /**
             * Adds current task to a collection of tasks.
             * @param {giant.MultiTaskCollection} taskCollection Collection to add the task to.
             * @returns {giant.GruntTask}
             */
            addToCollection: function (taskCollection) {
                giant.isGruntTaskCollection(taskCollection, "Invalid grunt task collection");
                taskCollection.setItem(this.taskName, this);
                return this;
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to GruntTask, treating the string as task name.
         * @returns {giant.GruntTask}
         */
        toGruntTask: function () {
            return giant.GruntTask.create(this.valueOf());
        }
    });
}());
