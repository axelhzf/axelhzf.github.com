---
layout: post
title: "Play Framework + Google Guice"
date: 2012-02-02 22:18
tags: [java, playframework, guice]
---

En el proyecto en el que estoy trabajando actualmente empezamos a utilizar Google Guice. Para quien no lo sepa, Guice es un framework de inyección de dependencias. La idea básica de la inyección de dependencias consiste en sumistrar a una clase sus dependencias, en lugar de que sea esta quien tenga que instanciarlas.

Play cuenta con un módulo para integrar Guice:

[http://www.playframework.org/modules/guice-1.2/home]()

Además de la propia documentación del módulo, está este post de [@_felipera](http://www.twitter.com/_felipera) que te puede ayudar a dar los primeros pasos:

[http://geeks.aretotally.in/dependency-injection-with-play-framework-and-google-guice]()


Los pasos para empezar a utilizar Guice en tu proyecto play son:

* Añadir la dependencia del módulo:

```
require:
- play
- play -> guice 1.2
```

* Descargar las dependencias

```bash
play deps
```

* Crear una nueva clase que será la que se inyectará en el controlador.


services.MyService.java
```java
package services;
public interface MyService {
    public void sayHello();
}
```


services.MyServiceImpl.java
```
package services;
public class MyServiceImpl implements MyService {
    public MyServiceImpl(){
        play.Logger.info("Constructor!");
    }
    @Override
    public void sayHello() {
        play.Logger.info("hello");
    }
}
```

* Configurar el inyector de dependencias


config.GuiceConfig.java
```java
package config;

public class GuiceConfig extends GuiceSupport {

    @Override
    protected Injector configure() {
        return Guice.createInjector(new AbstractModule() {
            @Override
            protected void configure() {
                bind(MyService.class).to(MyServiceImpl.class).in(Singleton.class);
            }
        });
    }

}
```

De esta forma se configura la clase como un singleton. Cada vez que una clase tenga la dependencia de MyService se inyectará la misma instancia de MyServiceImpl.

* Para inyectar la clase se utiliza la anotación @Inject

controllers.Application.java
```java
package controllers;
public class Application extends Controller {

    @Inject
    static MyService myService;

        public static void index() {
            myService.sayHello();
            render();
        }
}
```

Ya con esto está el servicio inyectado en el controlador.

Mi siguiente paso fue crear un test y es aquí cuando me encontré una sorpresa:

```bash
	play test
```

[http://localhost:9000/@tests]()

Compilation error! El problema está en que el módulo tiene una carpeta que se llama test. Esta carpeta en vez de tener algunos tests unitarios o funcionales, lo que tiene son 3 aplicaciones de ejemplo. Lo normal hubiera sido seguir la convención de play que es poner este tipo de aplicaciones en la carpeta 'samples-and-tests'.

Hice un fork del proyeto para renombrar esta carpeta

[https://github.com/axelhzf/play-guice-module]()

También hice un pull-request, pero no he tenido respuesta :(

[https://github.com/pk11/play-guice-module/pull/5]()


Renombrando la carpeta test del módulo sería suficiente para poder ejecutar este test:

InjectTest.java
```java
@InjectSupport
public class InjectTest extends UnitTest {
    @Inject
    static MyService myService;

    @Test
    public void injectOk(){
        assertNotNull(myService);
    }
}
```

Por defecto play detecta automáticamente la anotaciones @Inject en las clases que hereden de Controller, Job and Mail. Si queremos poder inyectar dependencias en otras clases debemos anotar la clase con @InjectSupport.

Normalmente nuestros servicios no son tan simples como MyService. Lo normal es tener dependencias entre servicios. Guice resuelve esto analizando las dependencias e instanciando los objetos en el orden adecuado.


services.MyDependentService.java
```java
package services;

public interface MyDependentService {
    public void sayHelloWorld();
}
```

services.MyDependentServiceImpl.java
```java
package services;

@InjectSupport
public class MyDependentServiceImpl implements MyDependentService {

    @Inject
    static MyService myService;

    public MyDependentServiceImpl(){
        play.Logger.info("Inicializando MyDependentServiceImpl");
    }

    public void sayHelloWorld(){
        myService.sayHello();
        play.Logger.info("world");
    }
}
```

InjectTest.java
```java
@InjectSupport
public class InjectTest extends UnitTest {

    @Inject
    static MyDependentService myDependentService;

    @Test
    public void injectOk(){
        assertNotNull(myDependentService);
        myDependentService.sayHelloWorld();
    }

}
```

Incluimos el binding

```java
bind(MyDependentService.class).to(MyDependentServiceImpl.class).in(Singleton.class);
```

Y esta es la salida por la consola

```bash
20:34:39,090 INFO  ~ Inicializando MyServiceImpl
20:34:39,095 INFO  ~ Inicializando MyDependentServiceImpl
20:34:39,095 INFO  ~ Application 'lazySingleton' is now started !
20:34:39,136 INFO  ~ hello
20:34:39,136 INFO  ~ world
```

Se inicializa primero MyService y luego MyDependentService

Una de las cosas que no me gusta del módulo es que te limita a que los campos que puedes inyectar deben de ser estáticos. Las dependencias por ejemplo me gustaría poder definirlas como parámetros en el constructor. De forma que quede claro que para crear un objeto de la clase MyDependentServiceImpl hace falta un objeto del tipo MyService. Además, utilizar las dependencias mediante constructor facilita hacer tests unitarios.Únicamente es necesario llamar al constructor y pasar como parámetros stubs o mocks de las dependencias. De esta forma no estamos obligados a configurar un inyector.

En la documentación del módulo no vi ninguna referencia a cómo hacer esto. Encontré un artículo que explicaba cómo hacerlo utilizando un Provider:

[http://ericlefevre.net/wordpress/2011/05/08/play-framework-and-guice-use-providers-in-guice-modules/]()

Esta forma funciona correctamente pero más tarde encontré una pregunta en stackoverflow que me dio otra pista:

[http://stackoverflow.com/questions/8435686/does-injector-getinstance-always-call-a-constructor]()

En el *Edit* pone que se olvidó de anotar con @Inject el constructor. Probé a hacer lo mismo y funcionó:

services.MyDependentServiceImpl.java
```java
public class MyDependentServiceImpl implements MyDependentService {

    private final MyService myService;

    @Inject
    public MyDependentServiceImpl(MyService myService){
        this.myService = myService;
        play.Logger.info("Inicializando MyDependentServiceImpl");
    }
    ...
```

Me faltaba un pequeño detalle para tener google guice configurado perfectamente. En el log se puede ver como los servicios se inicializan cuando se inicia la aplicación.


```bash
21:38:11,801 INFO  ~ Inicializando MyServiceImpl
21:38:11,805 INFO  ~ Inicializando MyDependentServiceImpl
21:38:11,805 INFO  ~ Application 'lazySingleton' is now started !
```

Cuando la aplicación está en modo producción está bien, es el comportamiento adecuado. Los servicios se deberían instanciar al arrancar la aplicación. Pero cuando estoy en modo desarrollo prefiero que los Singletons se inicialicen bajo demanda (lazy). Puede que haya servicios que tarden en iniciarse y quiero que el tiempo que tarda la aplicación en arrancar en modo desarrollo sea lo más rápido posible.

Buscando en la documentación de google guice veo que está preparado para hacer justamente lo que quiero:

[http://code.google.com/p/google-guice/wiki/Scopes]()

Lo único que hay que hacer es que configurar es el STAGE para indicarle a Guice si estamos en modo desarrollo o en modo producción:

```java
Stage stage = Play.mode.isDev()?Stage.DEVELOPMENT : Stage.PRODUCTION;
return Guice.createInjector(stage, new AbstractModule() {
    ...
```

Al volver a ejecutar el test


```bash
22:00:03,353 WARN  ~ You're running Play! in DEV mode
22:00:04,615 INFO  ~ Connected to jdbc:h2:mem:play;MODE=MYSQL;LOCK_MODE=0
22:00:04,811 INFO  ~ Guice injector created: config.GuiceConfig
22:00:04,819 INFO  ~ Inicializando MyServiceImpl
22:00:04,824 INFO  ~ Inicializando MyDependentServiceImpl
22:00:04,824 INFO  ~ Application 'lazySingleton' is now started !
```

Vaya, se volvieron a instanciar los singletons al iniciar la aplicación. ¿Será que el Stage no sirve para lo que creo? Vamos a probar con un test:

StageTest.java
```java
public class StageTest {

    @Test
    public void testDevelopment(){
        Injector injector = createInjector(Stage.DEVELOPMENT);
        System.out.println("development - antes del getInstance");
        MyService instance = injector.getInstance(MyService.class);
        System.out.println("development - después del getInstance");
    }

    @Test
    public void testProduction(){
        Injector injector = createInjector(Stage.PRODUCTION);
        System.out.println("production - antes del getInstance");
        MyService instance = injector.getInstance(MyService.class);
        System.out.println("production - después del getInstance");
    }

    public Injector createInjector(Stage stage){
        Injector injector = Guice.createInjector(stage, new AbstractModule(){
            @Override
            protected void configure() {
                bind(MyService.class).to(MyServiceImpl.class);
            }
        });
        return injector;
    }
}
```

Y el resultado es:

```bash
INFO: development - antes del getInstance
INFO: Inicializando MyServiceImpl
INFO: development - después del getInstance

INFO: Inicializando MyServiceImpl
INFO: production - antes del getInstance
INFO: production - después del getInstance
```

Como pone en la documentación, cuando se está en modo DEVELOPMENT los Singleton se inicializan de forma lazy.

¿Si esto funciona así, por qué cuando lo probé con el módulo de play no funcionó?

Revisando el código:

[https://github.com/pk11/play-guice-module/blob/master/src/play/modules/guice/GuicePlugin.java]()

Encontré que lo que se hace en el @OnApplicationStart es buscar todas las clases que están anotadas con @InjectSupport las dependencias. Para inyectarlas hace un getBean de cada una. Aquí esta el problema, al hacer el getBean se instancia.

Buscando en internet encontré una solución a este problema:

[https://groups.google.com/d/msg/google-guice/405HVgnCzsQ/fBUuueP6NfsJ]()

El código para permitir LazySingleton

* [@LazySingleton](https://github.com/wiregit/wirecode/blob/master/components/common/src/main/java/org/limewire/inject/LazySingleton.java)
* [MoreScopes](
https://github.com/wiregit/wirecode/blob/master/components/common/src/main/java/org/limewire/inject/MoreScopes.java)
* [LazyBinder](https://github.com/wiregit/wirecode/blob/master/components/common/src/main/java/org/limewire/inject/LazyBinder.java)

Estas clases lo que hacen es que cuando se crea el inyector, crea un proxy para cada una de las clases que están anotadas como @LazySingleton. De forma que cuando inyecta los objetos lo que se inyecta en realidad es el proxy. La primera vez que se invoque un método de alguna de estas clases, el proxy se va a encargar de inicializar la clase.

La configuración del inyector quedaría así:

GuiceConfig.java
```java
public class GuiceConfig extends GuiceSupport {
    @Override
    protected Injector configure() {
        Stage stage = Play.mode.isDev() ? Stage.DEVELOPMENT : Stage.PRODUCTION;
        return Guice.createInjector(stage, new AbstractModule() {
            @Override
            protected void configure() {
                bindScope(LazySingleton.class, MoreScopes.LAZY_SINGLETON);
                bindLazySingletonOnDev(MyService.class, MyServiceImpl.class);
                bindLazySingletonOnDev(MyDependentService.class, MyDependentServiceImpl.class);
            }

            protected <T> void bindLazySingletonOnDev(Class<T> expected, Class<? extends T> implClass){
                if(Play.mode.isDev()){
                    bind(implClass).in(MoreScopes.LAZY_SINGLETON);
                    Provider<T> provider = LazyBinder.newLazyProvider(expected, implClass);
                    bind(expected).toProvider(provider);
                }else{
                    bind(expected).to(implClass).in(Scopes.SINGLETON);
                }
            }
        });
    }
}
```

Cuando la aplicación está en modo desarrollo, las clases se instanciarán la primera vez que se llame a un método. Cuando usemos el modo producción, las clases se instanciarán cuando se inicie la aplicación.

Me queda pendiente añadir estas clases al fork para poder tener un módulo completo que se pueda reutilizar en todos los proyectos.
