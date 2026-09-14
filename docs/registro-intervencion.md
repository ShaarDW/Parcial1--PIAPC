# Registro de intervencion agentica

Registra cada ciclo relevante de herramienta. No copies razonamientos internos del modelo ni datos sensibles.

| Fecha o version | Instruccion resumida | Accion o herramienta | Resultado observable | Decision humana |
|---|---|---|---|---|
| v0.1.0 | Autorizacion puntual de scaffolding: Vite + JavaScript + Phaser 4, crear scaffolding minimo, instalar dependencias, usar red solo para la instalacion, actualizar .gitignore y validar el arranque | Consulta del registro npm (`npm view phaser@4 version`); escritura de `package.json`, `package-lock.json`, `index.html`, `src/main.js`; `npm install phaser@4.2.1` y `npm install -D vite`; edicion de `.gitignore`; `npm run build`; `npm run dev` | Build exitoso en 573 ms; Vite v8.3.0 init en 218 ms en `http://localhost:5173/`; 0 vulnerabilidades | Aceptar |
| v0.2.0 | Autorizacion del primer bloque de implementacion del gameplay (pasos 2 y 3 del plan): constantes y ciclo CAST -> WAIT -> BITE con seleccion de rareza | Escritura de `src/config.js` y `src/rarity.js`; modificacion de `src/main.js`; `npm run build` | Build exitoso; estado BITE queda activo con rareza seleccionada segun pesos; presentacion minima por texto y color | Aceptar |
| v0.3.0 | Sesion previa (bloques B2-B4): reaccion a Z y secuencia de flechas (QTE) con temporizador de 6 s; captura/escape con recompensa y relanzamiento; validacion de teclado (Z y flechas) | Escritura de `src/qte.js` (`ARROWS`, `generateSequence`); extension de `src/main.js` (startQte, handleQteInput, resolveQte, teclas); `npm run build` | QTE completo: secuencia visible N flechas (3-7), entrada correcta suma recompensa, error o timeout escapa y el ciclo se relanza | Aceptar |
| v0.4.0 | Sesion previa (bloques B5-B6): HUD minimo, fin de partida y pantallas | Extension de `src/main.js` (HUD: money/tiempo/estado; contador 180 s continuo; fin a 0 aun con QTE activo; pantalla final con rejuego; pantallas de titulo y controles); `npm run build` | HUD con dinero, barra de tiempo y textos de estado; pantalla final con total y Enter para reiniciar | Aceptar |
| v0.5.0 | Sesion previa (bloques B7-B8): escenario y vida marina | Extension de `src/main.js` (texturas procedurales de anzuelo, flecha y peces; agua, olas, algas, costas, cana; peces de fondo en movimiento); `npm run build` | Escenario animado: agua con olas, algas, cana/anzuelo visibles, peces decorativos nadando | Aceptar |
| v0.6.0 | Sesion previa (bloques B9-B10): pulido de HUD, feedback y casos limite | Extension de `src/main.js` (panel HUD traslucido, tipografia Comic Sans, colores y nombres de rareza, texto `+$X` flotante, reloj de 2 digitos, soporte de 7 flechas); `npm run build` | Presentacion pulida; verificacion manual del caso limite de 7 flechas (mitico) y del reloj de 2 digitos | Aceptar |
| v0.7.0 | Arreglo: HUD y solapamiento durante el QTE; crear y agregar sonidos | `src/main.js`: panel QTE adaptativo centrado (ancho segun N flechas), barras de progreso y de cuenta regresiva; sintesis WebAudio de 11 clips cargados en `this.game.cache.audio` y reproducidos con `sound.add` | QTE centrado sin solaparse con el HUD; sonidos de chapoteo, pique, tics, error, exito, fallo, inicio y fin de partida | Aceptar |
| v0.8.0 | Arreglo 12: canvas centrado que ocupa la pantalla; sedal que se recoge durante el QTE y captura que no vuelve al agua | `index.html` (CSS fullscreen centrado) y `src/main.js` (config `scale: Scale.FIT + CENTER_BOTH`; `REEL_TO_X`; `reelHookProgress`+`updateLine`; `showFishCapture` asienta el anzuelo junto a la cana) | Canvas responsive centrado en cualquier monitor; cada flecha correcta recoge el sedal hacia la cana; la captura deja el anzuelo junto a la cana sin re-lanzamiento | Aceptar |
| v0.9.0 | Arreglo 13: detectar PC vs movil y adaptar los controles táctiles | `src/main.js` (deteccion `isTouch`; unificacion `doEnter/doCatch/doArrow`; `makeTouchButton`; botones de titulo/controles/gameover; boton Z con pulso; D-pad de 4 flechas; `activePointers: 2`) e `index.html` (`touch-action: none`, `user-select: none`) | En pantallas tactiles se muestran botones dedicados; el D-pad reemplaza a las flechas del teclado en el QTE; en escritorio todo sigue igual | Aceptar |
| v0.10.0 | Entrega: pruebas automatizadas de reglas y cierre de la documentacion | Escritura de `tests/reglas.test.mjs`; `node --test tests/*.test.mjs` (10/10 OK); actualizacion de `GDD.md`, `README.md` y `docs/`; `npm run build` final | 10 tests pasan; build final 9 modulos; docs completas; commit final pendiente de push por el estudiante | Aceptar |

