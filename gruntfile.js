module.exports = function(grunt) {

    "use strict";

    var rewrite = require('connect-modrewrite');



    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
          main: {
            options: {
              port: 9001,
              base:'app'
            }
          }
        },

        watch: {
            
            options: {
                livereload: {
                    port:9002
                }
            },
          
            css: {
                files: [
                    'build/components/**/*.scss',
                    'build/scss/**/*.scss',
                ],
                tasks: ['concat:sass', 'sass', 'autoprefixer'],
            },
            html: {
                files:[
                    'build/components/**/*.html',
                    //'build/html/**/*.html',
                ],
                tasks:['ngtemplates'],
            },
            js: {
                files: [
                    'build/components/**/*.js',
                    //'build/js/**/*.js'
                ],
                tasks: ['concat'],
            },
            bower: {
                files: [
                    'app/bower.json',
                ],
                tasks: ['wiredep']
            },
        },

        ngtemplates: {
            fluro: {
                cwd: './build/components',
                src: '**/*.html',
                dest: 'app/js/templates.js',
                options: {
                    //usemin:'/js/templates.min.js',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives! 
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },


        open: {
            dev: {
                path: 'http://0.0.0.0:9001',
                //app: 'Google Chrome'
            },
        },

        sass: {
            build: {
                files: {
                    //'app/css/style.css': 'build/components/**/*.scss'
                    'app/css/style.css': 'build/scss/.tmp.scss'
                }
            }
        },

        wiredep: {
            task: {
                src: [
                    'app/index.html', // .html support...
                ],
                options: {
                    cwd: './app',
                },
                fileTypes: {
                    html: {
                        block: /(([\s\t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                        detect: {
                            js: /<script.*src=['"](.+)['"]>/gi,
                            css: /<link.*href=['"](.+)['"]/gi
                        },
                        replace: {
                            js: '<script src="/{{filePath}}"></script>',
                            css: '<link rel="stylesheet" href="/{{filePath}}" />'
                        }
                    }
                }

            }
        },
        //Build Stuff
        cssmin: {
            build: {
                files: {
                    'dist/css/style.min.css': ['app/css/style.css']
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/**',
                    ],
                    dest: 'dist'
                }, {
                    expand: true,
                    cwd: 'app/bower_components/font-awesome/fonts',
                    src: ['*.*'],
                    dest: 'dist/fonts'
                }],
            },
        },

        htmlmin: {
            finish: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: [
                        'index.html',
                    ],
                    dest: 'dist'
                }]
            },

        },

        //Concatenate all the build js files
        concat: {
            js: {
                src: ['build/components/**/*.js'],
                dest: 'app/js/app.js',
            },
            sass:{
                src: ['build/scss/style.scss', 'build/components/**/*.scss'],
                dest: 'build/scss/.tmp.scss',
            }
        },

        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },


        usemin: {
            html: ['dist/{,*/}*.html', 'dist/{,*/}*.ejs'],
            css: ['dist/css/{,*/}*.css'],
            js: ['dist/js/{,*/}*.js'],
            options: {
                dirs: ['dist']
            }
        },

        autoprefixer: {
            single_file: {
                src: 'app/css/style.css',
                dest: 'app/css/style.css'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            build: {
                src: 'app/js/app.js',
                dest: 'dist/js/app.min.js'
            },
            templates: {
                src: 'app/js/templates.js',
                dest: 'dist/js/templates.min.js'
            }
        }
    });

    grunt.registerTask('default', ['connect', 'open:dev', 'watch']);
    //grunt.registerTask('build', ['copy:build', 'htmlmin:build', 'uglify:build', 'cssmin:build']);
    grunt.registerTask('build', ['useminPrepare', 'concat', 'copy', 'cssmin', 'htmlmin', 'uglify', 'usemin']);

    //'autoprefixer', 'cssmin'


};