**Clase pruebas automatizadas + protocolo prueba UX-20260414_120655-Grabación de la reunión**

14 de abril de 2026, 5:06p.m.

4h 0m 0s

**Liliana Gonzalez Palacio** inició la transcripción

**Daniel Rendon Montaño** 0:04  
en este primer bloque eh Como les mencionamos a ver todo el tema de pruebas automatizadas es una clase eh práctica listo eh vamos a pasar rápidamente por algún recorderis creo que algunos de los temas ya los hemos visto cuando vimos en generalidad al inicio del curso eh los temas de pruebas automatizadas pero aquí simplemente recorderis  
Los tipos de pruebas y las que ya sí vamos a ver y a implementar que les es el entregable. Listo, precisamente, ay, espérenme que me fui listo. Precisamente, pues quería hacerle referencia de pronto a los que no hayan visto el entregable. Espero que todos lo hayan visto. Recordemos que tenemos el entregable.  
Para la siguiente semana, entonces también recordéis a todos los grupos para que vayan haciendo las citas de acuerdo a la metodología que igualmente hayan definido con cada uno de los profes, entiendo que acá también estamos en conjunto varios grupos, pero que tengamos presente ir gestionando esa cita con los product owners, el espacio para la otra semana para hacer la presentación.  
Del entregable Sprint 2. Listo, esos son los temas que están ahí, pues como listados en ese entregable. Una parte del caso de Negocios, pues la segunda parte que ya realmente pues el que finaliza y termina toda la parte de finanzas, todo el caso pues como de negocio completo. Las pruebas automatizadas, que es un poco lo que vamos a ver hoy y las pruebas de usabilidad, que es la segunda parte que les conversaba la clase.  
Eso sumado claro a toda la parte del desarrollo del MVP en esa versión 2, en los cuales pues es el cumplimiento de las iniciativas y de las archivos que ya hayan comprometido de acuerdo a lo que se haya priorizado pues con el owner para este siguiente sprint para este que estamos pues actual que es sprint 2 y la parte de la presentación que es la que siempre tenemos pues en clase.  
ya como a nivel de de review pues del del entregable y de la parte de funcionalidad listo como la parte más demo me van diciendo porfa en cualquier momento muchachos me levantan la mano yo aquí tengo la otra pantallita para ir viendo pero también cualquier cosa me interrumpen por el micrófono si no las veo listo  
Bueno, para entrar pues ya como tal en materia, como les he dicho con esta primera parte de pruebas automatizadas y también les decía pues que va a ser una clase muy práctica también pues tanto por participación, porque ahorita les vamos también a poner un ejercicio para que lo ejecuten. Listo. Entonces lo primero era que les queremos preguntar cuánto creen, cuánto estiman lo que se atrevan a decir.  
¿Que cuesta un bug en producción? ¿Quién se atreve a decir alguna cifra?  
Pueden abrir los micrófonos, porfa.  
Que no sé por qué, pero no tengo acceso al chat. Entonces también me necesito que ahora el micrófono porque no puedo ver los mensajes. No sé por qué creo que es porque me entró la cuenta que no era.  
Quien te traducir una cifra muchachos.

**Felipe Zapata Roldan** 2:50  
Estás estaba citado con la cuenta en Colombia, es por eso, por ser externo.

**Daniel Rendon Montaño** 2:54  
Y.  
Esto sí debe ser por eso. Cualquier, si algo me ayudas con el chat, pero no igual hablamos muchachos. ¿Quién se traduce una cifra? ¿Cuánto creen que vale un buque en producción?

**Liliana Gonzalez Palacio** 3:04  
Que depende del proyecto, según dice David Quintero.

**Daniel Rendon Montaño** 3:08  
O K, depende del proyecto y una cifra, digamos, hablemos, ustedes saben que esa cifra siempre salen en dólares. ¿Cuántos dólares creen que va a puede llegar a valer?

En orden de magnitud, obviamente 100000.

**David Quintero Gallego** 3:25  
Yo siento que si, por ejemplo, el bug es que en Amazon, obviamente más de miles de dólares.

**Daniel Rendon Montaño** 3:29  
Mhm.  
De acuerdo, de acuerdo. Muchas gracias ahí por la participación. Sí, muchachos, digamos que obviamente va a depender de la magnitud de qué represente ese buque en producción, pues y como tal que esté que sea la aplicación. Digamos que les queremos contar un caso de una empresa que se llama Nike Capital. No sé si alguno la llegó.  
A conocer Ney Capital en 2012 tuvo un caso muy particular en el cual Ney Capital era un corredor de bolsa pues automático, pues como de un software de trading, lo que hoy podría ser un IBKR o todas esas plataformas pues que conocen que hacen trading pues como a través de algoritmos y demás.  
En su momento, ellos tenían una presión en la cual un tema regulatorio tuvieron para hacer unos cambios literalmente como en un mes y unas pruebas en 15 días y tenían que salir con unos ajustes. Ellos hicieron el cambio ese día que se me ven la diapositiva el 02/08/2012 y tuvieron un problema. ¿Cuál fue el problema? Fue que a nivel de despliegue.  
Ellos tenían cuatro servidores, 8 servidores perdón a nivel productivo y resulta que el equipo de desarrollo o el de cooperación, pues realmente cuando hizo el cambio a producción al actualizaron 7 servidores y se les quedó el octavo sin actualizar, lo cual implicaba que pues ese código quedó desactualizado. No se no estaba digamos que a la par de los demás cambios que se han hecho y adicionalmente.  
Ese servidor estaba a modo de prueba antes de ese paso a producción. Sabían que iba a pasar, sabían que se iba a reescribir el código, pero en ese momento tenía unos flags que tanto manejamos y creo que todos hemos puesto en el código para hacer en algún momento algún debug, alguna validación y ellos al ejecutar estar llegando peticiones productivas.  
A ese A ese servidor lo que causó fue que generó compra y venta de acciones sin control, básicamente haciendo lo contrario a lo que siempre asegura el algoritmo de compra, es decir, estaba comprando caro y vendiendo barato. ¿Se imaginarán eso? Pues lo que implicaría así. El resumen se fue más o menos 1 pérdida de 440000000 USD.  
Para que lo dimensionemos en pesos colombianos, ¿cuánto puede llegar a ser? Y el resultado, si bien pues lo ponemos como bancarrota en 45 minutos, ellos inmediatamente no fue bancarrota, pero sí quedaron demasiado afectados en esos 45 minutos, tanto que pues como en los próximos, creo que fue el siguiente año, los 2 años los compró.  
otra empresa básicamente Eso pues es porque Obviamente el impacto que tuvieron con ese con ese incidente si lo queremos llamar de esa manera Pues porque precisamente lo traemos un poquito a colación este en esta temática es porque pues queremos que se pregunten un poco qué tan  
¿Qué tan ¿Qué tanto podemos hacer para haber evitado eso? ¿Qué tan evitable era? Era la palabra que estaba pensando, que posiblemente algunos ya estarán pensando en posibles validaciones que se pudieron haber realizado para evitar que eso ocurriera, cierto. Entonces esto era como un poquito para que vamos mirando realmente la importancia de realizar pruebas en un software que va a producción y nuevamente y súper de acuerdo con.  
Con lo que mencionaba Lily y David, pues depende también muchas veces de del software que vamos a tener y vamos a ver un poquito de eso también en ese contenido. Listo. Entonces a nivel de contenido, como les mencionaba, vamos a mirar un poquito de esos fundamentos, vamos a hacer rápidamente porque creo que la mayoría de esa temática ya la revisamos y que pasemos al ejercicio práctico para que.  
Para que ustedes también vayan entrando pues en materia y puedan hacer un reto que les hacemos práctico para que vayan preparando ahí de pronto algunas en el celular se vayan uniendo el computador, lo tengan ahí a la mano para que ahorita lo realicemos listo.  
Respecto a los fundamentos, vamos a saltar esta parte de este Kahoot. Vamos a hablar un poquito de los tipos de pruebas. Queremos igual que tengan el panorama completo. A nivel de pruebas, vamos a hablar primero de las pruebas unitarias. Esas pruebas unitarias yo creo que ya se las hemos mencionado en repetidas ocasiones. Básicamente,  
son lo mínimo que debemos de tener. Van muy del lado también del desarrollador. Esas pruebas unitarias prueban, por eso se llaman unitarias, prueban una función, un código de manera aislada. Aisladas es en el sentido de que si tiene alguna dependencia con otro sistema, con otra función, ahí se utilizan diferentes estrategias para realmente aislarle, que solo se pruebe ese código.  
Cuáles, por ejemplo, van a escuchar de pronto cuando investigue un poquito más de pruebas unitarias, lo que es un MOOC, lo que es un stop, que es básicamente simular otra función para que esa función le retorne a la función que estamos probando, lo que necesita que le retorne. Piénsenlo mucho. Por ejemplo, si yo voy a probar una función que se conecta a un API del banco y revisa cómo está el dólar, por ejemplo.  
Entonces, obviamente, pues no queremos que fue una petición real cuando estemos en las pruebas, entonces se crea una función de alguna manera como auxiliar que le retorne un valor estático y que de acuerdo se pueda revisar pues las pruebas que queramos. Si tenemos pruebas negativas de que retorne un 0, bueno, como se va a comportar nuestro sistema de acuerdo a eso, por ejemplo, ¿qué pruebas tienen estas?  
pruebas unitarias que son rápidas, son fáciles. ¿Por qué son rápidas y fáciles? Porque primero están del lado desarrollador, prueban un pequeño bloque de código que es una función no son complejas realmente, simplemente son super enfocadas en lo que tienen que hacer. Lo malo es que están aisladas, entonces que funcionen todas las pruebas unitarias no quiere decir que mi sistema esté funcionando, tiene que ir un poco más allá para entender.  
qué más tiene ya vamos a mirar precisamente Cómo se complementan con las demás pruebas ilimitadas porque precisamente estamos probando probando un simple bloque de código no el panorama completo de nuestra aplicación listo estas muchachos hay como como cuña pues Estas son las que más vamos a trabajar e a nivel de  
de desarrollo y puntualmente también en este proyecto, en lo que le estamos como tal, viendo el entregable precisamente por razones. Ahorita vamos a ver en qué proporciones se recomienda tener estas pruebas, porque como lo veíamos en clases previas pues no podemos hacer todas las pruebas que queramos. Siempre vamos a tener un depende del software, depende del tiempo que tengamos, depende de el riesgo, el apetito del riesgo que pueda tener la organización respecto a los  
que va a asumir. El segundo tipo de pruebas, vamos a hablar de las pruebas de integración. Las pruebas de integración, su nombre también es muy diciente, prueban cómo interactúan dos o más componentes de un sistema. Entonces digamos que tengo el componente A, tengo el componente B, hago pruebas unitarias y sé que funcionan, inclusive muchas pruebas unitarias a cada uno, sé que funcionan.  
Ya va a revisar, listo, ese contrato que en el medio de esa comunicación sí está funcionando o no está funcionando. Este componente A está enviando la información que debe enviar, recibe la que debe recibir y cómo se comportan los dos componentes como tal al interactuar. Los pros pues precisamente ayudan mucho a detectar problemas de comunicación, va mucho, piensan a nivel de cuando.  
Tenemos dependencias con la base de datos de consultas y demás. Mirar que esa consulta sí funciona. Piénselo mucho a nivel de validar. Venga, no me han cambiado la estructura de la base de datos. Este campo sigue existiendo, este más este componente almacenado sí sigue existiendo también para APIs. Para APIs también funcionan mucho las APIs. las.  
Pruebas de integración, de confirmar si la estructura, por ejemplo, piensen en un APIC le retorno a un JSON. Bueno, esa estructura que yo estoy asumiendo sigue funcionando y si en algún momento cambio, yo no me di cuenta y no la he actualizado por otro componente precisamente, pues cómo voy a hacer que funcione, es decir, cómo voy a darme cuenta antes de que llegue a producción nuevamente y.  
Pues allá me di cuenta de que es que el API cambió, pues me debería dar cuenta a través de integración para poder corregirlo antes de que suba de ambiente a Cuba y después a producción listo.  
Hmm.  
Las siguientes son las pruebas en tu end, pues también el nombre es super diciente en tu end de punta a punta también las llaman mucho o pruebas de usuario final también se pueden conocer. ¿Por qué? Porque precisamente prueban el flujo completo cuando digo usuario final es simulando el comportamiento de un usuario final, acordemos a que estaba hablando de tipos de pruebas automatizadas las manuales aquí.  
pues no la estamos eh considerando Pues porque ya las hemos visto y aquí estamos hablando netamente de pruebas automatizadas eh esas pruebas en como les decía pues prueba un flujo completo y normalmente eh se se especializan en probar el flujo más crítico de una de una aplicación Entonces cuál es el flujo más crítico piénselo no sé  
Tenemos un ecommerce. ¿Cuál creen que va a ser el flujo más crítico de un ecommerce?  
¿Qué probarían ustedes si les digo, hagámosle una prueba en tu end a no sé a Amazon, Amazon entenderlo como la parte del e-commerce? ¿Quién se atreve a decirnos más o menos qué creen que probarían? ¿Cómo podría comportarse o qué se les viene a la mente a través de un flujo completo? ¿Cuál creen que es el más crítico en un en un e-commerce?  
¿Quién nos quiere contar?  
Sí.

**Samuel Daza Carvajal** 12:38  
Pues profe, yo por ejemplo diría que podría hacer obviamente todo el proceso de del la compra del producto, tanto obviamente los métodos de pago, tener en cuenta de que por ejemplo Amazon tiene métodos de pago diferentes, vinculación con tarjetas de crédito para que no haya ningún error ni que nadie pueda comprar, por así decirlo, gratis.

**Daniel Rendon Montaño** 12:40  
Tales imágenes.  
Dicele.  
Mhm.  
¿De acuerdo, pero de dónde partirías en ese en tu en desde dónde hasta dónde lo harías el proceso?

**Samuel Daza Carvajal** 13:03  
Sería como entrar a la aplicación, buscar un producto e intentar comprar el producto, escoger el método de pago y después de darle a pagar, que primero sí me descuente la tarjeta y después que ya me aparezca que se ha realizado la compra con éxito con la información, obviamente del envío poniendo de ejemplo a Amazon.

**Daniel Rendon Montaño** 13:06  
Mhm.  
Mhm.  
De acuerdo, súper bien Samuel, muchísimas gracias. A esa solamente te agregaría que esa parte que hablabas del ingreso obviamente va a considerar, por ejemplo, en el caso de un ecommerce, tema de autenticación, cierto, también miren que desde esa punta a punta va de cómo ingresan, que con qué datos ingresaron, si los vale o nos vale. Entonces estoy probando un montón de componentes en esa prueba.  
desde la autenticación, como les he mencionado, pasando por los que mencionaba Samuel del carrito, como pasó por una pasarela de pagos, como el pago se hizo, como verificó que, por ejemplo, piensen detrás de Amazon, que más puedan probar. Deben de probar que el pedido se recibió, que se recibió, pues el pago como lo mencionamos, que se hizo un  
el tema logístico que eso obviamente dispara detrás a nivel de sí del tema logístico Pues de paquetería y demás eh envíos etcétera etcétera todo lo que sea que se dispare tras de ese de ese proceso y que haga una prueba en to end porque posiblemente sea el flujo más crítico cierto va a ser mucho más crítico eso que por decir algo no sé el flujo de  
De que una persona puso un.  
No sé, un producto en favoritos, cierto, eso también puede ser muy relevante, pero no va a ser el flujo más crítico. Entonces, porque esas en tu ven las enfocamos en el sistema más crítico, precisamente porque como lo ven ahí en los contras, son lentas y costosas, lentas porque una prueba unitaria tranquilamente muchos de esas pueden ejecutarse de 100 en 30 segundos.  
mientras que la end to end es algo que tiene que subir pues la aplicación tiene que ser las pruebas reales eso va a demorar minutos ya no estamos hablando de segundos sino de minutos eso en en en tema de pruebas pues obviamente va a ser eh lento y costosas porque son más demoradas de construir van a probar tantos componentes que pues realmente  
Levantarlas y crear esas pruebas son mucho más demoradas también de crear y va a ser mucho más costosas tanto la ejecución como la creación de esas pruebas. Entonces por eso estar enfocadas. Ya les muestro un poquito más como se listo. ¿Qué pros tienen estas ese tipo de pruebas? Pues que tenemos más confianza encontramos mucho tema de bugs en de interfaz de usuario porque precisamente como están simulando ese flujo.  
Nos van a mostrar venga, es que esto no está funcionando. Piensen cuántas cosas pudieron haber fallado en ese flujo que les mencionábamos. Pueden haber fallado, integramos 10 componentes, alguno de esos puede estar fallando y con esta prueba nos damos cuenta de que esa alerta se está generando, de que no está almacenando, nos está cobrando, etcétera, etcétera. Listo.  
Y lo último son las pruebas de performance. Las pruebas de performance, pues son como dice el nombre de rendimiento más del sistema, de cómo se comporta con temas de carga, estrés de picos, como escala cuando recibe X cantidad de peticiones. ¿Qué pasa si un servidor se cae y cómo se levanta? ¿Cómo es esa también esa elasticidad que tiene?  
Todas estas pruebas de performance son muy específicas, pues ya de un equipo más especializado que pueda ser de tester y demás. Listo, esas también pues no las vamos a tocar tanto en este primer entregable. Bueno, segundo entregable realmente. Antes de pasar, chicos, no sé si hasta acá tienen alguna pregunta.  
Yo voy tomando agüita.

**Salome Serna Restrepo** 16:32  
No, profesión aumenta.

**Samuel Daza Carvajal** 16:32  
No, yo lo veo claro.

