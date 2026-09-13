# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto antes de proponer cambios. Esta auditoria corresponde al estado inicial del repositorio, antes de crear scaffolding, instalar dependencias o implementar codigo.

## Estado inicial real del repositorio

- Repositorio clonado de la plantilla PIAPC desde `https://github.com/ShaarDW/Parcial1--PIAPC.git`. Evidencia: `.git/config` (seccion `[remote "origin"]`).
- No existe scaffolding de juego. El contenido versionado es solo la plantilla de documentacion, el GDD, el README y las reglas de agentes.
- Decisiones de proyecto registradas en el contexto de trabajo (no en archivos): motor **Phaser 4**, lenguaje **JavaScript**, proyecto **Silly Fishing** (arcade de pesca), estudiante **Juan Thiago Alfaro**.

## Control de versiones

- Rama actual: `main`. Evidencia: `.git/HEAD`.
- Commit actual: `1e168f6b02c66d90506b0ee41c84dc99bf9f0c73`. Evidencia: `.git/refs/heads/main`.
- Historial: un unico commit, correspondiente al clon inicial; sin commits locales posteriores. Evidencia: `.git/logs/HEAD`.

## Estructura real de archivos y carpetas

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

## Rutas y simbolos relevantes

| Ruta o simbolo | Rol observado | Evidencia |
|---|---|---|
| `README.md` | Plantilla de datos del proyecto, todo en `[PENDIENTE]` | Lectura del archivo |
| `GDD.md` | Plantilla de diseno, todo en `[PENDIENTE]` | Lectura del archivo |
| `AGENTS.md` | Reglas para agentes (auditoria, documentacion, alcance) | Lectura del archivo |
| `.gitignore` | Reglas comunes de ignorado (ver seccion aparte) | Lectura del archivo |
| `docs/` | Plantillas del proceso (9 documentos) | Listado del directorio |

## Scaffolding de Phaser

- **Ausente.** No existe ningun proyecto del motor, ni escenas, ni entrada del juego, ni assets.
- Busqueda global de archivos `**/*.{js,ts,mjs,cjs,jsx,tsx,json,html,css}`: sin resultados.
- No existe `src/`, `public/`, `dist/`, `node_modules/` ni carpeta equivalente.

## package.json, dependencias, scripts, tests y configuracion de build

- **Sin `package.json`**: busqueda global `**/package.json` sin resultados. No hay manifiesto de dependencias ni scripts definidos.
- **Sin dependencias**: no hay instalacion ni listado de paquetes.
- **Sin configuracion de build**: no hay `vite.config.*`, `webpack.config.*`, `tsconfig*.json` ni equivalentes.
- **Sin pruebas**: no existe codigo de tests ni framework de pruebas.
- **Sin comando de ejecucion documentado ni real**: no hay scripts ni puntos de entrada.

## Version de Phaser

- **No hay version de Phaser verificable** en el repositorio: no existe ninguna instalacion ni manifest que la declare.
- La decision declarada es Phaser 4, pero la **subversion exacta queda pendiente de verificacion** en el momento de preparar el scaffolding. No se asume ni se declara una version concreta sin evidencia.

## Decision de proyecto

- Motor: **Phaser 4** (decision del estudiante).
- Lenguaje: **JavaScript** (decision del estudiante).
- Proyecto: **Silly Fishing**, arcade de pesca con partidas de 180 segundos.
- Aclaracion: la subversion exacta de Phaser todavia **no esta verificada**; se confirmara al crear el scaffolding.

## Estado actual de .gitignore y faltantes

- Contenido actual (`.gitignore`, 8 lineas):
  - `.DS_Store`, `Thumbs.db`.
  - `.env`, `.env.*` y excepcion `!.env.example`.
- **Faltantes** para el proyecto Phaser + JavaScript/npm:
  - `node_modules/`.
  - Artefactos de build (p. ej. `dist/`).
  - Reglas recomendadas del motor/entorno elegido.
- Estado: pendiente de actualizar; no se modifica en esta auditoria.

## Flujo observado

