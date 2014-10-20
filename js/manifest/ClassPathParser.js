/*global dessert, troop, sntls, grocer */
troop.postpone(grocer, 'ClassPathParser', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The ClassPathParser has the sole purpose of parsing class path string expressions.
     * @class
     * @extends troop.Base
     */
    grocer.ClassPathParser = self
        .addConstants(/** @lends grocer.ClassPathParser */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_CLASS_PATH_DELIMITER: /[^0-9a-z_$]+/i,

            /**
             * @type {RegExp}
             * @constant
             */
            RE_IDENTIFIER: /^[a-z][0-9a-z_$]+$/i
        })
        .addMethods(/** @lends grocer.ClassPathParser */{
            /**
             * Parses class path. The class path is a path delimited by any character that is
             * not word character, numeric, underscore, or dollar sign.
             * @param {string} classPath
             * @returns {sntls.Path}
             */
            parseClassPath: function (classPath) {
                return classPath.split(this.RE_CLASS_PATH_DELIMITER).toPath();
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path# */{
            /**
             * Converts Path to a class path string.
             * @returns {string}
             */
            toClassPath: function () {
                return this.asArray
                    .toCollection()
                    .mapValues(function (propertyName, index) {
                        return !grocer.ClassPathParser.RE_IDENTIFIER.test(propertyName) ?
                               '["' + propertyName.replace('"', '\\"') + '"]' :
                               index > 0 ?
                               '.' + propertyName :
                               propertyName;
                    })
                    .items
                    .join('');
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to Path, treating the string as class path.
             * @returns {sntls.Path}
             */
            toPathFromClassPath: function () {
                return grocer.ClassPathParser.parseClassPath(this);
            }
        },
        false, false, false
    );
}());
