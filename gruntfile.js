'use strict'

var path = require('path')

module.exports = function (grunt) {
  var paths = {
    app: path.join(path.resolve(), '/src/app'),
    test: path.join(path.resolve(), '/src/app/_test'),
    dist: path.join(path.resolve(), '/public'),
    config: path.join(path.resolve(), '/config')
  }

  var clean = {
    src: '<%= paths.dist %>'
  }

  var ts = {
    options: {
      module: 'commonjs',
      target: 'ES6',
      rootDir: '<%= paths.app %>',
      inlineSourceMap: true
    },
    default: {
      src: ['<%= paths.app %>/**/*.ts', '!node_modules/**/*'],
      outDir: '<%= paths.dist %>/'
    },
    faster: {
      src: ['<%= paths.app %>/**/*.ts', '!node_modules/**/*'],
      outDir: '<%= paths.dist %>/',
      options: {
        fast: 'faster'
      }
    }
  }

  var copy = {
    json: {
      expand: true,
      cwd: '<%= paths.config %>/',
      src: '**/*.json',
      dest: path.join('<%= paths.dist %>/', '/config', '/')
    }
  }

  var mocha = {
    test: {
      options: {
        reporter: 'spec',
        captureFile: 'results.txt',
        quiet: false,
        clearRequireCache: false,
        noFail: false
      },
      src: ['<%= paths.test %>/**/*.js']
    }
  }

  var watch = {
    default: {
      files: [ '<%= paths.app %>/**/*.ts' ],
      tasks: ['copy', 'ts:faster']
    }
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: paths,
    clean: clean,
    copy: copy,
    ts: ts,
    mocha: mocha,
    watch: watch
  })

  require('load-grunt-tasks')(grunt)

  grunt.registerTask('compile', ['clean', 'copy', 'ts:default'])
  grunt.registerTask('test', ['compile', 'mocha'])
  grunt.registerTask('dev', ['test', 'concurrent'])
  grunt.registerTask('default', ['compile', 'watch'])
}
