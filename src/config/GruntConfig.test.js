/*global giant */
(function () {
    "use strict";

    module("GruntConfig");

    test("Task addition", function () {
        var config = giant.GruntConfig.create(),
            task = 'foo'.toMultiTask({
                hello: "world"
            }),
            taskConfigNode = {};

        raises(function () {
            config.addMultiTask();
        }, "should raise exception on missing arguments");

        raises(function () {
            config.addMultiTask('foo');
        }, "should raise exception on invalid arguments");

        task.addMocks({
            getConfigNode: function () {
                return taskConfigNode;
            }
        });

        strictEqual(config.addMultiTask(task), config, "should be chainable");

        deepEqual(config.items, {
            'foo': taskConfigNode
        }, "should set task config node in config");
    });

    test("Task config getter", function () {
        var config = giant.GruntConfig.create({
            hello: "world"
        });

        equal(config.getTaskConfig('hello'), "world", "should return task config node");
    });

    test("Config initialization", function () {
        expect(3);

        var config = giant.GruntConfig.create({
                foo: {hello: "world"},
                bar: {hi: "all"}
            }),
            tasks = [];

        giant.GruntProxy.addMocks({
            configEscape: function (propertyName) {
                return propertyName;
            },

            configSet: function (targetPath, targetNode) {
                tasks.push([targetPath, targetNode]);
            }
        });

        strictEqual(config.applyConfig(), config, "should be chainable");
        deepEqual(tasks, [
            ['foo.hello', "world"],
            ['bar.hi', "all"]
        ], "should set config nodes in grunt config object");

        giant.GruntProxy.removeMocks();

        giant.GruntProxy.addMocks({
            configInit: function (configNode) {
                strictEqual(configNode, config.items,
                    "should pass config node to grunt.config.init() when wipe argument is set");
            }
        });

        config.applyConfig(true);

        giant.GruntProxy.removeMocks();
    });

    test("Config merge", function () {
        expect(2);

        var config = giant.GruntConfig.create();

        giant.GruntProxy.addMocks({
            configMerge: function (configNode) {
                strictEqual(configNode, config.items, "should pass config node to grunt.config.merge()");
            }
        });

        strictEqual(config.mergeConfig(), config, "should be chainable");

        giant.GruntProxy.removeMocks();
    });

    test("Getting alias task association", function () {
        var config = giant.GruntConfig.create({
                copy  : {
                    dev : {},
                    prod: {}
                },
                cssMin: {
                    dev: {}
                }
            }),
            result;

        result = config._getAliasTaskAssociations('dev');
        ok(result.isA(giant.Hash), "should return Hash instance");
        deepEqual(result.items, {dev: ['copy:dev', 'cssMin:dev']}, "should return Hash with correct contents");

        result = config._getAliasTaskAssociations('prod');
        deepEqual(result.items, {prod: 'copy:prod'}, "should return Hash with correct contents");

        result = config._getAliasTaskAssociations();
        deepEqual(result.items, {
            dev : ['copy:dev', 'cssMin:dev'],
            prod: 'copy:prod'
        }, "should return Hash with correct contents");
    });

    test("Getting alias tasks grouped by target", function () {
        var config = giant.GruntConfig.create({
                copy  : {
                    dev : {},
                    prod: {}
                },
                cssMin: {
                    dev: {}
                }
            }),
            result;

        result = config.getAliasTasksGroupedByTarget();
        ok(result.isA(giant.GruntTaskCollection), "should return GruntTaskCollection instance");
        deepEqual(result.items, {
            dev : 'dev'.toAliasTask().addSubTasks('copy:dev', 'cssMin:dev'),
            prod: 'prod'.toAliasTask().addSubTask('copy:prod')
        }, "should return collection of AliasTask instances");
    });

    test("Merging with other config", function () {
        var tasks = giant.MultiTaskCollection.create(),
            configA = giant.GruntConfig.create({
                copy  : {
                    dev : {foo: "baz"},
                    prod: {hello: "all"}
                },
                cssMin: {
                    dev: {}
                }
            }),
            configMerged;

        'copy'.toMultiTask({
            dev : {foo: "bar"},
            prod: {hello: "world"}
        }).addToCollection(tasks);

        'cssMin'.toMultiTask({
            dev : {foo: "baz"},
            prod: {hello: "all"}
        }).addToCollection(tasks);

        configMerged = configA.mergeWith(tasks.toGruntConfig('_'));

        ok(configMerged.isA(giant.GruntConfig), "should return GruntConfig instance");
        deepEqual(configMerged.items, {
            copy  : {
                dev  : {foo: "baz"},
                prod : {hello: "all"},
                _dev : {foo: "bar"},
                _prod: {hello: "world"}
            },
            cssMin: {
                dev  : {},
                _dev : {foo: "baz"},
                _prod: {hello: "all"}
            }
        }, "should return merged config");
    });
}());
