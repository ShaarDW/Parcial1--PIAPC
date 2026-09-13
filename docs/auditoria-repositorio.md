# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto antes de proponer cambios. Esta auditoria distingue dos momentos: el estado inicial auditado (antes del scaffolding) y el estado actual posterior al scaffolding.

## Estado inicial auditado (antes del scaffolding)

### Estado inicial real del repositorio

- Repositorio clonado de la plantilla PIAPC desde `https://github.com/ShaarDW/Parcial1--PIAPC.git`. Evidencia: `.git/config` (seccion `[remote "origin"]`).
- No existia scaffolding de juego. El contenido versionado era solo la plantilla de documentacion, el GDD, el README y las reglas de agentes.
- Decisiones de proyecto registradas en el contexto de trabajo (no en archivos): motor **Phaser 4**, lenguaje **JavaScript**, proyecto **Silly Fishing** (arcade de pesca), estudiante **Juan Thiago Alfaro**.

### Control de versiones (inicial)

- Rama actual: `main`. Evidencia: `.git/HEAD`.
- Commit actual: `1e168f6b02c66d90506b0ee41c84dc99bf9f0c73`. Evidencia: `.git/refs/heads/main`.
- Historial: un unico commit, correspondiente al clon inicial; sin commits locales posteriores. Evidencia: `.git/logs/HEAD`.

### Estructura inicial de archivos y carpetas

```
Parcial1--PIAPC/
  .git/            (rama main, commit 1e168f6b, remote origin)
  .gitignore
  AGENTS.md
  GDD.md
  README.md
  docs/
    README.md
    auditoria-repositorio.md
    especificacion.md
    evidencia-pruebas.md
    informe-final.md
    matriz-permisos.md
    plan.md
    prompt-inicial-opencode.md
    registro-intervencion.md
```

### Ausencia de scaffolding (inicial)

- **Ausente.** No existia ningun proyecto del motor, ni escenas, ni entrada del juego, ni assets.
- Busqueda global de archivos `**/*.{js,ts,mjs,cjs,jsx,tsx,json,html,css}`: sin resultados.
- No existia `src/`, `public/`, `dist/`, `node_modules/` ni carpeta equivalente.

### package.json, dependencias, scripts, tests y configuracion de build (inicial)

- **Sin `package.json`**: busqueda global `**/package.json` sin resultados.
- **Sin dependencias**: no habia instalacion ni listado de paquetes.
- **Sin configuracion de build**: no habia `vite.config.*`, `webpack.config.*`, `tsconfig*.json` ni equivalentes.
- **Sin pruebas**: no existia codigo de tests ni framework de pruebas.
- **Sin comando de ejecucion documentado ni real**: no habia scripts ni puntos de entrada.

### Version de Phaser (inicial)

- **No habia version de Phaser verificable** en el repositorio: no existia instalacion ni manifest que la declarara.
- La decision declarada era Phaser 4 y la subversion exacta quedaba pendiente de verificacion al preparar el scaffolding.

### Estado inicial de .gitignore

- Contenido inicial (8 lineas): `.DS_Store`, `Thumbs.db`, `.env`, `.env.*` y excepcion `!.env.example`.
- Faltantes para el proyecto Phaser + JavaScript/npm: `node_modules/` y artefactos de build.

## Estado actual posterior al scaffolding

### Estructura actual de archivos y carpetas

```
Parcial1--PIAPC/
  .git/
  .gitignore        (agregadas reglas node_modules/ y dist/)
  AGENTS.md
  GDD.md
  README.md
  package.json
  package-lock.json
  index.html
  src/
    main.js
  docs/             (9 documentos de proceso)
  dist/             (salida de build, ignorada por git)
  node_modules/     (dependencias instaladas, ignorada por git)
```

### Scaffolding confirmado