**Daniel Rendon Montaño** 16:34  
Listo, súper bien, gracias ahí muchachos por la confirmación. Bueno, y precisamente esta era como para también un una pirámide que propone un señor que llamaba Kong. Él hablaba un poquito de ese esfuerzo y de dónde enfocar realmente como las pruebas que se realizan a un sistema.  
Y como lo ven, esos porcentajes no es que tengan que ser fijos, no se vayan con la idea de que tiene que ser el 80% literalmente, es más en orden de magnitud que lo entendamos que siempre vamos a tener una base más grande que sean las pruebas unitarias por tema de tiempo y de y de costo de desarrollarlas. Después tenemos unas pruebas de integración puntuales para las APIs y para los.  
para el backend que construyamos, mencionamos backend pues como todos esos consumos e interacciones entre componentes, base de datos, etcétera. Y finalmente tenemos unas pruebas en to end muy enfocadas en las en las funcionalidades críticas y de punta a punta, pues para simular ese flujo de del usuario final. Listo, esto siempre va a aplicar, muchachos, en la mayoría de sistemas.  
Y puede, como les decía, varía un poco, pero en la mayoría de casos siempre funciona bien por tema de eficiencia. Listo. Acá hay unos una actividad propuesta que la para que la pasemos rápidamente también por temas de tiempo. A ver unos casos propuestos también para ver un poquito más en detalle de la importancia de las pruebas, pero creo que ya.  
Vamos como entendiendo un poquito la importancia de queremos que no se salga un poquito ese chip que a veces se tiene de las pruebas es algo que me piden es algo que me toca es algo que alguien más está pidiendo me cargan de trabajo etcétera etcétera esos muchachos siempre tiene una razón de ser ejemplo el que vemos ahorita con ni capital Esos son otros ejemplos  
Que les dejamos si los quieren revisar el de Arian 5, pues que en este momento estamos otra vez tan en la era espacial. Fue un transbordador que no recuerdo el año, pero básicamente era pues la versión 5 y estaba reutilizando pues software de la versión cuatro, de la versión 3 y no se tuvo cuidado, no se tenían pruebas precisamente.  
Y entre un módulo y otro que estaban comunicando, uno estaba hablando en, en este momento, almacenamiento, entonces unos eran dígitos en 16 bits, el otro estaba en 8. Cuando uno se comunicó con el otro, pues no supo interpretar el dato, básicamente pues se desbordó la memoria.  
Y generó que ese cohete se se estallara. El terag 25 era un sistema de como de radiación, era para tema de pues como de de tratamientos médicos y también un tema pues de pruebas que no se hizo tal vez correctamente, generó inclusive y aquí es más el costo todavía por lo que fueron pues ya vidas humanas. ¿Qué se pudo haber hecho? Pues validar, hacer confirmaciones de.  
De que tanto precisamente tenemos y por eso ahí me gusta mucho lo que vamos ahorita el depende, pues va a ser muy diferentes y listo, se me cayó un ecommerce a pues cobré vidas humanas porque simplemente no se hicieron las validaciones correctas de validar con qué intensidad estaba disparando una máquina, pues un láser y demás cosas que pues pueden causar la muerte de una persona.  
La del La de Marte fue un era un radar como climatológico que estaban enviando y también fue un tema de conversación entre equipos. Había uno que estaba operando y creo que eran en Estados Unidos y el otro en Europa porque tenían unidades diferentes. Uno tenía el imperial, la otra la métrica y pues le dijeron está a 5 X.  
Pues no sé, como 5 km a 50 m por desinventar, pues cualquier cifra y uno lo interpretaron en una unidad y el otro en otro. Nunca hicieron las validaciones, pues precisamente para confirmar en qué idioma prácticamente están hablando. Y pues el peso que era río y realmente estaba ya muy cerca de la superficie y se estrelló contra la superficie de Marte.  
Pérdidas, obviamente millones de dólares. Imagínense cuánto puede haber costado enviar hasta ya trabajo de cuántos meses de un equipo de trabajo. Y el último es el del cambio de milenio. Este sí creo que es mucho más reciente. Pronto a muchos no nos tocó pues que lo recordemos, pero básicamente pues como es en la imagen se guardaba básicamente en año muchachos.  
dos dígitos cuando se iba a pasar el año 2000 pues ya el 99 se iba a convertir en cero cero pero en ese momento pues los sistemas no se han ideado pues por optimización y precisamente límites de memoria no se han diseñado para que lo manejar en cuatro dígitos lo cual Pues el 00 era 1900 o era 2000 iba a haber pues como unos problemas ahí también de escritura y más entonces eso  
Se tuvo en cuenta, obviamente muchos sistemas se actualizaron, lo tuvieron presente y se hizo. Sin embargo, aún con esas precauciones muchos problemas se tuvieron, hubieron pérdidas inclusive de empresas que se tuvieron relacionadas con ese bug, inclusive pues es el nombre que se le dio el Y2K, listo por si alguno lo quiere también ahí revisar y alguno de esto le llama la atención para que entiendan.  
Pero básicamente mensaje estos muchachos es muchos errores de esto se pudieron haber anticipado, al menos haber detectado por un tipo de prueba, algunas de integración, algunas tal vez inclusive más simples todavía.  
Lo último ya para que pasemos al ejercicio práctico era los principios del testing. Es así, estoy seguro que lo hemos visto para que lo recordemos. La primera es la que las pruebas muestran la presencia de efectos, es decir, eso suena muy raro, pero pues es que siempre las pruebas tenemos que enfocarlas, que que es la presencia de efectos, pero eso no quiere decir que el código no tenga.  
no tenga efectos porque no encontremos en las pruebas, es decir, si mis pruebas siempre prueban lo mismo, no quiere decir que no tenga no tenga efectos ese código o que tenga bugs o lo que estemos pues buscando como tal. Todo dependerá, todo dependerá de la buena calidad y cantidad de pruebas pues que se hagan como tal. Listo.

**Liliana Gonzalez Palacio** 22:17  
Dani.

**Daniel Rendon Montaño** 22:17  
La segunda relacionado, hola.

**Liliana Gonzalez Palacio** 22:19  
Por aquí la cuñita aprovechando que estás mencionando eso, muchachos para sobre todo para los que están haciendo el rol de testeros o los que están encargados digamos de las pruebas dentro del proyecto. Traten de no salir con el cuento de que es que yo sí detecté errores, pero le llamé a fulanito de tal o por WhatsApp le escribí y dije no corríjalo para yo no reportárselo.

**Daniel Rendon Montaño** 22:22  
Delgado.

**Liliana Gonzalez Palacio** 22:39  
Ustedes ahí se están clavando el cuchillo y si ustedes trabajaran en una empresa en el área de pruebas, un indicador importante de ustedes como personas que trabajan en Cuba es precisamente cantidad de cosas que ustedes le encuentran cuando empiezan a hacer pruebas. Entonces el resumen y la cantaleta es orientada a si usted encontró un error.  
Así sea una tilde, así sea una cosa mal escrita, así sea una bobada, repórtelo por favor. Lo que pasa es que acuérdese que el ciclo de ese de ese error pues también va cambiando, cierto, entonces está reportado, pero después que usted lo reporte, usted también puede decir que ya fue solucionado. Entonces realmente hay que tratar de hacer ese trabajo poniéndonos en los zapatos de esa persona que trabaja en el área de pruebas y en una empresa.  
Porque si usted va a entrar en ese rol, uno puede salir con ese cuento pa su jefe, cierto, porque va a quedar supremamente mal, no solamente por eso, sino por todo lo que ha mencionado Daniel.

**Daniel Rendon Montaño** 23:33  
super muchas gracias inclusive en el proyecto también es la idea muchachos no es que que porque encontré un bug entonces no es que me van a poner menos calificación no es que tengo problemas no es super normal hace parte del ciclo de vida Pues de del Software y es totalmente normal precisamente reportarlas detectarlas habrán unos precisamente que se puedan  
reportar y cerrar inmediatamente, porque es algo fácil, es algo que inclusive tiene relación con el usuario que estoy trabajando. Si yo tengo un extra de usuarios que ya detecte algo que tiene un bug, posiblemente no la puedo cerrar, sino que inclusive tengo que reportar el bug, corregirlo para poder cerrar la HU, porque realmente ya detecté algo que no está funcionando y no estoy cumpliendo con ese criterio de aceptación que tengo comprometido.  
diferente también que pues listo encontré hoy un bug sobre algo que ya ha cerrado en el sprint pasado sobre un archivo vieja no sé algo que ya se había y que no tiene tanta relación pues también está bien reportarlo puede que no lo alcance a cerrar puede que la cobertura no me dé pero si identificarlo dejarlo reportado y pues posiblemente después de priorizar  
Respecto a las futuras funcionalidades, no anterioridad, porque pues es para qué vamos a construir más si tenemos que corregir lo que ya existe. Es casi siempre la directriz que se tiene en la mayoría de casos, dependiendo claramente, pues como es la criticidad y lo que se tenga pues como reportado, porque habrá de casos a casos, cierto.  
Bueno, siguiendo acá la segunda con el segundo principio es relacionado con las pruebas exhaustivas. Las pruebas exhaustivas no son posibles. ¿En qué sentido? En que pues el tiempo es limitado, muchachos, tenemos que precisamente priorizar. Por eso es tan importante la que vemos anteriormente la pirámide con y también ahí entra el depende del software que estemos probando. Es decir.  
Si bien no se puede tener pruebas exhaustivas, así que tan reguloso tengo que ser si estoy probando un e-commerce o que tan reguloso tengo que ser si estoy probando algo médico, si tengo, si estoy programando no sé un sopa o algo así, pues que va a estar en riesgo ya inclusive temas de vidas y demás ciertos, claramente van a ser.  
Muy diferente la exhaustividad que tengo que tener uno del otro, pero siempre tenemos claro, nunca va a llegar al 100% de cobertura de tener realmente todos los casos posibles. Siempre toca llegar hasta un punto en el cual, pues de acuerdo a ese apetito de riesgo, pues estamos tranquilos de que estamos probando y estamos. Nos sentimos pues como bien con lo que se está construyendo y con las pruebas que.  
Valida en ese código que estamos construyendo, listo la tercera con las pruebas tempranas, esta también va muy relacionado con los costos, pues lo vemos con los casos inclusive que les planteamos, pero piensen si listo, o sea, ya en producción o realmente cuando ya ocurrió la tragedia valió millones de dólares. ¿Cuánto hubiera valido si lo han encontrado en un ambiente de Cuba?  
¿Cuánto hubiera valido si lo hubiera encontrado el desarrollador? Posiblemente o seguramente mejor dicho, mucho menos en Cuba va a ser un X cantidad de esfuerzo del desarrollador más el Cuba más lo que se cueste organizarlo siempre va a ser mucho menor que en producción, tanto por tema pues ya de cara al cliente y las consecuencias como tema de.  
realmente ya todos devolverse todo el proceso completo para volver a a solucionarlo listo el cuatro va relacionado con el agrupamiento de defectos que pues siempre vamos a tener ese pare vamos a tener unas fun realidades que son más críticas y que siempre buscar la paradoja del pesticida que es que las pruebas muchachos siempre recuerden son eh  
son iterativas, o sea, evolucionan a la medida que evoluciona el software, no se van a caer estética si ya cumplí con eso y listo esto obviamente también cuando ya veamos en el siguiente sprint un poco de la parte de de D y cómo se tiene esos pipelines que incluyen las pruebas automatizadas. Vamos a ver que precisamente por eso tiene un tema de cobertura, cobertura de nuevo código.  
Y cosas que nos nos apalancan pues esta paradoja pues para que se cumpla. La sexta relacionada con la que hablamos de la 2, que las pruebas dependen del contexto, no podemos siempre cumplirnos que es el 80, es el 70, dependerá de la organización y el software. Y la falacia de usencia de errores es que siempre tengamos en cuenta lo que vemos en una de esas clases de la diferencia entre.  
Verificación y validación y no porque pues nuestro código esté funcionando quiere decir que está solucionando la el problema de del usuario, no quiere decir que sea el software correcto que el usuario quiere, no porque no tenga errores. Entonces importante que tenga esas diferencias entre lo que es, pues como ya que no tengamos errores, que estamos tranquilos y que el software hace lo que tiene que hacer.  
Pero otra muy diferente es que el sea lo que el usuario requiere. Listo, no sé si hasta acá, chicos, alguna duda.  
Bueno, esta era para complementar un poco el costo de los defectos.

**Isabela Acosta Pareja** 28:04  
No problem.

**Daniel Rendon Montaño** 28:06  
Súper, muchas gracias. Ahí se las dejo, pero pues no profundicemos en esto. Siempre recuerden, llévense en la en su cabeza. Mientras más rápido se detecte el bug, mucho mejor. Siempre va a ser más costoso mientras más tiempo pase y en la fase más posterior que se haya encontrando.  
Entonces ahora sí vamos a empezar con la parte chévere siendo las 12:35 tenemos entonces más o menos una horita para que hagamos este ejercicio listo lo primero muchachos pues va a ser que vamos a hacer un caso simulado vamos a simular una startup colombiana la cual pues procesa transacciones Hay un problema y es que el código pues nos dicen que ya está listo pero realmente  
No se ha automatizado ninguna prueba, entonces la pregunta es si está realmente listo o no. Eso es lo que vamos a hacer un poco el día de hoy, como les ha dicho, pues tengan ahí a la mano sus computadores cada uno para que lo haga. Ahorita validamos, pues si alguno nos puede compartir pantalla para que lo hagamos muy práctico y lo socialicemos. Listo, pues aquí en la.  
Virtualidad como tal. ¿Qué es lo que queremos hacer? Pues que aprendamos a hacer pruebas automatizadas. Vamos a hacer algo súper básico, muchachos, de pruebas unitarias en Python. Precisamente eso es lo primero que necesitamos. Vamos a tomar aquí 2 minuticos, porfa, nos van mandando pantallazo cuando vayan terminando de qué cuando.  
salen esos requerimientos validen de que todo quedó correcto eso básicamente les va a decir pues cuando están las las dependencias y demás para que le quede ya correctamente entonces que lo primero que tengamos python si alguno lo tiene muchachos aproveché y lo descarga miramos requerimos una versión cualquiera del tres nos funciona listo también necesitamos pytest es la librería de python  
Una de las librerías realmente tenemos 2, está unit, pues conocidas, creo que 2 unit test y pay test puede que hayan más, pero las desconozco para hacer temas de pruebas en Python. Entonces también instalamos porfa esta dependencia, clonamos este repo, se los voy a pasar a, no tengo el chat. Lito me.  
Si lista por aquí me ayudas compartiéndoles este enlacecito porfa a los chicos aquí en el chat para que no lo tengan que copiar y clona el repo muchachos.

**Liliana Gonzalez Palacio** 30:04  
Sí, dale.  
¿Me lo vas a mandar por WhatsApp?

**Daniel Rendon Montaño** 30:14  
eh Ya no mentira esp compartir yo se los mando por el chat de teams pues desde el otro desde la otra cuenta creo que por allá sí me dejaron listo e y por acá muchachos ya clonamos el repuesto básicamente es este magenita que a la derecha simplemente es un proyecto tiene un código fuente literalmente un archivo solo de python que es el que vamos a probar  
ya tiene la estructura básica de test en el cual tenemos un test micro banco que es el que vamos a crear en este momento está vacío tenemos unos requerimientos que simplemente es como las librerías que vamos a utilizar pues ahí no tenemos nada raro simplemente la de cobertura y demás que vamos a probar y un ritmo de instrucciones que es lo que yo le estoy aquí básicamente contando listo Entonces por ahora verifiquemos que tenemos python instalemos esta librería  
Y ya les comparto este para esos comandos para que clonen. Bueno, les compartí los cuatro para que clone el repo y para que instalen las dependencias. Listo, denme aquí 1 segundo y yo se las comparto desde acá.  
¿Hace mucho alguna duda? Nos van por favor, si alguno le funciona, si tiene problemas, si nos va mandando aquí pantallazos o nos comparte pantalla y lo solucionamos. Listo, venga, te miró.  
Por acá nuestro mes.  
Por aquí debe tener el teams de la universidad.  
Es este cierto, aquí si me deja entrar.  
no me dejo entrar.  
Shut así.  
Listo, también yo les voy comprando entonces comando.  
Me dicen por muchachos y sí le está llegando ahí en la reunión, sí lo ven en el chat.

**Sofia Acosta Pareja** 32:19  
Sí, así es.

**Samuel Daza Carvajal** 32:20  
Yo no sé, yo no sé si sea el único, pero a mí me aparece en las reuniones del canal. Solo los miembros del equipo tienen acceso al chat.

**Daniel Rendon Montaño** 32:21  
Sí.

**Liliana Gonzalez Palacio** 32:31  
Ay, sí, señor, así es.

**Daniel Rendon Montaño** 32:33  
Porque lo citaste en el grupo, nosotros Lili me imagino que.

**Liliana Gonzalez Palacio** 32:36  
Sí, lo cité dentro del grupo de nosotros.

**Daniel Rendon Montaño** 32:38  
Bueno, pero de pronto aquí está Pipe y Wilmer lo ayudan ahí a pasárselo a los chicos, o k.

**Liliana Gonzalez Palacio** 32:42  
Sí, regálenme, regálenme un momentico, yo les yo les mando el.

**Daniel Rendon Montaño** 32:47  
Pues si no, el perro de muchos se lo escriben, tampoco es tan largo, son cuatro comandos corticos, listo.

**Liliana Gonzalez Palacio** 32:52  
Mhm.

**Daniel Rendon Montaño** 32:54  
Entonces lo vamos a ir haciendo el Python version, el instalar el PyTest, claramos este repo y hacemos el install.

**Liliana Gonzalez Palacio** 32:54  
No.

**Daniel Rendon Montaño** 33:02  
No sé si hay algún voluntario que nos quiera compartir o lo hacemos aquí juntos para que los demás solucionamos o si alguno tiene pregunta, pues lo tomamos como conejillo de indias para que lo solucionemos.  
Mola en algunos de compartir.  
Alguien que le esté haciendo muchachos, simplemente como a modo de prueba, pues como demostrando que todo funciona.  
Hasta acá no hemos hecho literalmente nada, simplemente estamos configurando el ambiente.

**Liliana Gonzalez Palacio** 33:41  
Elija usted mi hijo.

**Daniel Rendon Montaño** 33:45  
No le dijo usted a Lili, le dijo usted, yo soy muy malo para eso.

**Liliana Gonzalez Palacio** 33:46  
Cójalos, Cójalos ahí a quemar ropa acá para quedar yo como la mala gente. Espere, pues espere, pues.  
Ay, a ver, por ejemplo.  
Por ejemplo, Matias Monsalve está por ahí.

**Matias Monsalve Ruiz** 34:04  
Hola, sí, aquí estoy.

**Liliana Gonzalez Palacio** 34:06  
Ay, excelente Matías, te salvaste porque Salomé ya puso que sí le funcionó. ¿Nos quieres contar si ya te funcionó?

**Daniel Rendon Montaño** 34:10  
A.

**Matias Monsalve Ruiz** 34:13  
Ya lo estoy ejecutando todo, pues cree como una carpeta para hacerlo bien, entonces ya voy.

**Liliana Gonzalez Palacio** 34:20  
Súper bueno, Miguel Ángel Gomez también ya nos dijo que ya quedó todo o k.

**Daniel Rendon Montaño** 34:23  
Good.  
Súper bien. Aquí también veo que Salome ya lo envió. Muchachos que lo hagan todo listo. ¿Por qué? Porque vamos a hacer un workshop con esto para que vamos a aprender rápidamente a hacer pruebas unitarias. Voy a hacer un ejercicio. Esto más que la teoría, pues ya se las hemos dado, pero pues precisamente queremos que lleguemos a esos errores, a que se encuentren como probando así sea un archivo y un.  
Un sistema pues como tan simple como el que está en ese repo, pero que posiblemente van a encontrar y les va a servir para sus proyectos a futuro listo.

