# 💌 Calabacita — Carta interactiva de cumpleaños

Una carta de amor interactiva hecha con **React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion**.
Se abre como un sobre, se lee página a página con animaciones de giro de hoja,
y termina con un «Feliz cumpleaños» y una galería de recuerdos.

---

## ✍️ Editar la carta

**Todo el contenido está en un único archivo:**

```
src/content/letter.ts
```

Ahí puedes cambiar, sin tocar nada más:

| Campo | Qué es |
|---|---|
| `recipient` | A quién va dirigida |
| `sender` | Cómo te firmas |
| `opening` | El saludo («Querida mi amor,») |
| `date` | La fecha |
| `chapters` | **Los 8 capítulos de la historia** |
| `closing` / `signature` | La despedida |
| `finale` | El cierre final |
| `gallery` | Las fotos del visor final |
| `musicSrc` | Una canción de fondo (opcional) |

### Añadir un párrafo dentro de un capítulo

```ts
paragraphs: [
  'Primer párrafo…',
  'Segundo párrafo…',
  'Tercer párrafo…', // ← nuevo
]
```

### Añadir un capítulo nuevo

Duplica un objeto dentro de `chapters` y ya está. La navegación, los puntos de
progreso y la paginación se ajustan solos.

### Cambiar el color de ambiente de un capítulo

```ts
mood: 'rose' // rose · blush · plum · wine · amber · night
```

---

## 📸 Fotos

Las imágenes están en `src/assets/fotos/` y se importan arriba del archivo de contenido:

```ts
import foto6 from '../assets/fotos/6.jpeg'
```

```ts
photo: {
  src: foto6,
  caption: 'El pie de foto',
  aspect: 'portrait', // portrait · landscape · square
  rotate: 0,          // 0 · 90 · 180 · 270 (si la foto salió girada)
  tilt: -3,           // inclinación del polaroid, en grados
}
```

`rotate` es **la rotación del contenido**, no del marco: si marcas `90` o `270`,
el marco se pone apaisado automáticamente y la foto se coloca recta sola.

---

## 🎵 Música (opcional)

1. Mete un `.mp3` en `public/audio/`
2. Actívalo en `letter.ts`:

```ts
musicSrc: '/audio/nuestra-cancion.mp3',
```

Aparece un botón de reproducción en la esquina inferior derecha.

---

## 🎮 Cómo se recorre la carta

- **Continuar / Final** — el botón principal
- **← →** — flechas del teclado (o `AvPág` / `RePág`)
- **Rueda del ratón** y **deslizar** con el dedo
- **Los puntos** de la barra inferior y del riel lateral saltan a cualquier paso

---

## 🚀 Poner en marcha

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # previsualiza dist/
npm run lint     # oxlint
```

---

## ☁️ Desplegar en Netlify

El repositorio ya trae `netlify.toml`, así que:

1. Sube el proyecto a GitHub.
2. En Netlify: **Add new site → Import an existing project**.
3. Netlify detecta Vite automáticamente (o usa estos valores):

   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `24`

También funciona en Vercel, GitHub Pages, Cloudflare Pages o cualquier hosting
estático: `vite.config.ts` usa `base: './'`, así que la build funciona incluso
dentro de un sub-path.

---

## 🎨 Personalizar el diseño

| Dónde | Qué |
|---|---|
| `src/index.css` | Colores, tipografías, texturas de papel, animaciones |
| `src/lib/theme.ts` | Paletas de ambiente (`MOODS`) |
| `src/lib/types.ts` | Los tipos del contenido |

Tipografías: `Cormorant Garamond` (títulos), `Lora` (cuerpo de la carta),
`Caveat` (manuscrito) e `Inter` (interfaz).

---

## ♿ Accesibilidad

- Respeta `prefers-reduced-motion` (desactiva partículas y acorta animaciones).
- Navegación por teclado completa.
- El texto de la carta es texto real, no imágenes.
- El canvas de partículas se pausa si la pestaña está en segundo plano.

---

## 📁 Estructura

```
src/
├── content/letter.ts     ← TODO EL CONTENIDO (edita aquí)
├── components/
│   ├── EnvelopeIntro.tsx  sobre con sello de lacre
│   ├── Letter.tsx         orquestador de la carta y la navegación
│   ├── StepBody.tsx       → dentro de Letter.tsx
│   ├── Finale.tsx         feliz cumpleaños + galería
│   ├── PhotoViewer.tsx    visor de imágenes
│   ├── PhotoFrame.tsx     marco con soporte de rotación
│   ├── Polaroid.tsx       polaroid con inclinación 3D
│   ├── RevealParagraph.tsx  revelado palabra a palabra
│   ├── Fit.tsx            escala el texto para que nunca se corte
│   ├── Ambient.tsx        fondo con luces y grano
│   ├── Petals.tsx         lluvia de pétalos (canvas)
│   └── MusicToggle.tsx    reproductor opcional
├── hooks/
├── lib/                 tipos, paletas, utilidades
└── index.css            tokens y animaciones
```