## Detalle de la intervencion v0.1.0 (scaffolding)

- Instruccion recibida: autorizacion puntual de la etapa de scaffolding (montaje Vite + JavaScript + Phaser 4, sin TypeScript, sin librerias adicionales; verificar version real sin inventarla).
- Acciones realizadas:
  - Verificacion del entorno: Node.js v24.15.0 y npm 11.12.1.
  - Consulta del registro npm para confirmar la version real mas reciente de Phaser 4: `4.2.1`.
  - Creacion del scaffolding minimo: `package.json`, `package-lock.json`, `index.html` y `src/main.js`.
  - Instalacion de dependencias: `phaser` 4.2.1 y `vite` 8.3.0 (dependencia de desarrollo).
  - Actualizacion de `.gitignore` para excluir `node_modules/` y `dist/`.
  - Validacion del arranque: `npm run build` (exitoso) y `npm run dev` (servidor iniciado en `http://localhost:5173/`).
- Archivos creados: `package.json`, `package-lock.json`, `index.html`, `src/main.js`.
- Archivos modificados: `.gitignore` (reglas `node_modules/` y `dist/`).
- Dependencias instaladas (versiones exactas): `phaser` 4.2.1; `vite` 8.3.0; transitivas de phaser (eventemitter3 5.0.4) y de vite (rolldown 1.2.8, lightningcss 1.33.0, postcss 8.5.28, nanoid 3.3.19, picocolors 1.1.1, picomatch 4.0.7, source-map-js 1.2.1, tinyglobby 0.2.17, fdir 6.5.0, detect-libc 2.1.2, @oxc-project/types 0.149.0, @rolldown/pluginutils 1.0.1, mas opcionales por plataforma).
- Validaciones realizadas: `npm run build` (compilacion de produccion) y `npm run dev` (servidor local de desarrollo).
- Resultado: validacion exitosa; scaffolding aprobado por el estudiante.
- Warnings: chunk de mas de 500 kB por importar el bundle completo de Phaser (no bloquea); el proceso `dev` fue detenido por timeout por ser un servidor persistente (esperado).
- Decision humana/autorizacion: autorizacion puntual aprobada; la instalacion y el uso de red quedaron limitados a esta etapa.
- Limites respetados: no se implemento gameplay, no se modifico `src/main.js` mas alla del scaffolding, no se hicieron commits, no se instalaron dependencias fuera de las minimas, no se ejecutaron comandos ajenos a los scripts del scaffolding.

## Detalle de la intervencion v0.2.0 (bloque 1: constantes y ciclo CAST -> WAIT -> BITE)

- Instruccion recibida: autorizacion exclusiva del primer bloque de implementacion (pasos 2 y 3 del plan): modulo de constantes y ciclo basico CAST -> WAIT -> BITE con seleccion ponderada de rareza. Sin QTE, sin teclas, sin HUD, sin temporizador de partida, sin recast ni pantalla final.
- Acciones realizadas:
  - Creacion del modulo de constantes `src/config.js` con: `GAME_DURATION` (180), `BITE_MIN_WAIT` (3), `BITE_MAX_WAIT` (5), `QTE_DURATION` (6) y arreglo `RARITIES` (common 30 %/$100/3, rare 25 %/$300/4, epic 20 %/$500/5, legendary 15 %/$700/6, mythic 10 %/$1200/7).
  - Creacion de `src/rarity.js` con `selectRarity()`: un unico `Math.random()` sobre intervalos acumulativos de las probabilidades definidas.
  - Modificacion de `src/main.js`: escena base que ejecuta el ciclo CAST (visible ~0.5 s por presentacion), luego WAIT (espera aleatoria de 3 a 5 s) y luego BITE (queda activo indefinidamente mostrando la rareza seleccionada). Presentacion minima por texto y color por estado; sin manejo de teclado.
  - Validacion: `npm run build`.