**Liliana Gonzalez Palacio** 34:58  
Además, Dani, por lo que estás mencionando también porque probablemente aquí no les esté tocando esa parte, pues como tan cercana de pruebas porque estén en otro rol dentro del proyecto, pero pues igual uno sabe que de pronto terminen trabajando en eso.

**Daniel Rendon Montaño** 35:11  
No, igual, por ejemplo, muchachos, lo que les decía ahorita, esta parte de pruebas unitarias son del lado del desarrollador. Entonces igual si dicen no, a mí me gusta el desarrollo, yo no voy a hacer nada de pruebas, si les va a tocar. Les aseguro que en las empresas en la que sea que vayan a trabajar las pruebas unitarias, muchachos, son casi que la garantía o la.  
parte de calidad de el desarrollo que usted está entregando. Es decir, si ustedes le entregan, pues básicamente siempre va a ser a nivel de, por ejemplo, H bus, que la mayoría trabaja con tema de Agile y Scrum, me entregan tal H bus, H bus tiene los criterios de aceptaciones, los criterios de aceptaciones que tiene que cumplir ese desarrollo que yo voy a hacer. Esas son básicamente lo que yo debo  
probar lo que yo debo garantizar por ejemplo de que se cumpla y ya cuando lo voy a entregar pues es decir es cuando ustedes compran un reloj nuevo pues ustedes piden que tenga una garantía que tenga esa garantía más que el papel venga yo como estoy seguro de lo que le estoy comprando Pues sí me va a funcionar en x tiempo cierto una garantía por eso tiene un tiempo  
Acá es más o menos lo mismo, yo entrego un software, un desarrollo y le entrego las pruebas de que eso sí funciona, de que yo estoy tranquilo, de que lo probé y de que está haciendo la funcionalidad que entra A y B y sale C. Esa parte es la que siempre van a estar igualmente del lado desarrollador para que nos vayamos igualmente acostumbrando. Pueden haber excepciones en empresas y demás, pero la mayoría  
Va a ser de esta manera, inclusive en organizaciones que van haciendo más pruebas del desarrollador, van metiendo todo lo de pruebas de integración, se incluye inclusive pruebas de pruebas de aceptación, como todo lo que va en el proceso de DevOps, dependiendo pues de tan pequeño grande sea la empresa.  
Entonces llevamos más o menos personas que pasan muchachos para que no nos quemos tampoco mucho acá en esta parte.  
Listo, ya quedó súper bien.  
¿Alguno tiene problemas? Mejor dicho, voy a voltear la pregunta, alguno está bloqueado, algún tiene alguno tiene problemas, algunos comandos que mandamos para que nos comparta, nos mande la imagen y le ayudamos de una vez a ir solucionando.

**Laura Marin Velez** 37:20  
El de los otros grupos, pues el de Wilmer, donde mandamos la evidencia.

**Daniel Rendon Montaño** 37:25  
O K, claro, porque no les deja aquí el chat. A que sí, Laura, tienes toda la razón, listo, pero igual alguno tiene problemas.

**Liliana Gonzalez Palacio** 37:32  
Si quieres, las la mandas directamente directamente al chat de Daniel o el mío.

**Daniel Rendon Montaño** 37:40  
Listo, todo está bien, perfecto. Listo, muchachos, entonces vamos a continuar. ¿Qué vamos a hacer ahora? Sí, ya todos vamos a asumir. Tenemos el ambiente listo. Si alguno tiene problemas, pues normal está por ahí la mano ahorita. ¿Qué es lo primero que vamos a hacer muchachos? Vamos a construir este este esta prueba.

**Laura Marin Velez** 37:43  
Listo, gracias.

**Daniel Rendon Montaño** 37:59  
Literal son cinco líneas de código, cuatro, pues porque este print si que lo tenemos que poner. Son cuatro líneas de código muchachos, como poner en esos momentos en ese en ese archivo que tenemos vacío, que es lo que vamos a hacer, vamos a utilizar una, vamos a importar el archivo que vamos a probar, vamos a importar paytest que fue el que el que descargamos ahorita la librería y la dependencia que vamos a tener.  
Vamos a crear un primer test precisamente en ese archivo de pruebas. Casi siempre, pues dependiendo del lenguaje se tiene una anotación para esas pruebas. En Python se utiliza el test, es decir, que empiece con el nombre test guión bajo, el método que se va a utilizar, en este caso transferir y un identificador de la prueba.  
Es decir, en este caso es un monto positivo. ¿Por qué? Porque yo les anticipaba, normalmente se crea más de una prueba unitaria por cada función. La razón es porque pues en este caso yo puedo probar varias cosas sobre lo mismo, es decir, yo tengo un login, por decir, obviamente login saben que puede llegar a tener varias partes, pero digamos abstrayamoslo a  
A una función es login, yo puedo tener el login positivo, cierto que es lo que llamamos siempre como el happy path, que nunca nos demos de cara y simplemente yo tengo una calculadora, pongo 2 y 2, me dio cuatro, entonces yo digo, listo, la suma funciona perfecto, pero es que no venga que sí.  
Siempre vamos a tener más casos cierto listo Yo quiero hacer más pruebas yo quiero no simplemente probar números positivos sino negativos con el cero como se se  
Un número de 10 de 10 dígitos, por ejemplo, cierto, son todas esas cosas que uno ya tiene que ir cambiando ese sombrero de desarrollador por más bien uno de tester de venga que.  
Puede llegar allá, entonces ahí siempre se maneja para Python. Entonces test el método que debemos utilizar y un identificador básicamente como esa prueba.  
En la prueba como tal, porque siempre tenemos tales partes muchachos, el arrange o la preparación también en algunas, en algunos casos se conoce como el setup. El setup es básicamente, pues todas esas configuraciones o pasos previos que tengo que garantizar antes de antes de ejecutar la prueba. Recordemos que las pruebas son aisladas, entonces.  
Siempre en cada prueba debe ser todo lo que se necesite, debe ser única, debe tener.  
La dependencia, limpiar cosas y tiene que limpiarse al final. Por ejemplo, en este caso es instanciar el método o la clase mejor que teníamos en el archivo de Python, que ahorita les vamos a dar un tiempito para que lo exploren y entiendan que tiene ese archivo de banco. Listo, que se hace aquí se instancia. ¿Por qué digo que tiene que ser desde cero? Porque si yo ejecuto esta prueba,  
En el orden que sea, porque precisamente pues nosotros no podemos garantizar de que esta prueba ejecuta antes o después de otra, igualmente no debería tener dependencias. Es decir, yo esta prueba de pasar o no pasar independiente de que ejecutó antes otra cosa o que ejecutar después algo. ¿Por qué? Porque pues muchos casos supongamos que esta variable estuviera aquí a nivel global.  
Obviamente yo voy a mostrar qué se hace en esta prueba, pero si yo y valido algo sobre una variable global y ya otro método me cambió esa variable, la modificó, le cambió el nombre, lo que sea, pues como en lo que sea que tenga esa variable, pues claramente cuando llegue acá, pues algunas veces va a llegar con X, va a llegar con Y.  
y eso va a afectar el resultado de la prueba, lo cual no es lo correcto, porque no es que aquí queramos pruebas no determinísticas, sino queden de cero. Eso pasa o no pasa. Todo eso va en el setup, todo lo que les comentaba, inclusive ahorita de los mocks, los stops, que son como todos esos métodos que yo quiero mockear.  
es la palabra que siempre se van a escuchar mucho que se utiliza, pues las configuro en esa primera parte de lo que yo requiera para ejecutar mi prueba. La segunda parte de esa prueba va a ser precisamente el act o el actuar o la ejecución de la prueba como tal. ¿Qué voy a probar? Pues yo he dicho que voy a probar transferir. Entonces efectivamente guardo una breve resultado  
A esa instancia que tenía le llamo el método transferir, va. Creo que ahorita ustedes describan el código, pero creo que es como cuenta la source, mi cuenta, hacia qué cuenta voy a transferir y cuánto monto. Creo que es así como está implementado ese método. Entonces aquí estoy diciendo que la cuenta 123456 me transfiere a la 789012.  
100, no le vamos a decir pesos ni nada, pues son 100 unidades. Después de que pase eso que verificar, voy a verificar que el resultado, pues aquí claramente ya sabía que hay una variable de estatus, verifico que fue exitoso y adicionalmente verifico que el monto fue de 100. Listo, mire que es una prueba demasiado básica, no sé si ya mientras aquí hablaba la idea es que la fueran.  
Escribiendo de pronto que la vayan escribiendo para que confirmemos de que les funcione correctamente todo el ambiente que montamos. ¿Por qué? Porque esta es la prueba de prueba es la prueba de prueba es la primerita que estamos haciendo simplemente para que confirmemos que les quedaron bien instaladas las librerías. Ya les vamos a poner un ejercicio para que lo hagamos rápidamente. Listo si alguno ya la escribió.  
Nos va porfa ahí confirmando, una manito arriba que yo creo que así las puedo ver o algo así. Y la vamos a ejecutar. Si alguno falta, pues la va escribiendo. No creo que le demora mucho escribir estas cinco líneas. ¿Cómo la vamos a ejecutar? Vamos a utilizar PyTest que es la librería que estamos utilizando. Este guión ves para que nos de más detalle. Este es opcional. Hay muchos flags que pueden utilizar con estas librerías. Hay otro que es.  
que también nos da más detalle, como si vemos que tenemos un error para hacerle debug, igual pueden buscar la documentación completa, si son más curiosos, pues si quieren entrar, ahí les llama la atención el tema. Entonces llamamos pay test y vamos a llamar el archivo de pruebas. Mucho cuidado con este punto, yo he estado aquí en Windows, entonces obviamente toca indicarle  
desde donde lo vamos a a invocar pues este archivo y eh el archivo de pruebas de test listo eh vayan hasta ahí muchachos entonces aquí una llamadita rápidamente eh vayanlo poniendo y nos mandan la pantalla cuando cuando quede correcto  
Listo, muchachos, ¿cómo vamos? Voy a ver por aquí el chatcito.  
Ay se me están quedando cargando Ah bueno ahí están súper bien listo por acá ya tenemos uno que funcionó a nuestro ZAP de instalación  
Esta sí, esta es de Miguel Ángel Gomez, súper bien, aquí ya tengo la prueba.  
la ejecuta tal cual compay test y ya tenemos aquí que está pasando súper bien Miguel todos muchachos Esperamos que lleguen hasta este punto listo que es la misma pantalla que yo tenía ya de cómo queda cómo se ejecuta listo Entonces tenemos aquí un archivo él básicamente lo escribió dentro de ese que está ahí propuesto de my First test y  
inclusive aquí en el nombre, normalmente para Python, pues por notación se utiliza no con camel case, que es la primera con mayúscula, sino que se utiliza normalmente con guión bajo, con minúsculo y con guión bajo para separar palabras, pero pues obviamente eso a nivel de ejecución no genera ningún error hasta ahora.  
¿Alguno tiene algún problema? Muchachos quieren que revisemos, quieren que quieren compartirnos pantalla.  
Estamos bien hasta ahí.  
Quiero escucharlos.  
La idea es, como les decíamos, que lo ejecuten para que vayan teniendo ese primer acercamiento con si lo estamos con Python, puede que otros estén trabajando sus proyectos con otro lenguaje, pero pues les va a servir.

**Alejandro Hinestroza Gomez** 46:45  
Cortana.

**Daniel Rendon Montaño** 46:50  
Alguien por el micrófono.

**Alejandro Hinestroza Gomez** 46:52  
Pon una pregunta.

**Daniel Rendon Montaño** 46:53  
Sí, señor.

**Alejandro Hinestroza Gomez** 46:55  
No bastaría con poner pytest y ya y ya el compilador de Python automáticamente identifica qué activo le importamos pytest y los ejecuta, pues ahí medio, pues no sé como para qué ponerle como tanto de especificar, pues como decirle es que no te escuché cuando explicaste al menos B.

**Daniel Rendon Montaño** 47:05  
Sí, sí.  
En ese caso.  
sí sí no súper válida tu pregunta Alejandro él por defecto los va a correr qué es lo que pasa que ahorita vamos a cobertura todavía no lo hemos configurado bien porque pues es algo que estaba ahí de prueba Entonces él va a intentar revisar cobertura sobre todo la cobertura básicamente es pues Cuántas líneas de código estamos cubriendo de nuestro archivo fuente Entonces era para que fueran pues como entrando detalle porque ahorita que corramos como cobertura si tenemos que decirle  
Sobre cuál queremos medir la cobertura, que van a ser los archivos fuentes, nunca vamos a medir cobertura sobre nuestras mismas pruebas. Es decir, esto también es código ejecutable, pero no queremos revisar nuestro propio código. Cierto, lo que queremos probar es el código de la aplicación como tal. Entonces era un poco por eso, pero si realmente si tú lo dejas por defecto, él va a ir a buscar en ese en ese pad, pues lo que pueda ejecutar básicamente.  
Si tuviéramos más pruebas, pues también podemos decir listo, quiero correr estas una a una en caso de que tenga errores que tenga un set de pruebas realmente más complejo, pues yo puedo ejecutar individualmente cada una para verificar si alguna tenga un error, pues si ya lo corregí y no tener que ejecutar X cantidad de pruebas que va a demorar más que ejecutar simplemente una.  
Pero sí, pues dependiendo del caso, si utilizamos uno o el otro, listo.

**Alejandro Hinestroza Gomez** 48:21  
De una probabilidad de problema.

**Daniel Rendon Montaño** 48:23  
listo bueno muchachos ya veo que por ahí algunos están enviando la imagen súper bien Salomé voy a continuar entonces acá con la presentación ya sí que vamos a hacer Listo ya vamos a hacer entonces la prueba lo que les teníamos tenemos media horita más o menos Entonces creo que está súper bien porque son tres partes lo podemos hacer  
Esta primera en 5 minutos, esta les podemos dar 15 y esta otros 5 minutos más o menos creo que podemos dar, inclusive les podemos dar sí, creo que está bien, 5, 15, miremos cómo nos va sin esta pronto un poquito más de tiempo y aquí es otro 5 para que validemos, que es la idea muchachos que hagamos primero un tema de análisis, es decir, que ustedes escojan.  
ese archivo que les compartimos, que lo exploren, revisen qué métodos tienen y que es el que puede fallar. ¿Por qué ese punto es tan importante? Porque como ingenieros siempre pensamos en la solución, siempre entramos al hacer, más que al pensar a veces hacer, que no está siempre correctamente. Es decir, no es que no se viene ser proactivos, pero.  
A veces es mejor sentarse, planear qué voy a hacer, ver ese panorama completo y ahí sí hacerlo entonces en esta primera parte precisamente.  
Ya voy a entrar a detalle que vamos a hacer acá, mejor dicho. La idea es que para el ejercicio, pues si se queda alguno bloqueado, nos alce la mano o en este caso nos abre el micrófono, nos comparte en pantalla y revisamos si alguien está bloqueado, cómo lo podemos ayudar. La idea es que construyamos una suite de test funcionando, que construyamos unos cinco test diferentes.  
Posiblemente hay como spoiler van a encontrar errores, entonces acordemos cuando tengamos una prueba que falla, pueden dar dos escenarios: o la prueba está mal implementada y no debería fallar, o el código está mal implementado y está fallando la prueba, porque el código está mal. Por eso es tan importante manejar esa independencia entre el código y la prueba, es decir,  
Pues hay obviamente herramientas con inteligencia artificial que nos van a hacer las pruebas unitarias muy fácil, pero eso no está mal, eso está perfecto. Pero el input que le tenemos que dar siempre es la razón de ser la función y lo que queremos probar. No simplemente cree las pruebas unitarias para este set o para este código, porque eso obviamente los va a hacer y va a  
a forzar a que sí funcionen. Entonces si tengo un error, él va a hacer una prueba para que ese error pase la prueba. Hay que tener esa independencia para poder que las pruebas realmente sirvan para lo que tienen que hacer y detectar los errores. Entonces qué va a hacer para que entremos en detalle. En esta primera fase, la idea es que nos sentemos un momentico a pensar  
que puede fallar, que es como que les decía, un poquito que quitaron ese rol de desarrollo y más de tester. Aquí vamos a dar cinco minuticos, pues por tema de tiempo, vamos hasta las, son las 12:58, vamos hasta las 05, listo 1:05 y para que hagamos esta parte la idea, pues.  
Era hacerlo en grupal, pero pues por ahora hagámoslo individual, pues por tema de virtualidad, la vez que revisen, esta es la tablita que se les propone llenar, que revisen que hace la función super básico. Esto es para así escrito, ojalá lo hagan a mano para que se desconecten un poquito de y que se pongan a pensar qué hace esa función, qué puede fallar y casos positivos y negativos podemos testear. Acuerden que tenemos que pensar siempre no solamente en cómo funcionaría y la prueba.  
que llama un HappyPath, sino cómo puedo hacer que eso falle. Y una prioridad de acuerdo al código. Aquí les tenemos un ejemplo, por ejemplo para transferir el mismo método que estamos utilizando. Entonces, ¿qué hace? Pues transferir dinero entre cuentas. ¿Cómo sé? Pues porque reciben una cuenta A, una cuenta B y después un monto. ¿Qué puede fallar? En este caso, ejemplo, les ponía un monto negativo, que tengamos cuentas inválidas, que hay un saldo insuficiente. Casos positivos transferir  
bien, transferir 0.1 mire que son diferentes, no tiene más sentido que yo hago una segunda prueba de transferir un decimal a que yo con transferir con 200 cierto o puede hacer otra con 1 millón o con 1000 millones qué pasa y hasta dónde pues me deja transferir o qué limitantes técnicas se pueden tener a nivel de ahí y casos negativos que ya son un poquito más diferentes precisamente como salidas de ese  
de ese happy path y que yo quiero hacer forzar a que falle y verificar que mi sistema sí falla correctamente y es voy a transferir menos 100. Entonces, ¿qué pasa si yo intento transferir un monto negativo? Depende de decisiones de negocio, qué es lo que debe pasar o falla o ni siquiera me deja hacer nada o qué es lo que debe pasar.  
Si probamos con una cuenta que contenga letras, también qué pasaría si pongo un monto nulo, por ejemplo, qué pasaría si yo transfiero nada de una cuenta a otra. Esos son ejemplos. Entonces también revisen a nivel de funciones críticas cuáles van a poner. Aquí les demos unas pistas, transferir, calcular intereses, validar cuenta, etcétera. Entonces ya está el tiempo contando, faltan cinco segundos para la una.  
Entonces tenemos literalmente cinco minutos muchachos hasta la 1:05 vuelvo y retomo porfagan el ejercicio todavía no desarrollen nada no empleamente ninguna prueba simplemente siéntense y escriban ahí rápidamente a mano en un Word donde ustedes prefieran y son noticas para ustedes de qué van a aprobar por cada caso ahorita ya vamos a pasar a la implementación y daremos otro tiempito para eso listo  
Entonces por aquí vamos a estar si alguno nos quiere alzar la mano, nos quiere compartir, nos quiere preguntar. Mientras tanto, ahí los dejamos entonces 5 minuticos, voy a poner por aquí, creo que puedo poner un no, aquí no me deja.