No existe un flujo de juego observable: no hay implementacion. El lazo de comportamiento (lanzamiento automatico -> espera de pique 3-5 s -> picada -> QTE de flechas -> captura/escape -> relanzamiento -> fin de partida en 180 s) esta definido en el GDD y la especificacion como comportamiento objetivo, no como hecho del repositorio.

## Pruebas y comandos disponibles

| Comando o prueba | Que verifica | Resultado inicial |
|---|---|---|
| (ninguno presente) | No hay scripts ni pruebas en el repositorio | No aplicable |
| Pruebas manuales planificadas (CA-1 a CA-9) | Criterios de aceptacion del juego | Pendientes de ejecucion, se registraran en `docs/evidencia-pruebas.md` |

## Comparacion entre el estado real y el plan aprobado

| Paso del plan | Estado real | Resultado |
|---|---|---|
| 1. Auditoria / scaffolding Phaser 4 + JS | Sin scaffolding, sin version, sin scripts | Pendiente; requiere montaje e instalacion |
| 2. Archivo de constantes del juego | No existe | Pendiente de crear |
| 3. Ciclo lanzado -> espera -> picada | No existe | Pendiente de crear |
| 4. Reaccion a Z y QTE de flechas | No existe | Pendiente de crear |
| 5. HUD (dinero, tiempo, estado) | No existe | Pendiente de crear |
| 6. Fin de partida y pantalla final | No existe | Pendiente de crear |
| 7. Evidencia y registro de intervencion | Solo plantillas en `docs/` | Pendiente de registrar |

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados:
  - Repositorio clonado de la plantilla, rama `main`, commit unico `1e168f6b`.
  - Sin scaffolding de Phaser, sin `package.json`, sin dependencias, scripts, tests ni config de build.
  - Sin version de Phaser verificable.
  - `.gitignore` sin reglas de npm/build.
  - `README.md`, `GDD.md` y las plantillas de `docs/` permanecen en `[PENDIENTE]`.
- Supuestos por verificar:
  - JavaScript y Phaser 4 como stack (decision declarada, sin evidencia en el repositorio).
  - La plantilla o estructura minima a elegir (Vite u otro montaje) sera compatible con Phaser 4 + JavaScript.
- Preguntas para consultar:
  - Que montaje se usa (Vite vs. archivos estaticos vs. otro) y que estructura minima recomienda.
  - Cual es la subversion exacta de Phaser 4 a instalar.
  - Autorizacion puntual para crear scaffolding, instalar las dependencias minimas y usar red durante esa instalacion.

## Acciones necesarias todavia pendientes de autorizacion

1. Elegir y aprobar el montaje del scaffolding (Vite u otro) segun la estructura minima compatible con Phaser 4 + JavaScript.
2. Crear el scaffolding (archivos de proyecto) tras confirmar que no existe.
3. Instalar las dependencias minimas (Phaser 4) y usar red durante esa instalacion: la matriz de permisos permite la instalacion de forma limitada, pero requiere autorizacion puntual para el uso de red.
4. Actualizar `.gitignore` con reglas de npm/build (queda dentro del alcance del plan, despues de confirmar las rutas reales).

## Riesgos, contradicciones y condiciones de detencion

- Riesgos:
  - `.gitignore` incompleto: crear `node_modules/` sin actualizarlo puede llevar a versionar dependencias.
  - Version de Phaser y lenguaje sin verificar hasta el scaffolding.
  - Los acuerdos de GDD, especificacion, plan y matriz viven solo en la conversacion; los archivos siguen en `[PENDIENTE]`.
- Contradicciones:
  - La matriz define "Usar red: prohibida salvo durante una instalacion previamente autorizada". La instalacion del scaffolding requiere red, por lo que falta la autorizacion puntual para ese momento concreto.
- Condiciones de detencion:
  - Detenerse antes de crear scaffolding, instalar dependencias o usar red sin autorizacion puntual e explicita.
  - Detenerse si la estructura descubierta al preparar el scaffolding contradice el plan (p. ej. plantilla TypeScript, version incompatible).
  - Detenerse ante fallos de instalacion o ejecucion sin causa comprendida, sin reintentar por cuenta propia.
  - Detenerse ante cualquier accion fuera de la matriz de permisos aprobada.