- Motor: **Phaser 4.2.1** (version real comprobada en el registro npm e instalada; evidencia: `package.json` y `package-lock.json`).
- Lenguaje: **JavaScript** (confirmado en el scaffolding). Sin TypeScript.
- Montaje: **Vite 8.3.0** (confirmado). No se requiere configuracion propia de Vite; el proyecto funciona con la configuracion cero de Vite.
- Archivos creados: `package.json`, `package-lock.json`, `index.html`, `src/main.js`.
- Archivo modificado: `.gitignore` (se agregaron `node_modules/` y `dist/`).
- No se creo `vite.config.*` porque no fue necesario.

### Dependencias instaladas (versiones exactas de `package-lock.json`)

- Directas: `phaser` 4.2.1; `vite` 8.3.0 (dependencia de desarrollo).
- Transitivas relevantes: `eventemitter3` 5.0.4; `rolldown` 1.2.8; `lightningcss` 1.33.0; `postcss` 8.5.28; `nanoid` 3.3.19; `picocolors` 1.1.1; `picomatch` 4.0.7; `source-map-js` 1.2.1; `tinyglobby` 0.2.17; `fdir` 6.5.0; `detect-libc` 2.1.2; `@oxc-project/types` 0.149.0; `@rolldown/pluginutils` 1.0.1, mas binarios opcionales por plataforma de rolldown/lightningcss y `fsevents` 2.3.3 (opcional, macOS).

### Scripts disponibles

| Script | Comando | Que hace |
|---|---|---|
| `dev` | `vite` | Servidor local de desarrollo |
| `build` | `vite build` | Compilacion de produccion en `dist/` |
| `preview` | `vite preview` | Previsualizacion del build de produccion |

### Validacion realizada

- `npm run build`: exitoso. `vite v8.3.0` compilo 5 modulos y genero `dist/` en 573 ms.
- `npm run dev`: iniciado correctamente. `VITE v8.3.0 ready in 218 ms` en `http://localhost:5173/`. El proceso dev es un servidor persistente y fue detenido por el timeout del comando, lo cual es el comportamiento esperado.
- Warning: chunk de mas de 500 kB (bundle de Phaser completo, ~1.375 MB / 358 kB gzip). No bloquea la compilacion ni el arranque.
- `npm audit`: 0 vulnerabilidades reportadas.

### Estado del gameplay

- **Todavia no esta implementado.**
- `src/main.js` solo contiene la escena base de prueba (config de Phaser 800x600, fondo azul y texto "Silly Fishing").
- No existen todavia: estados de pesca (lanzado/espera/picada/QTE), sorteo de rarezas, recompensas, HUD, temporizador de 180 segundos, controles, pantalla final ni constantes de gameplay.
- No hay tests.

## Rutas y simbolos relevantes (estado actual)

| Ruta o simbolo | Rol observado | Evidencia |
|---|---|---|
| `README.md` | Datos del proyecto (parcialmente completado) | Lectura del archivo |
| `GDD.md` | GDD aprobado, completado | Lectura del archivo |
| `AGENTS.md` | Reglas para agentes (auditoria, documentacion, alcance) | Lectura del archivo |
| `.gitignore` | Reglas comunes + `node_modules/` y `dist/` | Lectura del archivo |
| `package.json` | Manifiesto npm con scripts y dependencias | Lectura del archivo |
| `package-lock.json` | Versionado exacto de dependencias | Lectura del archivo |
| `index.html` | Entrada HTML, carga `/src/main.js` | Lectura del archivo |
| `src/main.js` | Entry point de Phaser; escena base de prueba | Lectura del archivo |
| `docs/` | Plantillas/documents del proceso | Listado del directorio |

## Flujo observado

No existe un flujo de juego observable: no hay implementacion. El lazo de comportamiento (lanzamiento automatico -> espera de pique 3-5 s -> picada -> QTE de flechas -> captura/escape -> relanzamiento -> fin de partida en 180 s) esta definido en el GDD y la especificacion como comportamiento objetivo, no como hecho del repositorio.

## Pruebas y comandos disponibles (estado actual)