**Samuel Daza Carvajal** 53:37  
Daniel, qué pena, te puedo hacer una pregunta.

**Daniel Rendon Montaño** 53:40  
Claro, Samuel Dinos.

**Samuel Daza Carvajal** 53:41  
Es que estaba corrigiendo aquí unos errores que no me daba, pero ya me funcionó. Entonces me puedes repetir exactamente qué es lo que tenemos que analizar.

**Daniel Rendon Montaño** 53:42  
Yes.  
Claro que sí, Samuel. La idea es que revisen el código fuente y que busquen qué puede fallar. Vamos a tener 3 fases, una de análisis, una implementación, otra de validación que es donde vamos a cobrar las pruebas. Entonces en esta primera es más revisar el código fuente, busquen qué funciones hay, qué hace esa función, es decir, tema entendimiento y que planteen los casos de prueba.  
Los casos de prueba positivos y negativos, por ejemplo, para este que les ponemos de transferir. Listo, voy a transferir 100, voy a transferir un número decimal, voy a transferir los negativos un monto negativo, voy a transferir una cuenta que tal vez no exista, voy a transferir un monto nulo. Entonces toca es pensar en qué quiero probar sobre esa sobre esa función. Listo, solamente escrito, por ahora escribanlos en estos 5 minuticos.  
Ya cuatro minuticos en estos momentos y ya ahorita pasamos a la parte de implementación. Listo, queda claro, Samuel.

**Samuel Daza Carvajal** 54:36  
Sí, Daniel, gracias.

**Daniel Rendon Montaño** 54:38  
Listo, con gusto.  
Yo aprovecho alguna parada técnica, muchachos, ya regreso.  
¿Ya estoy por acá 3 muchachos, cómo les fue, cómo vamos?  
¿Todo bien, alguna pregunta?  
Listo, ya se terminó el tiempo.  
Y bueno, no sé si alguno nos quiera preguntar algo, si no pongamos en el chat cuántas alcanzar, cuántos casos más o menos alcanzaron a poner, cuántas funciones o cuántos casos por cada función pusieron más o menos. ¿Cuánto alcanzaron a abarcar?  
Por en que el mínimo debemos tener 5 pruebas, listo.  
La idea es que no probamos 5 sobre transferir, sino que probemos también sobre los otros métodos, pues 2 aquí, 2 allá o las 5 sobre otro diferente a este.  
Me confirman por favor cómo estamos respecto a eso por aquí el chat.  
Listo por aquí video que ahorita nos había enviado super bien, les pueden informar muchachos cuántas cuántos casos tenemos para ver si pasamos la implementación.  
Ahora el micrófonos, no se porque están tan callados.

**Samuel Daza Carvajal** 59:23  
Pues profe, yo por ejemplo, viendo el código de la parte del microbanco, cierto, hay otras funciones, por ejemplo, la de pues yo obviamente estoy analizando, puede que no haya completado todas las 5, pero por ejemplo, está lo de calcular el interés, entonces el interés. Yo creo que hay 2 casos, número uno.

**Daniel Rendon Montaño** 59:26  
Miguel.  
Sí.  
Uh-huh.

**Samuel Daza Carvajal** 59:42  
Si los días digamos que del interés que se pueden generar son cero en total, vamos a entender, son como eso puede ser un caso y la segunda es que la tasa de interés pueda ser negativa, o sea, en lugar de anual del 1.6 o del 8 punto algo que sea menos 6, eso también puede llegar a fallar, generar un bug.

**Daniel Rendon Montaño** 59:49  
Sí, señor.  
Good.  
Súper bien.  
haya llevas inclusive dos más la de pronto la positiva cierto lo que yo les decía muchachos de pensar más allá del happy path que es la positiva no quiere decir que la tengamos que emitir siempre pues también es bueno validarla es decir si yo le pongo listo para revisar simplemente que el cálculo está bien si pongo un monto X si pongo una taza de tan  
¿Cuál debería ser ese resultado y que si me funcione? Listo, súper bien, Samuel, súper bien esos casos que propones. Entonces continuamos con el siguiente punto, muchachos, que ya sí escribir los test. Listo, para esas no voy a tomar entonces, vamos a ver si nos da con 1015 minutos.  
Vamos hasta como unos tres vamos hasta la una y 20 más o menos. ¿Qué hay que hacer? Pues básicamente implementar lo que hablamos allá, ¿cierto? El como ya lo vimos, ya por eso queríamos que implementaran primero la prueba base, ya saben que tienen que tener una parte de setup, tienen que tener una parte del actuar.  
y después nos hacer para validar que eso sí funcionó no funcionó listo entonces en base a las que hayan puesto muchachos al menos que implementemos una una o dos Ojalá alcancemos al menos a tres Yo sé que cinco está pues un poquito retador ira para toda la clase completa En caso que tuviéramos más tiempo pero en temas Pues en horas del tiempo hagamos al menos dos o tres  
Pruebas que implementemos. Listo, entonces voy aquí a reiniciar el timer, que usted lo va a cambiar, pongámosle 10 minutos.  
Bueno, probable 12 minutos.  
minutos y nos da hasta la 1:20 más o menos Listo creo que está súper bien Ahí está 12 minutos muchachos si alguno nos quiere ahorita ir compartiéndonos nos comparte pantalla y la idea es aprovechemos este tiempo también muchachos a que a que pues en un ambiente controlado en el cual nos podemos asesorar pues tengan ese primer acercamiento con esas pruebas y  
Intenten hacerlas a ver que nos encontramos listo, no las ejecuten, eso sí, es la única el único requisito para que las ejecutemos en la fase 3 y miremos si funcionó o no funcionó. Todavía vaya creenlas como crean que deben de funcionar y ahorita revisamos si tenemos errores y ahí sí posiblemente por eso quiero dejar otros 10 minuticos para esa parte para que lo solucionemos y no se vayan con sus dudas.  
Entonces aquí voy a estar igualmente muchachos. Cualquier cosita me levantan la mano, me escriben el chat. También puede ser el chat interno. Cualquier cosa me pueden escribir.  
Voy a estar aquí pendiente de él.  
¿Muchachos, cómo vamos alguna pregunta hasta ahora?  
Pero que ya están implementando bien ahí sus pruebas. Cualquier duda, si no saben cómo implementar algo, nos alzan porfa la mano, pero acá estamos.  
Bueno, nos queda un minutico muchachos, me cuentan cómo vamos para que vamos a ir terminando. Si no han terminado de implementar todos, pues dejamos hasta ahí en un minutico, vamos cerrando para que ya ahorita pasemos a ejecutarlos. Listo.  
En otros 5 minuticos realmente pues eso no demora nada. 5 minuticos ya nos tomamos es resolviendo las dudas y miramos a ver si algunos puede compartir porfa de cómo les fue. Entonces ahí les de último minutico para que vayan cerrando, terminando si tienen de pronto alguna ahí a medias que terminar listo.  
¿Listo muchachos, cómo van? ¿Quieren que les de otros 5 minuticos o estamos bien hasta ahí? Cuéntenme un poquito, porfa, cómo van, cuántas lograron implementar? Si necesita les damos otros 5 minuticos que podemos hacerlo.

**Samuel Daza Carvajal** 1:13:39  
Pues yo, por ejemplo, sí logré implementar 2 mínimo que creo que estén bien, pero yo no estoy seguro, puede que para mí estén bien, pero.

**Daniel Rendon Montaño** 1:13:45  
Súper bien.  
Dale dale que ahorita nos damos cuenta Samuel y el resto compañeros, todo lo estamos haciendo.  
Entre los chicos, la idea es que lo tomen un espacio para ustedes.

**Salome Serna Restrepo** 1:14:04  
Sí, profe, pues yo también aún estoy implementando algunas pruebas.

**Daniel Rendon Montaño** 1:14:08  
¿Listo, baratos en común y listo para que es que yo creo que sí 10 minutos es muy poquito, entonces espérame, yo lo pongo aquí ahí?  
Preming.  
Cancelar y lo vamos a poner de 5 minutos.  
Le va a poner 7 minutos más, listo.  
Ahí pues otros siete minuticos muchachos para que de pronto los que ya llevan alguna, pues puedan hacer otras cosas interesantes también y los que no han logrado terminar, vayan ahí haciendo otras pruebas muchachos para que ahorita que ejecutemos, pues esa es la idea, que vayan cogiendo, claro, pues varios casos de prueba, como se implementan.  
Intenten hacer cosas diferentes a ver cómo nos va, listo y ahorita pues ya ejecutamos a ver cómo qué resultados obtenemos.  
Voy a estar aquí también nuevamente en el chat cualquier cosa me cuentan por el chat interno.  
listo muchachos por aquí nos queda 1 minuto para que vayamos cerrando ya le dije  
Silenciaron, ahí me escuchan muchachos, sí, listo.  
¿Bueno, cómo les fue?  
Quisiera escucharlo saber, aquí tengo el chat abierto, espérenme, se me perdió, es este.  
Se me cloro aquí.  
a ver que dejé ver el chat Ah sí lo veo listo por aquí caja mandó algo Ah no caja muy adelantada ya la ejecutó super bien listo muchachos Precisamente en 6 ven de pronto algunos la imagen yo la pongo acá grande eh de caja ya ejecutó tres pruebas una de tres transferir un monto positivo la de transferencia es al insuficiente y  
y validar cuenta correcta. Entonces ya ahorita si algo miramos que tienen detalle posiblemente y es lo chévere de esto y es que la forma de pensar de cada uno puede ser muy diferente y posiblemente entre todos tengamos pruebas o un set de pruebas muy robusto porque se van a complementar. Entonces qué vamos a hacer? Siguiendo aquí con el orden vamos a hacer el debugging y ejecutar a ver cómo nos fue. Si tenemos las pruebas correctamente así como las que nos mostraba Cadija.  
o si tenemos algún error pues revisamos que Qué pasó listo voy a quitar por acá este timer  
Listo, entonces como vamos a ejecutar muchachos pues no les va a pasar esto por el chat porque es muy corto, realmente lo pueden escribir paytest guión B como vimos que lo ejecutamos igualmente pues si lo crearon en otro pues también lo pueden poner el archivo como revisamos ahora con Alejandro, pues realmente si le pones la carpeta o inclusive hace la parte de buscarlas.  
las los test donde se encuentren realmente Qué resultados podemos tener hay tres posibles resultados muchachos las pases las verdecitas las que vimos ahorita todo está perfecto el test funciona listo las rojitas es que fallaron es porque algo está mal es decir que la cert por ejemplo cuando ponemos una cert de venga este revise que dos  
es igual al resultado, pues si ese resultado no es igual a dos, pues va a decir dos no es igual a uno, entonces la prueba falló. Es importante resaltar que el error es diferente al fail. Listo, el error, si es que hay un error de un problema, hay un problema de sintaxis, por algo está fallando la prueba, pero no porque esté fallando a nivel de ejecución.  
en la validación, sino que de verdad no está pudiendo ejecutar, está encontrando algún problema. Un error muy común es este que les mostraba que les cuenta un poquito el asercio un error es porque básicamente exitoso no es igual a error. Entonces claramente en estos casos pues vamos a tener como les decía ahora dos caminos o la prueba está bien y el código está mal y tenemos que entrar a corregir el código porque antes lo que debería hacer no lo está haciendo correcto.  
correctamente o la prueba nos quedó mal mal implementada Y pues si él debería en este momento estar retornando algo y la estamos validando incorrectamente Entonces no siempre muchachos que tengan una prueba unitaria que falla no siempre cambien la prueba para que pase eso es lo que el mensaje que quiero que también les quede mucho respecto a estas pruebas unitarias porque posiblemente están detectando un error y lo que esté mal es el código  
Les dije este código que está mando de prueba tiene errores. Entonces vamos a ver si ahorita esperaría que con todas las pruebas que hicimos vamos a encontrar algunos de estos. Todas esas recomendaciones siempre el mensaje de error cuidadosamente. Revisemos que está fallando si el test o el código original y si era lo correcto o qué es lo que estamos esperando realmente que saliera.  
Ahorita miramos el tema de cobertura. Listo, primero revisemos este primer punto, quisiera porfa que lo ejecuten, hasta acá, que lo ejecuten. Si alguno tiene un error, por favor, nos manda el pantallazo, nos alza la mano y hasta ahí la primera parte y la segunda, ya de pronto los que ya lo ejecutaron, como los compañeros que nos mandaron por los pantallazos.  
Vamos a revisar la cobertura. ¿Qué es la cobertura o el coverage? Pues en inglés, que es el término con el que más se conoce, es revisar pues realmente nuestras pruebas respecto al código fuente, qué cobertura están teniendo, cuántas líneas de código, digamos que podríamos decir cuántas se están ejecutando cuando ejecutamos nuestras pruebas. Es decir, tenemos un archivo de 100 líneas de código.  
Pero si yo siempre estoy probando las mismas funciones o los mismos fragmentos de código, no quiere decir que yo esté probando todo mi código. Entonces por eso es que es un indicador muy relevante que normalmente en todas las organizaciones se tiene como normal de tener una cobertura, digamos que el valor para que igualmente lo lleven muchas es más o menos casi siempre por más del 70% casi siempre pido una cobertura más del 70 y organizaciones que son un poquito más exigentes.  
y pide el 80 eh tampoco nunca se sube al 100% porque ya precisamente va en uno de los principios que revisamos es falso pues decir que yo voy a tener el 100% de coberturas por qué porque realmente el esfuerzo para yo subir de 90% al 100% 95 al 100 es más el esfuerzo que el beneficio que va a obtener entonces por eso se maneja pues como entre un 70 80%  
De cobertura normalmente. Entonces también los invito a que ejecuten este al menos el primero. Este segundo es porque nos saca un reporte en HTML, el cual es muy detallado, inclusive con este segundo nos dice línea, línea van a ver en ese reporte unas líneas rojas, unas líneas verdes, nos dice cuáles líneas de código se han ejecutado con nuestras pruebas y cuáles no. Entonces eso obviamente nos sirve de guía.  
Voy a hacer una prueba más que esté enfocada en probar, no sé, hay un if else, entonces aprobar no el caso que sea por el if, sino que sea por el else. Entonces, ¿cómo va a haber una prueba para que ejecuten las líneas de código de else y qué debe pasar para yo validar? Pues como en el Acert, pues que debería haber ocurrido y mirar que si funcionó correctamente. Por aquí veo que están viendo varias fotos. Venga, miremos a ver.  
Listo, por acá veo, perdón, cerro esto. Ah no, no me han mandado ninguna otra otro chato. Entonces ejecuten los muchachos, voy a estar aquí atento a ver cómo les va y me alza la mano porfa. O sea esta última parte del ejercicio para que revisemos. Entonces necesitamos un pantallazo, porfa. Los que lo pudieron ejecutar si tienen todo en pase o si tiene algún problema, pues lo mandan también no hay ningún problema porque pues.  
Precisamente tenemos que encontrar errores sí o sí y otro cobertura, esto es un porcentaje, ejecutenlo porfa, mándenos en el chat en cuanto están. Yo esperaría que al menos con esas que ejecutamos con dos o tres sets de pruebas como pues el código es tan pequeño, debemos tener una cobertura al menos 50 por ciento, casi siempre nos da por el 60 65% en otros cursos que lo hemos hecho.  
Entonces miremos a ver cómo nos fue, si mejor o peor, cómo estamos de cobertura. ¿Listo, los que puedan por acá me la mandando en el chat del de la reunión, sino por el interno también voy a estar aquí atento a ver si tenemos algo más, no?  
Si alguien tiene un error, muchachos también lo puede compartir para que lo revisemos.  
Quisiera ver que alguien más lo haya hecho al menos.  
Ahí está el error, muchachos.  
Pero por acá tenemos otra vez Sara.  
listo entonces a Sara le falló la de monto negativo y la de montón súper bien eso puede ser indicio de de algo entonces ahí la invitación Sara revisa porfa yo creo que uno de los bugs si mal no recuerdo es la del monto negativo entonces está está me imagino que tú estás verificando que cuando transfirieras monto negativo posiblemente estás validando que  
Tuviera error y no estás teniendo error, no sé si nos nos puedes contar como la tienes implementada.  
¿Para que no escribió que sí?  
Entonces miren que este es uno de los casos en los cuales ya encontramos un bug, pero no a nivel de la prueba, sino a nivel del código. Entonces aquí lo que se generaría es que tengo que corregir el código para validar el monto, si es positivo o negativo, si es negativo, pues retorno un estatus de error y ahí ya tu prueba pasaría, cierto, ahí cambiamos código para poder.  
la prueba funcionara pero por un obviamente por un sentido que encontramos ya un problema que se puede mejorar a nivel del del código igual con el monto de nombre verifica también yo creo que tocaría hacer las validaciones que hoy no se tienen implementadas en el código para poder salir entonces piensen muchachos de la forma tan sencilla que encontramos posibles errores si uno mira esa  
Esa implementación del método posiblemente diga sí está bien porque al final coge este monto y lo mueve esta cuenta esta cuenta y estamos todo bien. Pero miren que aquí cuando ya pensamos un poquito más allá podemos encontrar cosas, anticiparnos de que una funcionalidad como esta salga producción, en la cual va a tener una cantidad ya expuesta a usuarios finales en los cuales pues precisamente va a.  
Tener todos estos casos que no estamos imaginando y más siempre, obviamente porque está el caso tanto del que pues fue probando que encontró algo como el que es malintencionado, cierto, el que intenta transferir un monto negativo a ver si esa plata se va a su cuenta, si intenta hacer XYZ, todo lo que se imagine, entonces es anticiparnos de como.  
podemos hacer esas pruebas para que algo como esto se resuelva en desarrollo o en Cuba y que no llegue a producción, pues a causar errores o a causar una vulnerabilidad que tengamos pues también de cara a una producción, una aplicación productiva. Listo por tema de tiempo muchachos, entonces paremos el ejercicio hasta ahí. Les agradezco mucho.  
pues el interés a los que lo hicieron, los que suenan por acá a comparación de los resultados. La idea creo que del ejercicio se cumple, que era que se acercaran a este primer punto con las pruebas, con las pruebas, la automatización de pruebas, pues saben que para entregable se les pide pruebas relacionadas también para las historias de usuarios que están implementando entonces para que las tengan por ahí presente. Listo, les agradezco mucho muchachos y por aquí ya  
¿Que nos acompaña Lily, Lily, cómo estás?

