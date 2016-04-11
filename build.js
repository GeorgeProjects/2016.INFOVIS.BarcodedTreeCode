({
    baseUrl: './js',

    mainConfigFile: './js/main.js',

    dir: './build',
    name: 'main',

    paths: {
        'jquery': 'empty:',
        'backbone': 'empty:',
        'underscore': 'empty:',
        'bootstrap': 'empty:',
        'marionette': 'empty:',
        'nprogress': 'empty:',
        'd3': 'empty:',
        'highstock': 'empty:',
        'backbone.relational': 'empty:',
    },

    optimize: "uglify2",

    uglify2: {
        warnings: true,
        mangle: true
    },

    inlineText: true,

    useStrict: false,

    findNestedDependencies: true,

    fileExclusionRegExp: /^\./,

    preserveLicenseComments: false,

    logLevel: 0,

    removeCombined: true,

    throwWhen: {
        optimize: true
    }

})
