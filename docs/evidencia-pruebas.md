# Evidencia de pruebas

Relaciona cada criterio de aceptacion con una prueba o secuencia manual que otra persona pueda repetir. Las filas de pruebas automatizadas registran el resultado real ejecutado en la validacion final. Las filas de prueba manual requieren que el estudiante confirme el resultado observado tras jugar (columna completable).

## Pruebas automatizadas (ejecutadas en la validacion final)

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Reglas (constantes, tabla de rarezas, RNG, QTE) | Worktree previo al commit final | `node --test tests/*.test.mjs` | Ejecutar el comando | 10 tests pasan, 0 fallan | 10/10 pass (0 fail, 0 skipped) | Salida de consola: `tests 10 · pass 10 · fail 0` |
| Build de produccion | Worktree previo al commit final | `npm run build` | Ejecutar el comando | Compilacion exitosa | 9 modulos transformados; `dist/assets/index-CUuTEP3r.js` 1,405.58 kB / 365.81 kB gzip en 3.06 s; solo warning de chunk >500 kB | Salida de consola de Vite |
| Smoke del servidor dev | Worktree previo al commit final | `npm run dev` + peticion HTTP | Iniciar dev y pedir `/` y `/src/main.js` | HTTP 200 en ambos | HTTP 200 (`index.html` len 830; `main.js` len 255077) en `http://localhost:5197/` | Salida de consola de Vite e `Invoke-WebRequest` |

Que verifica la prueba automatizada (detalle):

- Constantes del GDD: partida 180 s, pique 3-5 s, QTE 6 s.
- Tabla de rarezas: 5 rarezas con probabilidad/recompensa/secuencia exactas del GDD (30 %/$100/3 ... 10 %/$1200/7).
- La suma de probabilidades es 100 %.
- Recompensas y largos de secuencia unicos y crecientes.
- `selectRarity` cae en los intervalos acumulados correctos (bounds) y nunca fuera de tabla (20000 tiradas).
- Distribucion de rarezas dentro de +/-3 % sobre 20000 tiradas (RNG determinista).
- `generateSequence` respeta longitud 0-7 y solo produce UP/DOWN/LEFT/RIGHT.
- `ARROWS` define exactamente las 4 direcciones sin duplicados.

## Pruebas manuales (protocolo CA-1 a CA-9)

Preparacion: `npm install`, `npm run dev` (o abrir la preview de Vercel en un dispositivo movil para las pruebas tactiles). Al probar en movil, usar el modo dispositivo del navegador o el celular; en escritorio, teclado.

| Criterio | Metodo | Pasos | Resultado esperado | Resultado observado |
|---|---|---|---|---|
| CA-1 Inicio de partida | Manual (escritorio) | Completar titulo y pantalla de controles (Enter) | El anzuelo se lanza automaticamente y el HUD muestra dinero $0 y la barra de tiempo bajando desde 180 s | [PENDIENTE: confirmar estudiante] |
| CA-2 Sorteo de rareza | Manual | Observar las picadas durante la partida | Cada pique ocurre entre 3 y 5 s tras el relanzamiento; el estado y el mensaje muestran la rareza sorteada segun la tabla | [PENDIENTE: confirmar estudiante] |
| CA-3 Picada sin reaccion | Manual | En estado de picada, no presionar nada | El juego permanece en picada esperando Z; otras teclas no cambian de estado (verificar con flechas) | [PENDIENTE: confirmar estudiante] |
| CA-4 Inicio del QTE | Manual | Presionar Z al picar | Aparece el panel centrado con N flechas (3-7 segun rareza), el sedal comienza vacio y arranca la cuenta regresiva de 6 s | [PENDIENTE: confirmar estudiante] |
| CA-5 Captura | Manual | Completar las N flechas antes de 6 s | Suma exacta de la recompensa segun la rareza (ej.: mitico +$1200), texto `+$X`, la rareza capturada se muestra y el anzuelo queda recogido junto a la cana sin relanzarse desde el agua | [PENDIENTE: confirmar estudiante] |
| CA-6 Escape por error | Manual | Ingresar una flecha incorrecta | El pez escapa, hay feedback visual (mensaje/color), no suma dinero y el ciclo se relanza | [PENDIENTE: confirmar estudiante] |
| CA-7 Escape por tiempo | Manual | Dejar pasar los 6 s sin completar | Escape sin recompensa, feedback visual y relanzamiento | [PENDIENTE: confirmar estudiante] |
| CA-8 Fin de partida con QTE activo | Manual (caso limite) | Dejar el tiempo cerca de 0 (esperar) y entrar a un QTE; dejar que el contador llegue a 0 | La partida termina al instante: sin recompensa del pez en curso, sin relanzamiento y muestra la pantalla final | [PENDIENTE: confirmar estudiante] |
| CA-9 Pantalla final | Manual | En la pantalla final, presionar Enter (o el boton tactil) | Muestra el dinero total; nueva partida limpia ($0, 180 s) sin persistencia de records | [PENDIENTE: confirmar estudiante] |

## Pruebas tactiles (extensiones aprobadas)

| Criterio | Metodo | Pasos | Resultado esperado | Resultado observado |
|---|---|---|---|---|
| Menus por toque | Manual (movil o modo dispositivo) | Abrir el juego en un dispositivo tactil | Aparecen botones dedicados ("TOCAR PARA EMPEZAR") en titulo y controles; en escritorio se mantienen los textos de Enter | [PENDIENTE: confirmar estudiante] |
| Pique con boton | Manual | Al picar, tocar el boton "TOCA PARA PESCAR" | El boton pulsa, arranca el QTE y el D-pad aparece activo | [PENDIENTE: confirmar estudiante] |
| QTE con D-pad | Manual | Completar una secuencia con los 4 botones del D-pad | Cada acierto recoge el sedal; un error o el fin del tiempo escapa al pez | [PENDIENTE: confirmar estudiante] |
| Canvas responsive | Manual (escritorio y movil) | Redimensionar la ventana o rotar el celular | El lienzo se escala (FIT) y queda centrado sin barras de scroll | [PENDIENTE: confirmar estudiante] |
| Recogido del sedal | Manual (escritorio) | Completar flechas en el QTE | El anzuelo se desplaza de x=400 hacia x=110 segun el avance y el sedal lo sigue | [PENDIENTE: confirmar estudiante] |
| Captura junto a la cana | Manual (escritorio) | Capturar un pez | El anzuelo queda junto a la cana (no vuelve al agua para relanzarse) | [PENDIENTE: confirmar estudiante] |

## Fallos y limites

- Reproduccion: `Phaser.Math.RandomPick is not a function` detectado por el estudiante en `makeMarineFish` (API inexistente en Phaser 4.x).
- Impacto: el error interrumpia la escena al generarse banco de peces de fondo.
- Decision: **corregido** por el estudiante reemplazandolo por `Phaser.Utils.Array.GetRandom` (API correcta); validado con build y prueba manual.
- Limite pendiente: la validacion tactil real requiere un dispositivo movil o el modo dispositivo del navegador; no se automatiza en `node:test`. Se recomienda probar la preview de Vercel en el celular antes de la entrega.
- Warning conocido: chunk de Phaser >500 kB (no bloquea build ni ejecucion).