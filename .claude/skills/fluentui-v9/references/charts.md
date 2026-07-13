# `@fluentui/react-charts` — référence

Librairie de graphes v9 (D3 + design system Fluent), accessible (WCAG 2.1) et thémée par le `FluentProvider`. **Un chart hors `FluentProvider` est non stylé.**

## Composants exportés

| Catégorie   | Composants                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Cartésiens  | `LineChart`, `AreaChart`, `ScatterChart`, `VerticalBarChart`, `VerticalStackedBarChart`, `GroupedVerticalBarChart`, `HorizontalBarChart`, `HorizontalBarChartWithAxis` |
| Proportions | `DonutChart`, `FunnelChart`, `GaugeChart`                                                                               |
| Spécialisés | `HeatMapChart`, `SankeyChart`, `GanttChart`, `PolarChart`, `Sparkline`, `ChartTable`                                    |
| Déclaratif  | `DeclarativeChart` (schéma Plotly), `VegaDeclarativeChart` (spec Vega-Lite)                                             |
| Utilitaires | `ResponsiveContainer`, `Legends`, `ChartPopover`, `ChartAnnotationLayer`, `DataVizPalette`                              |

## Composants typés

Forme de données commune : un `ChartProps` avec `chartTitle` + une collection de points (`chartData`, `lineChartData`, `scatterChartData`, `SankeyChartData` selon le chart).

```tsx
import { LineChart, DonutChart, DataVizPalette } from '@fluentui/react-charts'

<LineChart
  data={{
    chartTitle: 'Sessions',
    lineChartData: [
      {
        legend: 'Éditeur',
        color: DataVizPalette.color1,
        data: [
          { x: new Date('2026-01-01'), y: 10 },
          { x: new Date('2026-02-01'), y: 42 },
        ],
      },
    ],
  }}
/>

<DonutChart
  data={{
    chartTitle: 'Répartition',
    chartData: [
      { legend: 'Texte', data: 40, color: DataVizPalette.color1 },
      { legend: 'Image', data: 60, color: DataVizPalette.color2 },
    ],
  }}
  innerRadius={55}
/>
```

- **Couleurs : toujours `DataVizPalette.colorN`** (24 entrées, contrastes validés light/dark). Jamais un hex en dur, jamais un token de couleur d'UI.
- `color` est optionnel — sans lui, la palette par défaut s'applique dans l'ordre. Ne le fixer que si l'association série ↔ couleur doit être stable.
- `xAxisCalloutData` / `yAxisCalloutData` personnalisent le tooltip ; `chartTitleAccessibilityData` et `callOutAccessibilityData` l'a11y.

## Responsive

Les charts ont besoin de dimensions explicites. Ne pas calculer une largeur à la main : envelopper dans `ResponsiveContainer` (`width`, `height`, `aspect`, `minWidth`, `minHeight`, `onResize`).

```tsx
<ResponsiveContainer height={320}>
  <LineChart data={data} />
</ResponsiveContainer>
```

## `DeclarativeChart` — schéma Plotly

À utiliser quand **la donnée décide du type de graphe** (schéma reçu de l'API, config utilisateur, sortie d'un LLM) plutôt que le code. `chartSchema.plotlySchema` est un JSON Plotly standard (`{ data: [...], layout: {...} }`) ; l'adaptateur en déduit le chart Fluent à rendre.

```tsx
import { DeclarativeChart, type IDeclarativeChart, type Schema } from '@fluentui/react-charts'

const chartRef = useRef<IDeclarativeChart>(null)

<DeclarativeChart
  chartSchema={schema}
  componentRef={chartRef}
  colorwayType="default"
  onSchemaChange={(next: Schema) => persist(next)}
/>

// export PNG (data URL) — ex. « exporter le graphe » dans l'editor
const dataUrl = await chartRef.current?.exportAsImage({ scale: 2, background: 'white' })
```

Props :

| Prop             | Rôle                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `chartSchema`    | `{ plotlySchema }` — requis.                                                                            |
| `onSchemaChange` | Appelé quand l'utilisateur modifie l'état (ex. légendes sélectionnées). C'est ce schéma qu'on persiste. |
| `componentRef`   | Accès à `exportAsImage(opts)` — **utiliser ça, pas un `ref` DOM**.                                       |
| `colorwayType`   | `'default'` (palette Fluent alignée sur Plotly) \| `'builtin'` (colorway Fluent).                        |

Types de traces Plotly reconnus → chart Fluent rendu :

`scatter` (→ line / area / scatter selon `mode` et `fill`), `bar` (→ vertical, stacked ou grouped selon `barmode`), `histogram`, `pie` (→ donut), `heatmap`, `sankey`, `indicator` (→ gauge), `funnel`, `scatterpolar`, `table`, gantt, annotations.

Une trace non supportée n'est pas une exception : le composant rend un **fallback** et remonte `Unsupported chart - type : …`. Toujours prévoir le cas où le schéma est invalide ou non supporté (message d'erreur dans l'UI), le schéma étant par nature une donnée d'entrée non contrôlée.

`VegaDeclarativeChart` est l'équivalent pour une spec Vega-Lite (`chartSchema={{ vegaLiteSpec }}`) — même logique, marks `bar`, `line`, `point`, `area`, `arc`, `rect`.

## Pièges

- Chart rendu vide → dimensions à zéro : il manque le `ResponsiveContainer` ou une hauteur.
- Couleurs illisibles en dark → un hex en dur au lieu de `DataVizPalette`.
- Chart non stylé → rendu hors `FluentProvider`.
- Re-render en boucle → objet `data`/`chartSchema` recréé à chaque render : le mémoïser.