- Archivos creados: `src/config.js`, `src/rarity.js`.
- Archivos modificados: `src/main.js`.
- Resultado: build exitoso; estados CAST, WAIT y BITE verificables visualmente; rareza seleccionada por pesos.
- Decision humana/autorizacion: autorizacion puntual del bloque 1; los pasos 4 a 6 del plan quedan fuera.
- Decidision de presentacion: CAST se mantiene visible unos 500 ms para permitir la verificacion manual; la espera de mordida (3-5 s) comienza al entrar en WAIT. Este detalle es presentacional y no afecta las reglas del juego.
- Limites respetados: no se implemento QTE, entrada Z, secuencia de flechas, temporizador de 6 s, recompensas, HUD definitivo, temporizador de 180 s, pantalla final ni recast; no se agregaron logs de depuracion ni contadores de tiradas; no se instalaron dependencias; no se uso red; no se modificaron `package.json`, `package-lock.json`, `.gitignore` ni `index.html`; no hubo commit; no se agregaron scripts.

## Detalle de la intervencion v0.3.0 (bloques B2-B4: QTE, captura/escape y recast, sesion previa)

- Instruccion resumida: autorizacion de los pasos 4 del plan ampliados: reaccion a Z, QTE de flechas con temporizador de 6 s, validacion de secuencia, captura/escape con recompensa y relanzamiento inmediato. Estas opciones se trabajaron en una sesion previa de esta misma herramienta.
- Acciones realizadas:
  - Creacion de `src/qte.js` con `ARROWS` (UP/DOWN/LEFT/RIGHT) y `generateSequence(length)` (secuencia aleatoria con reposicion).
  - Extension de `src/main.js`: maquina de estados completa (CAST, WAIT, BITE, QTE, RESULT, GAME_OVER), `startQte`, `handleQteInput`, `resolveQte`, manejo de `keydown` para Z y las 4 flechas, feedback de escape/captura y relanzamiento.
  - Validacion: `npm run build`.
- Archivos creados: `src/qte.js`.
- Archivos modificados: `src/main.js`.
- Resultado: comportamiento de pesca completo verificable manualmente (CA-3 a CA-7 en `docs/especificacion.md`).
- Decision humana/autorizacion: aceptada por el estudiante; cada bloque se autorizo por separado antes de continuar.
- Limites respetados: sin dependencias nuevas, sin red, sin modificaciones a `package.json`, `package-lock.json`, `.gitignore` ni `index.html` (en esta etapa), sin commits.

## Detalle de la intervencion v0.4.0 a v0.6.0 (bloques B5-B10: HUD, pantallas, escenario, pulido; sesiones previas)

- Instruccion resumida: completar el ciclo de partida del GDD y mejorar la presentacion (HUD, fin de partida, pantallas de titulo/controles, escenario con agua/cana/anzuelo, vida marina, feedback de recompensa y casos limite). Se trabajaron en sesiones previas de esta herramienta; el estado final se verifica por inspeccion del codigo y builds acumulativos.
- Acciones realizadas (verificadas en el codigo final):
  - HUD: `hudPanel` traslucido (0x000000 al 35 %), `hudMoneyText` (verde con borde), barra de tiempo `hudTimeBar` actualizada por frame y textos/color por estado de pesca.
  - Fin de partida: el contador de 180 s corre de forma continua; al llegar a 0 termina la partida al instante (aun con QTE activo, sin recompensa y sin relanzamiento) y se muestra la pantalla final con el dinero total y la opcion de reiniciar con la tecla Enter.
  - Pantallas: titulo ("SILLY FISHING"), controles ("COMO JUGAR", Z y flechas, objetivo) y game over con rejuego.
  - Escenario y vida marina: texturas procedurales (anzuelo, flecha, peces por rareza con escala creciente `FISH_STYLE`), agua con olas y reflejos, algas, costas, cana con sedal y anzuelo, y peces decorativos nadando en el fondo.
  - Pulido: tipografia Comic Sans, colores y nombres de rareza (`RARITY_COLORS`), texto `+$X` flotante al capturar, reloj a 2 digitos y soporte del caso limite de 7 flechas (mitico).
  - Validacion acumulada: `npm run build` OK en cada sesion (llegando a 8 modulos antes del bloque B11).
