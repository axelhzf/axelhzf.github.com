---
layout: post
title: "Creando una presentación con HTML+CSS+JS"
date: 2011-06-19 20:58
tags: [javascript, landslide, html]
---

Me encanta la presentación [html5rocks](http://slides.html5rocks.com/). Es interactiva,
puedes ir probando todo lo que va explicando. Incluso dibujar un Doraemon en la diapositiva 47.
Lo mejor de todo es que crearon un generador de diapositivas y nosotros mismos podemos crear diapositivas de este tipo.

## Proyecto

El proyecto se llama **landslide** y se puede descargar de
[https://github.com/n1k0/landslide](https://github.com/n1k0/landslide)

## Instalación

En la página principal están las instrucciones de instalación. Hay varias opciones, la que yo seguí fue clonar el repositorio e instalar

```bash
git clone git://github.com/n1k0/landslide.git
cd landslide
python setup.py build
sudo python setup.py install
```


## Creando la presentación

Las presentaciones se escriben con [markdown](http://daringfireball.net/projects/markdown/syntax).
Este formato se está popularizando bastante, por ejemplo tumblr ya tiene soporte y es el formato con el
que estoy escribiendo el post.

```html

# Título de la presentación
---
## Primera diapositiva

Contenido de la diapositiva

---
## Segunda diapositiva

Contenido de la **segunda** diapositiva
```

Esta es una presentación bastante simple. Cada diapositiva va separada con --- y el título de la diapositiva con ##

## Compilando la presentación
Para poder ver la presentación tenemos que compilarla para que se cree el html.

    landslide presentacion.md

Esto genera un archivo presentation.html, lo abrimos con el navegador y ya tenemos nuestra presentación.

![landslice](/images/posts/landslide.png)