**Liliana Gonzalez Palacio** 1:30:13  
¿Hola, bien o no?

**Daniel Rendon Montaño** 1:30:15  
Muy bien, y tú?

**Liliana Gonzalez Palacio** 1:30:17  
Bien, gracias a Dios, Dani, muchísimas gracias por el ejercicio, pues yo creo que más que más que suficiente y más que bueno. Y la forma pues en que lo hiciste me parece pues que facilita mucho que los chicos puedan ir haciendo pues como ese paso a paso y se puedan ir apropiando, pues como ese tipo de cosas que como tú mencionabas, deben estar presentes en la entrega.

**Daniel Rendon Montaño** 1:30:25  
Mhm.

**Liliana Gonzalez Palacio** 1:30:37  
Que viene, pues próxima para el sprint 2. Bueno, ajá, muchas gracias Dani. Bueno, aquí pues hago la emoción de que este tema que vamos a trabajar en este momento ya los chicos que están, los chicos y las chicas que están con Felipe y Wilmer probablemente ya lo vieron. Ellos lo tocaron la clase pasada.

**Daniel Rendon Montaño** 1:30:40  
Esa era la idea.

**Liliana Gonzalez Palacio** 1:30:58  
Nosotros no pudimos tocarlo porque recibimos una visita, pues como muy especial, que también pues nos enseñó bastantes cosas la semana pasada y por eso fue que al principio Daniel mencionaba que íbamos como a juntar 2 contenidos que son importantes, pues en este momento para el grupo que coordinamos Daniel y Liliana.  
Listo entonces para los que son de Felipe y de Wilmer, pues muy bienvenidos y se quieren quedar, pero si de pronto tienen otras cosas pendientes, pues lo pueden hacer sin problema. Listo, muchas gracias, pues como por la participación.  
Bueno, entonces en este momento a Salomé, porfa, le pido que el recorderis que me hizo ahorita por interno me lo haga cuando terminemos de ver esta temática, listo.

**Salome Serna Restrepo** 1:31:46  
Listo, profe.

**Liliana Gonzalez Palacio** 1:31:48  
Bueno, me avisan, porfa, estoy compartiendo la pantalla, me cuentan, porfa, si ya están viendo.

**Salome Serna Restrepo** 1:31:58  
Sí, pero me dije.

**Daniel Rendon Montaño** 1:31:59  
Y solo y ya estamos viendo.

**Felipe Zapata Roldan** 1:32:00  
Sí, ya se ve, eso está bien.  
Se va de ver.

**Liliana Gonzalez Palacio** 1:32:02  
Listo y se puede ver.

**Daniel Rendon Montaño** 1:32:04  
Le dejamos de ver, sí, dejaste compartir.

**Felipe Zapata Roldan** 1:32:05  
sí.

**Salome Serna Restrepo** 1:32:05  
Sí.

**Liliana Gonzalez Palacio** 1:32:07  
yo no sé qué me está pasando pensé que era solo en el equipo de la oficina pero este que trabajo en la casa también la misma cosa debe ser la cuenta que ya cuando comparto pantalla completa me saca me saca el compartir no sé por qué bueno en fin

**Daniel Rendon Montaño** 1:32:21  
Aquí intentas compartir solo la aplicación de pronto.  
Ahí otra vez vemos.

**Liliana Gonzalez Palacio** 1:32:25  
No es bueno, no, pues lo voy a hacer así mejor para no complicarlos mucho. Bueno, chicos y chicas, entonces recuerdan por allá hace unos días que fuimos y conversamos con unas personas en Ipa.

**Felipe Zapata Roldan** 1:32:25  
Por la ventana.

**Liliana Gonzalez Palacio** 1:32:41  
Yo espero pues que sí más o menos recuerden que nos contaron un poquito, hicieron la introducción de usabilidad. Hoy vamos a conversar digamos un poquito cómo aterrizar todo ese tema de usabilidad, pero en el proyecto que estamos desarrollando listo Daniel pues también preparó y se los vamos a poner, pues les vamos a poner ambas presentaciones, una presentación que es mucho más extensa.  
Que tiene que ver, pues como con diferentes tipos de pruebas que se pueden hacer de usabilidad, formas desde remotas hasta presenciales, desde exploratorias, desde sumativas. O sea, hay un montón de formas de ver, digamos, esa usabilidad, pero aquí yo no me voy a concentrar como en mostrarles mucho esos detalles, sino que vamos a conversar sobre lo que se necesita puntualmente para.  
ustedes puedan desarrollar sobre todo ese protocolo de planeación de la prueba de usabilidad listo para que ustedes Entonces si quieren ampliar estos conceptos lo puedan hacer y lo hagan con el material Pues que les vamos a poner nosotros disponible listo Bueno entonces cuando nosotros ya hablamos de usabilidad Pues así como de pronto en otros en otros ámbitos hay unas normas Pues nosotros también tenemos unas normas  
Y particularmente nos vamos a amparar todo lo que vamos a hablar en este momento. Probablemente va a estar amparado en una norma que es un poquito viejita, pero que aún, digamos, no ha sufrido como unas actualizaciones significativas y es la norma ISO 9241. Y esa norma ISO básicamente nos habla sobre ergonomía.  
Y ergonomía es un concepto que probablemente nosotros lo tenemos como muy en el radar, pero por ejemplo, para decir si una silla es incómoda o si algo donde nos vamos a acostar o a sentar o a mover es incómodo. Pero resulta que ergonomía, pues también nosotros lo podemos ver en el ámbito de desarrollo de Soto. Entonces vamos a ampararnos, digamos, como sobre la ISO 9241 para conversar.  
poquito sobre la planeación y la posterior ejecución de la prueba que vamos a hacer con usuarios finales listo entonces básicamente vamos a estar todo el tiempo hablando de 3 cositas por eso es importante también que nosotros se las mencionemos vamos a estar hablando de efectividad de eficiencia de satisfacción y vamos a estar mirando Si todos esos 3 conceptos están  
y digamos que se están viendo claros en un contexto determinado. Por ejemplo, si nosotros estamos desarrollando una aplicación para personas ciegas, probablemente el contexto de esa de ese desarrollo puede ser diferente y el contexto para evaluar la usabilidad puede ser muy diferente a si estamos haciendo, por ejemplo, una aplicación que es para niños y que esos niños ven, por ejemplo.  
Cierto, entonces digamos que ese contexto de uso también sigue siendo muy importante.  
Están viendo todavía mi pantalla.

**Felipe Zapata Roldan** 1:35:24  
Sí.

**Liliana Gonzalez Palacio** 1:35:26  
O K, listo entonces, según la norma ISO, esa que les acabo de mencionar, pero por acá se me fue un guión, esa que les acabo de mencionar que es usabilidad.

**Isabela Acosta Pareja** 1:35:26  
Sí, señora.

**Felipe Zapata Roldan** 1:35:26  
This is sir, sir.

**Liliana Gonzalez Palacio** 1:35:38  
usabilidad es el grado de eficacia eficiencia y satisfacción con la que unos usuarios determinados pues pueden lograr cumplir unos objetivos específicos particularmente en nuestro contexto con el uso de una aplicación que nosotros estamos desarrollando listo si nos vamos un poquito a cada definición esta la vamos a volver a ver ahorita en un ratico  
La eficacia entonces la vamos a evaluar como esa habilidad para que el usuario complete una tarea que le vamos a poner, pero en intermedio o ahí en toda la mitad está nuestro sistema, lo que nosotros estamos fabricando, que ese sistema debe permitir o de facilitar hacer unas tareas determinadas.  
Listo, entonces miren qué eficacia. A veces uno, digamos, piensa que la eficacia es asociada probablemente a tiempo y no necesariamente. O sea, realmente no está asociada a tiempo. La que sí está probablemente asociada a tiempo es la eficiencia. Entonces la eficiencia es el nivel de recursos que nosotros consumimos para poder.

**Daniel Rendon Montaño** 1:36:41  
Eli te muteaste, te acabo de escuchar.

**Liliana Gonzalez Palacio** 1:36:46  
Ay, ¿y eso qué pasó?

**Daniel Rendon Montaño** 1:36:48  
Ahorita Ahorita me pasó, creo que creo que uno puede silenciar a otra persona.

**Liliana Gonzalez Palacio** 1:36:53  
¿Y quién y quién no quiere, pues que yo hable, ves?  
Estoy hablando muy maluco. Ay, ya casi termino muchachos. Bueno, entonces les estaba, les estaba mencionando que la satisfacción es también evaluar un poquito cómo se siente ese usuario al interactuar con nuestro sistema, cuál es la experiencia o cómo se siente al interactuar con ese sistema. Y para eso también digamos hay unas formas de medirlo, cierto.  
Hasta aquí vamos bien.  
listo si están calladitos es porque listo entonces esas pruebas de usabilidad que nosotros vamos a hacer muchachos van a hacer una cosa súper bacana porque ustedes lo que van a hacer es un poco lo que está haciendo esta muñequita aquí se van a parar vamos a hacer las presenciales se acuerdan que ahorita mencionaba que hay muchas formas y Sabores para todo

**Miguel Angel Gomez Olarte** 1:37:26  
Sí.

**Isabela Acosta Pareja** 1:37:26  
Sí, profe.

**Liliana Gonzalez Palacio** 1:37:45  
tema de pruebas y usabilidad particularmente nosotros no lo vamos a hacer en la medida de lo posible no lo vamos a hacer remoto lo vamos a hacer presencial lo vamos a hacer para tratar de recoger unos datos de números y vamos a utilizar digamos unas preguntas que van a estar hechas al principio antes de hacer la prueba durante la prueba vamos a probablemente hablar de algunas cosas mientras que se hace la prueba mientras  
que la hace el usuario final y vamos al final a evaluar Cómo fuese esa percepción o ese sentimiento de ese usuario al utilizar el sistema listo básicamente nosotros lo que vamos a tratar de mirar es cómo esos usuarios pueden completar x tarea que enseguida me voy a parar en los ejemplos que cada uno de de los equipos tiene  
Pueden completar una determinada tarea comprendiendo cómo se hace desde esa interfaz y lograr los objetivos, pues sin tener que repetir mucho o sin tener que preguntar mucho, porque también el rol de nosotros que vamos a hacer los facilitadores de esa prueba, nosotros es cada uno de ustedes dentro del equipo, va, digamos, a influenciar mucho el hecho de que se tergiverse la prueba o la prueba salga bien.  
Listo, les pido excusas chicos y de pronto escuchan niños por ahí hablando. Estoy trabajando desde la casa. Entonces se sienten ya los niños que llegaron del colegio. Listo.  
Bueno, entonces nosotros con lo con lo de los sabores que les mencionaba, podríamos tener, por ejemplo, algo asociado o moderado o algo no moderado. Listo, vamos a ver ahorita cómo lo vamos a hacer, pero en todo caso nosotros lo que sí deberíamos garantizar para el caso del proyecto y de la entrega que que tenemos próxima.  
Es la ejecución de esa prueba, pero presencial. Ojo que aquí, pues para que no se me vayan a asustar, no es necesario que para el sprint 2 ustedes tengan ejecutada la prueba, pero sí es necesario que la tengan planeada. Listo, ahorita les voy a mostrar rápidamente cómo es el formato que ustedes deben entregar, pero.  
Para la próxima entrega no es ejecutada la prueba, es planeada ya para el último sprint, ya sí hay que ejecutar esa prueba y ya entonces la recomendación mía es que una vez tengan claro qué es lo que van a hacer, que eso es lo que vamos a tratar, digamos, como de definir aquí en esta clase, una vez que ustedes tengan claro qué es lo que van a hacer, deberían empezar a reclutar personas, personas que  
Puedan hacer de esos usuarios finales. Listo, no es, digamos, válido, aunque pues hay unos casos donde probablemente nos tocará evaluar. No es válido, por ejemplo, que ustedes pongan a los compañeros de curso de otros equipos a que hagan la prueba. No sería lo ideal, sería lo ideal. Bueno, ya también depende mucho, pues como de negocios. y.  
Acuerdos a los que lleguen con el profesor particular. No sé si en este momento todavía hay conectados chicos que sean de Wilmer y Felipe. Entonces, pues digamos que ahí, en ese caso, ustedes negocian con cada profesor. En el caso nuestro, sí quisiéramos que haya por lo menos uno o 2 usuarios que realmente podrían.

**Felipe Zapata Roldan** 1:40:44  
Analista.  
Okay.

**Liliana Gonzalez Palacio** 1:40:52  
En potencial ser usuarios finales. ¿A qué me refiero con esos chicos que no es tan chévere ni tan válido, por ejemplo, que ustedes son 5 y por acá tenemos al que se está encargando, no sé al que es el scrum master y ustedes ponen al scrum master a que ensaye su aplicación y que ustedes toman resultados, toman tiempos, miran a ver si tuvo errores o no, y eso lo reportan como la prueba. Eso no es chévere.

**Felipe Zapata Roldan** 1:40:54  
Bing.  
No.  
No cabeza.  
Capital Five.

**Liliana Gonzalez Palacio** 1:41:17  
Ni está válido en este contexto de nosotros. Otra cosa que no debería ocurrir, ojalá que no ocurra, es, por ejemplo, usted se apalanca de un compañero de la misma clase para que haga esa prueba de usabilidad de su aplicación, pero resulta que ese realmente no es un potencial usuario final.  
Por ejemplo, les hablo de un caso particular. Aquí hay un equipo que está trabajando con personas con discapacidad visual. Entonces no es válido, por ejemplo, que ese grupo particularmente tome a uno de los compañeros de clase, a no ser que alguno de los compañeros de clase tenga una discapacidad visual.  
No ceguera absoluta, sino otro tipo de discapacidad visual y de pronto lo quieran hacer así, cierto, pero no sería, digamos, un caso donde podamos hablar de que esa persona sí pudiera potencialmente sentir, pensar como un usuario final. ¿Entonces, a qué me refiero con eso? Hay que elegir bien esas personas. Eso no se hace de un día para otro.  
Deberían entonces reclutar esas personas, pensar en recibirlas en el caso o en la medida de lo posible, en la universidad o ir a la empresa con la cual ustedes están trabajando, o sea, hacer el entorno lo más similar posible a cómo sería cuando se interactúe realmente con la aplicación. Hasta ahí es claro.  
Listo, cualquier cosa me hacen una señita o abren el micrófono y me preguntan aquí hay, por ejemplo, un caso donde bueno, este era un profesor de nosotros de este mismo curso. Aquí hay un caso donde donde él está haciendo, por ejemplo, una prueba de de usabilidad y lo está haciendo con un usuario final. Aquí hay una serie de dispositivos.  
¿Que él está utilizando para poder hacer esa prueba, cierto, en el caso?  
Nuestro, probablemente no vamos a tener un montón de dispositivos a disposición, pero sí es importante primero garantizar un espacio, por ejemplo, es una aplicación. Lo que estaba mencionando Daniela ahora es una aplicación de ecommerce. Sería bueno tener, digamos, esa prueba en la cafetería de la universidad. ¿Quién me quién me quiere decir o me quiere responder algo así?  
Sería chévere y nos permitiría, por ejemplo, mirar con tranquilidad si la persona sí está haciendo las cosas, como es si podemos tomar de pronto tiempos, no hay, no va a haber interrupciones. Ese tipo de cosas podrían ocurrir en la cafetería de la universidad, por ejemplo, a las 12:00 del día. Ese sería el escenario ideal para hacer esa prueba.

**Salome Serna Restrepo** 1:43:49  
No, pero pues es 1 hora de almuerzo, hay mucha distracción, cero concentración, no cero ideal.

**Liliana Gonzalez Palacio** 1:43:54  
Exactamente, entonces eso probablemente bueno, digamos que listo, no es que ya el entorno real tendría que ser así. Bueno, listo, digamos que puede ser una justificación, pero ahí se nos complica, por ejemplo, el tema de medir tiempos, medir cuánto se demoró haciendo la tarea, se nos se nos dificulta un poquito, por ejemplo.  
Saber si las caras que está haciendo la persona mientras que interactúa con la aplicación tienen que ver con no sé con que no está entendiendo cómo tiene que interactuar con la aplicación o si está haciendo mala cara es porque ve que hay mucha gente y mucho tumulto, cierto. Entonces la recomendación es que elijamos un lugar, ojalá digamos como.

**Felipe Zapata Roldan** 1:44:21  
No.

