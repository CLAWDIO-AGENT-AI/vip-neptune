import { CheckCircle2, Circle } from "lucide-react";

interface Method {
  name: string;
  capital: string;
  progress: number;
  steps: { label: string; done: boolean }[];
}

const methods: Method[] = [
  {
    name: "Método Tsunami 🌊",
    capital: "R$ 2.500",
    progress: 75,
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Missão 1", done: true },
      { label: "Missão 2", done: false },
      { label: "Saque", done: false },
    ],
  },
  {
    name: "Método Tridente 🔱",
    capital: "R$ 1.800",
    progress: 40,
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Rodada 1", done: false },
      { label: "Rodada 2", done: false },
      { label: "Saque", done: false },
    ],
  },
  {
    name: "Método Abismo 🌑",
    capital: "R$ 5.000",
    progress: 100,
    steps: [
      { label: "Cadastro", done: true },
      { label: "Depósito", done: true },
      { label: "Execução", done: true },
      { label: "Saque", done: true },
    ],
  },
];

export default function Methods() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-bold text-gradient-gold">Métodos Ativos</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe suas estratégias em andamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((m) => (
          <div key={m.name} className="glass rounded-2xl p-5 hover:glow-gold transition-all duration-300">
            <h3 className="font-display text-sm font-bold text-foreground mb-1">{m.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Capital Alocado: <span className="text-gradient-gold font-bold text-sm">{m.capital}</span>
            </p>

            {/* Progress bar */}
            <div className="h-3 rounded-full bg-secondary overflow-hidden mb-4 border border-border">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${m.progress}%`,
                  background:
                    m.progress === 100
                      ? "linear-gradient(90deg, hsl(155 100% 50%), hsl(187 100% 50%))"
                      : "linear-gradient(90deg, hsl(43 96% 56%), hsl(38 90% 40%))",
                  boxShadow:
                    m.progress === 100
                      ? "0 0 12px hsla(155, 100%, 50%, 0.4)"
                      : "0 0 12px hsla(43, 96%, 56%, 0.3)",
                }}
              />
            </div>
            <p className="text-right text-xs text-muted-foreground font-semibold mb-3">{m.progress}%</p>

            {/* Checklist */}
            <div className="space-y-2">
              {m.steps.map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  {step.done ? (
                    <CheckCircle2 size={14} className="text-neon-green" />
                  ) : (
                    <Circle size={14} className="text-muted-foreground" />
                  )}
                  <span className={`text-xs ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
