import { useState } from "react";
import { CheckCircle2, Circle, ExternalLink, ChevronDown, Zap, Shield, TrendingUp, DollarSign, X, BookOpen } from "lucide-react";

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
  description: string;
}

const difficultyColor = { "Fácil": "text-neon-green", "Médio": "text-primary", "Difícil": "text-destructive" };
const riskColor = { "Baixo": "text-neon-green", "Médio": "text-primary", "Alto": "text-destructive" };

const methods: Method[] = [
  {
    name: "Método Tsunami",
    emoji: "🌊",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=300&fit=crop",
    capital: "R$ 2.500",
    investimento: "R$ 500",
    lucroEstimado: "R$ 1.200",
    difficulty: "Médio",
    risk: "Médio",
    progress: 75,
    link: "https://example.com/tsunami",
    description: "O Método Tsunami é uma estratégia avançada que combina apostas qualificadas com rollover otimizado. Ideal para quem já tem experiência com missões de bônus e quer maximizar os ganhos com um capital moderado. A execução exige atenção aos prazos e condições de cada plataforma.",
    steps: [
      { label: "Cadastro na plataforma", done: true },
      { label: "Depósito inicial", done: true },
      { label: "Missão 1 - Aposta qualificada", done: true },
      { label: "Missão 2 - Rollover", done: false },
      { label: "Saque do lucro", done: false },
    ],
    tutorial: [
      "1. Acesse o link e faça o cadastro com seus dados reais. Use um email que você consiga confirmar rapidamente.",
      "2. Deposite o valor inicial indicado (R$ 500). Utilize PIX para liberação instantânea.",
      "3. Realize a aposta qualificada conforme orientação. O odd mínimo deve ser 1.80 em mercado pré-jogo.",
      "4. Complete o rollover necessário. Você precisa apostar 5x o valor do bônus antes de solicitar saque.",
      "5. Solicite o saque após cumprir todos os requisitos. O prazo médio é de 24-48h para PIX.",
    ],
  },
  {
    name: "Método Tridente",
    emoji: "🔱",
    image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=300&fit=crop",
    capital: "R$ 1.800",
    investimento: "R$ 300",
    lucroEstimado: "R$ 800",
    difficulty: "Fácil",
    risk: "Baixo",
    progress: 40,
    link: "https://example.com/tridente",
    description: "O Método Tridente é perfeito para iniciantes. Com baixo investimento e risco controlado, utiliza uma sequência de rodadas estratégicas em slots específicos. A simplicidade do método permite que qualquer pessoa execute com facilidade e segurança.",
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Rodada 1", done: false },
      { label: "Rodada 2", done: false },
      { label: "Saque", done: false },
    ],
    tutorial: [
      "1. Crie sua conta usando o link exclusivo. Não use cupom de outro lugar para não perder o bônus VIP.",
      "2. Faça o depósito mínimo de R$ 300 via PIX.",
      "3. Execute a Rodada 1: entre no jogo indicado e siga a estratégia de apostas progressivas.",
      "4. Execute a Rodada 2: ajuste os valores conforme resultado da Rodada 1.",
      "5. Aguarde liberação e solicite saque. Prazo: até 72h úteis.",
    ],
  },
  {
    name: "Método Abismo",
    emoji: "🌑",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=300&fit=crop",
    capital: "R$ 5.000",
    investimento: "R$ 1.000",
    lucroEstimado: "R$ 3.500",
    difficulty: "Difícil",
    risk: "Alto",
    progress: 100,
    link: "https://example.com/abismo",
    description: "O Método Abismo é a estratégia mais lucrativa do arsenal VIP Netuno. Requer capital elevado e experiência, mas os retornos são proporcionais ao risco. Recomendado apenas para membros que já dominaram os métodos anteriores e possuem banca sólida.",
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Execução", done: true },
      { label: "Saque", done: true },
    ],
    tutorial: [
      "1. Acesse a plataforma pelo link e realize cadastro completo com verificação de identidade.",
      "2. Deposite o valor recomendado de R$ 1.000. Use PIX para aprovação imediata.",
      "3. Execute a estratégia completa: siga o passo a passo do vídeo tutorial no grupo VIP.",
      "4. Realize o saque total assim que os requisitos forem cumpridos. Lucro estimado: R$ 3.500.",
    ],
  },
];

