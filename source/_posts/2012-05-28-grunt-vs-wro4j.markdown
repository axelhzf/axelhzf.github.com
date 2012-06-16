---
layout: post
title: "Grunt vs Wro4j"
date: 2012-05-28 22:01
comments: true
categories: [grunt, wro4j, js, v8, rhino]
---

En el post anterior hice la siguiente afirmación sin dar ningún dato:

{% blockquote %}
He probado algunas otras herramientas que tienen el mismo objetivo, como por ejemplo wro4j, pero grunt es mucho más rápido.
{% endblockquote %}
	
En realidad no había hecho ninguna prueba, fue la sensación que tuve al utilizar las dos herramientas. [Alex Objelean](http://www.twitter.com/alexobjelean), el creador de wro4j, escribió un comentario preguntando si había hecho alguna prueba de rendimiento. Para ser justos me decidí a hacer una comparativa.

<!-- more -->

## Máquina de pruebas

* Intel Core 2 Duo 2,66 GHz
* 4GB DDR3
* OS X Lion 10.7.4

## Pruebas

La prueba consistió en compilar :

* [jquery 1.7.2](http://code.jquery.com/jquery-1.7.2.js)
* [underscore 1.3.3](http://underscorejs.org/underscore.js)
* [backbone 0.9.2](http://backbonejs.org/backbone.js)
* [twitter bootstrap less](https://github.com/twitter/bootstrap/tree/master/less)

## Proyectos

### Grunt

	.
	├── grunt.js
	└── src
	    ├── js
	    │   ├── backbone.js
	    │   ├── jquery-1.7.2.js
	    │   └── underscore.js
	    └── less
	        ├── *bootstrap.less


{% codeblock  grunt.js lang:js %}
module.exports = function (grunt) {
    grunt.initConfig({
        concat : {
            dist : {
                src : ['src/js/jquery-1.7.2.js', 'src/js/underscore.js', 'src/js/backbone.js'],
                dest : 'dist/built.js',
                separator : ';'
            }
        },
        min : {
            dist : {
                src : ['dist/built.js'],
                dest : 'dist/built.min.js'
            }
        },
        recess : {
            dist : {
                src : 'src/less/bootstrap.less',
                dest : 'dist/bootstrap.css',
                options : {
                    compile : true,
                    compress : true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-recess');
    grunt.registerTask('default', 'concat min recess');
};
{% endcodeblock %}

### Wro4j

	.
	├── pom.xml
	├── wro.xml
	├── wro.properties
	└── src
	    ├── js
	    │   ├── backbone.js
	    │   ├── jquery-1.7.2.js
	    │   └── underscore.js
	    └── less
	        ├── *bootstrap.less


{% codeblock  pom.xml lang:xml %}
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.axelhzf</groupId>
    <artifactId>grunt-vs-wro4j</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>
    <dependencies>
        <dependency>
            <groupId>ro.isdc.wro4j</groupId>
            <artifactId>wro4j-maven-plugin</artifactId>
            <version>1.4.6</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>ro.isdc.wro4j</groupId>
                <artifactId>wro4j-maven-plugin</artifactId>
                <version>1.4.6</version>
                <executions>
                    <execution>
                        <phase>compile</phase>
                        <goals>
                            <goal>run</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <wroFile>wro.xml</wroFile>
                    <extraConfigFile>wro.properties</extraConfigFile>
                    <wroManagerFactory>ro.isdc.wro.maven.plugin.manager.factory.ConfigurableWroManagerFactory
                    </wroManagerFactory>
                    <destinationFolder>${basedir}/dist</destinationFolder>
                    <targetGroups>all</targetGroups>
                    <contextFolder>${basedir}</contextFolder>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
{% endcodeblock %}

{% codeblock  wro.xml lang:xml %}
<groups xmlns="http://www.isdc.ro/wro">
    <group name="all">
        <css>/src/less/bootstrap.less</css>
        <js>/src/js/underscore.js</js>
        <js>/src/js/backbone.js</js>
    </group>
</groups>
{% endcodeblock %}

{% codeblock  wro.properties lang:js %}
preProcessors=cssImport
postProcessors=lessCss, uglifyJs
{% endcodeblock %}

## Ejecución

{% codeblock grunt lang:bash %}
axel:grunt axelhzf$ time grunt
Running "concat:dist" (concat) task
File "dist/built.js" created.

Running "min:dist" (min) task
File "dist/built.min.js" created.
Uncompressed size: 343428 bytes.
Compressed size: 42680 bytes gzipped (123542 bytes minified).

Running "recess:dist" (recess) task
File "dist/bootstrap.css" created.
Uncompressed size: 97585 bytes.
Compressed size: 13496 bytes gzipped (81938 bytes minified).

Done, without errors.

real	0m5.620s
user	0m4.534s
sys	0m0.177s
{% endcodeblock %}

{% codeblock wro4j lang:bash %}
axel:wro4j axelhzf$ mvn compile
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building grunt-vs-wro4j 1.0
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- maven-resources-plugin:2.4.3:resources (default-resources) @ grunt-vs-wro4j ---
[WARNING] Using platform encoding (MacRoman actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/src/main/resources
[INFO] 
[INFO] --- maven-compiler-plugin:2.3.2:compile (default-compile) @ grunt-vs-wro4j ---
[INFO] No sources to compile
[INFO] 
[INFO] --- wro4j-maven-plugin:1.4.6:run (default) @ grunt-vs-wro4j ---
[INFO] Executing the mojo: 
[INFO] Wro4j Model path: /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/wro.xml
[INFO] targetGroups: all
[INFO] minimize: true
[INFO] ignoreMissingResources: true
[INFO] destinationFolder: /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/dist
[INFO] jsDestinationFolder: null
[INFO] cssDestinationFolder: null
[INFO] groupNameMappingFile: null
[INFO] folder: /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/dist
[INFO] processing group: all.css
[INFO] wroManagerFactory class: ro.isdc.wro.maven.plugin.manager.factory.ConfigurableWroManagerFactory
[INFO] file size: all.css -> 97585 bytes
[INFO] /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/dist/all.css (97585 bytes)
[INFO] folder: /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/dist
[INFO] processing group: all.js
[INFO] file size: all.js -> 39532 bytes
[INFO] /Users/axelhzf/dev/js/grunt-vs-wro4j/wro4j/dist/all.js (39532 bytes)
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1:11.501s
[INFO] Finished at: Mon May 28 22:22:50 WEST 2012
[INFO] Final Memory: 8M/81M
[INFO] ------------------------------------------------------------------------
{% endcodeblock %}

## Conclusión

La diferencia de tiempos es considerable. Creo que la principal diferencia entre las dos herramientas es el motor de javascript que utilizan. Wro4j usa [rhino](http://www.mozilla.org/rhino/) mientras que grunt utiliza [v8](http://code.google.com/p/v8/). En [este artículo](http://axtaxt.wordpress.com/2011/09/25/benchmark-rhino-vs-chrome-v8-on-server-side/) se realiza una comparativa de rendimiento de los dos motores.