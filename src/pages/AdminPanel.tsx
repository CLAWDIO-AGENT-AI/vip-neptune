import { useApp } from "@/context/AppContext";
import { Check, X, ShieldAlert, Users, Trash2, CalendarDays, Phone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminPanel() {
    const { users, pendingRequests, approveUser, rejectUser, updateVipDays, links, addLink, deleteLink } = useApp();
    const [tab, setTab] = useState<"membros" | "pendentes" | "links">("pendentes");
    const [newLink, setNewLink] = useState({ title: "", url: "", icon: "🔗", description: "" });

    // Filter out admin
    const members = users.filter(u => u.role !== "admin");

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-display font-bold text-gradient-gold">Gestão de Membros</h1>
                    <p className="text-sm text-muted-foreground mt-1">Aprove ou remova acessos ao grupo VIP</p>
                </div>
            </div>

            <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 w-fit">
                <button onClick={() => setTab("pendentes")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === "pendentes" ? "bg-primary/20 text-primary glow-gold" : "text-muted-foreground hover:text-foreground"}`}>
                    Solicitações {pendingRequests.length > 0 && <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[10px]">{pendingRequests.length}</span>}
                </button>
                <button onClick={() => setTab("membros")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === "membros" ? "bg-primary/20 text-primary glow-gold" : "text-muted-foreground hover:text-foreground"}`}>
                    <Users size={16} /> Membros Ativos
                </button>
            </div>

            {tab === "pendentes" && (
                <div className="glass rounded-xl overflow-hidden" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
                    <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2 text-amber-400">
                        <ShieldAlert size={16} /> <span className="font-semibold text-sm">Aprovações Pendentes</span>
                    </div>
                    {pendingRequests.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">Nenhuma solicitação no momento.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            {pendingRequests.map(req => (
                                <div key={req.id} className="bg-secondary/30 border border-border rounded-xl p-4 flex flex-col gap-4">
                                    <div>
                                        <h3 className="font-bold text-foreground text-lg">{req.name}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                            <p><span className="font-semibold">User:</span> {req.user}</p>
                                            <p className="flex items-center gap-1"><Phone size={10} /> {req.phone}</p>
                                            <p className="flex items-center gap-1"><CalendarDays size={10} /> {req.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-auto">
                                        <button onClick={() => { rejectUser(req.id); toast.success("Solicitação rejeitada"); }} className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-all flex items-center justify-center gap-1"><X size={14} /> Rejeitar</button>
                                        <button onClick={() => { approveUser(req.id); toast.success("Acesso liberado!"); }} className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center justify-center gap-1"><Check size={14} /> Aprovar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === "membros" && (
                <div className="glass rounded-xl overflow-hidden" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
                    <div className="grid items-center gap-2 px-4 py-3 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-secondary/30 grid-cols-[1fr_minmax(120px,1fr)_100px_100px_80px]">
                        <span>Membro</span>
                        <span>Usuário (Login)</span>
                        <span>Acesso</span>
                        <span>Dias VIP</span>
                        <span>Ações</span>
                    </div>
                    {members.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground text-sm">Nenhum membro ativo.</div>
                    ) : (
                        <div>
                            {members.map(member => (
                                <div key={member.id} className="grid items-center gap-2 px-4 py-3 border-b border-border text-xs md:text-sm grid-cols-[1fr_minmax(120px,1fr)_100px_100px_80px] hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">{member.avatar}</div>
                                        <span className="font-semibold text-foreground truncate">{member.name}</span>
                                    </div>
                                    <span className="text-muted-foreground truncate">{member.user}</span>
                                    <span className="text-muted-foreground">{new Date(member.createdAt).toLocaleDateString("pt-BR")}</span>
                                    <div className="flex items-center gap-1 opacity-80">
                                        <span className="font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg text-xs border border-amber-500/20">{member.vipDaysRemaining ?? 30} dias</span>
                                    </div>
                                    <button onClick={() => { if (confirm(`Remover acesso de ${member.name}?`)) { rejectUser(member.id, true); toast.success("Acesso removido."); } }} className="p-2 rounded-lg justify-self-start hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
