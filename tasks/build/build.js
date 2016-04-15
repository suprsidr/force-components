'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var sass = require('gulp-sass');
var jetpack = require('fs-jetpack');

var bundle = require('./bundle');
var generateSpecImportsFile = require('./generate_spec_imports');
var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    copyFromAppDir: [
        './node_modules/**',
        './vendor/**',
        './css/**/*.css',
        './**/*.html',
        './**/*.+(jpg|png|svg)',
    ],
}

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function (callback) {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
            overwrite: true,
            matching: paths.copyFromAppDir
        });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);


var bundleApplication = function () {
    return Q.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(srcDir.path('app.js'), destDir.path('app.js'))
        ]);
};

var bundleSpecs = function () {
    return generateSpecImportsFile().then(function (specEntryPointPath) {
        return Q.all([
                bundle(srcDir.path('background.js'), destDir.path('background.js')),
                bundle(specEntryPointPath, destDir.path('spec.js')),
            ]);
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
};
gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);


var sassTask = function () {
  var opts = {};
  switch (utils.getEnvName()) {
    case 'development':
      opts.outputStyle = 'nested';
      break;
    case 'production':
      opts.outputStyle = 'compressed';
      break;
    default:
      opts.outputStyle = 'nested';
      break;
  }
  return gulp.src('app/css/scss/app.scss')
    .pipe(sass(opts).on('error', sass.logError))
    .pipe(gulp.dest(destDir.path('css')));
};

gulp.task('sass', ['clean'], sassTask);
gulp.task('sass-watch', sassTask);




gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
    switch (utils.getEnvName()) {
        case 'development':
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
        case 'test':
            manifest.name += '-test';
            manifest.productName += ' Test';
            break;
    }

    // Copy environment variables to package.json file for easy use
    // in the running application. This is not official way of doing
    // things, but also isn't prohibited ;)
    manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

    destDir.write('package.json', manifest);
});


gulp.task('watch', function () {
    gulp.watch('app/**/*.js', ['bundle-watch']);
    gulp.watch(paths.copyFromAppDir, { cwd: 'app' }, ['copy-watch']);
    gulp.watch('app/**/*.scss', ['sass-watch']);
});


gulp.task('build', ['bundle', 'sass', 'copy', 'finalize']);