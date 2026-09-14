# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto. Esta auditoria distingue tres momentos: el estado inicial (plantilla, antes del scaffolding), el estado previo al gameplay (post-scaffolding) y el estado final entregado.

## Estado inicial auditado (plantilla, antes del scaffolding)

- Repositorio clonado de la plantilla PIAPC desde `https://github.com/ShaarDW/Parcial1--PIAPC.git`. Evidencia: `.git/config` (seccion `[remote "origin"]`).
- No existia scaffolding de juego. El contenido versionado era solo la plantilla de documentacion, el GDD, el README y las reglas de agentes.
- Decisiones de proyecto registradas en el contexto de trabajo (no en archivos): motor **Phaser 4**, lenguaje **JavaScript**, proyecto **Silly Fishing** (arcade de pesca), estudiante **Juan Thiago Alfaro**.
- Control de versiones inicial: rama `main`, commit unico `1e168f6b02c66d90506b0ee41c84dc99bf9f0c73`. Evidencia: `.git/refs/heads/main` y `.git/logs/HEAD`.
- Ausencia de scaffolding: sin `package.json`, sin `src/`, sin dependencias, sin configuracion de build, sin tests, sin comando de ejecucion.

## Estado previo al gameplay (post-scaffolding)

- Phaser **4.2.1** (version comprobada en el registro npm e instalada), JavaScript, Vite **8.3.0** (configuracion cero).
- Archivos creados: `package.json`, `package-lock.json`, `index.html`, `src/main.js`.
- `.gitignore` actualizado con `node_modules/` y `dist/`.
- En ese momento el gameplay no estaba implementado y no habia tests.

## Estado final entregado

### Estructura de archivos y carpetas

```
Parcial1--PIAPC/
  .git/
  .gitignore        (reglas node_modules/ y dist/)
  AGENTS.md
  GDD.md
  README.md
  package.json
  package-lock.json
  index.html        (CSS fullscreen centrado, touch-action: none)
  src/
    main.js         (escena completa, 1616 lineas)
    config.js       (constantes: GAME_DURATION, BITE_MIN/MAX_WAIT, QTE_DURATION, RARITIES)
    rarity.js       (selectRarity por intervalos acumulativos)
    qte.js          (ARROWS, generateSequence)
  tests/
    reglas.test.mjs (10 tests, node:test, sin dependencias)
  docs/             (9 documentos de proceso)
  dist/             (salida de build, ignorada por git)
  node_modules/     (dependencias, ignorada por git)
```

### Simbolos relevantes (verificados en el codigo)

| Ruta o simbolo | Rol observado |
|---|---|
| `src/config.js` (`GAME_DURATION`, `BITE_MIN_WAIT`, `BITE_MAX_WAIT`, `QTE_DURATION`, `RARITIES`) | Reglas del GDD centralizadas (180 s, 3-5 s, 6 s; 5 rarezas 30/25/20/15/10 %, recompensas 100/300/500/700/1200, secuencias 3-7) |
| `src/rarity.js` (`selectRarity`) | Sorteo ponderado por probabilidades acumuladas |
| `src/qte.js` (`ARROWS`, `generateSequence`) | Direcciones validas y generacion de secuencia aleatoria con reposicion |
| `src/main.js` — `config` de Phaser (`type: AUTO`, `Scale.FIT`, `CENTER_BOTH`, `activePointers: 2`) | Canvas responsive 800x600 centrado; soporte multitactil |
| `src/main.js` — `FishingScene` (`State`, `Screen`, `startCastCycle`, `startQte`, `handleQteInput`, `resolveQte`, `reelHookProgress`, `showFishCapture`, `doEnter/doCatch/doArrow`, `makeTouchButton`, `createSfx/playSfx/unlockAudio`, `updateHud*`, `updateTimeBar`) | Bucle de pesca completo: CAST/WAIT/BITE/QTE/RESULT/GAME_OVER, HUD (dinero, barra de tiempo, estado), QTE adaptativo, recogido del sedal, captura junto a la cana, menus (titulo/controles/final), tactil y sonido |
| `index.html` | Entrada HTML; CSS que centra el canvas y evita scroll/zoom (`touch-action: none`, `user-select: none`) |
| `tests/reglas.test.mjs` | Pruebas automaticas de las reglas (`node:test`, 10 casos) |
| `.gitignore` | Excluye `node_modules/` y `dist/` |

### Scripts disponibles

| Script | Comando | Que hace |
|---|---|---|
| `dev` | `vite` | Servidor local de desarrollo |
| `build` | `vite build` | Compilacion de produccion en `dist/` |
| `preview` | `vite preview` | Previsualizacion del build de produccion |
| (sin script) | `node --test tests/*.test.mjs` | Ejecuta las pruebas de reglas (node:test) |

