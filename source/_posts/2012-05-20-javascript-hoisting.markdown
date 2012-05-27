---
layout: post
title: "Javascript hoisting"
date: 2012-05-20 19:56
comments: true
categories: [javascript, hoisting]
published: false
---

A medida que iba viendo ejemplos de javascript, me llamaba la atención al de este tipo

	function f1(){
		var a, b, c;

		a = 1 + 1;
		b = a + 2;
		c = a * c;
		return c;
	}

Me llamaba la atención por qué declarar todas las variables al inicio de la función. Vengo de Java, y en Java se recomienda declarar las variables justo en el momento de uso, de forma que este el mínimo scope posible y se pueda liberar la variable lo antes posible. Por ejemplo

	function f1(p1) {
	    var result = 0;
	    if (p1) {
	        var a = p1 * 3;
	        result = a + 25;
	    }
	    return result;
	}

Al declarar la variable a dentro del bloque del if, mi mentalidad que proviene de java me hace pensar que al salir del if la viarable a ya no va a estar declarada.

Durante un tiempo pense que no eran más que manías de los programadores, que les gustaba declarar todas las variables al inicio para ahorrar tener que repetir `var` varias veces. No le di mayor importancia hasta que empecé a utilizar [JSLint](http://www.jslint.com/) para validar mi código. Ese código no pasa la validación y uno de los mensaje que aparece es `Combine this with the previous 'var' statement.`. Así que JSLint recomienda combinar la declaración de las variables en una única linea. Esto ya me hacía sospechar y decidí buscar algo de información y encontré acerca de Javascript Hoisting.

Javascript permite declarar variables utilizando multiples sentencias `var` en cualquier punto de la función, pero actúan como si fueran declaradas al inicio de la función. Esto es lo que se llama `hoisting`. Esto puede llevar a confusiones por ejemplo en este caso

	myname = "global"; // global variable 
	function func() {
		alert(myname); // "undefined" 
		var myname = "local"; 
		alert(myname); // "local"
	} func();

Podríamos pensar que en el primer alert estamos accediendo a la variable global porque todavía no hemos declarada la variable myname dentro del scope, pero esto no es así. Ese código es equivalente a

	myname = "global"; // global variable 
	function func() {
		var myname; // same as -> var myname = undefined;
		alert(myname); // "undefined"
		myname = "local";
		alert(myname); // "local" 
	}
	func();

También tenemos que considerar que a diferencia de otros lenguajes de programación, la función son las únicas sentencias que declaran scope. Los bloques de un if o los de un for no declaran un bloque propio. Por ejemplo

	function hoisting(){
	    var a = 1;
	    console.log(a);    // 1
	    if(true){
	       var a = 2;                    
	       console.log(a); // 2
	    }
	    console.log(a);  // 2 
	}
	hoisting();

Al salir del if podríamos pensar que la variable a tiene el valor 1 porque las declaraciones hechas del if no tienen valor al salir, pero no es así. En realidad esa variable a es la misma, están las dos dentro del mismo scope, el scope de la función hoisting. Para evitar este tipo de problemas se utiliza el "Single var Pattern". De forma que el mismo ejemplo de antes quedaría:

	function hoisting(){
	    var a = 1;
	    console.log(a);    // 1
	    if(true){
	    	a = 2;           
	        console.log(a); // 2
	    }
	    console.log(a);  // 2 
	}
	hoisting();

De esta forma podemos evitar posibles error debidos al hoisting.