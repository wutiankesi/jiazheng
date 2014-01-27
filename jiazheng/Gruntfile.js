module.exports = function(grunt) {
    
    var CSS_WATCH_MAP = {
        "src/css/home.css" : "src/css/less/home.less",
        "src/css/list.css" : "src/css/less/list.less",
        "src/css/detail.css" : "src/css/less/detail.less",
        "src/css/channel.css" : "src/css/less/channel.less"
    };
    var CSS_DEV_MAP = {
        "dist/css/home.css" : "src/css/less/home.less",
        "dist/css/list.css" : "src/css/less/list.less", 
        "dist/css/detail.css" : "src/css/less/detail.less",
        "src/css/channel.css" : "src/css/less/channel.less"
    };
    var CSS_PRD_MAP = {
        "min/css/home.css" : "src/css/less/home.less",
        "min/css/list.css" : "src/css/less/list.less",
        "min/css/detail.css" : "src/css/less/detail.less",
        "src/css/channel.css" : "src/css/less/channel.less"
    };
    var JS_DEV_MAP = {
		"dist/js/home/home.js": ['.build/js/home/home.js'],
		"dist/js/list/list.js": ['.build/js/list/list.js']
    };
    var JS_PRD_MAP = {
		"min/js/home/home.js": ['dist/js/home/home.js'],
		"min/js/list/list.js": ['dist/js/list/list.js']
    };
    function pwd(err, stdout, stderr, cb){
        return "imvvk123";
    };
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        key : grunt.file.readJSON('key.json'),
		transport: {
			options: {
                path : ["."],
                alias : '<%= pkg.spm.alias %>'
			},
			target: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['js/**/*.js','!js/config/**/*.js'],
					dest: '.build/'
				}]
			}
		},

		concat: {
            
            base : {
                options : {
                    separator : ";",
                    noncmd: true
                },
                files : [
                    {
                        src : ['sea-modules/seajs/seajs/2.1.1/sea.js','sea-modules/jquery/jquery/1.10.1/jquery.js'],
                        dest : 'dist/base/js/c.js'
                    }
                ]
            },
            config : {
                options : {
                    separator : ";",
                    noncmd: true
                },
                files : [
                    {
                     expand : true,
                     cwd : 'src/',
                     src : ['js/config/**/*.js'],
                     dest : 'dist/'
                    }
                ]
            },
			site : {
				options: {
                    path : ["."],
					include: "relative"
				},
				files: [{
                    expand: true,
                    cwd : '.build/',
                    src : ['js/**/*.js','!js/config/**/*.js'],
                    dest : 'dist/'
                }]
			}
		},
        less : {
            watch : {
                files : CSS_WATCH_MAP,
                options : {
                    cleancss : false
                }
            },
            dev : {
                files : CSS_DEV_MAP,
                options : {
                    cleancss : false
                }
            },
            prd : {
                files : CSS_PRD_MAP,
                options : {
                    cleancss : true
                }
            }
        },
        copy: {
            base : {
                files: [
                // includes files within path 
                    {expand: true, cwd: 'src/css/base/',src: ['*.css'], dest: 'dist/base/css/', filter: 'isFile'}
                ]
            },
            config : {
                files : [
                    {expand: true, cwd : 'src/js/config/',src: ['**/*.js'], dest: 'dist/base/config/', filter: 'isFile'}
                ]
            }
        },    
        watch: {
            css : {
                files: [
                    'src/css/less/**/*.less'
                ],
                tasks: [
                    'less:watch'
                ]
            },
            js : {
                files : ['src/js/config/**/*.js'],
                tasks : ['copy:config']
            } 
        },

		clean: {
			build: ['.build'] // clean .build directory  
		},
        uglify : {
            minifyJS : {
                expand : true,
                cwd : 'dist',
                src : ['js/**/*.js'],
                dest : 'min/'
            }
        },
		scp: {
			options: {
				//host: '118.244.233.121',
				host: '106.187.36.212',
				username: '<%= key.usr %>',
				password: '<%= key.key %>',
                port : 2222
                //port : 22000
			},
            base : {
                files : [{
                    expand : true,
                    cwd : 'dist/base/',
                    src : ['css/**/*','js/**/*'],
                    dest : '/home/q/www/source/<%= pkg.name %>/base/' 
                }]
            },
            config : {
                files :[
                    {
                        expand:true,
                        cwd : 'dist/base/',
                        src : ['config/**/*.js'],
                        dest : '/home/kai.wei/source/<%= pkg.name %>/base/' 
                    }
                ]
            },
            image : {
                files : [{
                    cwd : 'src/image/',
                    src : '*',
                    dest : '/home/kai.wei/source/image/<%= pkg.name %>/' 
                }]
            },
			site: {
                options : {
                },
				files: [{
					cwd: 'dist',
					src: ['js/**/*.js','css/**/*.css','!js/**/*-debug.js'],
					filter: 'isFile',
					// path on the server
					dest: '/home/q/www/source/<%= pkg.name %>/'
				}]
			},
            html : {
                files :[{
                   expand : true,
                   cwd : 'html',
                   src : ['**/*'],
                   filter : 'isFile',
                   dest : '/home/q/www/source/<%= pkg.name %>/html/'
                }]
            }
		}

	});

	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-scp');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-ssh');

    grunt.registerTask('base',['concat:base','copy:base','copy:config']);
	grunt.registerTask('default', ['transport','concat:site']);
	grunt.registerTask('build_dev', ['transport','concat:site','less:dev','clean']);
    grunt.registerTask('build',['transport','concat:site','uglify','less:prd','clean']);
    grunt.registerTask('sync',['scp:site','scp:html']);
    
};

