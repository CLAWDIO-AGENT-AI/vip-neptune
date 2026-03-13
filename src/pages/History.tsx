import { Clock } from "lucide-react";

export default function History() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-gradient-gold">Histórico</h1>
          <p className="text-sm text-muted-foreground mt-1">Registro completo das operações</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold font-display hover:bg-primary/20 transition-colors">
          📄 Exportar PDF
        </button>
      </div>
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <Clock size={48} className="text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm">Histórico completo será exibido aqui</p>
      </div>
    </div>
  );
}
