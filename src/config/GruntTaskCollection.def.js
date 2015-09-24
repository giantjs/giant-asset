/*global giant */
$oop.postpone(giant, 'GruntTaskCollection', function () {
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
     * @see $data.Hash#toGruntTaskCollection
     */

    /**
     * The GruntTaskCollection class implements a typed collection for storing and managing
     * GruntTask instances.
     * @class
     * @extends $data.Collection
     * @extends giant.GruntTask
     */
    giant.GruntTaskCollection = $data.Collection.of(giant.GruntTask);
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
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

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts Array to GruntTaskCollection. Array items must be GruntTask instances.
         * @returns {giant.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return giant.GruntTaskCollection.create(this);
        }
    });

    $assertion.addTypes(/** @lends giant */{
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
