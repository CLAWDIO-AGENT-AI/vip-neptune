import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Jan", lucro: 1200, prejuizo: 300 },
  { name: "Fev", lucro: 2800, prejuizo: 500 },
  { name: "Mar", lucro: 1800, prejuizo: 200 },
  { name: "Abr", lucro: 4200, prejuizo: 800 },
  { name: "Mai", lucro: 3600, prejuizo: 400 },
  { name: "Jun", lucro: 5100, prejuizo: 600 },
  { name: "Jul", lucro: 4800, prejuizo: 350 },
  { name: "Ago", lucro: 6200, prejuizo: 700 },
];

const summaryCards = [
  {
    label: "Lucro Total",
    value: "R$ 29.800",
    icon: TrendingUp,
    gradient: "text-gradient-profit",
    iconColor: "text-cyan",
  },
  {
    label: "Prejuízo Total",
    value: "R$ 3.850",
    icon: TrendingDown,
    gradient: "text-gradient-loss",
    iconColor: "text-destructive",
  },
  {
    label: "Resultado Líquido",
    value: "R$ 25.950",
    icon: DollarSign,
    gradient: "text-gradient-gold",
    iconColor: "text-primary",
  },
  {
    label: "Total de Operações",
    value: "142",
    icon: BarChart3,
    gradient: "text-gradient-gold",
    iconColor: "text-primary",
  },
];

const filters = ["Hoje", "Semana", "Mês", "Tudo", "CPA"];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Tudo");

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-xl font-display font-bold text-gradient-gold">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumo da sua operação VIP</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="glass rounded-xl p-4 md:p-5 hover:glow-gold transition-all duration-300 animate-float group"
            style={{ animationDelay: `${summaryCards.indexOf(card) * 0.3}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={16} className={card.iconColor} />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <p className={`text-2xl md:text-4xl font-bold tracking-tighter ${card.gradient}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeFilter === f
                ? "bg-primary/20 text-primary border border-primary/30 glow-gold"
                : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="glass rounded-xl p-4 md:p-6">
        <h2 className="text-sm font-display font-semibold text-foreground mb-4">Gráfico de Performance</h2>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187 100% 50%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(225 67% 2%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(220, 20%, 14%, 0.5)" />
              <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsla(220, 50%, 6%, 0.9)",
                  border: "1px solid hsla(0, 0%, 100%, 0.08)",
                  borderRadius: "8px",
                  backdropFilter: "blur(16px)",
                  color: "hsl(210 40% 92%)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="lucro"
                stroke="hsl(187 100% 50%)"
                strokeWidth={2}
                fill="url(#cyanGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
