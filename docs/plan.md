# Plan de intervencion

## Objetivo del plan

Satisfacer los criterios CA-1 a CA-9 mediante cambios minimos sobre el scaffolding de Vite + JavaScript + Phaser 4.2.1, sin ampliar el alcance de la especificacion. Cada paso verifica sus criterios asociados antes de avanzar al siguiente. La documentacion de este plan no autoriza por si misma la implementacion: los pasos de gameplay requieren autorizacion explicita.

## Cambios propuestos

### Paso 1 (completado): Scaffolding

| Campo | Valor verificable |
|---|---|
| Motor | Phaser 4.2.1 (version real confirmada e instalada) |
| Lenguaje | JavaScript (confirmado) |
| Montaje | Vite 8.3.0 (confirmado, configuracion cero) |
| Archivos creados | `package.json`, `package-lock.json`, `index.html`, `src/main.js` |
| Archivo modificado | `.gitignore` (agrego `node_modules/` y `dist/`) |
| Validacion | `npm run build` exitoso; `npm run dev` inicio en `http://localhost:5173/`; warning de chunk >500 kB; 0 vulnerabilidades |
| Resultado | Completado y aprobado por el estudiante |

### Pasos 2 a 6 (pendientes de autorizacion de implementacion)

| Paso | Cambio minimo | Archivos previstos (a confirmar al implementar) | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 2 | Crear archivo de constantes del juego con las reglas del GDD (180 s, 3-5 s, probabilidades 30/25/20/15/10 %, recompensas 100/300/500/700/1200, 3-7 flechas, QTE 6 s) | Constante(s) del juego | Revision: valores iguales al GDD; suma de probabilidades = 100 % | Desvio respecto del GDD | Valor que contradiga el GDD |
| 3 | Ciclo lanzado -> espera de pique -> picada con seleccion ponderada por probabilidades acumuladas | Escenas/proceso de partida | CA-2: pique en 3-5 s; rareza segun la tabla (observacion + revision de implementacion) | Ponderacion incorrecta del RNG | Pique fuera de la ventana o rareza fuera de la tabla |
| 4 | Reaccion a Z y QTE: mostrar secuencia de N flechas con reposicion y temporizador de 6 s; validar flechas; captura/escape con feedback (texto + color); relanzamiento inmediato | Escenas/proceso de partida | CA-3 a CA-7: estados correctos; QTE <= 6 s | Conflicto de teclas entre estados; temporizador desincronizado | Estados indebidos o QTE que excede 6 s |
| 5 | HUD: dinero acumulado, contador continuo de 180 s, estado (texto + color) | Componente HUD | CA-1: contador arranca y corre en todos los estados | Contador desincronizado | El HUD no refleja el estado real |
| 6 | Fin de partida y pantalla final: al llegar a 0 terminar de inmediato (aun con QTE activo), sin recompensa ni relanzamiento; rejuego con Enter | Escena/proceso final | CA-8, CA-9 | Otorgar recompensa tras 0; rejuego que conserve estado | Pago posterior a 0 o rejuego con estado previo |

### Paso 7 (se completa al final)

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 7 | Registrar evidencia de pruebas manuales y registro de intervencion | `docs/evidencia-pruebas.md`, `docs/registro-intervencion.md` | CA-1 a CA-9 con pasos reproducibles y resultado observado | Evidencia no reproducible | Una prueba no puede repetirse o documentarse |

## Orden de implementacion

1. El scaffolding (paso 1) esta completado y valida la base sobre la que se construira el gameplay.
2. Constantes del juego (paso 2): centralizan las reglas del GDD antes de programar la logica.
3. Bucle en orden del comportamiento: ciclo/pique (3) -> QTE (4) -> HUD (5) -> cierre (6).
4. Al final, evidencia y registro (7): solo se documenta lo efectivamente ejecutado.
- Antes de cada paso se confirma que el anterior cumplio su verificacion. Antes de cualquier edicion, instalacion o ejecucion que requiera autorizacion, la accion debe estar contemplada y aprobada en la matriz de permisos.

## Fuera de alcance

- Audio, pausa, menu de configuracion, soporte tactil, persistencia de records (localStorage), objetivo minimo de dinero, sprites/arte final.
- Logs temporales de verificacion de rareza (la verificacion es manual mas revision de codigo).
- Dependencias o frameworks no incluidos en la especificacion; cambios ajenos al plan aprobado.
- La implementacion del gameplay queda pendiente de autorizacion explicita; este plan no la autoriza.