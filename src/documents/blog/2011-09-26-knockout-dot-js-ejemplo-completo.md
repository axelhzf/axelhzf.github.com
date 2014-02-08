---
layout: post
title: "knockout.js (Ejemplo completo)"
date: 2011-09-26 22:05
tags: [knockout.js, javascript]
---

En el anterior post hice un pequeña [introducción a la librería knockout.js](http://axelhzf.tumblr.com/post/10638045853/knockout).  Este post, continuación del anterior, tiene un ejemplo más completo en el cual espero que se vea mejor la utilidad de la librería. En el ejemplo crearemos una tabla de Posts, donde mostraremos el título y el texto. Le añadiremos a la tabla filtrado y edición inline. Con esto veremos cómo utilizar variables observables, dependentObservables y observableArrays.
También haremos uso de jquery tmpl para renderizar la vista.

Este post también forma parte del curso de desarrollo de aplicaciones web con Play.

Prueba el ejemplo completo en [http://jsfiddle.net/9mSBY/](http://jsfiddle.net/9mSBY/)

### Esqueleto de la página

Enlazamos los css y js que vamos a utilizar:

* Twitter Bootstrap (Para el aspecto de la página)
* jQuery
* jQuery tmpl
* knockout.js

```html
<!doctype html>
<html>
<head>
    <title></title>

    <link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css">

    <script type="text/javascript " src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
    <script type="text/javascript" src="http://cloud.github.com/downloads/SteveSanderson/knockout/jquery.tmpl.min.js"></script>
    <script type="text/javascript" src="http://cloud.github.com/downloads/SteveSanderson/knockout/knockout-1.2.1.js"></script>
</head>
<body>
</body>
</html>
```


### Tabla

Añadimos la tabla donde mostraremos el listado de Post en 3 columnas. La primera de selección, la segunda el título y luego el texto.

```html
<div class="container">
    <table>
        <thead>
        <tr>
            <th></th>
            <th>Title</th>
            <th>Text</th>
        </tr>
        </thead>
        <tbody />
    </table>
</div>
```

### ViewModel

El viewModel contará con un listado de post que se mostrarán en la tabla

```html
<script>
     function containsIgnoreCase(s, q){
        return s.toLowerCase().indexOf(q.toLowerCase()) != -1;
     }

     function Post(title, text){
        this.title = ko.observable(title);
        this.text = ko.observable(text);
        this.selected = ko.observable(false);

        this.containsText = function(query){
            return containsIgnoreCase(this.title(), query)
                || containsIgnoreCase(this.text(), query);
        }
     }

     var viewModel = {
        posts : ko.observableArray([])
     }

     viewModel.posts.push(new Post('title1', 'text1'));
     viewModel.posts.push(new Post('title2', 'text2'));

     ko.applyBindings(viewModel);
</script>
```

En la clase Post se han definido los 3 campos como variables observables, para que los cambios que se hagan en esas variables se actualicen automáticamente. En el viewModel hemos definido un observableArray con el listado de post. Añadimos a esta lista dos posts de ejemplo.

Para mostrar los posts en la tabla. Creamos una nueva plantilla que mostrará el contenido de cada fila.

```html
<script type="text/html" id="postRow">
    <tr>
        <td><input type="checkbox" data-bind="checked: selected" /></td>
        <td>${title}</td>
        <td>${text}</td>
    </tr>
</script>
```

Y añadimos en binding en la tabla para que renderice la plantilla "postRow" con el listado de "posts".

```html
<tbody data-bind="template : {name : 'postRow', foreach: posts}" />
```

Con este código ya tenemos sincronizada la tabla con la lista de Posts. Para hacer una prueba podemos abrir la consola javascript y añadir un nuevos post.

```javascript
viewModel.posts.push(new Post('prueba', 'desde la consola de javascript!');
```

La tabla se tiene que haber actualizado automáticamanete con la nueva fila añadida.


### Filtrado

Para añadir filtrado de la tabla vamos a almacenar dos arrays, uno con la lista de posts completos y otro con la lista de posts filtrados.

Añadimos un campo de texto donde vamos a escribir el filtro. El evento por defecto que actualiza el viewModel es cuando pierde foco. Para hacer un filtrado en tiempo real podemos cambiar el evento de actualización a 'afterkeydown'.

```html
<div class="container">
    ...

    <form>
    <div class="clearfix">
        <input class="xxlarge" type="text" data-bind="value : filterQuery, valueUpdate:'afterkeydown'" placeholder="Filter"/>
    </div>
    </form>
</div>
```

Modificamos el viewModel para añadir el texto por el que se filtra y la lista de posts filtrados. Definimos la variable filteredPost como dependentObservable, de esta forma, cada vez que se actualice la lista de post, se volverá a evaluar la lista de post filtrados. En el caso de que el filtro esté vacio, mostramos la lista de todos los posts.

```html
var viewModel = {
    posts : ko.observableArray([]),
    filterQuery : ko.observable('')
}

viewModel.filteredPosts = ko.dependentObservable(function(){
    var query = this.filterQuery();
    if(query){
        var filtered = [];
        $.each(viewModel.posts(), function(i, post){
            if(post.containsText(query)){
                filtered.push(post);
            }
        });
        return filtered;
    }
    //Not filtering
    return viewModel.posts();
}, viewModel);
```

Modificamos el binding de la tabla para mostrar la lista de posts filtrados.

```html
<tbody data-bind="template : {name : 'postRow', foreach: filteredPosts}" />
```

### Edición inline

Para permitir la edición inline vamos a añadir una nueva variable que nos indique si estamos en modo edición. En el modo de edición, en la tabla aparecerán campos de texto donde el usuario podrá modificar las filas. También añadiremos un botón de nuevo y un botón para borrar las filas seleccionados.

Botones para realizar las acciones.

```html
<div class="container">
    ...

    <form>
    <div class="clearfix">
            <a href="#" class="btn primary" data-bind="click : newPost">New post</a>
            <a href="#" class="btn primary" data-bind="visible: editMode, click: toggleEditMode">Save</a>
            <a href="#" class="btn" data-bind="visible: !editMode(), click : toggleEditMode">Edit</a>
            <a href="#" class="btn danger" data-bind="click : deletePosts">Delete</a>
    </div>
     ...
```

La plantilla muestra el texto o un input dependiendo del campo editMode.


```html
<script type="text/html" id="postRow">
    <tr>
        <td><input type="checkbox" data-bind="checked: selected" /></td>
        {{if viewModel.editMode()}}
            <td><input type="text" data-bind="value : title" /></td>
            <td><input type="text" data-bind="value : text" /></td>
        {{else}}
            <td>${title}</td>
            <td>${text}</td>
        {{/if}}
    </tr>
</script>
```


Añadimos las acciones al modelo.

```javascript
var viewModel = {
    posts : ko.observableArray([]),
    filterQuery : ko.observable(''),
    editMode : ko.observable(false)
}

viewModel.selectedPosts = ko.dependentObservable(function(){
    var result = [];
    $.each(this.posts(), function(i, post){
        if(post.selected()){
            result.push(post);
        }
    });
    return result;
}, viewModel);

viewModel.toggleEditMode = function(){
    viewModel.editMode(!viewModel.editMode());
}

viewModel.newPost = function(){
    viewModel.posts.push(new Post('',''));
    viewModel.editMode(true);
}

viewModel.deletePosts = function(){
    viewModel.posts.removeAll(viewModel.selectedPosts());
}
```

Declarando la variable selectedPosts como dependentObservable nos aseguramos que esté sincronizada con la lista de posts. A la hora de borrar los posts de la lista utilizamos la función removeAll y le pasamos la lista completa de posts seleccionados.

### Conclusiones

En el ejemplo hemos visto como podemos utilizar knockout.js para tener sincronizada la interfaz de usuario con el modelo. Haciendo uso de variables dependientes y bindings hemos conseguido darle comportamiento dinámico a una tabla estática. En pocas lineas de código hemos conseguido que nuestra tabla sea completamente editable y filtrable.

Falta ver como sincronizar nuestro modelo con el servidor por medio de llamadas ajax. Lo dejo pendiente para un futuro artículo.

Puedes ver el código completo en [http://jsfiddle.net/9mSBY/](http://jsfiddle.net/9mSBY/)
