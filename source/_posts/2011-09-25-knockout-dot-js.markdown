---
layout: post
title: "knockout.js"
date: 2011-09-25 22:01
comments: true
categories: [knockout.js, javascript]
---

[knockout.js](http://knockoutjs.com/) es una librería javascript que implementa el patrón Model View View-Model.

### Patrón Model View View-Model

Patrón Model View View-Model (MVVM) es un patrón diseñado para construir interfaces de usuario.
Describe cómo mantener de una forma simple una interfaz de usuario sofisticada dividiéndola en tres partes:

- Model: Los datos de la aplicación.
- View-Model : Representación de los datos y las operaciones de la interfaz gráfica. No es la interfaz de usuario en sí, no tiene los conceptos de botones o estilos.
- Vista : Representación gráfica del estado del View-Model. Muestra la información del View-Model y envía comandos para ejecutar las acciones.

### Aplicado a Knockout.js

- Modelo : Normalmente llamadas Ajax para leer o escribir en el servidor.
- View-Model : Código javascript puro.
- Vista : Código HTML con "bindings" declarativos para enlazar el view-model. También se pueden utilizar templates para generar el código html.

### Ejemplo

[http://jsfiddle.net/h7tgN/](http://jsfiddle.net/h7tgN/)

En el ejemplo tenemos un campo de texto donde estamos escribiendo en la variable valor. La variable se esta actualizando automáticamente cuando se presiona una tecla. Después tenemos una etiqueta span donde estamos mostrando el contenido de la variable. Vemos que a medida que vamos escribiendo en el campo de texto se va actualizando la etiqueta.

Recomiendo que pruebes los tutoriales de knockout.js [http://learn.knockoutjs.com/](http://learn.knockoutjs.com/). Están bastante trabajados y tienen una web donde puedes ir probando el código en la página web directamente y viendo los resultados.

Nota : El contenido de este post pertenece a un curso de desarrollo de aplicaciones web con Play Framework que daré del 3 al 7 de octubre.