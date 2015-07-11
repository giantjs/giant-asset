/*global giant */
giant.postpone(giant, 'GruntTaskCollection', function () {
    "use strict";

    /**
     * Creates a GruntTaskCollection instance.
     * GruntTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name giant.GruntTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {giant.GruntTaskCollection}
     * @see Array#toGruntTaskCollection
     * @see giant.Hash#toGruntTaskCollection
     */

    /**
     * The GruntTaskCollection class implements a typed collection for storing and managing
     * GruntTask instances.
     * @class
     * @extends giant.Collection
     * @extends giant.GruntTask
     */
    giant.GruntTaskCollection = giant.Collection.of(giant.GruntTask);
});

giant.amendPostponed(giant, 'Hash', function () {
    "use strict";

    giant.Hash.addMethods(/** @lends giant.Hash# */{
        /**
         * Converts Hash to GruntTaskCollection. Hash items must be GruntTask instances.
         * @returns {giant.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return giant.GruntTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    giant.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array to GruntTaskCollection. Array items must be GruntTask instances.
             * @returns {giant.GruntTaskCollection}
             */
            toGruntTaskCollection: function () {
                return giant.GruntTaskCollection.create(this);
            }
        },
        false, false, false
    );

    giant.addTypes(/** @lends giant */{
        /** @param {giant.GruntTaskCollection} expr */
        isGruntTaskCollection: function (expr) {
            return giant.GruntTaskCollection.isBaseOf(expr);
        },

        /** @param {giant.GruntTaskCollection} expr */
        isGruntTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   giant.GruntTaskCollection.isBaseOf(expr);
        }
    });
}());
