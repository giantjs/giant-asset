/*global giant */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("GruntProxy", {
        setup   : function () {
            giant.GruntProxy.clearInstanceRegistry();
        },
        teardown: function () {
            giant.GruntProxy.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var gruntProxy = giant.GruntProxy.create();

        ok(gruntProxy.hasOwnProperty('grunt'), "should add grunt property");
        equal(typeof gruntProxy.grunt, 'undefined', "should set grunt property to undefined");

        strictEqual(giant.GruntProxy.create(), gruntProxy, "should be singleton");
    });

    test("Grunt object setter", function () {
        var gruntProxy = giant.GruntProxy.create(),
            gruntObject = {};

        raises(function () {
            gruntProxy.setGruntObject();
        }, "should raise exception on missing argument");

        raises(function () {
            gruntProxy.setGruntObject('foo');
        }, "should raise exception on invalid argument");

        strictEqual(gruntProxy.setGruntObject(gruntObject), gruntProxy, "should be chainable");
        strictEqual(gruntProxy.grunt, gruntObject, "should set grunt object");
    });
}());
