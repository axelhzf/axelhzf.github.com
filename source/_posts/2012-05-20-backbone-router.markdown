---
layout: post
title: "Backbone Router"
date: 2012-05-20 01:08
comments: true
categories: [javascript, backbone, router, pushstate]
published: false
---

Creación de aplicaciones completamente javascript necesita el concepto de rutas

Single-Page Application
http://en.wikipedia.org/wiki/Single-page_application

La idea de las aplicaciones Single-Page es traer todo el html, css y javascript cuando la aplicación carga o bajo demanda a medida que se interactúa con la página. Pero en ningún momento volver a hacer una petición al servidor de manera que refresque toda la página. Mediante ajax iremos obteniendo los datos e iremos haciendo actualizaciones parciales de la página. La principal ventaja de esta técnica es ofrecer una mejor experiencia al usuario, una navegación más fluida.

Uno de los problemas que tienen las páginas single-page es mantener la navegación que ha realizado el usuario. Cuando el usuario va desde la página A a la página B quiere que el botón de atrás del navegador le devuelva a la página A. Al igual que la url del navegador debe cambiar, de forma que sea boorkmarkeable. Esto se puede llevar a cabo mediante dos técnicas:

Hash-Based navigation

Esta técnica consiste en utilizar el hash # de las urls para mantener el estado de la navegación. Por ejemplo si la url

http://www.myapp.com

Cuando el usuario pulse un enlace que le lleve a la página B, la ruta cambiará a

http://www.myapp.com/#B

Para el navegador este cambio de url no le fuerza a recargar la página entera. Los hash para hacer navegación a elementos dentro de la misma página. De esta forma conseguimos que el botón de atrás funcione correctamente.

Por defecto los indexadores de los buscador no analizan estas urls. Si quieres que las indexes debes utilizar #!

https://developers.google.com/webmasters/ajax-crawling/docs/faq#whentousewhich

Por ejemplo twitter utiliza esta técnica:

Al entrar en 

https://twitter.com/axelhzf

Redirige automáticamente a

https://twitter.com/#!/axelhzf

Y medida que vas navegando únicamente cambia de la url la parte que está a la derecha del #.



HTML5 trajo una nueva API para poder manipular el historial del usuario de forma que ya no hace falta utilizar la navegación basada en Hash.

https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history

Utilizando esta nueva API mediante javascript podemos navegar de

http://www.myapp.com

a

http://www.myapp.com/B

Sin tener que realizar una nueva petición al servidor.

Utilizar esta técnica requiere cambios en el servidor. La petición a `/` y a `/B` deben renderizar la misma página y desde javascript se analiza la ruta, para saber que código debe ejecutar.

¿Qué navegadores lo soportan?

http://caniuse.com/#feat=history

(En esta tabla hay algo raro, la versión 2.2 y 2.3 de Android lo soportaban, pero la versión 3 y 4 no?)


¿Cómo utilizar esto con Backbone?

Backbone trae la clase Router que permite hacer la navegación de la aplicación

http://documentcloud.github.com/backbone/#Router

var router = Backbone.Router.extend({
  routes: {
    "":         "index",    
    "b":        "b",  
  },
  index: function() {
    ...
  },
  b: function(query, page) {
    ...
  }
});

Backbone.history.start();


Para navegar de una página a otra basta con poner un enlace a la nueva ruta

	<a href="#B">Go to B</a>

Al pulsar en el enlace se ejecutará la función b definida en el Router. 

Si queremos utilizer push state deems camber la última linea por

Backbone.history.start({pushState: true});

Backbone da soporte a los navegadores que no tienen pushState. En caso de que el navegador no tenga pushState cambiará de forma automática a navegación basada en hash.

La cosa se complica para cambiar de una pagina a otra.

	<a href="B">Go to B</a>
	
Poniendo un enlace de este tipo se cargará toda la página y eso no es lo que queremos. En vez de esto tenemos que ejecutar

	app.navigate("b", {trigger: true});

La opción `trigger` indica que queremos que se ejecute la función asociada en el router, además de cambiar la url.

Para simplicar la navegación, backbone-boilerplate propone utilizar este código

https://github.com/tbranyen/backbone-boilerplate/blob/master/app/main.js

 $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol &&
        href.indexOf("javascript:") !== 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events.  The Router's internal `navigate` method
      // calls this anyways.
      Backbone.history.navigate(href, true);
    }
  });

Lo que se hace es añadir un listener al evento click de los elementos a. De forma que al hacer click en un enlace de este tipo

<a href="B">Go to B</a> 

se llame a 

Backbone.history.navigate("B", true);

Si tenemos enlaces externos debemos añadirles el atributo data-bypass

<a href="http://enlaceExterno.com" data-bypass="">enlace externo</a>