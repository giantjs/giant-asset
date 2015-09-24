/*global giant */
(function () {
    "use strict";

    module("Module");

    test("Instantiation", function () {
        throws(function () {
            giant.Module.create();
        }, "should raise exception on absent arguments");

        throws(function () {
            giant.Module.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var module = giant.Module.create('foo', {
            classPath: 'foo["bar"].baz',
            assets   : {
                js: ['hello.js', 'world.js']
            }
        });

        equal(module.moduleName, 'foo', "should set moduleName property");

        ok(module.classPath.isA($data.Path), "initializes classPath as Path instance");
        ok(module.classPath.toString(), 'foo>bar>baz', "should set class path based on value in module node");

        ok(module.assetCollections.isA($data.Collection), "should initialize collection of assets");
        equal(module.assetCollections.getKeyCount(), 1, "should set 1 AssetCollection instance in collection");
    });

    test("Conversion from string", function () {
        var module = 'foo'.toModule({
            classPath: 'foo["bar"].baz',
            assets   : {
                js: ['hello.js', 'world.js']
            }
        });

        ok(module.isA(giant.Module), "should return Module instance");
        equal(module.moduleName, 'foo', "should set module name");
    });

    test("Getting assets by type", function () {
        var module = 'foo'.toModule({
                classPath: 'foo["bar"].baz',
                assets   : {
                    js: ['hello.js', 'world.js']
                }
            }),
            scripts = module.getAssets('js');

        ok(scripts.isA(giant.AssetCollection), "should return AssetCollection instance");
        deepEqual(
            scripts,
            ['hello.js', 'world.js'].toAssetCollection('js'),
            "should return assets of specified type");
    });

    test("Getting asset list by type", function () {
        var module = 'foo'.toModule({
                classPath: 'foo["bar"].baz',
                assets   : {
                    js: ['hello.js', 'world.js']
                }
            }),
            scriptList;

        throws(function () {
            scriptList.getAssetNames();
        }, "should raise exception on missing arguments");

        scriptList = module.getAssetNames('js');

        deepEqual(
            scriptList,
            ['hello.js', 'world.js'],
            "should return array of asset names of the specified type");

        scriptList = module.getAssetNames('foo');

        deepEqual(scriptList, [], "should return undefined for non-existing asset type");
    });

    test("Module node getter", function () {
        var module = 'foo'.toModule({
            classPath: 'foo["bar"].baz',
            assets   : {
                js: ['hello.js', 'world.js']
            }
        });

        deepEqual(module.getModuleNode(), {
            classPath: 'foo.bar.baz',
            assets   : {
                js: ['hello.js', 'world.js']
            }
        }, "should return asset list part of node");
    });

    test("Conversion to asset", function () {
        var module = 'foo'.toModule({
            classPath: 'foo["bar"].baz',
            assets   : {
                js: ['hello.js', 'world.js']
            }
        }),
            result;

        throws(function () {
            module.toAsset();
        }, "should raise exception on missing argument");

        throws(function () {
            module.toAsset('4');
        }, "should raise exception on invalid argument");

        throws(function () {
            module.toAsset('css');
        }, "should raise exception on invalid asset type argument");

        result = module.toAsset('js');
        ok(result.isA(giant.Asset), "should return Asset instance");
        equal(result.assetName, 'foo.js', "should set asset name");
        equal(result.assetType, 'js', "should set asset type");
    });
}());
