import { useState, useMemo } from "react";
import { AlertTriangle, Lock, User, Eye, EyeOff, Diamond, Send, Phone } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import icone from "@/assets/icone.webp";

export default function LoginPage() {
    const { login, requestAccess } = useApp();
    const navigate = useNavigate();
    const [mode, setMode] = useState<"login" | "signup">("login");

    // Login State
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    // Signup State
    const [regName, setRegName] = useState("");
    const [regUser, setRegUser] = useState("");
    const [regPass, setRegPass] = useState("");
    const [regPhone, setRegPhone] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Memoized particles to avoid re-rendering on every keystroke
    const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-primary/20 animate-float" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s`,
        }} />
    )), []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !pass) { setError("Preencha todos os campos."); return; }
        setError(""); setLoading(true);
        setTimeout(() => {
            if (login(user, pass)) navigate("/");
            else setError("Credenciais inválidas. Verifique seu login e senha.");
            setLoading(false);
        }, 800);
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regName || !regUser || !regPass || !regPhone) { setError("Preencha todos os campos."); return; }
        setError(""); setLoading(true);
        setTimeout(() => {
            const success = requestAccess({ name: regName, user: regUser, pass: regPass, phone: regPhone });
            if (success) {
                toast.success("Solicitação enviada! Aguarde a aprovação do administrador.");
                setMode("login");
                setRegName(""); setRegUser(""); setRegPass(""); setRegPhone("");
            } else {
                setError("Usuário já existe ou solicitação já pendente.");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: "radial-gradient(ellipse at top, hsl(220 50% 8%), hsl(225 67% 3%))" }}>
            {/* Floating particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">{particles}</div>

            <div className="relative w-full max-w-md z-10 animate-scale-in">
                {/* Test mode banner */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6">
                    <AlertTriangle size={14} className="shrink-0" />
                    <p className="text-[11px] font-semibold">MODO TESTE — Pré-Firebase · Login Admin: admin / netuno2026</p>
                </div>

                <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 80px hsla(43,96%,56%,0.08)" }}>
                    {/* Header */}
                    <div className="p-8 pb-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <img src={icone} alt="" className="w-20 h-20 rounded-full object-cover trident-glow border-2 border-primary/30" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Lock size={12} className="text-primary-foreground" /></div>
                            </div>
                        </div>
                        <h1 className="font-display text-2xl font-extrabold text-gradient-gold">VIP NETUNO</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {mode === "login" ? "Acesso restrito a membros" : "Solicite acesso ao grupo VIP"}
                        </p>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex px-8 mb-6">
                        <div className="flex w-full bg-secondary/40 p-1 rounded-xl border border-border">
                            <button type="button" onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === "login" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Entrar</button>
                            <button type="button" onClick={() => { setMode("signup"); setError(""); }} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === "signup" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Solicitar Acesso</button>
                        </div>
                    </div>

                    {/* Login Form */}
                    {mode === "login" ? (
                        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-4 animate-fade-in">
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5 flex items-center gap-1.5"><User size={11} /> Usuário / Email</label>
                                <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Seu login" className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-sm text-foreground outline-none focus:border-primary/40 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5 flex items-center gap-1.5"><Lock size={11} /> Senha</label>
                                <div className="relative">
                                    <input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-sm text-foreground outline-none focus:border-primary/40 transition-colors pr-12" />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                            </div>
                            {error && <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">{error}</div>}
                            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-amber-600 text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Lock size={14} /> Acessar Painel</>}
                            </button>
                        </form>
                    ) : (
                        /* Signup Form */
                        <form onSubmit={handleSignup} className="px-8 pb-8 space-y-4 animate-fade-in">
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5"><User size={11} className="inline mr-1" /> Nome Completo</label>
                                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="João Silva" className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-sm text-foreground outline-none focus:border-primary/40 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5"><Phone size={11} className="inline mr-1" /> WhatsApp</label>
                                <input type="tel" value={regPhone} onChange={e => setRegPhone(useApp().formatPhone(e.target.value))} placeholder="(11) 99999-9999" className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-sm text-foreground outline-none focus:border-primary/40 transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5">Usuário</label>
                                    <input type="text" value={regUser} onChange={e => setRegUser(e.target.value)} placeholder="login" className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-sm text-foreground outline-none focus:border-primary/40 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5">Senha</label>
                                    <input type={showPass ? "text" : "password"} value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="••••" className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border text-sm text-foreground outline-none focus:border-primary/40 transition-colors" />
                                </div>
                            </div>
                            {error && <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">{error}</div>}
                            <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 rounded-xl bg-secondary text-foreground font-display font-bold text-sm hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {loading ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <><Send size={14} /> Solicitar Aprovação</>}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="px-8 py-4 bg-secondary/20 border-t border-border flex items-center justify-center gap-2 text-center">
                        <Diamond size={12} className="text-primary" />
                        <p className="text-[10px] text-muted-foreground">Sistema VIP Seguro</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
