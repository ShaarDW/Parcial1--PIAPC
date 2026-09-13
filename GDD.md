# GDD simplificado

## Juego y experiencia

- Genero y situacion de juego: Arcade/pesca. El jugador pesca desde un puesto sencillo durante una partida de 3 minutos (180 segundos).
- Rol del jugador: Controla a un pescador en un puesto fijo. El anzuelo se lanza automaticamente; el jugador reacciona al pique y completa la secuencia de flechas.
- Experiencia buscada: Tension breve durante la espera del pique, seguida de una reaccion rapida (Z) y una instancia de precision en la secuencia de flechas. Las capturas de mayor rareza deben producir una mayor sensacion de recompensa.

## Comportamiento a resolver

- Entidad: Sistema de pesca del puesto. Estados del anzuelo: lanzado, espera de pique, picada, QTE, captura/escape, relanzado y fin de partida.
- Problema actual: No existe un bucle de pesca implementado; se debe crear el comportamiento completo de pesca definido para el juego.
- Comportamiento esperado: El anzuelo se lanza automaticamente al comenzar la partida; el jugador espera entre 3 y 5 segundos hasta que un pez pica; cuando pica debe presionar Z; aparece una secuencia de flechas que debe completar correctamente en hasta 6 segundos; si la completa captura el pez y recibe su recompensa; si se equivoca o agota el tiempo el pez se escapa; tras una captura o escape el anzuelo vuelve a lanzarse automoticamente mientras la partida continue; la partida dura 3 minutos.

## Reglas

- Estados, condiciones o eventos relevantes:
  - Inicio de partida: lanzamiento automatico del anzuelo y contador de 180 segundos corriendo de forma continua (espera de pique, espera de Z y QTE incluidos; no hay pausas).
  - Pique: ocurre entre 3 y 5 segundos tras el lanzamiento. La rareza se sortea en cada pique con seleccion ponderada segun probabilidades acumuladas.
  - Variedades de peces:
    - Comun: 30 %, $100, secuencia de 3 flechas.
    - Raro: 25 %, $300, secuencia de 4 flechas.
    - Epico: 20 %, $500, secuencia de 5 flechas.
    - Legendario: 15 %, $700, secuencia de 6 flechas.
    - Mitico: 10 %, $1200, secuencia de 7 flechas.
  - Espera de Z: sin limite adicional; el juego espera hasta que el jugador presione Z.
  - QTE: al presionar Z se muestra inmediatamente la secuencia de flechas y comienza el temporizador de 6 segundos. Las unicas direcciones usadas son arriba, abajo, izquierda y derecha. La secuencia es aleatoria con reposicion (puede repetirse la misma flecha consecutivamente).
  - Captura: secuencia completada correctamente dentro de los 6 segundos -> se otorga la recompensa segun la tabla y el anzuelo se relanza de inmediato.
  - Escape: entrada incorrecta o 6 segundos agotados -> sin recompensa y con feedback visual simple (texto e indicadores de estado). El anzuelo se relanza de inmediato.
  - Fin de partida: al llegar el contador a 0 la partida termina inmediatamente, incluso con un QTE activo; el pez en curso no otorga recompensa y no se relanza el anzuelo.
- Accion del jugador o del entorno: Unico metodo de entrada: teclado. Z activa el QTE y las cuatro flechas direccionales completan la secuencia.
- Resultado esperado: El jugador consigue la mayor cantidad de dinero posible durante los 3 minutos; no hay objetivo minimo. El HUD muestra como minimo el dinero acumulado, el tiempo restante y el estado actual de la pesca (feedback con texto y cambio de color simple). Al finalizar la partida se muestra una pantalla con el dinero total conseguido y una opcion para iniciar una nueva partida.
- Caso limite: Si los 3 minutos terminan mientras el jugador esta intentando capturar un pez, la captura se interrumpe y la partida finaliza sin otorgar la recompensa de ese pez.

## Limites

- Fuera de alcance: Audio, pausa, menu de configuracion, soporte tactil, persistencia de records, objetivo minimo de dinero, assets de arte final (el feedback se implementa con texto e indicadores simples).
- Restricciones tecnicas: Phaser 4.2.1, JavaScript, Vite 8.3.0; entrada solo por teclado; sin dependencias no autorizadas; no se agregan funcionalidades fuera de esta especificacion.
- Criterios de aceptacion: CA-1 a CA-9 definidos en `docs/especificacion.md`.

El GDD delimita la intencion de diseno. La especificacion y el plan convierten esa intencion en una intervencion tecnica verificable.