### Pruebas y comandos disponibles (estado final)

| Comando o prueba | Que verifica | Resultado |
|---|---|---|
| `node --test tests/*.test.mjs` | Reglas del GDD, tabla de rarezas, RNG y QTE | 10/10 tests pasan (ver `docs/evidencia-pruebas.md`) |
| `npm run build` | Compilacion de produccion | Exitoso: 9 modulos, `dist/assets/index-CUuTEP3r.js` (1.405 MB / 366 kB gzip); warning de chunk >500 kB (bundle de Phaser) no bloquea |
| `npm run dev` | Servidor local de desarrollo | Inicia en `http://localhost:5173/` (smoke con HTTP 200 para `index.html` y `src/main.js`) |
| `npm run preview` | Previsualizacion del build | Disponible; no ejecutado en la validacion final |
| Pruebas manuales CA-1 a CA-9 | Criterios de aceptacion del juego | Registradas en `docs/evidencia-pruebas.md` |

### Estado del gameplay (final)

- **Implementado y funcional.** El bucle completo del GDD funciona: lanzamiento automatico, espera de pique (3-5 s), picada, QTE de flechas (3-7 segun rareza, 6 s), captura con recompensa o escape con feedback, relanzamiento y fin de partida a los 180 s.
- Correctiones y extensiones incluidas: correccion manual de `Phaser.Math.RandomPick` -> `Phaser.Utils.Array.GetRandom`; QTE adaptativo y sonido (B11); canvas responsive y recogido del sedal (B12); soporte tactil (B13).
- Hay tests automatizados de las reglas, no de la interfaz (la interfaz se cubre con prueba manual).

## Comparacion entre el estado real y el plan aprobado

| Paso del plan | Estado actual | Resultado |
|---|---|---|
| 1. Auditoria / scaffolding Phaser 4 + JS | Phaser 4.2.1, Vite 8.3.0, JavaScript, scaffolding validado | **Completado** |
| 2. Archivo de constantes del juego | `src/config.js` (+ `src/rarity.js`, `src/qte.js`) | **Completado** |
| 3. Ciclo lanzado -> espera -> picada | `startCastCycle`, `selectRarity`, estados CAST/WAIT/BITE | **Completado** |
| 4. Reaccion a Z y QTE de flechas | `startQte`, `handleQteInput`, `resolveQte`, teclado y tactil | **Completado** |
| 5. HUD (dinero, tiempo, estado) | `hudMoneyText`, `hudTimeBar`, textos/colores de estado | **Completado** |
| 6. Fin de partida y pantalla final | `showGameOver`, rejuego con Enter/boton | **Completado** |
| 7. Evidencia y registro de intervencion | `docs/registro-intervencion.md`, `docs/evidencia-pruebas.md` y `docs/informe-final.md` completados + `tests/reglas.test.mjs` | **Completado** |

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados:
  - Scaffolding completado y validado (Phaser 4.2.1, JavaScript, Vite 8.3.0).
  - Gameplay completo implementado en `src/` (config, rarity, qte, main), con titulo, menus, HUD, recogido del sedal y controles tactiles.
  - Tests automatizados 10/10 OK y build final de 9 modulos OK.
  - `node_modules/` y `dist/` ignorados por git; sin secretos en el repositorio.
- Supuestos por verificar (prueba manual del estudiante):
  - Comportamiento real observado de cada criterio CA-1 a CA-9 en navegador (protocolo en `docs/evidencia-pruebas.md`).
  - Comportamiento tactil en un dispositivo movil real o en el modo dispositivo del navegador (desplegado en Vercel).
- Preguntas resueltas durante el proyecto (decisiones aprobadas):
  - Motor Phaser 4.2.1 / JavaScript / Vite 8.3.0 (scaffolding).
  - Extensiones de alcance: audio sintetizado, canvas responsive (`Scale.FIT`) y soporte tactil.
  - Correccion humana de `Phaser.Math.RandomPick` por `Phaser.Utils.Array.GetRandom`.

## Riesgos, contradicciones y condiciones de detencion

- Riesgos:
  - Bundle de Phaser completo genera un chunk grande (>500 kB). Aceptado como warning; no bloquea.
  - `dist/` y `node_modules/` deben permanecer ignorados por git para no versionarse (verificado: `.gitignore` los excluye).
  - La verificacion tactil depende de un dispositivo real o del modo dispositivo del navegador; no se puede automatizar en `node:test`.
- Contradicciones:
  - Ninguna detectada en el estado final.
- Condiciones de detencion (aplicadas durante el proyecto):
  - Detenerse si una accion excede la autorizacion otorgada.
  - Detenerse si la implementacion contradice el GDD/especificacion sin una decision aprobada (ley -> registradas las desviaciones aprobadas).
  - Detenerse ante fallos de ejecucion sin causa comprendida.