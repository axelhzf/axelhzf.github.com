module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-less');

    grunt.initConfig({

        less:{
            app:{
                src:'less/bootstrap.less',
                dest:'source/stylesheets/main.css'
            }
        },

        watch:{
            files:'less/*.less',
            tasks:'less'
        }

    });
    grunt.registerTask('default', 'less');
};