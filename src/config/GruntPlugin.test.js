/*global giant, giant, giant, giant */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntPlugin");

    test("Instantiation", function () {
        raises(function () {
            giant.GruntPlugin.create();
        }, "should raise exception on missing arguments");

        var plugin = giant.GruntPlugin.create('foo');

        equal(plugin.packageName, 'foo', "should set packageName property");
    });

    test("Conversion from string", function () {
        var plugin = 'foo'.toGruntPlugin();

        ok(plugin.isA(giant.GruntPlugin), "should return GruntPlugin instance");
        equal(plugin.packageName, 'foo', "should set packageName property");
    });

    test("Loading plugin", function () {
        expect(2);

        giant.GruntProxy.addMocks({
            loadNpmTasks: function (npmTaskName) {
                equal(npmTaskName, 'foo', "should load module via grunt");
            }
        });

        var plugin = giant.GruntPlugin.create('foo');

        strictEqual(plugin.loadPlugin(), plugin, "should be chainable");

        giant.GruntProxy.removeMocks();
    });
}());
