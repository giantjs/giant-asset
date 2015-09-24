/*global $asset */
(function () {
    "use strict";

    module("GruntPlugin");

    test("Instantiation", function () {
        throws(function () {
            $asset.GruntPlugin.create();
        }, "should raise exception on missing arguments");

        var plugin = $asset.GruntPlugin.create('foo');

        equal(plugin.packageName, 'foo', "should set packageName property");
    });

    test("Conversion from string", function () {
        var plugin = 'foo'.toGruntPlugin();

        ok(plugin.isA($asset.GruntPlugin), "should return GruntPlugin instance");
        equal(plugin.packageName, 'foo', "should set packageName property");
    });

    test("Loading plugin", function () {
        expect(2);

        $asset.GruntProxy.addMocks({
            loadNpmTasks: function (npmTaskName) {
                equal(npmTaskName, 'foo', "should load module via grunt");
            }
        });

        var plugin = $asset.GruntPlugin.create('foo');

        strictEqual(plugin.loadPlugin(), plugin, "should be chainable");

        $asset.GruntProxy.removeMocks();
    });
}());