**Liliana Gonzalez Palacio** 1:44:32  
Pues tranquilo en solitario en la medida de lo posible, salvo otros casos, cierto, por ejemplo, nuevamente vuelvo a la prueba que probablemente las personas que tienen en este momento desarrollo para personas con discapacidad visual pudieran tener que hacer y como es un algo que de pronto se requiere, mientras que la persona va transitando por la universidad, entonces probablemente en ese caso.  
Se podría elegir ojalá un horario del día donde no haya, digamos, tanta afluencia de personas para poder estar un poquito más tranquilos haciendo la prueba. Entonces, en resumen, hay que tratar de buscar unas condiciones favorables para poder tomar, digamos, como esos datos que nosotros necesitamos tomar y para estar lo más concentrados que se pueda en hacer esa prueba.  
Listo.  
cuando nosotros estamos haciendo esa prueba Entonces lo primero les estoy mencionando es planificar esa sesión cierto y realmente Este es el paso que nosotros les estamos pidiendo para el siguiente Sprint Listo ya para el último Sprint sí les estamos pidiendo todo lo demás todo lo demás es reclutar los participantes diseñar o pensar digamos  
¿Puntualmente, cómo voy a poner a ejecutar esa persona la tarea? Porque en la planificación ya quedó un poco, digamos, esa planificación de tareas, celebrar o ejecutar la sesión como tal, siguiendo ese protocolo que es el que vamos a diseñar, vamos a tratar de diseñar y dejar muy listo hoy y analizar cuáles fueron los resultados. Cierto, probablemente nosotros en el alcance del curso no vamos a alcanzar.  
Bueno, valga la redundancia, no vamos a alcanzar a hacer digamos como un una siguiente iteración para si nos dijeron, vea ese botón no se entiende ahí, no está haciendo la función que se tiene que hacer, entonces mueva el botón para otro lado o ponga otra funcionalidad. Probablemente esas cosas algunas de pronto las vamos a poder alcanzar a hacer, otras probablemente no.  
Cierto, pero igual vamos a hacer ese análisis de esa información que nos resultó listo entonces para la planificación de esa sesión.  
Importante algunas cosas aquí, por eso se ponen, digamos, como en la presentación resumida. Recuerden que hay una presentación de estas que también la vamos a poner, que es en extenso, que tiene otro montón de cosas que les pueden ser útiles. Errores comunes. Si usted no planea la prueba y tiene que ver, digamos, como con estas 3 primeras cosas.  
No define esos criterios de éxito o cómo va a medir, no define o no dice cuáles son las tareas concretas y correctas como se tienen que hacer y no hace el reclutamiento de participantes, sino a última hora cuando ya tiene que ejecutar la prueba. Eso es un error que puede resultar nefasto para la hora de hacer esa prueba como tal.  
Otro error y lo puse en rojito porque es, digamos, muy tendemos mucho a hacer eso, es guiar a los usuarios en el proceso de la prueba. Por ejemplo, yo necesito que un usuario utilice Google Maps para orientarse y poder llegar de la casa hasta la Universidad EAFIT.  
Y entonces yo miro cómo está empezando a utilizar el usuario final esa aplicación y empiezo a decirle no, pero mejor hacele por acá, no será que de pronto te metes por este otro lado, no métele este dato, no métele esta otra cosa. Ahí usted ya empezó a meter la cuchara y ya se tiró la prueba, cierto, usted no debe como moderador de la prueba, nosotros grupo de trabajo vamos a hacer es los moderadores.  
No debería decirle esas cosas al usuario, porque entonces ahí usted ya no está permitiendo que fluya esa ese momento en el que él va a hacer la tarea a través de su aplicación y probablemente entonces ya ahí usted no. Los datos que usted capture no van a ser válidos. Listo.  
Otra cosa es simplemente tirarle ahí la aplicación al usuario final y decirle.  
Hágalo y usted no está pendiente de nada y entonces probablemente ese participante también dice si si nadie me está parando hola, yo para qué voy a decir si me gustó o no me gustó, si encontré dificultad en esto o en esto, pues para qué voy a decir yo nada, no hay necesidad de decir nada cierto y realmente todos esos comentarios que nos van haciendo los participantes mientras que están  
con la aplicación hasta las caras que hacen por eso lo vamos a hacer presencial es tan importante para nosotros saber qué tan usable resultó esa aplicación que nosotros estamos diseñando listo otra cosa es usted empezar a enredarlo con siglas y con cosas a ese usuario final con siglas y con cosas relacionadas con el área de conocimiento cierto  
No es que entonces la aplicación se hizo en Node JS y se hizo en esta otra cosa y con bases de datos de tal de tal tipo o empezar a utilizar terminología propia, por ejemplo, de UX, que es lo que vamos a hacer nosotros pruebas de UX, cierto, trate de ser muy sencillo en el discurso, trate de ser muy sencillo en lo que le explica al usuario listo independiente de que su usuario.  
Final en este momento sea, digamos, una persona técnica. Por ejemplo, lo ideal sería que esa persona, pues del común encuentre también esa prueba muy común, cierto listo por acá también. Probablemente hay una cosa que es un error común y probablemente nosotros por tiempo no vamos a alcanzar a hacer más o varias rondas de pruebas de usabilidad, pero.  
En la realidad no deberíamos tener solo una ronda de pruebas de usabilidad. Listo, y otro error común es que el moderador, o sea, nosotros como equipo de trabajo.  
Queremos como que el usuario final a cuesta de lo que sea diga, es que esto está bien así. Nosotros debemos dejar que fluya la prueba y permitir que ellos hagan lo que tienen que hacer, ir tomando tiempos, ir tomando otros otros detalles que nosotros establezcamos en nuestro protocolo y pare de contado.  
Listo hasta aquí vamos bien.  
¿No hay preguntas por ahora, todo bien?  
Listo, no, por acá no veo como nada adicional. Listo, entonces todo esto que nosotros estamos haciendo o ese enfoque para tener nuestras pruebas de usabilidad, vamos a utilizar un enfoque que se llama el enfoque HDD o vamos a hacer ese enfoque orientado o guiado por hipótesis. Listo, y las hipótesis enseguida vamos a aprender un poquito cómo hacerlas.  
listo en resumen porque estamos hablando de que nuestro enfoque es este Porque nuestro enfoque no va a dejar Digamos como la prueba al azar No yo le entrego a mi usuario la aplicación y empiece a interactuar con ella y yo voy tomando nota de lo que usted va a ir haciendo cierto o sea no tenemos no le no sabemos qué tarea lo vamos a poner a hacer no sabemos qué es lo que vamos a medir o sea una

**Felipe Zapata Roldan** 1:51:05  
Sí.

**Liliana Gonzalez Palacio** 1:51:07  
Supremamente abierta y a ver qué sale. Eso no es lo que nosotros vamos a hacer. Nosotros vamos a pensar alrededor de unas hipótesis que sean explícitas, que sean comprobables, que sean claras y que se las digamos a nuestros usuarios finales. Listo.

**Felipe Zapata Roldan** 1:51:14  
I'm not with...

**Liliana Gonzalez Palacio** 1:51:23  
Entonces, cuando pensamos en esas pruebas orientadas por el por el modo HDD orientado por las hipótesis, entonces nosotros lo primero que vamos a hacer es identificar, digamos, qué es lo que vamos a poner a hacer a ese usuario, cierto, y qué es lo que queremos con esa prueba. Listo, vamos entonces a formular a partir de eso una hipótesis.

**Felipe Zapata Roldan** 1:51:26  
Sí.  
Yeah.

**Liliana Gonzalez Palacio** 1:51:45  
Vamos a hacer ese diseño de la prueba, vamos a estar midiendo resultados, vamos a analizar después si la hipótesis se validó o no. Y bueno, idealmente necesitaríamos iterar y mejorar, pero como yo les mencionaba ahorita, pues por temas de tiempo no nos da digamos como para iterar varias veces y hacer las cosas, pero sería lo ideal y es lo que pasa en la realidad cuando a usted lo ponen a hacer estas cosas.  
Pero en una empresa y pues también nuevamente decirles que a pesar de que hay robots para un montón de cosas que probablemente esto se puede conversar mucho con una prueba en tu end, realmente esto todavía no ha sido reemplazado por completo, por ni por las ias, ni por los robots, ni por toda la tecnología que hay disponible. Listo entonces ahora.  
Después de estos contextos iniciales, ahora sí vamos a ver un ejemplito y vamos a ir. Yo les voy haciendo pregunticas, sobre todo a los a los chicos que están, pues con nosotros, con Daniel y conmigo para que me vayan contando qué pondrían en algunos puntos de ese protocolo. Listo dentro del material que nosotros ya les dispusimos en la carpeta está este protocolo.

**Felipe Zapata Roldan** 1:52:50  
Is.

**Liliana Gonzalez Palacio** 1:52:52  
Y hay un ejemplo, cierto, es el ejemplo de cómo deberíamos hacer la planeación de la prueba. Listo para el.

**Felipe Zapata Roldan** 1:52:58  
Lili, Lili, hay una, hay una mano levantada.

**Liliana Gonzalez Palacio** 1:53:01  
O K, atina, se dice así, atina.

**Felipe Zapata Roldan** 1:53:05  
Y.

**Athina Cappelletti** 1:53:07  
Sí, usted mencionaba que no puede ser todavía, pues todavía no ha sido reemplazada por inteligencia artificial ni nada, pero ¿por qué?

**Liliana Gonzalez Palacio** 1:53:17  
Pues a ver si vamos a lo cierto, realmente usted sí podría hacer, por ejemplo, que un robot, así como lo mencionaba ahorita Daniel, usted podría hacer que un robot haga, digamos, de principio a fin, unas tareas específicas, cierto, y usted puede estar midiendo tiempos y que el robot, digamos, simule o se comporte como un usuario final.

**Felipe Zapata Roldan** 1:53:18  
Yes.

**Liliana Gonzalez Palacio** 1:53:36  
Eso sí lo puede hacer usted, cierto, pero hasta el momento y también como la forma en que nosotros estamos pensando que vamos a hacer esa prueba, probablemente por ejemplo la cara o de desagrado o de agrado o de frustración o de otro montón de cosas que usted puede capturar, por ejemplo, en una prueba que no es remota, sino que es presencial como la vamos a hacer nosotros.

**Felipe Zapata Roldan** 1:53:39  
What's it?

**Liliana Gonzalez Palacio** 1:53:55  
Probablemente esos efectos y esos detalles que usted captura, por ejemplo, en ese tipo de interacciones diría yo que todavía no son del todo reemplazables, aunque pues la verdad probablemente también me vas a decir, pero ya existe esta aplicación que usted simplemente dice le dice a la aplicación que primero tiene que hacer esto, que después se tiene que hacer esto, que después tiene que hacer esto otro y que.  
Se comporte como un usuario final y yo le digo cómo es ese usuario final y entonces él también digamos va a hacer cosas cierto, incluso también ahí en este momento forma de usted imitar y nos contaban en una en una clase anterior nos contaban que ahorita, por ejemplo, las empresas para reclutamiento están muy preocupadas porque se están presentando personas que hacen entrevistas virtuales.  
Y en esas entrevistas entrevistas virtuales ponen, por ejemplo, fachadas de caras que se parecen a la persona que supuestamente se está presentando y al final esa persona digamos que está siendo suplantada como por una inteligencia artificial que hace las cosas muchísimo mejor. Entonces, de pronto digamos que eso tiene como todos los matices que tú quieras. A eso me refiero cuando.  
Pues cuando digo que no del todo reemplazadas, no sé si alguien quiera agregar algo más de mis compañeros.  
A esa pregunta.

**Felipe Zapata Roldan** 1:55:05  
Sí.  
Sí, Lili, yo personalmente adicionaría que hay un asunto subjetivo y emocional que aunque yo entrene o que al menos tenga una IA, que tenga unos sets de entrenamiento específicos, esa de emocionalidad, digamos, como hace parte del...  
A ver, mejor dicho, la respuesta emocional que yo tengo frente a algo, en este caso un producto y un producto de software, depende de mi estructura cognitiva y depende de mi bagaje o de mi historial. En ese sentido, entonces, precisamente toda respuesta emocional es diferente a pesar de que tengamos  
algunas cosas en común. Entonces, ¿qué es lo que pasa con una IA? Una IA no tiene en cuenta la variabilidad que hay, ni tampoco todos los backgrounds y todo, digamos, las experiencias previas que tenemos y todas las estructuras cognitivas. Entonces yo podría tener, y la mayoría de las IAs lo que son es, son una gran red neuronal,  
montada y que tiene muchos nodos cuando hablan de la cantidad de nodos que hay detrás o de los puntos de entrenamiento, pues hablan de miles de millones y básicamente lo que hacen es que entrenan una red neuronal. Entonces esa red neuronal va a tener fijados unos sesgos específicos de ese conjunto de entrenamiento.  
Entonces es muy difícil en este momento, obviamente, generar una variabilidad y sobre todo, pues como lo mencionaba Liliana, el tema de la aproximación basada en hipótesis, precisamente la hipótesis casi siempre está dirigida a un grupo poblacional específico. Es decir, cuando yo formulo una hipótesis, yo digo, ah,  
Para las personas entre tantos y tantos años que utilizan estaciones de carga, las estaciones de carga tienen unas pantallas o inclusive las, no sé si quienes hayan utilizado el sistema de bicicletas públicas de en cicla, que hay unas estaciones automáticas que tienen un software. Uno puede plantear una hipótesis precisamente para la demográfica específica  
y la va a ir a comprobar, y la va a ir a comprobar estadísticamente y la va a ir a comprobar subjetivamente. Entonces ahí es donde por ejemplo las ideas no han llegado a ese nivel de detalle. No sé si Wilmer o Daniel tendrían algo para adicionar también ahí, o alguien más del público.

**Liliana Gonzalez Palacio** 1:57:29  
Gracias, David.  
El resumen, muchachos, es que o sea, para ser muy sincera, prácticamente todo lo que nosotros estamos haciendo y estamos viendo en este momento que está ocurriendo, pues en nuestra vida y en nuestra sociedad, pues prácticamente todo podríamos decir que se reemplaza cierto por la tecnología, por las ias, por esas, por los agentes, por todas esas cosas, pero digamos que eso tiene como todos sus matices, cierto.

**Felipe Zapata Roldan** 1:57:52  
No se sabe que estamos.  
Mhm.

**Liliana Gonzalez Palacio** 1:58:20  
podemos reemplazar y qué cosas no a que un gerente o una persona muy estratégica y una organización se puede reemplazar. Pues cómo les parece que en una conversación que tuvimos el miércoles pasado un estudiante como ustedes le preguntó a una persona que es un CTO de una empresa grande, le preguntó, venga a usted le pueden reemplazar ese cargo de CTO y esa persona dijo sí.  
Con la mayor tranquilidad del mundo, entonces dice uno de madre, pero si a un CTO lo pueden reemplazar, entonces a mí que yo soy un mortal común y corriente será que no me van a reemplazar. También está en nuestro nivel de adaptación, está en la forma en que nosotros vayamos digamos adaptando y mejorando y evolucionando nuestras tareas para aportar más valor. Yo creo que en ese en eso está el detalle.  
Para que no nos vayamos a paniquear que es que para qué estudiamos entonces si no vamos a tener trabajo ni quiera.  
No sé si de pronto algún otro compañero quiere agregar algo a la discusión.  
Mhm.

**Daniel Rendon Montaño** 1:59:17  
No, Lili, súper de acuerdo con lo que con lo que mencionan.

**Liliana Gonzalez Palacio** 1:59:17  
Bueno, listo.  
Okay, bueno, entonces aquí ya en el ejemplo que les pusimos, pues en plataforma, básicamente vemos que el protocolo es muy sencillo. O sea, para este siguiente sprint no es tanto el complique. Ojo que el complique va a ser, digamos, ir reclutando los usuarios finales, ir programando cuando se va a hacer la prueba, sepa.  
espacio que nos quede en un espacio chévere, ojo que aquí hago el asterisco los que de pronto quieran hacer la prueba, por ejemplo en la universidad y no en la empresa donde están trabajando y quieran un espacio, digamos que de pronto no puedan reservar alguno de ustedes nos avisan por favor a los profes y nosotros tratamos de buscar la forma de reservarles o una sala o algún espacio.  
Antes nosotros hacíamos este tipo de pruebas en un laboratorio que se llama el mercalab, pero en este momento no está tan fácil reservar, digamos ese espacio y digamos que también había una cosa muy chévere y era que utilizábamos dispositivos como el itracker, que en este momento no los vamos a utilizar, pero eso no significa que nosotros o no podamos hacer la prueba y no la podamos hacer con buena calidad. Cierto no significa que porque no tengamos ese itrack.  
Entonces no vamos a poder medir el tiempo de la persona, no vamos a poder medir sus reacciones, no vamos a poder medir cuántas veces hizo bien la tarea y cuántos clics dio. O sea, igual lo podemos hacer. Va a ser un poco más manual, pero igual lo podemos hacer listo.  
el caso del ejemplo ustedes van a ver aquí que lo que estábamos haciendo era por ejemplo medir o mirar cómo estaba funcionando una aplicación web que hicieron unos chicos hace unos semestres en el mismo curso pero para agendamiento de promotorías para una empresa determinada que incluso ahí empieza digamos como un poco el contexto que mencionaba Felipe para cuál empresa y qué es lo que vamos a probar  
Entonces, básicamente el objetivo general de nosotros de la mayoría, yo creo que va a ser muy parecido a esto, cierto, si le queremos agregar detalles, como los mencionaba Felipe, que son supremamente valiosos, por ejemplo, vamos a probarlo con personas que están entre los 50 y los 60 años o vamos a probarlo con las personas que están ubicadas en la ciudad de Medellín.  
O vamos a probarlo con personas que tienen formación en tecnología de tales y tales cosas. Lo podemos agregar, o sea, podemos poner, digamos, esos detalles, pero en general nosotros queremos mirar si la experiencia con la aplicación que nosotros estamos construyendo.  
Es eficaz, es eficiente y es satisfactoria para ese usuario final. Listo, entonces aquí y antes de continuar, me gustaría que rápidamente alguno de ustedes me diga cómo cambiaría este objetivo principal para el caso de del proyecto que ustedes están desarrollando.  
¿Si me quiere decir por encima, cómo sería ese objetivo principal?  
Pregunto yo.  
Bueno, yo pregunto yo entonces, por ejemplo, Moisés, ¿tú cómo pondrías ese objetivo general, ese objetivo principal? Perdón en este protocolo para investigación de usuarios.  
Para el caso del proyecto de ustedes.

**Felipe Zapata Roldan** 2:02:46  
O inclusive si alguien se anima, si está pensando en una funcionalidad o en un específicamente en un módulo que ya tienen concebido, puede haber un objetivo determinado para ese módulo. Claro que.

**Liliana Gonzalez Palacio** 2:02:49  
Ajá.  
Para ese módulo sí podría ser también.

**Felipe Zapata Roldan** 2:03:04  
Claro que en términos de usabilidad debe haber consistencia, pues en todo y debería evaluarse, pero ustedes podrían decir no, en el módulo de creación de usuarios, en el módulo de agendamiento, puede que ustedes tengan una hipótesis ahí. Espérate Juan José, adelante.

**Liliana Gonzalez Palacio** 2:03:21  
Juan Jose Baron, cuéntanos.

**Juan Jose Baron Osorio** 2:03:24  
Sí, profe, pues por ejemplo, consideraría que ese objetivo principal dentro de nuestro proyecto, que nosotros somos First, el sistema de recomendaciones, pensaría que nuestro objetivo principal es que el usuario pueda tener todas las opciones de interacción correctas con su grafo de recomendaciones. ¿A qué nos referimos con esto? Pues que tenga la oportunidad de.

**Liliana Gonzalez Palacio** 2:03:32  
Mhm.

**Juan Jose Baron Osorio** 2:03:46  
Hacer las consultas de lo de a través de la recomendación que está pidiendo, que pueda revisar los lugares, que esto les aparezcan organizados con todas sus especificaciones.

**Liliana Gonzalez Palacio** 2:03:57  
Okey, listo, eso está súper bien.  
Ay, Juan José, se me olvidó el nombre. Perdón, eso está bien, Juan, aquí estás mencionando una cosa super interesante y es ya el detalle de cosas que vamos a poner a hacer al usuario. Listo, esto está dentro de las tareas que le vamos a indicar a ese usuario, cierto, porque es más fácil si tú le dices a un usuario con el cual vas a probar tu aplicación.

**Juan Jose Baron Osorio** 2:04:03  
If.

**Felipe Zapata Roldan** 2:04:03  
Sí, answer.

**Liliana Gonzalez Palacio** 2:04:22  
Vamos a entrar a la aplicación y vamos a hacer el login del usuario, o sea, vamos a entrar a la aplicación como tal. Aquí hago un asterisco importante, nosotros no tenemos que probar todas las funcionalidades de la aplicación para el caso, pues de del proyecto que estamos desarrollando. ¿Cuáles vamos a elegir? Vamos a elegir las que sean más críticas.

