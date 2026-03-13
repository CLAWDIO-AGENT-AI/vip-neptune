import { useState, useRef } from "react";
import {
  Plus, Download, FileSpreadsheet, ChevronDown, Edit2, Trash2, X,
  TrendingUp, TrendingDown, DollarSign, Share2, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer,
} from "recharts";

type Tab = "geral" | "cpa" | "clientes";
type FilterPeriod = "dia" | "semana" | "mes" | "ano";

interface Operation {
  id: string;
  platform: string;
  date: string;
  status: "PAGO" | "PENDENTE" | "NÃO PAGO";
  result: number;
  category: string;
  email: string;
  valorCPA: number;
  valorInvestido: number;
  valorFinal: number;
}

const miniChartData = [
  { v: 20 }, { v: 35 }, { v: 25 }, { v: 45 }, { v: 38 }, { v: 55 }, { v: 48 }, { v: 65 },
];

const mockOperations: Operation[] = [
  { id: "1", platform: "Betano", date: "12/03/2026", status: "PAGO", result: 1250, category: "Missões", email: "cliente@email.com", valorCPA: 200, valorInvestido: 500, valorFinal: 1750 },
  { id: "2", platform: "Bet365", date: "11/03/2026", status: "PENDENTE", result: 890, category: "Métodos", email: "user2@email.com", valorCPA: 150, valorInvestido: 300, valorFinal: 1190 },
  { id: "3", platform: "Sportingbet", date: "10/03/2026", status: "NÃO PAGO", result: -320, category: "Outro", email: "user3@email.com", valorCPA: 100, valorInvestido: 800, valorFinal: 480 },
  { id: "4", platform: "Betano", date: "09/03/2026", status: "PAGO", result: 2100, category: "Missões", email: "user4@email.com", valorCPA: 250, valorInvestido: 600, valorFinal: 2700 },
  { id: "5", platform: "KTO", date: "08/03/2026", status: "PAGO", result: 560, category: "Métodos", email: "user5@email.com", valorCPA: 100, valorInvestido: 200, valorFinal: 760 },
];

const mockClients = [
  { id: "1", name: "Carlos Silva", phone: "(11) 99999-1234", pix: "carlos@pix.com" },
  { id: "2", name: "Ana Souza", phone: "(21) 98888-5678", pix: "12345678900" },
  { id: "3", name: "João Santos", phone: "(31) 97777-9012", pix: "joao@chave.com" },
];