- Archivos modificados: `src/main.js` (y `index.html` al incorporar la hoja de estilos del contenedor del juego en etapas posteriores).
- Resultado: juego jugable completo segun la especificacion CA-1 a CA-9, verificable con prueba manual.
- Decision humana/autorizacion: aceptado por el estudiante en cada bloque; arreglos y extensiones se acordaron de forma explicita.
- Limites respetados: sin dependencias nuevas, sin uso de red, sin commits, sin logs de depuracion temporales.

## Detalle de la intervencion v0.7.0 (bloque B11: QTE adaptativo y sonido)

- Instruccion recibida: corregir el solapamiento del HUD durante la secuencia del QTE (longitud de la secuencia desbordaba el panel y los elementos quedaban demasiado juntos) y crear/agregar sonidos.
- Acciones realizadas:
  - Panel QTE adaptativo: `updateQtePanel(color, count)` calcula el ancho segun la cantidad de flechas (`N*56 + (N-1)*14 + 24`), centrado en x=400; fila de flechas fija; barras de avance y de cuenta regresiva integradas con texto numerico superpuesto. Se eliminaron los textos de secuencia/progreso/temporizador redundantes.
  - Sonido sintetizado: `createSfx()` genera 11 clips WebAudio con `this.game.cache.audio.add(key, AudioBuffer)` (splash, bite, tick0-6, wrong, success, success_big, fail, enter, gameover) y `playSfx(name)` los reproduce con `this.sound.add(key, { volume })`. Se verifico en Phaser 4.2.1 que `sound.add` lee el buffer desde `game.cache.audio`.
  - `unlockAudio()` reanuda el contexto de audio en la primera interaccion del usuario.
  - Validacion: `npm run build` (8 modulos) y smoke del servidor dev.
- Archivos modificados: `src/main.js`.
- Resultado: el panel QTE queda centrado y no solapa el HUD para secuencias de 3 a 7 flechas; los sonidos se escuchan en navegador tras la interaccion inicial.
- Decision humana/autorizacion: el estudiante pidio cubrir ambas correcciones y un set completo de sonidos; build aprobado.
- Limites respetados: sin dependencias nuevas, sin archivos de audio externos (sintesis en tiempo de ejecucion), sin red, sin commits.

## Detalle de la intervencion v0.8.0 (bloque B12: canvas responsive, recogido del sedal y captura junto a la cana)

- Instruccion recibida: centrar el canvas y que ocupe la pantalla de forma proporcionada segun el monitor; durante el QTE el sedal debe recogerse hacia la cana de forma visible y, al capturar, el anzuelo no debe volver al agua para luego relanzarse.
- Acciones realizadas:
  - `src/main.js`: config de Phaser con `scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 600 }`.
  - `index.html`: CSS que centra el lienzo (body sin margen, altura completa, fondo `#0b3a5c`, `#game` centrado con flex).
  - `reelHookProgress(progress)`: tween que desplaza el anzuelo y el sedal desde `HOOK_X` (400) hacia `REEL_TO_X` (110) segun el avance de la secuencia, actualizando la linea (`updateLine`) en cada fotograma.
  - `showFishCapture()`: la captura coloca el pez junto a la cana (x=110, y de agua), hace un salto animado y se asienta; el anzuelo permanece recogido sin volver al punto de lanzamiento.
  - Validacion: `npm run build` (9 modulos) y smoke del servidor dev.
- Archivos modificados: `src/main.js`, `index.html`.
- Resultado: el juego se escala y centra en cualquier tamano de pantalla; cada flecha correcta recoge el sedal y las capturas terminan junto a la cana.
- Decision humana/autorizacion: el estudiante eligio el modo FIT y autorizo el bloque.
- Limites respetados: sin dependencias nuevas, sin red, sin commits.

