import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { Plus, Users, Wallet, Target, Trophy, TrendingUp, TrendingDown, Clock, Star, AlertTriangle, DollarSign, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SparkLine({ data, color }: { data: { v: number }[]; color: string }) {
  if (data.length < 2) return null;
  return (
    <div className="h-12 w-full mt-1 opacity-60 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
          <Tooltip
            cursor={{ stroke: 'hsla(0,0%,100%,0.1)', strokeWidth: 1, fill: 'transparent' }}
            contentStyle={{ backgroundColor: 'hsl(220 50% 8%)', border: '1px solid hsla(43,96%,56%,0.2)', borderRadius: '8px', fontSize: '10px', color: '#fff', padding: '4px 8px' }}
            formatter={(value: number) => [`R$ ${Math.abs(value).toLocaleString("pt-BR")}`, "Acumulado"]}
            labelFormatter={(label) => label}
            isAnimationActive={false}
          />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={{ r: 0 }} activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 1 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong p-3 rounded-lg border border-border shadow-xl text-xs z-50">
        <p className="font-bold text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-semibold" style={{ color: entry.color }}>
              {entry.name}: R$ {Math.abs(entry.value).toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { clients, operations, currentUser, isAdmin, links, deleteLink, updateLink } = useApp();
  const [editLink, setEditLink] = useState<{ id: string, title: string, url: string, icon: string, description: string } | null>(null);

  const finOps = useMemo(() => operations.filter(o => o.finalizado), [operations]);

  const { totalProfit, totalLoss, totalCpa, sparkData } = useMemo(() => {
    let profit = 0; let loss = 0; let cpa = 0;
    const lPts: { v: number; name?: string }[] = []; const pPts: { v: number; name?: string }[] = [];
    const rPts: { v: number; name?: string }[] = []; const oPts: { v: number; name?: string }[] = [];

    [...finOps].reverse().forEach((op, i) => {
      if (op.result >= 0) { profit += op.result; } else { loss += Math.abs(op.result); }
      if (op.isCPA && op.status === "PAGO") cpa += op.valorCPA;

      lPts.push({ v: profit, name: op.date }); pPts.push({ v: loss, name: op.date });
      rPts.push({ v: profit - loss, name: op.date }); oPts.push({ v: i + 1, name: op.date });
    });

    return { totalProfit: profit, totalLoss: loss, totalCpa: cpa, sparkData: { lPts, pPts, rPts, oPts } };
  }, [finOps]);

  const totalBalance = totalProfit - totalLoss;

  const chartData = useMemo(() => {
    const dataByDate: Record<string, { name: string; lucro: number; prejuizo: number }> = {};
    finOps.forEach(op => {
      const d = op.date.substring(0, 5); // DD/MM
      if (!dataByDate[d]) dataByDate[d] = { name: d, lucro: 0, prejuizo: 0 };
      if (op.result >= 0) dataByDate[d].lucro += op.result;
      else dataByDate[d].prejuizo += Math.abs(op.result);
    });
    return Object.values(dataByDate).reverse().slice(-7); // Last 7 days
  }, [finOps]);

  const rankingData = useMemo(() => {
    const map = new Map<string, { profit: number; ops: number }>();
    finOps.forEach(op => {
      const e = map.get(op.platform) || { profit: 0, ops: 0 };
      e.profit += op.result; e.ops++;
      map.set(op.platform, e);
    });
    return Array.from(map.entries()).map(([platform, d]) => ({ platform, ...d })).sort((a, b) => b.profit - a.profit);
  }, [finOps]);
  const emojis = ["🏆", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣"];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Test Mode Banner */}
      {isAdmin && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle size={16} className="shrink-0" />
          <p className="text-xs font-semibold">⚠️ MODO TESTE — ADMIN · Os dados são salvos localmente</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-gradient-gold tracking-tight">Olá, {currentUser?.name || "Membro"} {currentUser?.avatar}</h1>
          <p className="text-sm text-muted-foreground mt-1">Bem-vindo ao centro de controle VIP Netuno</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/30 p-1.5 rounded-xl border border-border">
          <Link to="/operacoes" className="px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-bold flex items-center gap-2 hover:bg-primary/30 transition-all"><Plus size={16} /> Nova Op.</Link>
          <Link to="/operacoes" className="px-4 py-2 rounded-lg text-muted-foreground text-sm font-bold flex items-center gap-2 hover:bg-secondary transition-all"><Users size={16} /> Clientes</Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "LUCRO TOTAL", value: totalProfit, type: "profit", icon: TrendingUp, sp: sparkData.lPts, sc: "hsl(187,100%,50%)" },
          { label: "PREJUÍZO TOTAL", value: totalLoss, type: "loss", icon: TrendingDown, sp: sparkData.pPts, sc: "hsl(0,84%,60%)" },
          { label: "SALDO LÍQUIDO", value: totalBalance, type: totalBalance >= 0 ? "profit" : "loss", icon: Wallet, sp: sparkData.rPts, sc: totalBalance >= 0 ? "hsl(187,100%,50%)" : "hsl(0,84%,60%)" },
          { label: "TOTAL OPS", value: finOps.length, type: "neutral", icon: Target, isCount: true, sp: sparkData.oPts, sc: "hsl(43,96%,56%)" }
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:glow-gold transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] md:text-xs text-muted-foreground font-bold tracking-wider">{stat.label}</p>
              <stat.icon size={16} style={{ color: stat.sc }} className="opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 relative z-10">
              {!stat.isCount && <span className="text-xs md:text-sm font-bold text-muted-foreground">R$</span>}
              <span className={`text-xl md:text-3xl font-black tracking-tighter ${stat.type === "profit" ? "text-gradient-profit drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" : stat.type === "loss" ? "text-gradient-loss drop-shadow-[0_0_10px_rgba(255,82,82,0.3)]" : "text-foreground"}`}>
                {stat.isCount ? stat.value : Math.abs(stat.value).toLocaleString("pt-BR")}
              </span>
            </div>
            <SparkLine data={stat.sp} color={stat.sc} />
          </div>
        ))}
      </div>

      <Tabs defaultValue="resumo" className="w-full mt-6">
        <TabsList className="bg-secondary/50 border border-border p-1 rounded-xl">
          <TabsTrigger value="resumo" className="rounded-lg text-xs md:text-sm font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none">📊 Resumo</TabsTrigger>
          <TabsTrigger value="ranking" className="rounded-lg text-xs md:text-sm font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none">🏆 Ranking</TabsTrigger>
          <TabsTrigger value="ferramentas" className="rounded-lg text-xs md:text-sm font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none">🔗 Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-4">
          <div className="glass rounded-2xl p-5" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            <h2 className="font-display text-sm font-bold text-foreground mb-4">📈 Gráfico de Performance</h2>
            {chartData.length === 0 ? (
              <div className="h-64 md:h-80 flex items-center justify-center text-muted-foreground text-sm">Registre operações para visualizar o gráfico.</div>
            ) : (
              <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="profitG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(187 100% 50%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(187 100% 50%)" stopOpacity={0} /></linearGradient>
                      <linearGradient id="lossG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.05)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 50%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" name="Lucro" dataKey="lucro" stroke="hsl(187 100% 50%)" fillOpacity={1} fill="url(#profitG)" strokeWidth={2} />
                    <Area type="monotone" name="Prejuízo" dataKey="prejuizo" stroke="hsl(0 84% 60%)" fillOpacity={1} fill="url(#lossG)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="mt-4">
          <div className="glass rounded-2xl p-5 max-w-3xl" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            <h2 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Trophy size={16} className="text-primary" /> Ranking por Plataforma</h2>
            {rankingData.length === 0 ? (
              <div className="text-muted-foreground text-sm py-4">Sem dados para ranking.</div>
            ) : (
              <div className="space-y-4">
                {rankingData.map((plat, i) => (
                  <div key={plat.platform} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{emojis[i] || emojis[emojis.length - 1]}</div>
                      <div>
                        <span className="font-bold text-sm md:text-base">{plat.platform}</span>
                        <p className="text-xs text-muted-foreground">{plat.ops} operações</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Líquido</p>
                      <p className={`font-black text-sm md:text-lg ${plat.profit >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>
                        {plat.profit >= 0 ? "+" : ""}R$ {Math.abs(plat.profit).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ferramentas" className="mt-4">
          <div className="glass rounded-2xl p-5" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-sm font-bold text-foreground">🔗 Links Úteis</h2>
            </div>
            {links.length === 0 ? (
              <div className="text-muted-foreground text-sm">Nenhuma ferramenta cadastrada.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {links.map(link => (
                  <div key={link.id} className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-all flex flex-col gap-2 group relative">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 pb-6">
                      <span className="text-2xl">{link.icon}</span>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{link.title}</span>
                      <span className="text-xs text-muted-foreground">{link.description}</span>
                    </a>
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.preventDefault(); setEditLink(link); }} className="p-1.5 rounded bg-primary/20 text-primary hover:bg-primary/40 transition-colors"><Settings size={14} /></button>
                        <button onClick={(e) => { e.preventDefault(); if (confirm('Excluir link?')) deleteLink(link.id); }} className="p-1.5 rounded bg-destructive/20 text-destructive hover:bg-destructive/40 transition-colors"><AlertTriangle size={14} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Link Modal */}
      {editLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditLink(null)} />
          <div className="relative glass-strong rounded-2xl p-6 w-full max-w-sm animate-scale-in border border-border">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Editar Link</h2>
            <div className="space-y-3">
              <input type="text" value={editLink.icon} onChange={e => setEditLink({ ...editLink, icon: e.target.value })} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="Ícone/Emoji" />
              <input type="text" value={editLink.title} onChange={e => setEditLink({ ...editLink, title: e.target.value })} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="Título" />
              <input type="text" value={editLink.url} onChange={e => setEditLink({ ...editLink, url: e.target.value })} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="URL" />
              <input type="text" value={editLink.description} onChange={e => setEditLink({ ...editLink, description: e.target.value })} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm" placeholder="Descrição" />
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditLink(null)} className="flex-1 py-2 rounded-lg bg-secondary text-sm font-semibold">Cancelar</button>
                <button onClick={() => { updateLink(editLink); setEditLink(null); toast.success("Atualizado!"); }} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
