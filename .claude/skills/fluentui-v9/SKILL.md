---
name: fluentui-v9
description: Design system Fluent UI v9 (@fluentui/react-components, @fluentui/react-charts, @fluentui/react-icons) — le design system de apps/editor (Electron). À utiliser pour créer ou modifier l'UI de l'editor — composants, theming FluentProvider, styles Griffel (makeStyles + tokens), icônes, et graphiques (DeclarativeChart, LineChart, DonutChart…).
---

# Fluent UI v9 — design system de `apps/editor`

`apps/editor` (Electron + React 19) utilise **Fluent UI v9**. C'est le seul design system de cette app.

> ⚠️ Les autres apps (`web`, `admin`) utilisent **shadcn/Tailwind** via `@app/ui`. Les deux ne se mélangent pas : **ne jamais importer `@app/ui`, Tailwind ou `lucide-react` dans `apps/editor`**, et ne jamais importer Fluent hors de l'editor.

## Dépendances

| Package                     | Version   | Rôle                                       |
| --------------------------- | --------- | ------------------------------------------ |
| `@fluentui/react-components` | `^9.74.3` | Composants + theming + Griffel (makeStyles) |
| `@fluentui/react-icons`      | `^2.0.333`| Icônes (remplace `lucide-react`)            |
| `@fluentui/react-charts`     | `^9.3.21` | Graphiques v9 (dont `DeclarativeChart`)     |

React 19 est supporté (peer `react >=16.14 <20`). Tant que seul l'editor consomme Fluent, les versions restent **en dur** dans `apps/editor/package.json` — voir `dependency-management` : le catalog est réservé aux dépendances partagées par ≥ 2 packages. Dès qu'un 2ᵉ package utilise Fluent, on bascule sur `catalog:`.

## Setup du renderer

`FluentProvider` est **obligatoire** et doit envelopper toute l'app : il injecte les CSS variables des tokens. Sans lui, composants et charts sont non stylés.

```tsx
// src/renderer/src/main.tsx
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components'

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? webDarkTheme : webLightTheme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={theme} style={{ height: '100vh' }}>
      <App />
    </FluentProvider>
  </StrictMode>
)
```

- Thèmes : `webLightTheme` / `webDarkTheme` (`teams*Theme` existent aussi, on ne les utilise pas).
- Thème custom : `createLightTheme(brandRamp)` / `createDarkTheme(brandRamp)` — jamais un objet thème écrit à la main.
- Un `FluentProvider` imbriqué permet d'isoler une zone (ex. preview clair dans une app sombre).

## Styles — Griffel, pas de CSS

Tout le style passe par `makeStyles` (Griffel, compilé à la build). **Aucun CSS global, aucun `style={{}}` inline, aucune classe utilitaire.**

```tsx
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    borderRadius: tokens.borderRadiusMedium,
  },
  selected: { backgroundColor: tokens.colorNeutralBackground1Selected },
})

export function Panel({ selected }: { selected: boolean }) {
  const styles = useStyles()
  return <div className={mergeClasses(styles.root, selected && styles.selected)} />
}
```

Règles :

- **Toute valeur visuelle vient de `tokens`** — couleur, espacement, rayon, typo, ombre. Jamais `#fff`, `16px`, `1rem` en dur : c'est ce qui casse le mode sombre.
- `mergeClasses` pour combiner des classes — jamais `clsx`, jamais une concaténation de strings (l'ordre des règles Griffel serait faux).
- Composer les classes conditionnellement, pas les styles : une classe par état.
- Pour les propriétés composites (`border`, `padding` multi-valeurs), Griffel raisonne en longhand : écrire les longhands (`borderTopWidth`…) ou passer par les helpers `shorthands.*` exportés par `@fluentui/react-components`.
- `makeResetStyles` pour le style de base d'un composant réutilisé souvent (une seule classe atomique, plus performante) ; `makeStyles` pour les variantes par-dessus.

## Composants

Tout s'importe depuis `@fluentui/react-components` (barrel unique) :

```tsx
import { Button, Field, Input, Dropdown, Option, Dialog, Toolbar, DataGrid } from '@fluentui/react-components'
import { SaveRegular, DeleteRegular } from '@fluentui/react-icons'

<Button appearance="primary" icon={<SaveRegular />} onClick={onSave}>Enregistrer</Button>

<Field label="Nom du projet" validationState={error ? 'error' : 'none'} validationMessage={error}>
  <Input value={name} onChange={(_, data) => setName(data.value)} />
</Field>
```

- **Les handlers Fluent ont la signature `(event, data)`** — la valeur est dans `data`, pas dans `event.target.value`. C'est l'erreur la plus fréquente en venant de shadcn.
- Un champ de formulaire est toujours enveloppé dans `Field` (label + message de validation + a11y).
- Icônes : suffixe `Regular` (contour) ou `Filled` (plein) — `Filled` pour l'état actif/sélectionné.
- Ne pas réécrire un composant qui existe : `Toolbar`, `TabList`, `Menu`, `Tree`, `DataGrid`, `Toast` couvrent la quasi-totalité des besoins d'un editor.

## Graphiques

`@fluentui/react-charts`. Deux approches :

1. **Composant typé** (`LineChart`, `DonutChart`, `VerticalBarChart`…) quand la forme du graphe est connue à l'écriture du code.
2. **`DeclarativeChart`** quand le graphe est décrit par de la **donnée** (schéma Plotly JSON) — la donnée décide du type de graphe.

```tsx
import { DeclarativeChart, ResponsiveContainer } from '@fluentui/react-charts'

<ResponsiveContainer height={320}>
  <DeclarativeChart
    chartSchema={{ plotlySchema: { data: [{ type: 'bar', x: ['A', 'B'], y: [12, 30] }], layout: { title: 'Ventes' } } }}
  />
</ResponsiveContainer>
```

Détails (liste des composants, types Plotly supportés, export image, légendes) : **`references/charts.md`**.

## Où placer les fichiers

```
apps/editor/src/renderer/src/
├── features/[feature]/components/*.tsx   # UI de la feature
├── shared/components/*.tsx               # UI réutilisée entre features
└── shared/theme/                         # thème custom, tokens dérivés
```

Un composant qui ne fait qu'habiller un composant Fluent sans logique n'a pas lieu d'être : utiliser Fluent directement.

## Règles d'or

- ✅ `FluentProvider` à la racine, un seul thème source de vérité.
- ✅ `makeStyles` + `tokens` pour 100 % du style.
- ✅ `mergeClasses` pour combiner des classes.
- ✅ Handlers en `(event, data)`.
- ❌ Pas de Tailwind, `@app/ui`, `lucide-react`, `clsx` dans l'editor.
- ❌ Pas de valeur visuelle en dur (couleur, espacement, taille de police).
- ❌ Pas de `style={{}}` inline ni de CSS global (hors reset de `main.css`).
- ❌ Pas d'import profond (`@fluentui/react-components/unstable/...`) sans raison documentée.