/* ───────── Immersive Tutorial Dialog ───────── */
function TutorialDialog({ method, onClose }: { method: Method; onClose: () => void }) {
  const [checklist, setChecklist] = useState(method.steps.map(s => ({ ...s })));

  const toggleStep = (idx: number) => {
    setChecklist(prev => prev.map((s, i) => i === idx ? { ...s, done: !s.done } : s));
  };

  const completedCount = checklist.filter(s => s.done).length;
  const totalSteps = checklist.length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" onClick={onClose} />
      <div
        className="relative glass-strong rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
        style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 80px hsla(43,96%,56%,0.1)" }}
      >
        {/* Banner Image */}
        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl">
          <img src={method.image} alt={method.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(220 50% 6%), transparent 40%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsla(220,50%,6%,0.3), transparent 30%)" }} />

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full glass-strong hover:bg-secondary transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <span className="text-4xl">{method.emoji}</span>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{method.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs font-bold ${difficultyColor[method.difficulty]}`}>⚡ {method.difficulty}</span>
                <span className={`text-xs font-bold ${riskColor[method.risk]}`}>🛡️ {method.risk}</span>
              </div>
            </div>
          </div>

          {/* Completion badge */}
          {method.progress === 100 && (
            <div className="absolute top-4 left-6 px-3 py-1 rounded-full status-paid text-[10px] font-bold">✓ COMPLETO</div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border">
              <DollarSign size={16} className="text-muted-foreground mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Investimento</p>
              <p className="text-sm font-bold text-foreground">{method.investimento}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border">
              <TrendingUp size={16} className="text-primary mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Lucro Est.</p>
              <p className="text-sm font-bold text-gradient-profit">{method.lucroEstimado}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border">
              <Zap size={16} className="text-primary mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Capital</p>
              <p className="text-sm font-bold text-foreground">{method.capital}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <BookOpen size={14} className="text-primary" /> Sobre o Método
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{method.description}</p>
          </div>

          {/* Interactive Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">Checklist de Etapas</h3>
              <span className="text-[10px] text-muted-foreground font-bold">{completedCount}/{totalSteps} completas</span>
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4 border border-border">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: progressPct === 100
                    ? "linear-gradient(90deg, hsl(155 100% 50%), hsl(187 100% 50%))"
                    : "linear-gradient(90deg, hsl(43 96% 56%), hsl(38 90% 40%))",
                  boxShadow: progressPct === 100 ? "0 0 12px hsla(155, 100%, 50%, 0.4)" : "0 0 12px hsla(43, 96%, 56%, 0.3)",
                }}
              />
            </div>
            <div className="space-y-2">
              {checklist.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${step.done
                      ? "bg-emerald-500/5 border border-emerald-500/20"
                      : "bg-secondary/30 border border-border hover:border-primary/20 hover:bg-secondary/50"
                    }`}
                >
                  {step.done
                    ? <CheckCircle2 size={18} className="text-neon-green shrink-0" />
                    : <Circle size={18} className="text-muted-foreground shrink-0" />
                  }
                  <span className={`text-sm ${step.done ? "text-foreground/70 line-through" : "text-foreground"}`}>
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial Steps */}
          <div>
            <h3 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider mb-3">Tutorial Detalhado</h3>
            <div className="glass rounded-xl p-4 space-y-3 border border-border">
              {method.tutorial.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{line.replace(/^\d+\.\s*/, "")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={method.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all duration-300"
          >
            <ExternalLink size={16} /> Acessar Método
          </a>
        </div>
      </div>
    </div>
  );
}

/* ───────── Method Card ───────── */
function MethodCard({ method }: { method: Method }) {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <>
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

          {/* Ver Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all border border-primary/20"
          >
            <BookOpen size={14} /> Ver Tutorial
          </button>
        </div>
      </div>

      {showTutorial && <TutorialDialog method={method} onClose={() => setShowTutorial(false)} />}
    </>
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
