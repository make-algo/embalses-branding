import React, { useMemo, useState } from "react";

const THEMES = [
  {
    id: "ciudadano",
    name: "Ciudadano",
    description: "Amigable, educativo, luminoso",
    variants: [
      {
        id: "agua-cerca",
        name: "Agua Cerca",
        headline: "Cálido, de barrio, cercano",
        text: "Información accesible sobre el estado de tus embalses locales, diseñada para conectar con tu entorno."
      },
      {
        id: "embalses-claro",
        name: "Embalses en Claro",
        headline: "Educativo, didáctico, limpio",
        text: "Datos simplificados y visualizaciones claras para entender la situación hídrica de un vistazo."
      },
      {
        id: "mapa-agua",
        name: "El Mapa del Agua",
        headline: "Exploración, viaje, guía",
        text: "Navega por la geografía de nuestros recursos hídricos y descubre el estado de cada cuenca."
      },
    ],
  },
  {
    id: "tecnico",
    name: "Técnico",
    description: "Dashboard oscuro, datos, high-tech",
    variants: [
      {
        id: "hidrodata",
        name: "Hidrodata",
        headline: "Rigor, datos, precisión",
        text: "Análisis detallado con métricas precisas y series temporales para profesionales del sector."
      },
      {
        id: "nivel-hidrico",
        name: "Nivel Hídrico",
        headline: "Sobrio, sin ruido",
        text: "Monitorización esencial de niveles y capacidades sin distracciones visuales."
      },
      {
        id: "bluepulse",
        name: "BluePulse",
        headline: "Tecnológico, dinámico, señal",
        text: "Visualización avanzada en tiempo real con indicadores dinámicos y alertas de estado."
      },
    ],
  },
  {
    id: "institucional",
    name: "Institucional",
    description: "Oficial, sobrio, sólido",
    variants: [
      {
        id: "observatorio",
        name: "Observatorio",
        headline: "Autoridad moderna",
        text: "Plataforma oficial de seguimiento hidrológico nacional y gestión de recursos."
      },
      {
        id: "estado",
        name: "Estado",
        headline: "Directo, informativo, neutral",
        text: "Informe ejecutivo actualizado sobre las reservas hídricas y su evolución histórica."
      },
      {
        id: "agua-publica",
        name: "Agua Pública",
        headline: "Transparencia y civismo",
        text: "Portal de transparencia para la gestión sostenible de los recursos comunes."
      },
    ],
  },
];

const kpisMock = [
  { label: "Llenado nacional", value: "63%", sub: "+2% vs semana pasada" },
  { label: "Embalses críticos", value: "18", sub: "<25% capacidad" },
  { label: "Cuenca más llena", value: "Cantábrico", sub: "82% media" },
  { label: "Cuenca más baja", value: "Segura", sub: "29% media" },
];

const reservoirsMock = [
  { name: "Yesa", basin: "Ebro", current: 330, total: 447, electric: true },
  { name: "La Serena", basin: "Guadiana", current: 950, total: 3220, electric: false },
  { name: "Albarellos", basin: "Miño-Sil", current: 32, total: 91, electric: true },
];

function pct(current, total) {
  const p = (current / total) * 100;
  return Math.max(0, Math.min(100, p));
}

import ChartsView from "./components/ChartsView";