**Felipe Zapata Roldan** 2:04:29  
Hey.

**Liliana Gonzalez Palacio** 2:04:42  
listo entonces probablemente para el caso de todos nosotros para el caso de los proyectos que ustedes están desarrollando probablemente elegir por ejemplo la parte de login de usuario no es la tarea más adecuada para que tú elijas para hacer las pruebas en el caso por ejemplo de eh Juan que está mencionando que están trabajando es con un eh grafo de recomendación  
Probablemente sí puede ser una tarea muy interesante para probar ese revisar lugares, indicar cuál es la recomendación que yo quiero recibir y mirar cuál fue el resultado. Esa probablemente sí es una tarea interesante para probar en esta prueba con usuarios finales. Listo.  
Entonces Moisés, ya está, ya puedes hablar.  
Bueno, Moisés como que conectó el computador y lo dejó por ahí pensando, entonces sigamos por aquí.  
En general, vamos a poner entonces aquí muy grande, muy grande, porque ahí van a estar todas las tareas y todas las hipótesis que nosotros vamos a desarrollar y las que vamos a probar. Listo, hola.

**Isabela Acosta Pareja** 2:05:48  
You long.

**Felipe Zapata Roldan** 2:05:52  
Alone.

**Isabela Acosta Pareja** 2:05:53  
Hola, profe, por ejemplo, desde nuestro caso que el proyecto es Rally Motors, que es toda el gestionamiento como de agendamiento por parte, por ejemplo, el cliente y también gestionar como módulo de administrador. Nosotros también como usabilidad pensábamos esto que veníamos hablando, por ejemplo, en las reuniones que colocar como.

**Liliana Gonzalez Palacio** 2:05:57  
T.  
Mhm.

**Isabela Acosta Pareja** 2:06:14  
Diferenciar cuando los campos son obligatorios, cuando los campos no son obligatorios. También ser específica, por ejemplo, en la parte de agendamientos, ser como más realistas. Si tenemos que aclarar algún tipo de información, dejarlo explícito como en la interfaz para que se sea consciente como de lo que puede pasar en diferentes módulos.

**Liliana Gonzalez Palacio** 2:06:19  
Mhm.

**Isabela Acosta Pareja** 2:06:37  
Siento que se ha identificado como más que todo esos aspectos.

**Liliana Gonzalez Palacio** 2:06:44  
Okay está muy bien eso que tú mencionas es digamos la forma de nosotros facilitarle la vida a ese usuario final cierto pero a la hora de yo elegir por ejemplo la tarea no el objetivo principal porque probablemente el objetivo principal casi que va a ser igualito pero con el nombre de la aplicación de cada uno y con el nombre de la empresa donde están trabajando y listo cierto va a ser digamos como muy parecido para todos pero por ejemplo en el caso tuyo en el caso de de

**Felipe Zapata Roldan** 2:06:47  
Estoy cantando para mañana.  
Yeah.

**Liliana Gonzalez Palacio** 2:07:08  
rally motos, ustedes iban a agendar, por ejemplo, una asesoría, cierto, entonces una tarea que sería muy bacano que ustedes incluyan dentro de las dentro del trabajo con usuarios finales es que pueda efectivamente agendar esa esa cita para poder recibir la asesoría y agendarla significaría entonces todos esos pasos que tú mencionabas y lo de ponerle los asterisquitos del campo obligatorio.  
o hacerle digamos la interfaz ciertos ajustes para que sea más fácil de entender, probablemente va digamos a impactar. Es a la hora de tú mencionar cuánto se demoró la persona haciéndolo, si tuvo una tasa de éxito, o sea, sí, sí pudo finalmente realizar esa actividad completa o no lo pudo hacer. Listo entonces puntualmente en el caso de ustedes rally motos.  
Probablemente una de las tareas que vamos a tener en cuenta ahí presentes va a tener que ver con el agendamiento de esa asesoría, o sea, que el usuario final pueda agendar una asesoría con un asesor determinado. Incluso nosotros dentro de la tarea podemos especificar eso, que el asesor o que el nombre de usuario tal.

**Felipe Zapata Roldan** 2:08:01  
Y.

**Isabela Acosta Pareja** 2:08:25  
Listo, pero muchas gracias.

**Liliana Gonzalez Palacio** 2:08:27  
Listo aquí en la metodología simplemente lo que vamos a decir es pues que nosotros estamos haciendo o vamos a hacer una planeación, vamos a hacer una un reclutamiento de personas, los vamos a llevar a la universidad, vamos a explicarles un poquito de qué se trata como la prueba van a empezar a hacer la prueba nosotros como moderadores vamos a hacer digamos como una serie de.

**Felipe Zapata Roldan** 2:08:36  
O sea, lo estoy haciendo.

**Liliana Gonzalez Palacio** 2:08:46  
preguntas como que desaten como esa esa interacción de esas personas con la aplicación y al final vamos a ejecutar o bueno, vamos a estar tomando ojo que este este esta metodología de pronto está muy chiquita, muy cortita y hay que ampliarla más, hay que explicar con más detalle qué es lo que nosotros vamos a hacer, o sea, cuál es el paso a paso.  
Y el paso a paso por allá, por ejemplo, en el desarrollo de la prueba, probablemente va a tener y nosotros vamos a estar midiendo tiempos en los que se ejecuta la tarea. Vamos a estar mirando si la persona pudo o no realizar la tarea que le pedimos y vamos a estar tomando atenta nota y grabando que dijo esa persona que cara hizo la persona. O sea, vamos a estar como muy pendientes de cómo está interactuando esa persona.

**Felipe Zapata Roldan** 2:09:07  
Sí.

**Liliana Gonzalez Palacio** 2:09:30  
Aquí hay un tema interesante, chicos, nosotros dentro del ejercicio que vamos a hacer como parte de la clase, debemos definir un conjunto determinado de usuarios. Entonces, además de reclutarlos, también es muy importante organizarnos como equipo. No vayan a salir, por favor, que como fulanito de tal del equipo es el que está encargado de esas pruebas. Entonces solamente ese esa persona va a estar presente en la prueba porque ojo en la

**Felipe Zapata Roldan** 2:09:45  
Transport.  
Actually.  
A los cambios de paz.  
Pater.

**Liliana Gonzalez Palacio** 2:09:55  
prueba se necesitan yo creo que se necesitarían todos los del equipo y por qué se necesitan porque tiene que haber una persona que esté grabando porque tiene que haber una persona probablemente con un protocolo con una tablita para ir diciendo Liliana que estaba haciendo la tarea de de ir la asesoría Se demoró 7 minutos pidiendo la asesoría van a estar tomando fotos también van a estar pendientes como de la logística de la prueba eso significa que no  
No deberían dejar solo al personaje del equipo que está encargado de pruebas, o sea, deben estar todos muy pendientes para que la prueba salga bien, listo.

**Felipe Zapata Roldan** 2:10:29  
Lili, si se sugiere que mínimo 3 que haya una persona pendiente del producto como tal, o sea, en este caso producto de software, si por ejemplo están haciendo algo tipo mago de voz o es el prototipo funcional o es una maqueta, que esa persona esté pendiente de que esa cosa esté funcionando.

**Liliana Gonzalez Palacio** 2:10:36  
Mhm.

**Felipe Zapata Roldan** 2:10:50  
otra persona que es la que está de cierta forma como anfitriona, como siguiendo el protocolo y llevando el flujo de la prueba y ahí mínimo una tercera persona que es la que está registrando. Eso es el mínimo. De nuevo, involucran a todo el equipo para que bajen las cargas en términos de la prueba.

**Liliana Gonzalez Palacio** 2:11:05  
Ajá.  
Total, gracias Pipe. Hay otra cosa, chicos, superimportante y es y es también importante mencionarlo incluso aquí en la metodología. Ojo que aquí está muy chiquita esa metodología, hay que ampliarla, ampliarla. ¿Con qué datos? Por ejemplo, sería muy chévere que ustedes tengan claro si van a hacer la prueba en los equipos.  
De las personas que vienen a hacer la prueba y entonces tienen que estipular un tiempo antes para poder instalar en ese equipo de esa persona o si van a hacer la prueba en equipos de ustedes. Por ejemplo, lo digo porque sé que aquí ya hay un equipo que empezó, digamos, como hacer ese ejercicio y por las características de la aplicación.  
Necesitaron instalar lo que se llevara de la aplicación en los celulares de los usuarios finales, porque si lo hacían en los celulares propios o en los celulares del equipo, podría resultar, digamos, como más o fallida incluso la prueba, porque digamos que hay unas características que tienen esos celulares de esos usuarios finales que son diferentes.  
Volvamos otra vez a ese ejemplo que les menciono. Estamos hablando de un caso de las personas que están trabajando con personas con discapacidad visual. Estos usuarios tienen activo su lector de pantalla y para, digamos, poner a funcionar ese lector de pantalla y familiarizarse como con las cosas, es un poquito más demorado, digamos como esa curva de aprendizaje. Entonces es difícil entregarle a una persona ciega otro celular que no sabe.  
manejar y que haga la prueba sobre ese celular diferente puede impactar negativamente esos registros que nosotros hagamos. Entonces, si ustedes están ante el caso no de las personas con discapacidad visual, sino ante un caso donde es más importante analizar en qué equipo lo voy a instalar, en qué equipo lo voy a probar. Es importante que también eso vaya aquí en metodología.  
Listo.  
Bueno, entonces, continuando aquí en metodología, entonces deberíamos nosotros decir todos los detalles, todos los detalles y el paso a paso de esa prueba.  
Listo.  
Por acá, por ejemplo, hay un poquito de logística, cierto, listo. ¿Cuáles son los datos de dónde lo voy a hacer, qué en qué fecha lo voy a hacer, cuál va a ser la hora? O sea, una agenda planeada. Aquí hay otro tema súper interesante, no es recomendable que ustedes citen a todos los usuarios finales a la misma hora y entonces digan, no, es que fulanito de tal se va a sentar con este usuario.  
Y el otro integrante del equipo se va a sentar con este otro usuario y en simultáneo vamos a hacer todas las pruebas para que salgamos en una horita. Muchachos, para estas pruebas traten de ser por favor conscientes de que se demora.  
Y hacerlo, ojalá como secuencial o programarlo en diferentes momentos del tiempo, pero que todos puedan estar atentos a la misma prueba. Listo, o sea, no que estén haciendo en simultáneo tareas porque les puede resultar un poquito más difícil hacerlo.  
Bueno, entonces aquí miren que por ejemplo decíamos que teníamos un técnico, bueno es el caso del laboratorio donde lo donde lo hacíamos antes, pero si deberíamos tener si no es el técnico, deberíamos tener alguien como decía ahorita Felipe, que esté muy encargado por ejemplo de los detalles de logística, que el equipo esté funcionando, que la aplicación esté instalada.  
O sea, como todas las todas las cosas que son como de detalles para poder arrancar con la prueba. Listo, tenemos 2 moderadores o cuántos moderadores vamos a tener listo aquí, por ejemplo, está súper general, también sería mejor que cada persona tenga más pocas tareas, una persona tomando nota, una persona haciendo la presentación inicial de la aplicación, una persona diciendo.  
o pendiente de bueno que sí se vayan siguiendo los tiempos o sea ya se ya nos cogió la tarde porque está esperando el otro el otro usuario final para hacer la prueba por último y pues de pronto no menos importante estas estos usuarios ustedes deberían poder conseguirlos y le deben pedir a digamos a la empresa con la cual están trabajando deberían apalancarse también de esas personas de empresa para que les entreguen  
Los contactos de personas que sí efectivamente puedan ser usuarios finales casi que reales. ¿Listo, por ejemplo, si ustedes están haciendo una aplicación que es para contadores, probablemente nadie, el salón es una persona, digamos, como adecuada para poder hacer la prueba con esa aplicación, cierto?  
Entonces ustedes se van a apalancar por favor de la empresa, pero le van a decir con tiempo, miren, nosotros vamos a hacer las pruebas de usuarios finales en tal fecha a tal hora. Usted nos puede prestar un espacio dentro de la empresa, esa es una opción o nosotros lo vamos a hacer en Eafit y va a ser en un salón que tenemos en necesitamos por favor que usted nos consiga.  
Tales perfiles.  
Esa persona empresa debería ayudarles a ustedes a conseguir ese perfil específico, listo, y debería también ayudarles a, por ejemplo, porque se usa mucho. Yo creo que también es importante que lo tengan en cuenta. Se usa mucho darles como una especie de bonificación o así sea un refrigerio a la persona que participe en la prueba.  
Entonces esos refrigerios pues no deberían salir del bolsillo de ustedes, sino que deberían salir del bolsillo de la persona que está haciendo digamos o que está interesada en esa aplicación entonces para que lo vayan por favor coordinando con las personas de la empresa con la cual ustedes están trabajando.  
Listo, entonces miren que, por ejemplo, en este caso de esa aplicación para el llamamiento de promotorías teníamos 2 que son administradores y tenemos 3 jefes directos, cierto, o sea, debe ser una persona que tenga el perfil muy similar al que utilizaría esa aplicación. Listo, aquí entonces se pone un poco la agenda. ¿Cuál va a ser la agenda de la sesión? Ahorita también les mencionaba, es importante hacer.  
la preparación es importante pensar en cómo vamos a hacer el contexto inicial para el usuario ojo que aquí en este contexto inicial No deberíamos dar Demasiada información para no tirarnos la prueba cierto entonces en general yo qué haría le diría vea vamos a probar esta aplicación esta aplicación sirve para esto esto y esto Usted sabe que hemos venido trabajando con la empresa  
Pero no le vaya a decir vea esta aplicación para usted agendar la asesoría, tiene que hacer clic en el botón iniciar y después tiene que irse para tal formulario y tiene que llenar los campos y los campos con asteriscos son campos obligatorios y usted puede dejar vacío tal cosa y tal otra no le de tantas recomendaciones a ese usuario final que ya se tiró la prueba porque la idea es que eso sea tan intuitivo.  
Que esa persona lo pueda usar sin usted darle demasiadas instrucciones. Listo, entonces no nos vayamos a mucho detalle, pero tampoco a muy poquito detalle. Hasta ahí vamos bien.

**Isabela Acosta Pareja** 2:17:44  
Sí, profe, se íbamos bien.

**Miguel Angel Gomez Olarte** 2:17:45  
Sí.

**Liliana Gonzalez Palacio** 2:17:47  
Listo, aquí hay un tema de un formato que es interesante que ustedes pongan a llenar a esas personas y es un consentimiento informado, cierto, porque ustedes los van a grabar, les van a tomar fotos, les van a pedir que llenen una encuesta y probablemente ustedes necesitan utilizar eso para entregar el informe del proyecto. Entonces es importante que esas personas sepan que ustedes los están grabando, que les están tomando fotos y que eso va a ser, digamos, utilizado  
un entorno académico listo Eso sí es importante también decírselos porque ustedes saben que hay personas que no les gustan y que les tomen fotos ni que lo suban a redes etcétera etcétera Entonces eso no va a pasar cierto no lo van a subir a redes pero ustedes sí van a tomar fotos entonces para que no se les vaya enojar la persona de pronto listo junto con esa explicación entonces de que le van a tomar fotos video etcétera ustedes deberían  
También tener un documentico que la persona coja, diligencie y firme y esté tranquila, listo.  
Es importante también muchachos que ustedes le digan la verdad a las personas. La verdad es que no le digan esto se demora media horita porque probablemente no se va a demorar media hora y eso le va a generar frustración a la persona que usted invitó y probablemente esa persona tiene otras cosas que hacer. Entonces usted le dice eso ya incluso cuando la persona ve que ya se está demorando más de lo que usted le prometió que se iba a demorar, empieza a ponerse molesta, empieza a hacer otra la actitud y probablemente también.  
Se puede tirar la prueba simplemente por no decir las cosas como son, entonces digámosle las cosas a las personas como son.  
y lo último probablemente miren que aquí estaban mencionando como el flujo de las actividades probablemente a bueno aquí ojo pues que cuando se está ejecutando la sesión usted le va a decir a la persona vamos a hacer esta tarea dentro de la aplicación vamos a agendar una cita  
Vamos a agendar una cita con tal asesor y a tal hora, por ejemplo, listo, y hay unas preguntas que hay que hacer y tienen que ver con un formulario o con un como una especie de forma de medir la satisfacción que tuvo esa persona, que usted también al final le va a pedir a esa persona que diligencia también de acuerdo al tipo de usuario que usted tenga va a poder, por ejemplo, usar. no.  
de un forms que simplemente la persona le dé clic y llene Esa esa información o va a tener que utilizar cosas como formatos físicos por ejemplo o incluso hacerle la pregunta o las preguntas a la persona y poder resolver usted dentro de algo físico dentro de algo digital esas preguntas me refiero nuevamente por ejemplo a las personas que tienen las cosas con personas con discapacidad visual probablemente esas personas no van a poder entrar a un formulario probablemente no  
Fácil a llenar un formato que usted le ponga en físico, pero si usted le hace una especie de entrevista y le dice cómo se sintió con la aplicación y que la persona le diga y usted le diga cuáles son las posibles respuestas que esa persona le diga y usted va a ir apuntando, listo.  
O sea, en resumen, busque la manera de que esos usuarios finales estén lo más cómodos posibles para que usted pueda tener una muy buena prueba. Listo aquí, entonces ya iríamos con ya hablamos de la parte inicial de ese protocolo que ustedes van a diligenciar.  
Ya vamos por aquí para hipótesis, tareas y preguntas. Listo, entonces aquí en el material que estamos compartiendo, pues el más cortico y el más largo, hay un montón de ejemplos de suposiciones, perdón, de hipótesis que se deberían, por ejemplo, tener dentro de este formatico. Listo.  
Por ejemplo.  
Si sabemos que una hipótesis en este contexto de UX es una suposición fundamentada sobre cómo un cambio o algo que yo tengo en mi aplicación puede funcionar o puede impactar a ese usuario cuando use mi aplicación. Entonces eso me va a facilitar, digamos, como lo que yo después voy a definir, como la tarea y todo el detalle que yo vaya a poner a la persona.  
Por ejemplo, a bueno, un formato de pronto como sugerido para esa hipótesis. Aquí está, pues digamos como ese formato sugerido. Un ejemplo, si agregamos un botón de pedido rápido en la pantalla de inicio, entonces los usuarios podrán hacer ese pedido en tanto tiempo. ¿Cierto? Probablemente como nosotros no hemos empezado a detectar cosas que no funcionan en nuestra aplicación, probablemente nosotros no vamos a hacer agregar tal cosa.  
Cierto, probablemente nosotros lo que vamos a decir es si tenemos una funcionalidad para agendar las asesorías.  
¿Entonces los usuarios van a poder hacer esa tarea en tanto tiempo? Cierto, lo que usted estipule que se va a demorar esa persona en hacer esa tarea puntual, listo.  
Y si yo le puedo agregar también para qué, para qué me sirve eso de que lo haga haga esa tarea puntual en tanto tiempo, por ejemplo, entonces también se lo puede agregar. Listo, mire que entonces hay unas características que puede tener esa hipótesis.  
Aquí hay algunos ejemplitos de preguntas que pueden estarse queriendo resolver con esa prueba unas posibles hipótesis que podrían funcionarnos.  
¿Cómo se puede solucionar ese problema y un poquito cómo se sería, digamos, como esa dinámica ese experimento? Entonces lo primero es el objetivo principal que ya pusimos por allá arriba. Seguimos con las hipótesis, después siguen las tareas, después siguen las preguntas y después siguen los criterios. Listo.  
Aquí hay varios ejemplos de hipótesis, entonces con eso en mente miren, por ejemplo, aquí la hipótesis. Acuérdense que este es un ejemplo de una página web que sirve para agendar promotorías. Tenemos una hipótesis, un agendamiento de promotorías con eficiencia y eficacia. Y aquí dice si reducimos los pasos en el proceso de agendamiento y mejoramos la visibilidad de la información clave.  
Los usuarios podrán completar la tarea sin errores, o sea, cero errores, no uno ni 2, cero. Ahí están diciendo sin errores y en menos de 2 minutos. También podría decir en máximo 2 minutos o simplemente podría decir en 2 minutos exactamente, o sea, poner como un límite o poner un valor exacto, ya ustedes definirán cómo.  
¿Y qué va a aumentar ahí la tasa de reservas exitosas? ¿Cierto? ¿Quién me quiere? ¿Quién se quiere atrever a decir una hipótesis de ese proyecto o de esa aplicación que van a poner, digamos, como a prueba?

