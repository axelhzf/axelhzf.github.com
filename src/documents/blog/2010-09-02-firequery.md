---
layout: post
title: "FireQuery"
date: 2010-09-02 20:39
tags: [firequery, firebug, firefox, jquery, javascript, megaupload,vagos.es]
---

[FireQuery](http://firequery.binaryage.com/) es un plugin para Firefox que se integra con Firebug.
Permite inyectar jquery en cualquier página web, tiene muchas otras [características](http://firequery.binaryage.com/#features)
, pero esta era justo la que estaba buscando cuando encontré el plugin.

Un uso práctico de este plugin sería extraer todos los links de megaupload de una página.
Pongamos que queremos bajarnos [Dos hombre y medio](http://www.imdb.com/title/tt0369179/) desde esta página
[http://www.vagos.es/showthread.php?t=842744](http://www.vagos.es/showthread.php?t=842744).
Lo único que tenemos que hacer es abrir la consola de Firebug e inyectar jquery dándole al botón “jQuerify”.
Con un poquito de magia de jQuery podemos extraer todos los enlaces de megaupload de la página:

``` javascript
$('a:contains("megaupload")').each(function(i, e){
    console.log($(e).attr('href'));
});
```

![FireQuery](/images/posts/firequery.png)