import { useState } from "react";
import { User, Phone, Lock, LogOut, Save, CreditCard, Crown, Shield, Bell, Palette } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Caio");
  const [phone, setPhone] = useState("(11) 99999-0000");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (password && password !== confirmPassword) { toast.error("As senhas não coincidem!"); return; }
    toast.success("✅ Configurações salvas!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-display font-bold text-gradient-gold">⚙️ Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Ajuste suas preferências e dados da conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="glass rounded-2xl p-6" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-cyan-500/20 flex items-center justify-center font-display font-bold text-xl text-primary border-2 border-primary/20">Ψ</div>
            <div>
              <p className="font-display font-bold text-foreground text-base">{name}</p>
              <div className="flex items-center gap-2 mt-0.5"><span className="text-xs trident-glow">🔱</span><span className="text-xs font-display font-bold text-primary">VIP ATIVO</span><span className="text-xs text-muted-foreground">até 21/03/2026</span></div>
            </div>
          </div>
          <div className="space-y-4">
            <div><label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5"><User size={12} /> Nome</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="modal-input" /></div>
            <div><label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5"><Phone size={12} /> WhatsApp</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="modal-input" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5"><Lock size={12} /> Nova Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="modal-input" /></div>
              <div><label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5"><Lock size={12} /> Confirmar</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="modal-input" /></div>
            </div>
            <button onClick={handleSave} className="py-3 px-8 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all flex items-center justify-center gap-2"><Save size={16} /> Salvar Alterações</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* VIP Plan */}
          <div className="glass rounded-2xl p-5" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 30px hsla(43,96%,56%,0.05)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-amber-600/20 flex items-center justify-center"><Crown size={18} className="text-primary" /></div>
              <div><p className="font-display font-bold text-foreground text-sm">🔱 Plano VIP</p><p className="text-[10px] text-muted-foreground">Ativo até 21/03/2026</p></div>
            </div>
            <button onClick={() => toast.success("Redirecionando para pagamento...")} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-amber-600 text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all flex items-center justify-center gap-2">
              <CreditCard size={16} /> Renovar / Pagar VIP
            </button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">Pagamento via PIX com ativação instantânea</p>
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl p-5" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Bell size={16} className="text-muted-foreground" />
              <p className="font-display font-bold text-foreground text-sm">Notificações</p>
            </div>
            <div className="space-y-3">
              {[{ label: "Alertas de operação", desc: "Receba notificações de novas operações" }, { label: "Lembretes de CPA", desc: "Lembrar de CPAs pendentes" }, { label: "Relatórios semanais", desc: "Resumo semanal por email" }].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div><p className="text-sm text-foreground">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                  <div className="w-10 h-5 rounded-full bg-primary/30 relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-primary" /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="glass rounded-2xl p-5" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Shield size={16} className="text-muted-foreground" />
              <p className="font-display font-bold text-foreground text-sm">Segurança</p>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors"><p className="text-sm text-foreground">Autenticação em 2 fatores</p><p className="text-[10px] text-muted-foreground">Proteja sua conta com verificação extra</p></button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors"><p className="text-sm text-foreground">Sessões ativas</p><p className="text-[10px] text-muted-foreground">Gerencie dispositivos conectados</p></button>
            </div>
          </div>

          {/* Logout */}
          <div className="glass rounded-2xl p-5" style={{ border: "1px solid hsla(0,84%,60%,0.1)" }}>
            <button onClick={() => { toast.success("Logout realizado!"); navigate("/login"); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-bold hover:bg-destructive/20 transition-colors border border-destructive/20">
              <LogOut size={16} /> Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
