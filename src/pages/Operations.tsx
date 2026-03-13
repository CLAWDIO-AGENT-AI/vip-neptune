import { useState } from "react";
import {
  Plus, Download, FileSpreadsheet, ChevronDown, Edit2, Trash2, X,
} from "lucide-react";

type Tab = "geral" | "cpa" | "clientes";

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

function OperationRow({ op }: { op: Operation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden mb-2 transition-all duration-300 hover:glow-gold">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {op.platform.charAt(0)}
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{op.platform}</p>
            <p className="text-xs text-muted-foreground">{op.date}</p>
          </div>
          <p className="text-xs text-muted-foreground sm:hidden">{op.date}</p>
          <StatusBadge status={op.status} />
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xl md:text-2xl font-bold tracking-tighter ${
              op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"
            }`}
          >
            {op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result).toLocaleString("pt-BR")}
          </span>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {[
              { label: "Categoria", value: op.category },
              { label: "Email", value: op.email },
              { label: "Valor CPA", value: `R$ ${op.valorCPA}` },
              { label: "Valor Investido", value: `R$ ${op.valorInvestido}` },
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
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan text-xs font-semibold hover:bg-cyan/20 transition-colors ml-auto">
                🔱 Compartilhar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NewOperationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md glow-gold animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-gradient-gold">Nova Operação</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Plataforma</label>
            <select className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
              <option>Betano</option><option>Bet365</option><option>Sportingbet</option><option>KTO</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Data</label>
              <input type="date" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Categoria</label>
              <select className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                <option>Missões</option><option>Métodos</option><option>Outro</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Valor Investido</label>
              <input type="number" placeholder="R$ 0,00" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Valor Final</label>
              <input type="number" placeholder="R$ 0,00" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              % do Cliente do Lucro: <span className="text-primary">50%</span>
            </label>
            <input
              type="range" min="0" max="100" defaultValue="50"
              className="w-full accent-primary"
            />
          </div>
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300">
            🔱 Registrar Operação
          </button>
        </div>
      </div>
    </div>
  );
}

function NewCPAModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md glow-gold animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-gradient-gold">Novo CPA</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Plataforma</label>
            <select className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
              <option>Betano</option><option>Bet365</option><option>Sportingbet</option><option>KTO</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Data</label>
              <input type="date" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">E-mail</label>
              <input type="email" placeholder="email@exemplo.com" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Status do CPA</label>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg status-pending text-sm font-bold w-full justify-center hover:status-paid transition-all">
              CPA NÃO PAGO → Clique para PAGO
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">V. Inicial</label>
              <input type="number" placeholder="R$" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">V. Final</label>
              <input type="number" placeholder="R$" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Bônus</label>
              <input type="number" placeholder="R$" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              % do Cliente: <span className="text-primary">50%</span>
            </label>
            <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-primary" />
          </div>
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300">
            🔱 Registrar CPA
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Operations() {
  const [tab, setTab] = useState<Tab>("geral");
  const [showNewOp, setShowNewOp] = useState(false);
  const [showNewCPA, setShowNewCPA] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "geral", label: "Geral" },
    { key: "cpa", label: "CPA" },
    { key: "clientes", label: "Clientes" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
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
            onClick={() => tab === "cpa" ? setShowNewCPA(true) : setShowNewOp(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold font-display hover:glow-gold-strong transition-all duration-300"
          >
            <Plus size={14} /> {tab === "cpa" ? "Novo CPA" : tab === "clientes" ? "Novo Cliente" : "Nova Operação"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              tab === t.key
                ? "bg-primary/20 text-primary glow-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "clientes" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockClients.map((client) => (
            <div key={client.id} className="glass rounded-xl p-4 hover:glow-gold transition-all duration-300">
              <p className="font-semibold text-foreground">{client.name}</p>
              <p className="text-xs text-muted-foreground mt-1">📱 {client.phone}</p>
              <p className="text-xs text-muted-foreground">🔑 {client.pix}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mockOperations.map((op) => (
            <OperationRow key={op.id} op={op} />
          ))}
        </div>
      )}

      {showNewOp && <NewOperationModal onClose={() => setShowNewOp(false)} />}
      {showNewCPA && <NewCPAModal onClose={() => setShowNewCPA(false)} />}
    </div>
  );
}
