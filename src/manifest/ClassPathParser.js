/*global giant, giant, giant, giant */
giant.postpone(giant, 'ClassPathParser', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * The ClassPathParser has the sole purpose of parsing class path string expressions.
     * @class
     * @extends giant.Base
     */
    giant.ClassPathParser = self
        .addConstants(/** @lends giant.ClassPathParser */{
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
        .addMethods(/** @lends giant.ClassPathParser */{
            /**
             * Parses class path. The class path is a path delimited by any character that is
             * not word character, numeric, underscore, or dollar sign.
             * @param {string} classPath
             * @returns {giant.Path}
             */
            parseClassPath: function (classPath) {
                return classPath.split(this.RE_CLASS_PATH_DELIMITER).toPath();
            }
        });
});

giant.amendPostponed(giant, 'Path', function () {
    "use strict";

    giant.Path
        .addMethods(/** @lends giant.Path# */{
            /**
             * Converts Path to a class path string.
             * @returns {string}
             */
            toClassPath: function () {
                return this.asArray
                    .toCollection()
                    .mapValues(function (propertyName, index) {
                        return !giant.ClassPathParser.RE_IDENTIFIER.test(propertyName) ?
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

    giant.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to Path, treating the string as class path.
             * @returns {giant.Path}
             */
            toPathFromClassPath: function () {
                return giant.ClassPathParser.parseClassPath(this);
            }
        },
        false, false, false
    );
}());
