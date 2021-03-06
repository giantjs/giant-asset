(function () {
    "use strict";

    module("AssetCollection");

    test("Instantiation", function () {
        throws(function () {
            $asset.AssetCollection.create({});
        }, "should raise exception on invalid arguments");
    });

    test("Conversion from Array", function () {
        var assets = ['foo/bar', 'hello/world'].toAssetCollection('baz');

        ok(assets.isA($asset.AssetCollection), "should return AssetCollection instance");
        deepEqual(
            assets,
            $asset.AssetCollection.create(['foo/bar'.toAsset('baz'), 'hello/world'.toAsset('baz')]),
            "should initialize instance identically as through constructor");
    });

    test("Conversion from Hash", function () {
        var hash = [
                'foo/bar'.toAsset('baz'),
                'hello/world'.toAsset('baz')
            ].toHash(),
            assets = hash.toAssetCollection();

        ok(assets.isA($asset.AssetCollection), "should return AssetCollection instance");
        deepEqual(
            assets,
            $asset.AssetCollection.create(['foo/bar'.toAsset('baz'), 'hello/world'.toAsset('baz')]),
            "should initialize instance identically as through constructor");
    });

    test("Asset list getter", function () {
        var assets = ['foo/bar', 'hello/world'].toAssetCollection('baz'),
            assetNames = assets.getAssetNames();

        deepEqual(assetNames, ['foo/bar', 'hello/world'], "should retrieve asset list array");
    });

    test("Asset file name getter", function () {
        var assets = ['foo/bar.js', 'baz/bar.js', 'hello/world.js'].toAssetCollection('baz'),
            assetFileNames = assets.getFlatAssetFileNameLookup();

        ok(assetFileNames.isA($data.Dictionary), "should return Dictionary instance");
        deepEqual(assetFileNames.items, {
            'foo/bar.js'    : 'bar0.js',
            'baz/bar.js'    : 'bar1.js',
            'hello/world.js': 'world.js'
        }, "should lookup of return flattened asset file names");
    });

    test("Serialization", function () {
        var assets = ['foo/bar', 'hello/world'].toAssetCollection('js');

        equal(
            assets.toString(),
            '<script src="foo/bar"></script>\n<script src="hello/world"></script>',
            "should return serialized assets concatenated");
    });
}());
