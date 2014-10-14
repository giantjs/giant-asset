/*global dessert, troop, sntls, g$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Asset");

    test("Instantiation", function () {
        raises(function () {
            g$.Asset.create();
        }, "should raise exception on absent arguments");

        var asset = g$.Asset.create('foo/bar', 'baz');

        equal(asset.assetId, 'foo/bar', "should set asset ID");
        equal(asset.assetType, 'baz', "should set asset type");
    });

    test("Conversion from string", function () {
        var asset = 'foo/bar'.toAsset('js');
        ok(asset.isA(g$.Asset), "should return Asset instance");
    });
}());