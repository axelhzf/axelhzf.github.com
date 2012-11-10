---
layout: post
title: "Cocoapods"
date: 2012-11-10
tags: [iOS, CocoaPods]
---

![CocoaPods](/images/posts/cocoapods.png)

[CocoaPods](http://cocoapods.org/) es una librería para la gestión de dependencias de proyectos de XCode. Se encarga de resolver las dependencias, descargar los fuentes y de gestionar el workspace. Esto simplifica mucho utilizar librerías de terceros en nuestro proyecto.

CocoaPods se distribuye como una gema de ruby, para instalarlo:

```
gem install cocoapods
pod setup
```

Una vez instalado tenemos que indicar las dependencias que tiene nuestro proyecto. Para ello creamos el fichero **Podfile**. Este fichero es el equivalente al pom.xml en Maven. La sintaxis de este fichero es la siguiente:

```
platform :ios
pod 'MagicalRecord', '~> 2.0.6'
pod 'SVProgressHUD', '~> 0.8'
pod 'Underscore.m', '~> 0.1.0'

target :test, :exclusive => true do
   pod 'OCMock', '~> 2.0.1' 
end
```

En este fichero de configuración se especifica que el proyecto depende de las librerias *MagicalRecord*, *SVProgressHUD* y *Underscore.m*. En el target *test* se especifica las dependencias que sólo estarán disponibles para la ejecución de los tests. En la página de [CocoaPods](http://cocoapods.org/) hay un buscador donde puedes encontrar las librerías disponibles.

Cada vez que se modifique el fichero Podfile es necesario actualizar las dependencias. Para ello se utiliza el comando:

```
pod install
```

CocoaPods creará un workspace (fichero que termina con la extensión .xcworkspace). Este es el fichero que tenemos que abrir con XCode a partir de ahora. Este workspace está compuesto por dos proyectos, uno que contiene aplicación y el otro que está gestionado por CocoaPods que es donde se encuentran los fuentes de todas las librerías que se han descargado.








