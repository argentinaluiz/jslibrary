// Karma configuration
// Generated on Thu May 08 2014 13:30:51 GMT-0300 (Hora oficial do Brasil)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],
        // list of files / patterns to load in the browser
        files: [
            //{pattern: 'js/**/*.js', included: false},
            {pattern: 'js/angular/**/*.js', included: false},
            {pattern: 'js/jquery/**/*.js', included: false},
            {pattern: 'js/ui/**/*.js', included: false},
            {pattern: 'js/unit_tests/Spec/*.js', included: false},
            //{pattern: 'js/unit_tests/Spec/angular-jslibrary-form-validation-Spec.js', included: false},
            {pattern: 'bower_components/**/*.js', included: false},
            {pattern: 'bower_components/bootstrap/docs/assets/js/bootstrap.min.js', included: false},
            {pattern: 'template/**/*.html', included: true},
            {pattern: 'fixture/**/*.html', included: false, served: true},
            'js/unit_tests/config.js'
        ],
        // list of files to exclude
        exclude: [
            'bower_components/**/*Spec.js',
            'bower_components/**/demo/**/*.js',
            'bower_components/**/examples/**/*.js',
            'bower_components/**/example/**/*.js',
            'bower_components/**/test/**/*.js',
            'bower_components/**/tests/**/*.js',
            'bower_components/**/unit_testing/**/*.js',
            'bower_components/**/spec/**/*.js',
            'bower_components/**/Spec/**/*.js',
            'bower_components/**/docs/**/!(bootstrap.min)*.js'
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'js/angular/**/*.js': 'coverage',
            'template/**/*.html': ['html2js']
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
