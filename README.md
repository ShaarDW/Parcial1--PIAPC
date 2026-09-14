# Silly Fishing

Proyecto individual PIAPC: juego arcade de pesca en Phaser 4.

## Datos del proyecto

- Estudiante: Juan Thiago Alfaro
- Materia, comision y anio: Programacion de Inteligencia Artificial y Patrones de Comportamiento, 2026 (comision: [PENDIENTE])
- Nombre del proyecto: Silly Fishing
- Motor y version: Phaser 4.2.1
- Estado: Completo. Gameplay implementado, verificado con pruebas automatizadas (10/10) y build de produccion OK.

## Descripcion

Juego arcade de pesca en el que el jugador captura peces durante una partida de 3 minutos para conseguir la mayor cantidad posible de dinero. El anzuelo se lanza automaticamente; cuando un pez pica (entre 3 y 5 segundos), el jugador presiona Z y debe completar una secuencia de flechas dentro de los 6 segundos. Cada rareza (comun, raro, epico, legendario, mitico) tiene su probabilidad, su recompensa y la cantidad de flechas de su secuencia.

## Requisitos y ejecucion

- Entorno verificado: Node.js v24.15.0 y npm 11.12.1.
- Motor: Phaser 4.2.1.
- Herramienta de servidor/build: Vite 8.3.0 (configuracion cero, no requiere configuracion propia).
- Lenguaje: JavaScript.

Pasos:

```
npm install
npm run dev                 # Servidor local de desarrollo (http://localhost:5173)
npm run build               # Compilacion de produccion en dist/
npm run preview             # Previsualizacion del build de produccion
node --test tests/*.test.mjs  # Pruebas automatizadas de las reglas (node:test)
```

## Controles

- **Z**: reaccionar al pique (abrir el QTE).
- **Flechas direccionales**: completar la secuencia del QTE (arriba, abajo, izquierda, derecha).
- **Enter**: avanzar en el titulo, la pantalla de controles y reiniciar en la pantalla final.
- **Pantallas tactiles** (movil): boton dedicado para avanzar en los menus, boton "TOCA PARA PESCAR" (equivale a Z) y D-pad de 4 flechas (equivale a las flechas).
- El canvas se adapta y se centra a cualquier tamano de pantalla sin scroll (`scale` FIT).

## Creditos

- Desarrollado por Juan Thiago Alfaro (PIAPC 2026).
- Sin assets externos: las texturas y las imagenes se generan proceduralmente con Phaser (Graphics) y los sonidos se sintetizan en tiempo de ejecucion con WebAudio.

## Entrega o demostracion

Entrega del primer parcial de PIAPC 2026.

- Repositorio: https://github.com/ShaarDW/Parcial1--PIAPC.git (commit final pendiente de push por el estudiante).
- Despliegue: Vercel (preview del proyecto).
- Detalle del proceso e intervenciones: `docs/`.
- Pruebas y protocolo manual: `docs/evidencia-pruebas.md`.