## Detalle de la intervencion v0.9.0 (bloque B13: soporte tactil para moviles)

- Instruccion recibida: detectar si el jugador usa PC o movil y adaptar los controles (se acordaron botones en pantalla para el QTE y un boton dedicado para avanzar en los menus).
- Acciones realizadas:
  - Deteccion: `this.isTouch = !!device.input.touch || matchMedia('(pointer: coarse)').matches`.
  - Entrada unificada: `doEnter()` (avanzar menus/reiniciar), `doCatch()` (reaccionar al pique) y `doArrow(token)` (flecha del QTE) usadas tanto por teclado como por toque; `onKeyDown` delega en ellas.
  - GUI tactil: `makeTouchButton(x, y, w, h, label, onClick)` (Graphics redondeado + texto + area interactiva); botones dedicados en titulo ("TOCAR PARA EMPEZAR"), controles y game over; boton Z "TOCA PARA PESCAR" con pulso durante el pique; D-pad de 4 botones con la textura de flecha rotada que llama a `doArrow`.
  - Visibilidad por pantalla: los controles tactiles solo se muestran durante la partida en modo tactil; el D-pad se atenua fuera del QTE y el boton Z se resetea al relanzar.
  - Config y CSS: `input: { activePointers: 2 }` y `touch-action: none` / `user-select: none`.
  - Validacion: `npm run build` (9 modulos) y smoke del servidor dev; prueba en navegador con modo dispositivo pendiente de verificacion manual.
- Archivos modificados: `src/main.js`, `index.html`.
- Resultado: en pantallas tactiles aparece la interfaz de botones completa; en escritorio el control por teclado queda identico.
- Decision humana/autorizacion: el estudiante eligio botones en pantalla y boton dedicado para menus; autorizo el bloque.
- Limites respetados: sin dependencias nuevas, sin red, sin commits.

## Detalle de la intervencion v0.10.0 (entrega: tests y cierre de documentacion)

- Instruccion recibida: preparar la entrega del parcial (segun las instrucciones de la catedra): pruebas automatizadas de las reglas, actualizar la documentacion de proceso y dejar el commit final para que el estudiante haga el push.
- Acciones realizadas:
  - Creacion de `tests/reglas.test.mjs` (10 tests con `node:test`, sin dependencias): constantes del GDD, tabla de rarezas (probabilidades, recompensas, secuencias), suma de probabilidades = 100 %, intervalos acumulativos de `selectRarity`, nunca fuera de tabla, distribucion +/-3 % sobre 20000 tiradas (RNG determinista), `generateSequence` (longitud 0-7 y tokens validos) y direcciones unicas.
  - Ejecucion: `node --test tests/*.test.mjs` -> 10/10 OK.
  - Actualizacion de `GDD.md`, `README.md` y los documentos de `docs/`.
  - Validacion final: `npm run build` (9 modulos) y smoke del servidor dev.
- Archivos creados: `tests/reglas.test.mjs`.
- Archivos modificados: `GDD.md`, `README.md`, `docs/registro-intervencion.md`, `docs/especificacion.md`, `docs/plan.md`, `docs/auditoria-repositorio.md`, `docs/evidencia-pruebas.md`, `docs/informe-final.md`.
- Resultado: reglas verificadas automaticamente y documentacion completa; commit final preparado (el push lo realiza el estudiante).
- Decision humana/autorizacion: el estudiante autorizo las fases de tests, documentacion y commit.
- Limites respetados: no se instalo nada, no se uso red, no se modifico `package.json` (las pruebas se documentan como comando directo).

## Correcciones y acciones rechazadas

- En una sesion previa el estudiante detecto `Uncaught TypeError: Phaser.Math.RandomPick is not a function` en `makeMarineFish`. El estudiante lo corrigio manualmente reemplazandolo por `Phaser.Utils.Array.GetRandom` (API correcta en Phaser 4.x); la correccion quedo validada por build y prueba manual.
- No se rechazo ninguna otra accion propuesta en este proyecto.
- Las desviaciones de alcance (audio y soporte tactil/canvas responsive) fueron decision explícita y aprobada del estudiante antes de implementarse (ver `GDD.md` y `docs/especificacion.md`).