# Plan de intervencion

## Objetivo del plan

Satisfacer los criterios CA-1 a CA-9 mediante cambios minimos sobre el scaffolding de Vite + JavaScript + Phaser 4.2.1. Documentado este plan no autoriza nada por si mismo: cada fase de implementacion requirio autorizacion explicita del estudiante. Estado final: todos los pasos completados y validados.

## Cambios propuestos y ejecutados

### Paso 1 (completado): Scaffolding

| Campo | Valor verificable |
|---|---|
| Motor | Phaser 4.2.1 (version real confirmada e instalada) |
| Lenguaje | JavaScript (confirmado) |
| Montaje | Vite 8.3.0 (confirmado, configuracion cero) |
| Archivos creados | `package.json`, `package-lock.json`, `index.html`, `src/main.js` |
| Archivo modificado | `.gitignore` (agrego `node_modules/` y `dist/`) |
| Validacion | `npm run build` exitoso; `npm run dev` inicio en `http://localhost:5173/`; warning de chunk >500 kB; 0 vulnerabilidades |
| Resultado | Completado y aprobado por el estudiante (registro v0.1.0) |

### Paso 2 (completado): Constantes del juego

- `src/config.js`: `GAME_DURATION` (180), `BITE_MIN_WAIT` (3), `BITE_MAX_WAIT` (5), `QTE_DURATION` (6), `RARITIES` (probabilidades 30/25/20/15/10 %, recompensas 100/300/500/700/1200, secuencias 3-7).
- Archivos creados: `src/config.js`, `src/rarity.js` (`selectRarity`).
- Verificacion: valores iguales al GDD; la suma de probabilidades es 100 % (verificado por tests).

### Paso 3 (completado): Ciclo lanzado -> espera de pique -> picada

- Implementado en `src/main.js` (estados CAST, WAIT, BITE; `startCastCycle`, `enterBite`).
- Verificacion: CA-1 y CA-2 (pique en 3-5 s, rareza por la tabla).

### Paso 4 (completado): Reaccion a Z y QTE

- `src/qte.js` (ARROWS, generateSequence) y `src/main.js` (startQte, handleQteInput, resolveQte; teclas Z y flechas).
- Extensiones aprobadas: panel QTE adaptativo al numero de flechas y barras de progreso/cuenta regresiva; recogido del sedal hacia la cana durante el QTE (B12).
- Verificacion: CA-3 a CA-7; el QTE nunca supera los 6 s.

### Paso 5 (completado): HUD

- `src/main.js`: `hudMoneyText` (dinero), `hudTimeBar` (barra de tiempo de la partida) y textos/colores de estado de pesca.
- Verificacion: CA-1 (contador arranca y corre en todos los estados).

### Paso 6 (completado): Fin de partida y pantalla final

- `src/main.js`: al llegar a 0 termina de inmediato (aun con QTE activo), sin recompensa ni relanzamiento; pantalla final con dinero total y rejuego con Enter (o boton tactil).
- Verificacion: CA-8 y CA-9.

### Paso 7 (completado): Evidencia, tests y registro

- `docs/evidencia-pruebas.md` (protocolo CA-1 a CA-9 + tactil), `docs/registro-intervencion.md` (v0.1.0 a v0.10.0), `docs/informe-final.md`.
- Extra autorizado: `tests/reglas.test.mjs` (10 tests con `node:test`) -> 10/10 OK.

## Extensiones aprobadas por el estudiante (fuera del alcance original)

| Bloque | Extension | Archivos | Validacion |
|---|---|---|---|
| B11 | Sonido sintetizado WebAudio (cache.audio + sound.add); panel QTE adaptativo | `src/main.js` | build OK; sonido audible tras interaccion |
| B12 | Canvas responsive (`Scale.FIT`, `CENTER_BOTH`) + CSS en `index.html`; recogido del sedal y captura junto a la cana (`REEL_TO_X`) | `src/main.js`, `index.html` | build OK + smoke dev |
| B13 | Soporte tactil: deteccion `isTouch`, `doEnter/doCatch/doArrow`, `makeTouchButton`, boton de pescar con pulso, D-pad, `activePointers: 2`, `touch-action: none` | `src/main.js`, `index.html` | build OK + smoke dev; prueba en dispositivo pendiente en `evidencia-pruebas.md` |

## Orden de implementacion ejecutado

1. Scaffolding (paso 1).
2. Constantes (paso 2) -> ciclo/pique (paso 3) -> QTE (paso 4) -> HUD (paso 5) -> cierre (paso 6).
3. Arreglos y extensiones posteriores en bloques B11 a B13 tras cada autorizacion.
4. Al final: pruebas automatizadas, evidencia y registro (paso 7).

## Fuera de alcance (confirmado al cierre)

- Pausa, menu de configuracion, persistencia de records (localStorage), objetivo minimo de dinero, sprites/arte final.
- Logs temporales de verificacion de rareza (la verificacion es por tests + revision de codigo + prueba manual).
- Dependencias o frameworks no incluidos en la especificacion; cambios ajenos al plan aprobado.