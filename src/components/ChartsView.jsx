import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis,
    Sankey,
} from "recharts";
import {
    basinData,
    historicalData,
    reservoirBubbleData,
    sankeyData,
    pieData,
} from "../data/mockData";

// Hook to get theme colors from CSS variables
const useThemeColors = () => {
    const [colors, setColors] = useState(() => {
        const appElement = document.querySelector('.app');
        const style = getComputedStyle(appElement || document.documentElement);
        return {
            primary: style.getPropertyValue('--chart-primary').trim() || '#3b82f6',
            secondary: style.getPropertyValue('--chart-secondary').trim() || '#10b981',
            tertiary: style.getPropertyValue('--chart-tertiary').trim() || '#f59e0b',
            quaternary: style.getPropertyValue('--chart-quaternary').trim() || '#ef4444',
            quinary: style.getPropertyValue('--chart-quinary').trim() || '#8b5cf6',
            grid: style.getPropertyValue('--chart-grid').trim() || 'rgba(255,255,255,0.05)',
            axis: style.getPropertyValue('--chart-axis').trim() || '#64748b',
        };
    });

    useEffect(() => {
        const updateColors = () => {
            const appElement = document.querySelector('.app');
            const style = getComputedStyle(appElement || document.documentElement);
            setColors({
                primary: style.getPropertyValue('--chart-primary').trim() || '#3b82f6',
                secondary: style.getPropertyValue('--chart-secondary').trim() || '#10b981',
                tertiary: style.getPropertyValue('--chart-tertiary').trim() || '#f59e0b',
                quaternary: style.getPropertyValue('--chart-quaternary').trim() || '#ef4444',
                quinary: style.getPropertyValue('--chart-quinary').trim() || '#8b5cf6',
                grid: style.getPropertyValue('--chart-grid').trim() || 'rgba(255,255,255,0.05)',
                axis: style.getPropertyValue('--chart-axis').trim() || '#64748b',
            });
        };

        // Watch for class changes on the app element (which trigger theme changes)
        const observer = new MutationObserver(updateColors);
        const appElement = document.querySelector('.app');

        if (appElement) {
            observer.observe(appElement, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        return () => observer.disconnect();
    }, []);

    return colors;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="tooltip-value" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                        {entry.unit || ""}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ChartsView() {
    const colors = useThemeColors();
    const COLORS = [colors.primary, colors.secondary, colors.tertiary, colors.quaternary, colors.quinary];

    return (
        <div className="charts-view">
            <div className="section-header">
                <h2 className="section-title">Análisis Hídrico Avanzado</h2>
                <p className="section-subtitle">Visualización de datos en tiempo real del sistema hidrológico nacional</p>
            </div>

            <div className="charts-grid">
                {/* 1. Area Chart: Historical Trend (Span 8) */}
                <div className="chart-card span-8">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Evolución Histórica</h3>
                            <p className="chart-subtitle">Tendencia anual vs media histórica</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.axis} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={colors.axis} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                <XAxis dataKey="week" stroke={colors.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke={colors.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="2024" stroke={colors.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" name="Año Actual" unit="%" />
                                <Area type="monotone" dataKey="average" stroke={colors.axis} strokeWidth={2} strokeDasharray="4 4" fill="url(#colorAvg)" name="Media Histórica" unit="%" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Pie Chart: Usage (Span 4) */}
                <div className="chart-card span-4">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Distribución de Usos</h3>
                            <p className="chart-subtitle">Por sector de actividad</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="24" fontWeight="bold">
                                    {pieData[0].value}%
                                </text>
                                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="14">
                                    {pieData[0].name}
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Bar Chart: Basins (Span 12) */}
                <div className="chart-card span-12">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Estado por Cuencas Hidrográficas</h3>
                            <p className="chart-subtitle">Capacidad total vs Agua embalsada actual (hm³)</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={basinData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                <XAxis dataKey="name" stroke={colors.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke={colors.axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: colors.grid }} />
                                <Bar dataKey="current" name="Agua Actual" stackId="a" fill={colors.primary} radius={[0, 0, 4, 4]} />
                                <Bar dataKey="capacity" name="Capacidad Restante" stackId="a" fill={colors.secondary} opacity={0.3} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Bubble Chart (Span 6) */}
                <div className="chart-card span-6">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Análisis de Embalses</h3>
                            <p className="chart-subtitle">Relación Capacidad / Llenado</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke={colors.grid} />
                                <XAxis type="number" dataKey="capacity" name="Capacidad" stroke={colors.axis} tickLine={false} axisLine={false} unit=" hm³" />
                                <YAxis type="number" dataKey="fillPct" name="% Llenado" stroke={colors.axis} tickLine={false} axisLine={false} unit="%" />
                                <ZAxis type="number" dataKey="current" range={[100, 1000]} name="Volumen" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                <Scatter name="Embalses" data={reservoirBubbleData} fill={colors.primary}>
                                    {reservoirBubbleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fillPct < 30 ? colors.quaternary : entry.fillPct > 70 ? colors.tertiary : colors.secondary} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Map (Span 6) */}
                <div className="chart-card span-6">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Mapa de Calor</h3>
                            <p className="chart-subtitle">Estado geográfico de las reservas</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <SpainMapMock colors={colors} />
                    </div>
                </div>

                {/* 6. Sankey (Span 12) */}
                <div className="chart-card span-12">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Ciclo del Agua</h3>
                            <p className="chart-subtitle">Flujo estimado desde precipitación hasta usos finales</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={400}>
                            <Sankey
                                data={sankeyData}
                                node={{ stroke: 'none', fill: colors.quinary, width: 10 }}
                                link={{ stroke: colors.primary, strokeOpacity: 0.2 }}
                                nodePadding={50}
                                margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                            >
                                <Tooltip />
                            </Sankey>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpainMapMock({ colors }) {
    return (
        <div className="spain-map-mock">
            <svg viewBox="0 0 300 250" className="spain-svg">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <path d="M50,20 L120,20 L140,50 L100,80 L40,60 Z" fill={colors.primary} opacity="0.8" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Galicia / Cantábrico</title>
                </path>
                <path d="M120,20 L200,20 L220,60 L180,90 L140,50 Z" fill={colors.primary} opacity="0.6" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Ebro / Pirineos</title>
                </path>
                <path d="M40,60 L100,80 L110,130 L30,110 Z" fill={colors.tertiary} opacity="0.7" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Duero</title>
                </path>
                <path d="M100,80 L180,90 L190,140 L110,130 Z" fill={colors.secondary} opacity="0.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Tajo</title>
                </path>
                <path d="M180,90 L220,60 L250,120 L200,160 L190,140 Z" fill={colors.quaternary} opacity="0.8" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Levante / Júcar</title>
                </path>
                <path d="M30,110 L110,130 L120,180 L50,170 Z" fill={colors.secondary} opacity="0.6" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Guadiana</title>
                </path>
                <path d="M50,170 L120,180 L140,220 L70,210 Z" fill={colors.tertiary} opacity="0.7" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Guadalquivir</title>
                </path>
                <path d="M120,180 L200,160 L180,210 L140,220 Z" fill={colors.quaternary} opacity="0.9" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <title>Sur / Segura</title>
                </path>
            </svg>
            <div className="map-legend">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="dot high"></span> <span>Alto</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="dot med"></span> <span>Medio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="dot low"></span> <span>Bajo</span>
                </div>
            </div>
        </div>
    );
}
