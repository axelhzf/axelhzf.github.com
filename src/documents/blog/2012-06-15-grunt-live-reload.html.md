---
layout: post
title: "Grunt Live-Reload"
date: 2012-06-15 23:34
tags: [javascript, grunt, js, live-reload]
disqusId: "http://axelhzf.github.com/blog/2012/06/15/grunt-live-reload/"
---

![Grunt Reload](/images/posts/grunt-reload.jpg)

## LiveReload

[LiveReload](http://livereload.com/) es una aplicación genial. Su funcionalidad es muy sencilla, se encarga de refrescar el navegador automáticamente mientras estas desarrollando. Imagina que estas trabajando en el diseño de una web y estas haciendo pequeñas modificaciones en los estilos para ver cómo va quedando el diseño. Para visualizar cada pequeño cambio es necesario cambiar a la ventana del navegador y refrescar las página. Livereload elimina ese cambio de contexto, monitoriza los ficheros fuentes y cuando detecta que se ha modifica un fichero fuerza a que el navegador se actualice automáticamente.


LiveReload trae incorporado varios preprocesadores como por ejemplo CoffeeScript, LESS o SASS. Esto ya se vuelve mucho más interesante, puedes estar modificando un fichero less y el cambio se refleja automáticamente en el navegador. Sin tener que compilar manualmente ese fichero. Esto es una clara ventaja a utilizar las herramientas de desarrollo del navegador para probar los cambios de diseño y luego llevar esos cambios al fichero.

LiveReload está disponible para OS X en la App Store por $9.99 y para windows está en versión beta. 

Si prefieres no utilizar una aplicación con GUI, en la página recomiendan utilizar [guard-livereload](https://github.com/guard/guard-livereload). Una librería escrita en ruby que permite hacer de servidor livereload. En este post explican cómo configurarlo: [http://icoloma.blogspot.com.es/2012/06/using-livereload-on-linux.html](http://icoloma.blogspot.com.es/2012/06/using-livereload-on-linux.html)

### Desventajas de utilizar LiveReload

El principal problema que le encuentro a LiveReload es que no se integra con el ciclo de compilación de la aplicación. Es una aplicación externa que duplica la configuración de los preprocesadores. Por un lado está la configuración en grunt, para empaquetar la aplicación y por otro lado livereload para hacer el desarrollo más cómodo. Mantener la misma configuración en dos sitios distintos puede llevar a errores de sincronización.

## grunt-reload

Buscando entre los plugins que tiene grunt encontré uno que hace una funcionalidad similar,  se llama [grunt-reload](https://github.com/webxl/grunt-reload). Para que funcione no hace falta instalar ninguna extensión en el navegador y lo mejor de todo es que es completamente gratis.

### Configuración de un proyecto usando grunt-reload

Lo primero, ya que vamos a trabajar con grunt, debemos tener instalado [node.js y NPM](http://nodejs.org/#download).

Para el proyecto de ejemplo vamos a ver como integrar [grunt-less](https://github.com/jharding/grunt-less) y [grunt-reload](https://github.com/webxl/grunt-reload). Lo primero que vamos a hacer es crear un fichero `package.json` donde vamos a configurar las dependencias del proyecto. Para la gente que viene del mundo de Java, este fichero es el equivalente al `pom.xml` de maven.

package.json
```javascript
{
    "name" : "post-grunt-reload",
    "description" : "Source code from post",
    "author" : "Axel Hernández Ferrera <axelhzf@gmail.com>",
    "version" : "0.0.1",
    "dependencies" : {
        "grunt" : ">= 0.3.9",
        "grunt-less" : ">= 0.1.5",
        "grunt-reload" : ">= 0.1.2"
    },
    "engine" : "node 0.6.0"
}
```

Ya tenemos las dependencias definidas, para instalarlas:

    npm install

Ahora vamos a preparar un ejemplo sencillo que utilice less:

index.html
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="msg">This page reload automatically when a file is modified :D</div>
</body>
</html>
```

style.less
```css
@bgColor: #ff5412;
@textColor: #fff;

.msg {
    background-color: @bgColor;
    color: @textColor;
}
```

Por último nos queda configurar grunt para integrar las dos tasks.

grunt.js
```javascript
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        less: {
            all: {
                src: 'style.less',
                dest: 'style.css'
            }
        },
        watch : {
            files : '<config:less.all.src>',
            tasks : 'less reload'
        },

        reload: {
            proxy: {}
        },
        server : {
            port : 8000
        }
    });

    // External tasks
    grunt.loadNpmTasks('grunt-less');
    grunt.loadNpmTasks('grunt-reload');

    // Custom tasks names
    grunt.registerTask('default', 'less');
    grunt.registerTask('dev', 'server reload watch');
};
```

Ejecutando el comando

    grunt dev

Se arrancará un servidor en el puerto 8000 y un proxy en el 8001. Accediendo a [http://localhost:8001/](http://localhost:8001/) con un navegador que tenga soporte para websockets, los cambios que hagamos en el fichero .less producieran que se actualice la página automáticamente. El último paso y más importante es buscar un monitor lo suficientemente grande donde quepa el editor de texto y el navegador a la vez.

## ¿Cómo funciona?

![Grun Live Reload diagram](https://docs.google.com/drawings/pub?id=1cDIetWqZmVvZzag7ec1QhhbNGkbUa-wCCFNWz2cFvL4&amp;w=960&amp;h=720)

El funcionamiento es muy sencillo. Al ejecutar el comando `grunt dev` se lanza un servidor, en el puerto 8000, un proxy en el puerto 80001 y un servidor que se encargará de gestionar las conexiones de webscokets.

La función del reload proxy es inyectar un javascript en la página. Este javascript se va a encargar de las funciones de livereload. Cuando se cargue la página abrirá una conexión con el servidor websocket.

Cuando la tarea grunt watch detecte cambios en alguno de los ficheros que está monitorizando, ejecutará los preprocesadores que tengamos configurados y llamará a la tarea reload. Esta tarea se comunicará con el servidor de webscoket para informarle de que hay que reiniciar la página. El servidor de webscoket se comunicará con todos los navegadores que tengan una conexión abierta enviándoles un mensaje de reload. El javascript inyectado es el que va a forzar la actualización de la página cuando reciba este mensaje.

Aquí tienes una lista de navegadores que soportan websockets

[http://caniuse.com/#feat=websockets](http://caniuse.com/#feat=websockets)

