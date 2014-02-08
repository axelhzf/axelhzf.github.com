---
layout: post
title: "Ampliando el módulo de Google Guice"
date: 2012-02-04 22:34
tags: [java, playframework, guice]
---

Como comenté al final de mi [post](http://axelhzf.tumblr.com/post/16930248351/play-framework-google-guice) anterior mi intención era añadir al módulo de play las clases que añaden el scope LazySingleton.

Los cambios están en este [commit](https://github.com/axelhzf/play-guice-module/commit/30af78bb96c7561a529ac578ff93d2b49a1e5492).

Añadí a la clase *GuiceSupport* una variable con el stage en función del modo en el que se está ejecutando play y creé la clase *PlayAbstractModule* que incluye el método *bindLazySingletonOnDev*.

Para utilizarlo:

conf/dependencies.yml
```
require:
    - play
    - axelhzf -> guice 1.3

repositories:
    - axelhzf-guice-repository:
        type: http
        artifact: "http://cloud.github.com/downloads/axelhzf/play-guice-module/guice-[revision].zip"
        contains:
            - axelhzf -> guice
```

Configurar el inyector

GuiceConfig.java
```java
    public class GuiceConfig extends GuiceSupport {
        @Override
        protected Injector configure() {
            return Guice.createInjector(stage, new PlayAbstractModule() {
                @Override
                protected void configure() {
                    bindLazySingletonOnDev(MyService.class, MyServiceImpl.class);
                    bindLazySingletonOnDev(MyDependentService.class, MyDependentServiceImpl.class);
                }
            });
        }
    }
```