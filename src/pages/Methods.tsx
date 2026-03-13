import { useState } from "react";
import { CheckCircle2, Circle, ExternalLink, ChevronDown, Zap, Shield, TrendingUp, DollarSign } from "lucide-react";

interface Method {
  name: string;
  emoji: string;
  image: string;
  capital: string;
  investimento: string;
  lucroEstimado: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  risk: "Baixo" | "Médio" | "Alto";
  progress: number;
  link: string;
  steps: { label: string; done: boolean }[];
  tutorial: string[];
}

const difficultyColor = { "Fácil": "text-neon-green", "Médio": "text-primary", "Difícil": "text-destructive" };
const riskColor = { "Baixo": "text-neon-green", "Médio": "text-primary", "Alto": "text-destructive" };

const methods: Method[] = [
  {
    name: "Método Tsunami",
    emoji: "🌊",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop",
    capital: "R$ 2.500",
    investimento: "R$ 500",
    lucroEstimado: "R$ 1.200",
    difficulty: "Médio",
    risk: "Médio",
    progress: 75,
    link: "https://example.com/tsunami",
    steps: [
      { label: "Cadastro na plataforma", done: true },
      { label: "Depósito inicial", done: true },
      { label: "Missão 1 - Aposta qualificada", done: true },
      { label: "Missão 2 - Rollover", done: false },
      { label: "Saque do lucro", done: false },
    ],
    tutorial: [
      "1. Acesse o link e faça o cadastro com seus dados",
      "2. Deposite o valor inicial indicado",
      "3. Realize a aposta qualificada conforme orientação",
      "4. Complete o rollover necessário",
      "5. Solicite o saque após cumprir requisitos",
    ],
  },
  {
    name: "Método Tridente",
    emoji: "🔱",
    image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=200&fit=crop",
    capital: "R$ 1.800",
    investimento: "R$ 300",
    lucroEstimado: "R$ 800",
    difficulty: "Fácil",
    risk: "Baixo",
    progress: 40,
    link: "https://example.com/tridente",
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Rodada 1", done: false },
      { label: "Rodada 2", done: false },
      { label: "Saque", done: false },
    ],
    tutorial: [
      "1. Crie sua conta usando o link exclusivo",
      "2. Faça o depósito mínimo",
      "3. Execute as rodadas conforme estratégia",
      "4. Aguarde liberação e solicite saque",
    ],
  },
  {
    name: "Método Abismo",
    emoji: "🌑",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
    capital: "R$ 5.000",
    investimento: "R$ 1.000",
    lucroEstimado: "R$ 3.500",
    difficulty: "Difícil",
    risk: "Alto",
    progress: 100,
    link: "https://example.com/abismo",
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Execução", done: true },
      { label: "Saque", done: true },
    ],
    tutorial: [
      "1. Acesse a plataforma pelo link",
      "2. Deposite o valor recomendado",
      "3. Execute a estratégia completa",
      "4. Realize o saque total",
    ],
  },
];

function MethodCard({ method }: { method: Method }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden hover:glow-gold transition-all duration-300" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img src={method.image} alt={method.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(220 50% 6%), transparent)" }} />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-2xl">{method.emoji}</span>
          <h3 className="font-display text-sm font-bold text-foreground">{method.name}</h3>
        </div>
        {method.progress === 100 && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full status-paid text-[10px] font-bold">COMPLETO</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <InfoPill icon={<Zap size={12} />} label="Dificuldade" value={method.difficulty} valueClass={difficultyColor[method.difficulty]} />
          <InfoPill icon={<Shield size={12} />} label="Risco" value={method.risk} valueClass={riskColor[method.risk]} />
          <InfoPill icon={<DollarSign size={12} />} label="Investimento" value={method.investimento} valueClass="text-foreground" />
          <InfoPill icon={<TrendingUp size={12} />} label="Lucro Est." value={method.lucroEstimado} valueClass="text-gradient-profit" />
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Progresso</span>
            <span className="font-bold text-foreground">{method.progress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden border border-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${method.progress}%`,
                background: method.progress === 100
                  ? "linear-gradient(90deg, hsl(155 100% 50%), hsl(187 100% 50%))"
                  : "linear-gradient(90deg, hsl(43 96% 56%), hsl(38 90% 40%))",
                boxShadow: method.progress === 100
                  ? "0 0 12px hsla(155, 100%, 50%, 0.4)"
                  : "0 0 12px hsla(43, 96%, 56%, 0.3)",
              }}
            />
          </div>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-all"
        >
          {expanded ? "Fechar" : "Ver Tutorial"}
          <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="animate-fade-in space-y-3 pt-2 border-t border-border">
            {/* Checklist */}
            <div className="space-y-2">
              {method.steps.map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  {step.done ? <CheckCircle2 size={14} className="text-neon-green shrink-0" /> : <Circle size={14} className="text-muted-foreground shrink-0" />}
                  <span className={`text-xs ${step.done ? "text-foreground line-through opacity-70" : "text-foreground"}`}>{step.label}</span>
                </div>
              ))}
            </div>

            {/* Tutorial */}
            <div className="glass rounded-lg p-3 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Tutorial</p>
              {method.tutorial.map((line, i) => (
                <p key={i} className="text-xs text-muted-foreground">{line}</p>
              ))}
            </div>

            {/* Link */}
            <a
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xs hover:glow-gold-strong transition-all duration-300"
            >
              <ExternalLink size={14} /> Acessar Método
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPill({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-secondary/50">
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[8px] text-muted-foreground uppercase tracking-wider leading-none">{label}</p>
        <p className={`text-xs font-bold ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

export default function Methods() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-bold text-gradient-gold">Métodos Ativos</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe suas estratégias em andamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((m) => (
          <MethodCard key={m.name} method={m} />
        ))}
      </div>
    </div>
  );
}
