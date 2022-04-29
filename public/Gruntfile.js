module.exports = function (grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8000,
                    livereload: 35729,
                    hostname: 'localhost',
                    base: '.',
                    open: true,
                    keepalive: true
                },
            },
        },

        watch: {
            sass: {
                files: 'styles/*.scss',
                tasks: ['css']
            },
            concat: {
                files: [
                    'scripts/utilities/endGate.js',
                    'scripts/utilities/*.js',
                    'scripts/game.js',
                    'scripts/gameScreen.js',
                    'scripts/main.js',
                    'scripts/debug/*.js',
                    'scripts/configuration/*.js',
                    'scripts/server/*.js',
                    'scripts/user/*.js',
                    'scripts/cursor/*.js',
                    'scripts/HUD/*.js'
                ],
                tasks: ['concat']
            },
            uglify: {
                files: 'build/built.js',
                tasks: ['uglify']
            },

            options: {
                livereload: true
            }

        },

        concat: {
            options: {
                separator: '\n/*next file*/\n\n'
            },
            dist: {
                src: [
                    'scripts/utilities/endGate.js',
                    'scripts/utilities/*.js',
                    'scripts/game.js',
                    'scripts/gameScreen.js',
                    'scripts/main.js',
                    'scripts/debug/*.js',
                    'scripts/configuration/*.js',
                    'scripts/server/*.js',
                    'scripts/user/*.js',
                    'scripts/cursor/*.js',
                    'scripts/HUD/*.js'
                ],
                dest: 'build/built.js'
            }
        },

        uglify: {
            build: {
                files: {
                    'build/built.min.js': ['build/built.js']
                }
            }
        },

        cssmin: {
            build: {
                src: 'styles/main.css',
                dest: 'styles/main.min.css'
            }
        },

        sass: {
            dev: {
                files: {
                    // destination     // source file
                    'styles/main.css': 'styles/main.scss'
                }
            }
        }
    });

    // Default task
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['sass', 'cssmin']);
    grunt.registerTask('js', ['concat', 'uglify']);

    // Start web server
    grunt.registerTask('serve', [
        'connect:server',
        'watch'
    ]);

    // Load up tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');

};