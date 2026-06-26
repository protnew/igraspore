# iGraSpore — Arquitectura

## Concepto
Simulación de vida de microorganismos en un charco. 100 especies reales de bacterias, protozoos, hongos.
Mapa 2D infinito con luz solar, nutrientes, temperatura.
El jugador controla un organismo, evoluciona, se come a otros.

## Stack tecnológico
- **Un solo archivo HTML** (Canvas + JS) — funciona sin servidor, file:// OK
- **Sin dependencias** — JS puro
- **GitHub Pages** — despliegue

## Arquitectura del motor
1. **World** — mapa infinito (chunk-based), cada chunk 512×512 px
2. **Environment** — luz solar (profundidad/hora del día), temperatura, pH, nutrientes
3. **Organism** — clase base: posición, energía, tamaño, velocidad, ADN (parámetros)
4. **Species** — 100 especies predefinidas con características reales
5. **Player** — control del organismo del jugador (WASD + ratón)
6. **Ecosystem** — red trófica: productores → consumidores → descomponedores
7. **Renderer** — Canvas 2D, cámara sigue al jugador, zoom

## Niveles de organización
- **Productores** (fotosintéticos): cianobacterias, algas
- **Consumidores I**: bacterias depredadoras, pequeños flagelados
- **Consumidores II**: amebas, ciliados
- **Consumidores III**: protozoos grandes, rotíferos
- **Descomponedores**: hongos, bacterias destructoras

## Mecánicas clave
- División celular (reproducción)
- Fagocitosis (alimentación)
- Fotosíntesis (productores)
- Quimiosíntesis
- Movimiento: flagelos, cilios, seudópodos
- Quistes (latencia en condiciones desfavorables)
- Taxis: fototaxis, quimiotaxis
- Mucus y biopelículas

## Controles
- WASD — movimiento
- Ratón — dirección de ataque/movimiento
- Espacio — sprint (gasta energía)
- E — comer/fagocitosis
- Q — dividirse (cuando la energía es suficiente)
- Tab — tabla de especies
- Scroll — zoom