function StatusBadge({ status }: { status: Operation["status"] }) {
  const cls =
    status === "PAGO" ? "status-paid" : status === "PENDENTE" ? "status-pending" : "status-unpaid";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

/* ───────── Share Victory Modal ───────── */
function ShareVictoryModal({ op, onClose }: { op: Operation; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement("a");
      link.download = `vitoria-netuno-${op.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // fallback
      alert("Erro ao gerar imagem. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md glow-gold animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gradient-gold">🔱 Compartilhar Vitória</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
        </div>

        {/* Victory Card */}
        <div
          ref={cardRef}
          className="relative rounded-2xl overflow-hidden p-6 text-center"
          style={{
            background: "linear-gradient(135deg, hsl(220 50% 6%), hsl(225 67% 2%))",
            border: "2px solid hsla(43, 96%, 56%, 0.3)",
            boxShadow: "0 0 40px hsla(43, 96%, 56%, 0.15), inset 0 1px 0 hsla(0,0%,100%,0.05)",
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 50% 0%, hsla(43,96%,56%,0.4), transparent 60%)" }} />
          <div className="relative z-10">
            <p className="text-3xl mb-2 trident-glow">🔱</p>
            <p className="font-display text-xs font-bold text-primary tracking-[0.3em] mb-4">VIP NETUNO</p>
            <p className="text-xs text-muted-foreground mb-1">{op.platform} • {op.date}</p>
            <p className="text-5xl font-bold tracking-tighter text-gradient-profit my-4">
              +R$ {Math.abs(op.result).toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground font-display tracking-widest">LUCRO CONFIRMADO ✓</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Download size={16} /> Baixar Imagem
        </button>
      </div>
    </div>
  );
}

/* ───────── Desktop Table Row ───────── */
function DesktopTableRow({ op, tab, onShare }: { op: Operation; tab: Tab; onShare: (op: Operation) => void }) {
  const [emailExpanded, setEmailExpanded] = useState(false);

  return (
    <div className="grid items-center gap-2 px-4 py-3 border-b border-border hover:bg-secondary/30 transition-colors text-sm"
      style={{ gridTemplateColumns: tab === "cpa"
        ? "1fr 0.8fr minmax(60px,1fr) 0.8fr 90px 80px 80px 80px 90px 40px"
        : "1fr 0.8fr 0.8fr minmax(60px,1fr) 80px 80px 90px 100px 40px"
      }}
    >
      {tab === "cpa" ? (
        <>
          <span className="font-semibold text-foreground">{op.platform}</span>
          <span className="text-muted-foreground">{op.category}</span>
          <button onClick={() => setEmailExpanded(!emailExpanded)} className="text-left text-muted-foreground hover:text-foreground truncate transition-colors flex items-center gap-1">
            {emailExpanded ? op.email : op.email.substring(0, 8) + "..."}
            <ChevronRight size={10} className={`transition-transform ${emailExpanded ? "rotate-90" : ""}`} />
          </button>
          <span className="text-muted-foreground">{op.date}</span>
          <StatusBadge status={op.status} />
          <span className="text-foreground">R$ {op.valorCPA}</span>
          <span className="text-muted-foreground">R$ {op.valorInvestido}</span>
          <span className="text-foreground">R$ {op.valorFinal}</span>
          <span className={`font-bold ${op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>
            {op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result)}
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-secondary"><Edit2 size={12} className="text-muted-foreground" /></button>
          </div>
        </>
      ) : (
        <>
          <span className="font-semibold text-foreground">{op.platform}</span>
          <span className="text-muted-foreground">{op.category}</span>
          <span className="text-muted-foreground">{op.date}</span>
          <button onClick={() => setEmailExpanded(!emailExpanded)} className="text-left text-muted-foreground hover:text-foreground truncate transition-colors flex items-center gap-1">
            {emailExpanded ? op.email : op.email.substring(0, 8) + "..."}
            <ChevronRight size={10} className={`transition-transform ${emailExpanded ? "rotate-90" : ""}`} />
          </button>
          <span className="text-foreground">R$ {op.valorInvestido}</span>
          <span className="text-foreground">R$ {op.valorFinal}</span>
          <StatusBadge status={op.status} />
          <span className={`font-bold text-base ${op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>
            {op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result)}
          </span>
          <div className="flex gap-1">
            {op.result > 0 && (
              <button onClick={() => onShare(op)} className="p-1 rounded hover:bg-primary/10"><Share2 size={12} className="text-primary" /></button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────── Mobile Card ───────── */
function MobileOperationCard({ op, onShare }: { op: Operation; onShare: (op: Operation) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden mb-2 transition-all duration-300 hover:glow-gold">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {op.platform.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{op.platform}</p>
            <p className="text-xs text-muted-foreground">{op.date}</p>
          </div>
          <StatusBadge status={op.status} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold tracking-tighter ${op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>
            {op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result).toLocaleString("pt-BR")}
          </span>
          <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in border-t border-border">
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              { label: "Categoria", value: op.category },
              { label: "Email", value: op.email },
              { label: "Valor CPA", value: `R$ ${op.valorCPA}` },
              { label: "Investido", value: `R$ ${op.valorInvestido}` },
              { label: "Valor Final", value: `R$ ${op.valorFinal}` },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
              <Edit2 size={12} /> Editar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
              <Trash2 size={12} /> Excluir
            </button>
            {op.result > 0 && (
              <button onClick={() => onShare(op)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors ml-auto">
                🔱 Compartilhar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Modal: Nova Operação ───────── */
function NewOperationModal({ onClose }: { onClose: () => void }) {
  const [pct, setPct] = useState(50);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 60px hsla(43,96%,56%,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-gradient-gold">🔱 Nova Operação</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <ModalField label="Plataforma">
            <select className="modal-input"><option>Betano</option><option>Bet365</option><option>Sportingbet</option><option>KTO</option></select>
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Data"><input type="date" className="modal-input" /></ModalField>
            <ModalField label="Categoria">
              <select className="modal-input"><option>Missões</option><option>Métodos</option><option>Outro</option></select>
            </ModalField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Valor Investido"><input type="number" placeholder="R$ 0,00" className="modal-input" /></ModalField>
            <ModalField label="Valor Final"><input type="number" placeholder="R$ 0,00" className="modal-input" /></ModalField>
          </div>
          <ModalField label={`% do Cliente: ${pct}%`}>
            <div className="relative mt-1">
              <input type="range" min="0" max="100" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full slider-gold" />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
            </div>
          </ModalField>
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300">
            🔱 Registrar Operação
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Modal: Novo CPA ───────── */
function NewCPAModal({ onClose }: { onClose: () => void }) {
  const [pct, setPct] = useState(50);
  const [cpaPago, setCpaPago] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 60px hsla(43,96%,56%,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-gradient-gold">🔱 Novo CPA</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <ModalField label="Plataforma">
            <select className="modal-input"><option>Betano</option><option>Bet365</option><option>Sportingbet</option><option>KTO</option></select>
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Data"><input type="date" className="modal-input" /></ModalField>
            <ModalField label="E-mail"><input type="email" placeholder="email@exemplo.com" className="modal-input" /></ModalField>
          </div>
          <ModalField label="Status do CPA">
            <button
              onClick={() => setCpaPago(!cpaPago)}
              className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                cpaPago
                  ? "status-paid"
                  : "status-unpaid"
              }`}
            >
              {cpaPago ? "✓ CPA PAGO" : "CPA NÃO PAGO"}
            </button>
          </ModalField>
          <div className="grid grid-cols-3 gap-3">
            <ModalField label="V. Inicial"><input type="number" placeholder="R$" className="modal-input" /></ModalField>
            <ModalField label="V. Final"><input type="number" placeholder="R$" className="modal-input" /></ModalField>
            <ModalField label="Bônus"><input type="number" placeholder="R$" className="modal-input" /></ModalField>
          </div>
          <ModalField label={`% do Cliente: ${pct}%`}>
            <div className="relative mt-1">
              <input type="range" min="0" max="100" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full slider-gold" />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
            </div>
          </ModalField>
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300">
            🔱 Registrar CPA
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Modal: Novo Cliente ───────── */
function NewClientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 60px hsla(43,96%,56%,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-gradient-gold">🔱 Novo Cliente</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <ModalField label="Nome"><input type="text" placeholder="Nome completo" className="modal-input" /></ModalField>
          <ModalField label="Telefone / WhatsApp"><input type="tel" placeholder="(00) 00000-0000" className="modal-input" /></ModalField>
          <ModalField label="Chave PIX"><input type="text" placeholder="CPF, Email ou Chave" className="modal-input" /></ModalField>
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300">
            🔱 Cadastrar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Shared Modal Field ───────── */
function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

/* ───────── Main Page ───────── */
export default function Operations() {
  const [tab, setTab] = useState<Tab>("geral");
  const [filter, setFilter] = useState<FilterPeriod>("mes");
  const [showNewOp, setShowNewOp] = useState(false);
  const [showNewCPA, setShowNewCPA] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [shareOp, setShareOp] = useState<Operation | null>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: "geral", label: "Geral" },
    { key: "cpa", label: "CPA" },
    { key: "clientes", label: "Clientes" },
  ];

  const filterLabels: { key: FilterPeriod; label: string }[] = [
    { key: "dia", label: "Dia" },
    { key: "semana", label: "Semana" },
    { key: "mes", label: "Mês" },
    { key: "ano", label: "Ano" },
  ];

  const totalInvestido = mockOperations.reduce((s, o) => s + o.valorInvestido, 0);
  const totalRetorno = mockOperations.reduce((s, o) => s + o.valorFinal, 0);
  const totalLucro = mockOperations.reduce((s, o) => s + o.result, 0);

  const handleNewClick = () => {
    if (tab === "cpa") setShowNewCPA(true);
    else if (tab === "clientes") setShowNewClient(true);
    else setShowNewOp(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-gradient-gold">Operações</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie todas as suas operações</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors">
            <FileSpreadsheet size={14} /> Planilha
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-xs font-semibold hover:text-foreground transition-colors">
            <Download size={14} /> Modelo
          </button>
          <button
            onClick={handleNewClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold font-display hover:glow-gold-strong transition-all duration-300"
          >
            <Plus size={14} /> {tab === "cpa" ? "Novo CPA" : tab === "clientes" ? "Novo Cliente" : "Nova Operação"}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {tab !== "clientes" && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Investimento Total", value: totalInvestido, icon: TrendingDown, gradient: "text-gradient-loss", color: "hsl(0 84% 60%)" },
            { label: "Retorno Total", value: totalRetorno, icon: TrendingUp, gradient: "text-gradient-profit", color: "hsl(187 100% 50%)" },
            { label: "Lucro Total", value: totalLucro, icon: DollarSign, gradient: "text-gradient-gold", color: "hsl(43 96% 56%)" },
          ].map((card) => (
            <div key={card.label} className="glass rounded-xl p-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniChartData}>
                    <defs>
                      <linearGradient id={`bg-${card.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={card.color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={card.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={card.color} strokeWidth={1.5} fill={`url(#bg-${card.label})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <card.icon size={14} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{card.label}</span>
                </div>
                <p className={`text-xl md:text-2xl font-bold tracking-tighter ${card.gradient}`}>
                  R$ {card.value.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs + Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                tab === t.key ? "bg-primary/20 text-primary glow-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab !== "clientes" && (
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-0.5">
            {filterLabels.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all ${
                  filter === f.key ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "clientes" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockClients.map((client) => (
            <div key={client.id} className="glass rounded-xl p-4 hover:glow-gold transition-all duration-300" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
              <p className="font-semibold text-foreground">{client.name}</p>
              <p className="text-xs text-muted-foreground mt-1">📱 {client.phone}</p>
              <p className="text-xs text-muted-foreground">🔑 {client.pix}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block glass rounded-xl overflow-hidden" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            {/* Table Header */}
            <div
              className="grid items-center gap-2 px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-secondary/30"
              style={{ gridTemplateColumns: tab === "cpa"
                ? "1fr 0.8fr minmax(60px,1fr) 0.8fr 90px 80px 80px 80px 90px 40px"
                : "1fr 0.8fr 0.8fr minmax(60px,1fr) 80px 80px 90px 100px 40px"
              }}
            >
              {tab === "cpa" ? (
                <><span>Plataforma</span><span>Categoria</span><span>Email</span><span>Data</span><span>Status CPA</span><span>V. CPA</span><span>V. Investido</span><span>V. Final</span><span>Resultado</span><span></span></>
              ) : (
                <><span>Plataforma</span><span>Categoria</span><span>Data</span><span>Email</span><span>Investido</span><span>V. Final</span><span>Status</span><span>Resultado</span><span></span></>
              )}
            </div>
            {mockOperations.map((op) => (
              <DesktopTableRow key={op.id} op={op} tab={tab} onShare={setShareOp} />
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {mockOperations.map((op) => (
              <MobileOperationCard key={op.id} op={op} onShare={setShareOp} />
            ))}
          </div>
        </>
      )}

      {showNewOp && <NewOperationModal onClose={() => setShowNewOp(false)} />}
      {showNewCPA && <NewCPAModal onClose={() => setShowNewCPA(false)} />}
      {showNewClient && <NewClientModal onClose={() => setShowNewClient(false)} />}
      {shareOp && <ShareVictoryModal op={shareOp} onClose={() => setShareOp(null)} />}
    </div>
  );
}