| Comando o prueba | Que verifica | Resultado |
|---|---|---|
| `npm run build` | Compilacion de produccion | Exitoso (573 ms, genero `dist/`) |
| `npm run dev` | Servidor local de desarrollo | Inicia en `http://localhost:5173/` |
| `npm run preview` | Previsualizacion del build | Disponible; no ejecutado en esta etapa |
| Pruebas manuales planificadas (CA-1 a CA-9) | Criterios de aceptacion del juego | Pendientes; se registraran en `docs/evidencia-pruebas.md` |

## Comparacion entre el estado real y el plan aprobado

| Paso del plan | Estado actual | Resultado |
|---|---|---|
| 1. Auditoria / scaffolding Phaser 4 + JS | Completado: Phaser 4.2.1, Vite 8.3.0, JavaScript, scaffolding creado y validado | **Completado** |
| 2. Archivo de constantes del juego | No existe | Pendiente (requiere autorizacion de implementacion) |
| 3. Ciclo lanzado -> espera -> picada | No existe | Pendiente |
| 4. Reaccion a Z y QTE de flechas | No existe | Pendiente |
| 5. HUD (dinero, tiempo, estado) | No existe | Pendiente |
| 6. Fin de partida y pantalla final | No existe | Pendiente |
| 7. Evidencia y registro de intervencion | `docs/registro-intervencion.md` completo para la intervencion v0.1.0; `docs/evidencia-pruebas.md` sigue como plantilla | Pendiente de registrar pruebas de gameplay |

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados:
  - Repositorio clonado de la plantilla, rama `main`, commit unico `1e168f6b` al inicio; sin commits posteriores.
  - Scaffolding completado: Phaser 4.2.1, JavaScript, Vite 8.3.0, con `package.json`, `package-lock.json`, `index.html` y `src/main.js`.
  - Validacion exitosa de `build` y `dev`; warning de chunk >500 kB; 0 vulnerabilidades.
  - `.gitignore` actualizado con `node_modules/` y `dist/`.
  - Gameplay no implementado; sin tests.
- Supuestos por verificar:
  - La estructura elegida (Vite + JavaScript + Phaser 4.2.1) es suficiente para implementar el gameplay segun la especificacion.
  - Los controles (Z y flechas) no requieren configuracion adicional de entrada.
- Preguntas para consultar:
  - Autorizacion para iniciar la implementacion del gameplay (pasos 2 a 6 del plan).
  - En su momento, si se requieren assets adicionales o dependencias nuevas.

## Acciones necesarias todavia pendientes de autorizacion

1. Autorizar la implementacion del gameplay (definir alcance y permisos para los pasos 2 a 6 del plan).
2. Crear el archivo de constantes del juego y las escenas de partida/HUD/final segun la especificacion.
3. Actualizar `docs/evidencia-pruebas.md` y `docs/informe-final.md` cuando existan validaciones reales.
4. Completar campos de `README.md` que sigan en `[PENDIENTE]` (materia/comision/anio, creditos, entrega) con datos que aporte el estudiante.

## Riesgos, contradicciones y condiciones de detencion

- Riesgos:
  - Bundle de Phaser completo genera un chunk grande (>500 kB). Aceptado como warning; no bloquea.
  - `dist/` y `node_modules/` deben permanecer ignorados por git para no versionarlos.
  - La implementacion del gameplay debe limitarse a la especificacion aprobada para no ampliar el alcance.
- Contradicciones:
  - Ninguna detectada en esta etapa.
- Condiciones de detencion:
  - Detenerse si una accion excede la autorizacion otorgada (la autorizacion puntual de scaffolding no incluye gameplay).
  - Detenerse si la implementacion contradice la especificacion CA-1 a CA-9 sin una decision aprobada.
  - Detenerse ante fallos de ejecucion sin causa comprendida, sin reintentar por cuenta propia.
  - Detenerse ante cualquier accion fuera de la matriz de permisos aprobada.