**Miguel Angel Gomez Olarte** 2:23:58  
Hola, sí se me escucha.

**Liliana Gonzalez Palacio** 2:23:59  
Hola.  
Sí, señor.

**Miguel Angel Gomez Olarte** 2:24:03  
Okay.

**Felipe Zapata Roldan** 2:24:03  
Sí, se escucha bien.

**Miguel Angel Gomez Olarte** 2:24:05  
Bueno, de nuestro proyecto tenemos como un e-commerce de una licorera. Lo que pues la hipótesis que se me ocurre inmediatamente es como qué tanto se demoraría un usuario intentando hacer un pedido, que decimos como si reducimos los pasos lo más posible, si está pidiendo, digamos, como solo.

**Liliana Gonzalez Palacio** 2:24:08  
Y.  
Sí.  
Mhm.

**Miguel Angel Gomez Olarte** 2:24:26  
Un six pack de cerveza o algo así que no se demore más de 5 minutos en entrar a la página, encontrar el six pack de cerveza, meter al carrito y hacer el pedido algo a ese estilo, por ejemplo.

**Liliana Gonzalez Palacio** 2:24:37  
¿O K, pero mira que entonces ahí tú ya estarías hablando de las tareas puntuales, cierto, la hipótesis, cuál sería?

**Felipe Zapata Roldan** 2:24:42  
La tarea.

**Liliana Gonzalez Palacio** 2:24:47  
Ahí ya me dijiste, incluso vea, va a pedir un cis pack. Te entendí que también va por allá a ir al pago. O sea, diste todas las tareas que le vas a poner a hacer al usuario. Listo, pero si fuéramos un poquito más arriba, acuérdate que vamos a ir en este orden. Vamos a ir en el orden de hipótesis y esa hipótesis va a ser la sombrilla para.  
Definir las tareas que vamos a hacer, las preguntas que le debemos, digamos, hacer como un poquito como desencadenantes de esa posterior interacción que va a tener el usuario y los criterios o los las cosas que vamos a medir puntualmente. ¿Qué plantearías como hipótesis?  
P.

**Miguel Angel Gomez Olarte** 2:25:26  
Bueno, la hipótesis sería, por ejemplo, si.  
Hacemos que el catálogo sea como más fácil de navegar, pues utilizando como categorías o pudiendo buscar por palabras clave más fácilmente. Los usuarios pueden comprar cualquier producto.

**Liliana Gonzalez Palacio** 2:25:38  
Uh-huh.  
Mhm.

**Miguel Angel Gomez Olarte** 2:25:48  
En menos de 5 minutos.

**Liliana Gonzalez Palacio** 2:25:53  
O K, el usuario va a poder comprar un producto de la licorera en máximo 5 minutos, listo. ¿Y eso qué nos puede mejorar dentro de, digamos, como todo el contexto de la licorera?

**Felipe Zapata Roldan** 2:26:03  
Yeah.

**Miguel Angel Gomez Olarte** 2:26:07  
Eso mejora, pues obviamente, como la rapidez en la que se tratan a los usuarios, pues porque se reciben pedidos de forma rápida. Entonces no tienen que esperar a consultar con un usuario muchas cosas.

**Liliana Gonzalez Palacio** 2:26:17  
Mhm.  
Mhm.  
Okey.

**Miguel Angel Gomez Olarte** 2:26:27  
Y ayuda a mejorar la satisfacción de los usuarios, porque el usuarios no tiene que esperar, porque tiene que quedarse haciendo una solicitud media hora para comprarse algo que sea muy chiquito.

**Liliana Gonzalez Palacio** 2:26:32  
Mhm.  
Mucho tiempo, ajá.  
Ajá, y bueno, y si nos fuéramos para el lado de la organización, probablemente es cierto que eso redundaría también en más venticas, más platica, cierto, probablemente listo, súper entonces para el caso del compañero que está mencionando lo de comprar un producto en una licorera.

**Miguel Angel Gomez Olarte** 2:26:47  
Sí.

**Liliana Gonzalez Palacio** 2:26:56  
Y también, digamos un poquito nuevamente tocando el tema del contexto, que podría ser una pregunta o un par de preguntas previas que le podemos hacer a ese usuario antes de que empiece a utilizar nuestra aplicación. No sé cuál será el contexto de la licorera, pero por ejemplo, podríamos pensar en decirle antes cómo se hacía, digamos, esa compra.  
¿Y ahora cómo la vamos a hacer? Por ejemplo, puede que esa compra siempre se hiciera en la tienda, cierto, y ahora la persona puede, por ejemplo, entrar al ecommerce, hacer la selección, comprar y que le lleguen a domicilio. No sé, me estoy inventando cualquier cosa, entonces probablemente podríamos decirle también como para hacer caer en cuenta de ese usuario de que lo que le estamos ofreciendo es una forma de hacer mejor y más fácil.  
Sin menos, sin tanto esfuerzo esa compra, cierto, entonces probablemente podríamos decirle o pregúntale, venga usted cómo hace para tomarse una cervecita con este calor, o sea que a qué pasos tiene que seguir. Entonces el usuario probablemente te va a decir cierto, mira que ahí no estás tú digamos como sesgando la prueba porque no estás hablando puntualmente de la aplicación, estás diciendo cómo se hacía antes.  
También depende mucho como les menciono como el contexto en el que estemos trabajando, cierto, si fuera por ejemplo el caso de que ya hay una aplicación y estamos moviendo la aplicación y le estamos cambiando cosas, entonces probablemente las preguntas previas sí deberían tener que ver con la aplicación anterior versus la que le estamos presentando en este momento. Si me hago entender y se entiende un poquito el sentido de esas preguntas previas.

**Miguel Angel Gomez Olarte** 2:28:20  
Sí, pero sí.

**Liliana Gonzalez Palacio** 2:28:21  
Listo, entonces la tarea uno que vamos a hacer asociada a esa hipótesis. Uno, entonces miren que ahí ya si yo pongo un escenario muy puntual, en este caso de las promotorías de casa ferretera, dice para promocionar su marca, se desea programar una promotoría con casa ferretera a través de la aplicación. Cierto se enviará al usuario tal.  
Y estará disponible el 29 de abril de 7 a 5 en la sede pala C. Listo, entonces, ¿qué le vamos a decir a ese usuario final que está sentado ahí al frente de la aplicación que queremos probar? Necesitamos por favor que usted agende una promotoría utilizando esa información que le acabamos de decir.  
Esa información de Pepito Pérez que está disponible el 29 de abril, que está disponible en este horario y que está disponible en esta sede. Mire todos los detalles que le dijimos. Entonces miren que ahí ya nos vamos a un escenario muy puntual con ese escenario muy puntual. Entonces yo ya puedo empezar y puedo entregarle a ese usuario final para que haga ojo.  
No vaya a cometer o no le vaya a dar la digamos como el bichito de que le tengo que decir si lo veo enredado o le tengo que decir cómo lo hace. Usted no debe tocar ese celular. Usted probablemente le puede ir haciendo, digamos, como algunas algunas anotaciones para que esa persona caiga en cuenta de por dónde podría ser que lo hace, cierto, pero no debería meterse en la prueba porque entonces se la tira.  
Listo, eso es importante.  
¿Las preguntas posteriores, o sea, la persona hizo el trabajo, cierto? Ojo, pues que mientras que la persona está agendando esa promotoría con estos datos, ¿qué está pasando con el resto del equipo? ¿Quién me quiere decir?  
¿Qué está pasando con el resto del equipo que está desarrollando el proyecto? ¿Están dormidos? ¿Están mirando el celular? ¿Qué están haciendo?  
¿Moisés, qué están haciendo?

**Isabela Acosta Pareja** 2:30:14  
Watch.  
Por ejemplo, unos pueden tomar nota, otros pueden, pues no una persona como que puede grabar, otra puede tomar como apuntes de los gestos de la interacción que está teniendo, mientras que otra persona pues lo va guiando, pero así como mencionas, sin necesidad como de sesgar la prueba.

**Felipe Zapata Roldan** 2:30:16  
Es.

**Liliana Gonzalez Palacio** 2:30:22  
Ajá.  
Exactamente, entonces es súper importante que todos estén ahí, ahí, ahí en la jugada, ahí en la jugada, mirando y midiendo tiempos, listos. Si yo dije que esa persona va a tomar o le va a tomar tanto tiempo hacer ese trabajito, entonces hay que tomar tiempos, cierto? Hay una persona que tiene que fijarse también si la tarea se pudo cumplir.  
O si se quedó en la mitad. Ay, no, es que me salió un error y no pude terminar. Eso también hay que apuntarlo, cierto, porque eso nos da también un poquito pistas de si se van a cumplir esos criterios de evaluación o no. Listo, si yo tengo 5 usuarios, yo me voy por bien servidas y 3 de esos pueden hacer las cosas.  
Y si 3 de esos lograron estos tiempos, por ejemplo, esto.  
Preguntas hasta ahí, chicos.

**Isabela Acosta Pareja** 2:31:26  
No, señora, todo claro.

**Liliana Gonzalez Palacio** 2:31:28  
Listo entonces aquí en esta en esta versión corta de la presentación vamos a tener ejemplos de hipótesis. Miren, por ejemplo, que hay algunos algunas hipótesis que tienen como el detalle de cosas que probablemente se van a cambiar de una aplicación. El caso de ustedes que probablemente es una aplicación desde cero. Entonces digamos que un poco podría variar esa hipótesis, pero.  
Tiene que conservar, digamos, como esa estructura, o sea, decir qué es lo que queremos nosotros probar, qué van a obtener digamos esos usuarios y cuál va a ser como un poco como nuestro indicador de si eso funcionó o no funcionó. Listo, las tareas, como les mencionaba, son acciones más específicas que pueden llevar a verificar si la hipótesis fue validada o no fue validada.  
Listo, entonces aquí van a encontrar varios ejemplitos de tareas.  
Ya entonces, por ejemplo, ahorita el trío de hipótesis, tarea y métricas también lo tenemos que tener en cuenta y todo esto que les estamos mencionando es lo que ustedes deberían tener. Ojo, la planeación que se resume en este protocolo muy sencillo para el siguiente sprint.  
Listo.  
Para el de arriba ya sí hay que probar listo y entonces hay que ir buscando esos usuarios, esos usuarios con los que cuáles vamos a probar. Si tenemos varios perfiles en nuestra aplicación, ojalá podamos hacer pruebas con esos varios perfiles. Listo, bueno, para cerrar entonces la interacción porque ya se nos está acabando el tiempito, es importante y me lo mencionó Salomé.  
Salo, no sé si quieras compartir un momentico el repositorio de ustedes para mostrarles puntualmente cuál es el cambio que yo les solicito que hagan para que sea más claro, sobre todo la parte de la definición de casos de prueba, la parte del recorte de los errores, porque para muchos de ustedes de pronto no fue claro.  
Y probablemente también, pues mea culpa de eso no les mencioné un detalle, y es que cuando ustedes van a reportar casos de prueba no es ideal que lo hagan a través de la wiki, o sea, que quede documentado en la wiki como un ítem más, no. Lo ideal es que ustedes lo pongan al nivel o en el punto donde ponen, por ejemplo, todos los ítems del backlog.  
¿Por qué? Porque eso es lo que me permite, o sea, lo quieres de pronto y tienes forma de compartir la pantalla. Eso es lo que nos permite, muchachos, lo que nos permite es que, por ejemplo, yo pueda decir esta historia de usuario, yo le pueda anclar elementos, o sea, yo le pueda linkear elementos y pueda decir esta historia de usuario.

**Salome Serna Restrepo** 2:33:44  
Sí, profe, ya voy.

**Liliana Gonzalez Palacio** 2:33:58  
Tiene estos casos de prueba y ahí es claro, digamos, cuando yo linkeo las 2 cosas, es claro que ese caso de prueba tiene que ver es con tal historia de usuario y cuando vayamos a generar el último informe de pruebas funcionales, nos va a quedar más fácil también poder hacer estadísticas de cosas.  
Entonces, miren, exacto, miren, gracias a lo muchos de ustedes, creo que casi todos pusieron estos casos de prueba como un listadito dentro de la wiki.

**Salome Serna Restrepo** 2:34:18  
I said.  
Viendo por la pantalla.

**Liliana Gonzalez Palacio** 2:34:32  
Y como les menciono, yo particularmente no fui, digamos, detallada con eso y pues es válido porque ustedes no sabían que tenía que ser por ahí, pero lo vamos a tener en cuenta por favor para las siguientes iteraciones, o sea, a partir del sprint 2 ya esto sí debe estar así, como lo está mencionando en este momento Salomé. Miren que ella, por ejemplo, está generando un nuevo ítem.  
Y ese ítem se genera es por allá donde ustedes generan también el backlog en el mismo, en la misma parte donde generan backlog y elementos del backlog, historias de usuario épicas. Ahí en ese punto es donde se genera ese caso de prueba. ¿Cómo lo voy yo a diferenciar entonces para que no quede como si fuera igual una historia o una historia de usuario? Le voy a poner arriba en el título.  
Por ejemplo, la inicial CP.  
Y mira.  
¿En que particularmente lo que nosotros es que tiene el CP cero uno y si ustedes quieren, no sé ponerle al código después HU tal cosa ahí realmente estarían diciendo cuál es el caso de prueba, pero cuál es la historia de usuario vinculada? Listo, después como para que ustedes lo dejen ahí como presente. Acuérdense que en el nombre del caso de prueba es súper importante que ustedes digan cuál es la funcionalidad que se está probando, pero qué cosa.  
Particular está probando, por ejemplo, registro exitoso. Si registro exitoso, si se puede hacer un registro exitoso de varias maneras, entonces decir registro exitoso con correo de Gmail, registro exitoso con creación de nuevo usuario, registro exitoso con o sea, ser más detallados en el nombre corto que se le da a ese caso de prueba sin irnos a exagerar.  
Que ya nos quede una pastoral ahí en el nombre listo y cuando usted va a enlazar, entonces esa es la ese es el chiste y la gracia de hacerlo así por este lado, porque usted más abajo, bajémonos, porfa, hazlo.  
Más abajo usted puede hacer.

**Salome Serna Restrepo** 2:36:23  
Perfect.  
Yeah.

**Liliana Gonzalez Palacio** 2:36:25  
Usted puede, usted puede linkear cierto en ese relationships. Usted puede decir que esto está relacionado con tal cosa o con la historia de usuario o en el caso de que ya vaya a reportar el error. Entonces los errores también se reportan o se ponen aquí en este nivel, no en la wiki. Listo.  
Miren, por ejemplo, que ahí le saca como todo el listado, no solamente de historias de usuarios, sino en el caso de los muchachos que ya tienen box también entonces los box. Entonces usted la idea es que linkee para todos lados, linkee para arriba. ¿Cuál es la historia de usuario que le corresponde o la que usted está probando y para abajo? ¿Cuáles son los errores?  
O los box relacionados con ese caso de prueba. Listo, eso nos va a facilitar mucho al final, en la en el informe final de pruebas, poder hacer esas estadísticas y decir este caso de prueba, tu este historio tuvo tantos casos de prueba. Estos casos de prueba tuvieron estos errores. ¿Estos errores quedaron o abiertos o fueron solucionados o cómo quedaron?  
Listo, entonces esa era como la acotación o la claridad que yo quería hacerles, gracias a Salo por haberme recordado y por servirme de modelo.

**Salome Serna Restrepo** 2:37:34  
Con el sabroso.

**Liliana Gonzalez Palacio** 2:37:34  
Era, Era, creo que hasta ahí, pues como lo que les quería contar, como les menciono, el material se los vamos a poner disponible y cualquier pregunta que ustedes tengan, muchachos, utilicennos, acuérdense que nosotros estamos aquí, es para ustedes y por ustedes. Preguntas, dudas, inquietudes, sugerencias.

**Salome Serna Restrepo** 2:37:56  
Hasta el momento, profe, gracias.

**Liliana Gonzalez Palacio** 2:37:59  
Listo, señorita. Bueno, Santi, todo claro o k listo. Si tienen alguna inquietud también, pues pueden recurrir a nosotros. Nos escriben también por el Teams. Bueno, de varias maneras lo pueden hacer.  
Bueno, fue un placer haber compartido con ustedes esta sesión, que tengan un resto de tarde muy bonita. Chao.

**Felipe Zapata Roldan** 2:38:22  
Gracias, Liliana, gracias, Daniel, gracias, profesor.

**Salome Serna Restrepo** 2:38:22  
Listo, profe, gracias.

**Isabela Acosta Pareja** 2:38:24  
No, profe, gracias. Chao.

**Liliana Gonzalez Palacio** 2:38:24  
Chao, chao.

**Wilmer Alberto Gil Moreno** 2:38:25  
Gracias.  
Sí.

**Liliana Gonzalez Palacio** 2:38:27  
Usted chao.

**Felipe Zapata Roldan** 2:38:27  
Gracias chicos, estén bien, chao.

**Simon Sloan Garcia Villa** 2:38:28  
Gracias, profe.
