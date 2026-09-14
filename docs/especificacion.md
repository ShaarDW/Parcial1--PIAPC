# Especificacion

## Problema

Desarrollar desde cero el bucle de pesca arcade de **Silly Fishing** (Phaser 4.2.1 + JavaScript con Vite). El jugador maximiza el dinero capturando peces durante una partida de 180 segundos mediante espera de pique, reaccion con Z y una secuencia de flechas (QTE). No existe implementacion previa: no hay un comportamiento roto que corregir.

## Resultado esperado

Al terminar la partida, el dinero total depende solo de las capturas correctas realizadas y se muestra en una pantalla final con opcion de iniciar una nueva partida. Cada regla del GDD queda verificada por prueba manual conforme a los criterios CA-1 a CA-9.

## Alcance

- Incluye:
  - Lanzamiento automatico del anzuelo al iniciar la partida.
  - Sorteo ponderado de rareza en cada pique (comun 30 %, raro 25 %, epico 20 %, legendario 15 %, mitico 10 %).
  - Pique entre 3 y 5 segundos tras el lanzamiento.
  - Estado de picada sin limite de tiempo para presionar Z.
  - QTE de 3 a 7 flechas segun rareza, con temporizador de 6 segundos.
  - Captura con recompensa segun tabla (100/300/500/700/1200) o escape con feedback visual.
  - Relanzamiento inmediato tras captura o escape, siempre que la partida continue.
  - HUD minimo: dinero acumulado, tiempo restante y estado actual de la pesca (texto + cambio de color simple).
  - Fin de partida al llegar a 0 el contador de 180 segundos (continuo, sin pausas).
  - Pantalla final con dinero total y nueva partida con Enter.
  - Feedback visual minimo con texto/indicadores simples; sin sprites finales.
- Extensiones aprobadas por el estudiante (decision explicita, fuera del alcance original):
  - **Audio**: sonidos sintetizados en tiempo de ejecucion con WebAudio (`game.cache.audio` + `sound.add`; splash, pique, tics del QTE, error, exito, fallo, fin de partida). Sin archivos ni dependencias de audio.
  - **Canvas responsive**: escala `Phaser.Scale.FIT` con centrado `CENTER_BOTH` para que el lienzo (800x600) se adapte al monitor/ventana. `index.html` con CSS fullscreen centrado.
  - **Recogido del sedal**: durante el QTE el anzuelo/sedal se recogen hacia la cana en funcion del avance; al capturar, el anzuelo queda junto a la cana (no vuelve a la posicion de lanzamiento).
  - **Soporte tactil**: deteccion de dispositivo (`isTouch`), boton dedicado en menus, boton de pescar (equivalente a Z) y D-pad de 4 flechas (equivalente a las flechas); `activePointers: 2`.
- No incluye: pausa, menu de configuracion, persistencia de records, objetivo minimo de dinero, assets de arte final, ni ninguna funcionalidad fuera del GDD y de las extensiones aprobadas.

## Restricciones

- Tecnicas: Phaser 4.2.1, JavaScript, Vite 8.3.0; entrada por teclado (Z y las cuatro flechas direccionales) y por toque en pantallas tactiles (botones equivalentes); sin frameworks ni dependencias adicionales sin autorizacion.
- Operativas: no instalar, usar red ni publicar cambios sin autorizacion; editar solo archivos previstos en el plan; `node_modules/` y `dist/` deben permanecer ignorados por git.
- De calidad: validacion por pruebas manuales reproducibles, registradas en `docs/evidencia-pruebas.md`; estados y errores comunicados visualmente de forma inequivoca; sin logs temporales de verificacion de rareza.

## Casos y criterios de aceptacion

| Caso | Id | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|---|
| Inicio de partida | CA-1 | Partida nueva iniciada | se inicia la partida | el anzuelo se lanza y el contador corre desde 180 s | Manual: iniciar y observar el HUD |
| Sorteo de rareza | CA-2 | Anzuelo en espera | ocurre el pique (3-5 s) | la rareza se elige segun la tabla (30/25/20/15/10) y se muestra el estado | Manual: observar repeticiones y revisar implementacion |
| Picada sin reaccion | CA-3 | Pez picado, Z sin presionar | pasa tiempo sin tocar Z | el juego permanece en estado de picada; otras teclas no cambian el estado | Manual |
| Inicio del QTE | CA-4 | Pez picado | presiona Z | se muestra la secuencia de N flechas (3-7 segun rareza) y arranca el temporizador de 6 s | Manual |
| Captura | CA-5 | QTE activo | ingresa las N flechas correctas antes de 6 s | suma la recompensa exacta de la tabla y relanza el anzuelo | Manual |
| Escape por error | CA-6 | QTE activo | ingresa una flecha incorrecta | el pez escapa, hay feedback visual, no suma recompensa y relanza | Manual |
| Escape por tiempo del QTE | CA-7 | QTE activo | transcurren 6 s sin completar la secuencia | escape sin recompensa, feedback visual y relanzamiento | Manual |
| Fin de partida con QTE activo | CA-8 | El contador llega a 0 | expira el tiempo | termina de inmediato: sin recompensa, sin relanzamiento y se muestra la pantalla final | Manual |
| Pantalla final | CA-9 | Partida terminada | se muestra la pantalla final | muestra el dinero total y permite iniciar una nueva partida con Enter; no persiste records | Manual |

*La columna Evidencia se registrara como pasos reproducibles en `docs/evidencia-pruebas.md` cuando exista la implementacion.*

## Invariantes

- El contador de 180 s corre de forma continua durante toda la partida (espera de pique, espera de Z y QTE). Al llegar a 0 la partida termina de inmediato, incluso con un QTE activo; el pez en curso no otorga recompensa y no se relanza el anzuelo.
- La suma de probabilidades de rareza es siempre 100 %.
- La recompensa otorgada por captura es exactamente la de la tabla segun la rareza.
- Toda captura o escape implica relanzamiento inmediato si queda tiempo.
- No se otorga recompensa si el contador de la partida llega a 0.
- Las unicas entradas activas son Z y las cuatro flechas direccionales (o sus equivalentes tactiles: boton de pescar y D-pad).
- El QTE nunca dura mas de 6 segundos.
- En pantallas tactiles, `isTouch` detecta el dispositivo y se muestran los botones; en escritorio la entrada por teclado se mantiene identica.

## Preguntas abiertas

Las preguntas abiertas previas fueron resueltas por las decisiones aprobadas del diseno (montaje, version, nueva partida, temporizador, secuencia, rareza, RNG y HUD). No quedan preguntas abiertas para la implementacion.