export default function App() {
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [variantId, setVariantId] = useState(THEMES[0].variants[0].id);
  const [selected, setSelected] = useState(reservoirsMock[0]);
  const [showCharts, setShowCharts] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const currentVariant = currentTheme.variants.find((v) => v.id === variantId) || currentTheme.variants[0];

  const handleSetTheme = (newThemeId) => {
    const newTheme = THEMES.find((t) => t.id === newThemeId);
    setThemeId(newThemeId);
    setVariantId(newTheme.variants[0].id);
  };

  const selectedPct = useMemo(
    () => pct(selected.current, selected.total).toFixed(1),
    [selected]
  );

  return (
    <div className={`app theme-${themeId} variant-${variantId}`}>
      <Header
        themeId={themeId}
        setThemeId={handleSetTheme}
        variantId={variantId}
        setVariantId={setVariantId}
        currentTheme={currentTheme}
        showCharts={showCharts}
        setShowCharts={setShowCharts}
      />

      <main className="container">
        <Hero theme={currentTheme} variant={currentVariant} />

        {showCharts ? (
          <ChartsView />
        ) : (
          <>
            <section className="kpi-grid">
              {kpisMock.map((k) => (
                <KpiCard key={k.label} {...k} />
              ))}
            </section>

            <section className="layout-2col">
              <Card className="map-card">
                <CardHeader
                  title="Mapa de embalses"
                  subtitle="Estado actual, filtrable por cuenca"
                />
                <MapPlaceholder />
              </Card>

              <Card className="list-card">
                <CardHeader
                  title="Embalses destacados"
                  subtitle="Selecciona uno para ver detalle"
                />
                <div className="list">
                  {reservoirsMock.map((r) => {
                    const p = pct(r.current, r.total);
                    const isActive = r.name === selected.name;
                    return (
                      <button
                        key={r.name}
                        className={`list-item ${isActive ? "active" : ""}`}
                        onClick={() => setSelected(r)}
                      >
                        <div className="list-item-main">
                          <div className="list-title">{r.name}</div>
                          <div className="list-subtitle">{r.basin}</div>
                        </div>
                        <div className="list-item-right">
                          <div className="pill">{p.toFixed(0)}%</div>
                          {r.electric && <div className="tag">Hidroeléctrico</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </section>

            <section className="layout-2col">
              <Card>
                <CardHeader
                  title={`Detalle: ${selected.name}`}
                  subtitle={`${selected.basin} · Capacidad ${selected.total} hm³`}
                />

                <div className="detail">
                  <div className="detail-metric">
                    <div className="detail-label">Agua actual</div>
                    <div className="detail-value">{selected.current} hm³</div>
                  </div>
                  <div className="detail-metric">
                    <div className="detail-label">Porcentaje llenado</div>
                    <div className="detail-value">{selectedPct}%</div>
                  </div>
                  <div className="detail-metric">
                    <div className="detail-label">Uso eléctrico</div>
                    <div className="detail-value">{selected.electric ? "Sí" : "No"}</div>
                  </div>

                  <ProgressBar value={Number(selectedPct)} />
                </div>

                <div className="actions">
                  <button className="btn primary">Comparar años</button>
                  <button className="btn ghost">Descargar CSV</button>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Evolución temporal"
                  subtitle="Histórico desde 1988"
                />
                <ChartPlaceholder />
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader
                  title="Tabla semanal"
                  subtitle="Últimas mediciones"
                />
                <SimpleTable />
              </Card>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Header({ themeId, setThemeId, variantId, setVariantId, currentTheme, showCharts, setShowCharts }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-mark" />
        <div>
          <div className="brand">Agua en Embalses</div>
          <div className="brand-sub">España · 1988–2025</div>
        </div>
      </div>

      <div className="header-center">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${!showCharts ? "active" : ""}`}
            onClick={() => setShowCharts(false)}
          >
            Dashboard
          </button>
          <button
            className={`toggle-btn ${showCharts ? "active" : ""}`}
            onClick={() => setShowCharts(true)}
          >
            Gráficos
          </button>
        </div>
      </div>

      <div className="header-right">
        <ThemeSelector
          themeId={themeId}
          setThemeId={setThemeId}
          variantId={variantId}
          setVariantId={setVariantId}
          currentTheme={currentTheme}
        />
      </div>
    </header>
  );
}

function ThemeSelector({ themeId, setThemeId, variantId, setVariantId, currentTheme }) {
  return (
    <div className="theme-selector-container">
      <div className="theme-selector">
        <label className="theme-label">Estilo</label>
        <div className="theme-tabs" role="tablist" aria-label="Selector de estilo">
          {THEMES.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={themeId === t.id}
              className={`theme-tab ${themeId === t.id ? "active" : ""}`}
              onClick={() => setThemeId(t.id)}
              title={t.description}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="variant-selector">
        <label className="theme-label">Variante</label>
        <div className="variant-tabs" role="tablist" aria-label="Selector de variante">
          {currentTheme.variants.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={variantId === v.id}
              className={`variant-tab ${variantId === v.id ? "active" : ""}`}
              onClick={() => setVariantId(v.id)}
              title={v.description}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero({ theme, variant }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{variant.name}</h1>
        <h2 className="hero-subtitle">{variant.headline}</h2>
        <h3 className="hero-desc">{variant.text}</h3>
      </div>
    </section>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardHeader({ title, subtitle }) {
  return (
    <div className="card-header">
      <div>
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <Card className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </Card>
  );
}

function MapPlaceholder() {
  return (
    <div className="map">
      <div className="map-bg" />
      <div className="map-overlay">
        <div className="map-chip">Ebro 61%</div>
        <div className="map-chip">Guadiana 42%</div>
        <div className="map-chip">Miño-Sil 75%</div>
      </div>
      <div className="map-footer">Mapa interactivo (placeholder)</div>
    </div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="chart">
      <div className="chart-grid" />
      <div className="chart-line" />
      <div className="chart-caption">Gráfico histórico (placeholder)</div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <div className="progress-legend">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function SimpleTable() {
  const rows = [
    { date: "2025-11-15", current: "330", total: "447", pct: "74%" },
    { date: "2025-11-08", current: "325", total: "447", pct: "73%" },
    { date: "2025-11-01", current: "318", total: "447", pct: "71%" },
  ];

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Agua actual (hm³)</th>
            <th>Capacidad (hm³)</th>
            <th>% llenado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.date}>
              <td>{r.date}</td>
              <td>{r.current}</td>
              <td>{r.total}</td>
              <td>
                <span className="pill small">{r.pct}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>Datos históricos de embalses · Fuente oficial</div>
      <div className="footer-links">
        <a href="#" onClick={(e) => e.preventDefault()}>Metodología</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Contacto</a>
      </div>
    </footer>
  );
}
