/*global $asset */
$oop.postpone($asset, 'GruntTaskCollection', function () {
    "use strict";

    /**
     * Creates a GruntTaskCollection instance.
     * GruntTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name $asset.GruntTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {$asset.GruntTaskCollection}
     * @see Array#toGruntTaskCollection
     * @see $data.Hash#toGruntTaskCollection
     */

    /**
     * The GruntTaskCollection class implements a typed collection for storing and managing
     * GruntTask instances.
     * @class
     * @extends $data.Collection
     * @extends $asset.GruntTask
     */
    $asset.GruntTaskCollection = $data.Collection.of($asset.GruntTask);
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Converts Hash to GruntTaskCollection. Hash items must be GruntTask instances.
         * @returns {$asset.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return $asset.GruntTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts Array to GruntTaskCollection. Array items must be GruntTask instances.
         * @returns {$asset.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return $asset.GruntTaskCollection.create(this);
        }
    });

    $assertion.addTypes(/** @lends $asset */{
        /** @param {$asset.GruntTaskCollection} expr */
        isGruntTaskCollection: function (expr) {
            return $asset.GruntTaskCollection.isBaseOf(expr);
        },

        /** @param {$asset.GruntTaskCollection} expr */
        isGruntTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $asset.GruntTaskCollection.isBaseOf(expr);
        }
    });
}());
