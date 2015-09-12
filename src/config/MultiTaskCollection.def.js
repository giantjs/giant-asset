/*global giant */
giant.postpone(giant, 'MultiTaskCollection', function () {
    "use strict";

    var base = giant.Collection.of(giant.MultiTask),
        self = base.extend();

    /**
     * Creates a MultiTaskCollection instance.
     * MultiTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name giant.MultiTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {giant.MultiTaskCollection}
     * @see Array#toMultiTaskCollection
     * @see giant.Hash#toMultiTaskCollection
     */

    /**
     * The MultiTaskCollection class implements a typed collection for storing and managing
     * MultiTask instances. The main purpose of MultiTaskCollection is to provide conversion to
     * config-related objects and classes.
     * @class
     * @extends giant.Collection
     * @extends giant.MultiTask
     */
    giant.MultiTaskCollection = self
        .addMethods(/** @lends giant.MultiTaskCollection# */{
            /**
             * Generates a grunt config object for all tasks in the collection,
             * with targets optionally prefixed.
             * @param {string} [targetPrefix] Optional prefix for all targets of all tasks.
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                return this.callOnEachItem('getConfigNode', targetPrefix).items;
            },

            /**
             * Converts task collection to a GruntConfig instance.
             * @param {string} [targetPrefix] Optional prefix for all targets of all tasks.
             * @returns {giant.GruntConfig}
             */
            toGruntConfig: function (targetPrefix) {
                return giant.GruntConfig.create(this.getConfigNode(targetPrefix));
            }
        });
});

giant.amendPostponed(giant, 'Hash', function () {
    "use strict";

    giant.Hash.addMethods(/** @lends giant.Hash# */{
        /**
         * Converts Hash to MultiTaskCollection. Hash items must be MultiTask instances.
         * @returns {giant.MultiTaskCollection}
         */
        toMultiTaskCollection: function () {
            return giant.MultiTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    giant.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts Array to MultiTaskCollection. Array items must be MultiTask instances.
         * @returns {giant.MultiTaskCollection}
         */
        toMultiTaskCollection: function () {
            return giant.MultiTaskCollection.create(this);
        }
    });

    giant.addTypes(/** @lends giant */{
        /** @param {giant.MultiTaskCollection} expr */
        isMultiTaskCollection: function (expr) {
            return giant.MultiTaskCollection.isBaseOf(expr);
        },

        /** @param {giant.MultiTaskCollection} expr */
        isMultiTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                giant.MultiTaskCollection.isBaseOf(expr);
        }
    });
}());
