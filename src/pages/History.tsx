import { useState } from "react";
import { Clock, Search, TrendingUp, TrendingDown, Trash2, UserPlus, Download } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function History() {
  const { history } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = history.filter(
    (e) => e.action.toLowerCase().includes(searchTerm.toLowerCase()) || e.detail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-gradient-gold">Histórico</h1>
          <p className="text-sm text-muted-foreground mt-1">Registro completo das suas atividades</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold font-display hover:bg-primary/20 transition-colors">
          <Download size={14} /> Exportar PDF
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Buscar no histórico..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="modal-input pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Clock size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm">Nenhuma atividade registrada ainda.</p>
          <p className="text-muted-foreground text-xs mt-1">Suas operações aparecerão aqui conforme você as registrar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="glass rounded-xl p-4 flex items-center justify-between hover:glow-gold transition-all" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${entry.type === "operacao" ? "bg-primary/20" : entry.type === "cpa" ? "bg-cyan-500/20" : entry.type === "delete" ? "bg-destructive/20" : "bg-emerald-500/20"
                  }`}>
                  {entry.type === "operacao" ? <TrendingUp size={14} className="text-primary" /> :
                    entry.type === "cpa" ? <TrendingUp size={14} className="text-cyan-400" /> :
                      entry.type === "delete" ? <Trash2 size={14} className="text-destructive" /> :
                        <UserPlus size={14} className="text-emerald-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">{entry.detail} • {entry.date}</p>
                </div>
              </div>
              {entry.result !== undefined && (
                <span className={`font-bold text-sm ${entry.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>
                  {entry.result >= 0 ? "+" : ""}R$ {Math.abs(entry.result).toLocaleString("pt-BR")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
