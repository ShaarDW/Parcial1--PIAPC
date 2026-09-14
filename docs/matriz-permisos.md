# Matriz de permisos

Completa esta matriz antes de habilitar acciones de un agente. Una accion no declarada debe considerarse prohibida hasta consultar.

| Accion | Estado | Alcance o justificacion |
|---|---|---|
| Leer archivos del proyecto | Permitida | Requerida para la auditoria real y el seguimiento del plan. |
| Buscar rutas y simbolos | Permitida, limitada | Solo lectura/inspeccion. No modificar archivos. |
| Editar archivos previstos | Permitida, limitada | Solo archivos contemplados en el plan y unicamente despues de que la auditoria confirme las rutas reales. Cualquier archivo fuera del plan requiere consulta. |
| Crear archivos del scaffolding | Permitida, limitada | Solo si la auditoria confirma que son necesarios y respetando la estructura descubierta. No implica autorizacion para agregar funcionalidades. |
| Ejecutar scripts documentados | Permitida, limitada | Solo scripts existentes/documentados en el repositorio y con los argumentos necesarios para la tarea. No inventar scripts, comandos ni argumentos para resolver problemas. |
| Instalar dependencias | Permitida, limitada | Unicamente las dependencias minimas necesarias para el scaffolding Phaser 4 + JavaScript identificadas y aprobadas. No instalar librerias adicionales por conveniencia. |
| Usar red | Prohibida salvo excepcion | Permitida solo durante una instalacion de dependencias previamente autorizada. Sin busquedas, descargas ni consultas externas por iniciativa propia. |
| Publicar o subir cambios | Prohibida | Hasta autorizacion explicita. |
| Acceder a secretos o credenciales | Prohibida | No corresponde al trabajo. |

## Autorizacion puntual de scaffolding (otorgada y cumplida)

La autorizacion puntual de la etapa de scaffolding permitio:

- Elegir Vite + JavaScript + Phaser 4 y verificar la subversion real: **Phaser 4.2.1** instalado; **Vite 8.3.0** instalado.
- Crear el scaffolding minimo: `package.json`, `package-lock.json`, `index.html`, `src/main.js`.
- Instalar las dependencias minimas (Phaser 4.2.1 y Vite 8.3.0).
- Usar red exclusivamente durante la instalacion de dichas dependencias (consulta del registro npm para verificar la version real).
- Modificar `.gitignore` para no versionar `node_modules/` y `dist/`.
- Ejecutar los scripts definidos por el scaffolding para validar el arranque (`npm run build` y `npm run dev`).

Esta autorizacion **NO incluyo** la implementacion del gameplay (estados de pesca, QTE, rarezas, recompensas, HUD, temporizador ni pantalla final). La implementacion queda pendiente de una autorizacion especifica.

## Autorizaciones de implementacion otorgadas (bloques B1 a B13)

El estudiante autorizo cada bloque de implementacion de forma explicita antes de ejecutarlo; a continuacion, el alcance acumulado de lo autorizado:

- **B1 a B10 (sesiones previas)**: gameplay completo segun el GDD (constantes, ciclo de pesca, QTE, recompensas, relanzamiento, HUD, fin de partida, pantallas, escenario, vida marina y pulido). Permiti realizar una correccion manual sobre `Phaser.Utils.Array.GetRandom`.
- **B11**: correccion del panel QTE (adaptativo, centrado, sin solapamiento con el HUD) y creacion de sonidos sintetizados WebAudio (sin archivos ni dependencias).
- **B12**: canvas responsive centrado (`scale: Scale.FIT`, `CENTER_BOTH`) y CSS en `index.html`; recogido del sedal durante el QTE y captura junto a la cana.
- **B13**: soporte tactil (deteccion de dispositivo, botones en pantalla, D-pad, `activePointers: 2`, `touch-action: none`).
- **Entrega**: creacion de `tests/reglas.test.mjs`, actualizacion de la documentacion de proceso (`GDD.md`, `README.md`, `docs/`) y commit final (el push lo realiza el estudiante).

## Autorizaciones que siguen vigentes

- Publicar o subir cambios: **prohibida**; el push final lo ejecuta el estudiante.
- Acceder a secretos o credenciales: **prohibida**.
- Instalar dependencias o usar red: **prohibida** (no fueron necesarias tras el scaffolding).

## Condiciones de detencion

- La accion a ejecutar no esta contemplada en esta matriz o excede su alcance -> detenerse y consultar.
- La auditoria o la implementacion revelan una estructura o requisitos que contradicen el plan (p. ej. una plantilla que imponga TypeScript, una version de Phaser distinta).
- Un comando instalado/ejecutado falla sin causa comprendida -> no reintentar ni "arreglar" por cuenta propia.
- Aparecen cambios ajenos en el repositorio o secretos no previstos.
- Cualquier divergencia entre la implementacion y el GDD/especificacion sin decision aprobada.