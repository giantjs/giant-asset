/*global giant */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Script");

    test("Instantiation", function () {
        var asset = giant.Script.create('foo/bar');

        equal(asset.assetName, 'foo/bar', "should set asset name");
        equal(asset.assetType, 'js', "should set asset type to js");
    });

    test("Asset surrogate", function () {
        var asset = giant.Asset.create('foo/bar', 'js');
        ok(asset.isA(giant.Script), "should return Script instance");
    });

    test("Serialization", function () {
        var asset = giant.Script.create('foo/bar');
        equal(
            asset.toString(),
            '<script src="foo/bar"></script>',
            "should return a script tag");
    });
}());
