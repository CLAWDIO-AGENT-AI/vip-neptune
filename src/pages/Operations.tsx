import { useState, useRef, useCallback, useMemo } from "react";
import {
  Plus, Download, FileSpreadsheet, ChevronDown, Trash2, X, Edit2,
  Share2, MessageCircle, Copy, Eye,
  Upload, Paperclip, CheckSquare, Square, Check, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useApp, Operation, ClientData } from "@/context/AppContext";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

function SparkLine({ data, color }: { data: { v: number; tooltipFormat?: string; label?: string }[]; color: string }) {
  if (data.length < 2) return null;
  return (
    <div className="h-10 w-full mt-2 opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(220 50% 8%)', border: '1px solid hsla(43,96%,56%,0.2)', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
            itemStyle={{ color: color, fontWeight: 'bold' }}
            formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Total"]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.label || ""}
          />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} activeDot={{ r: 4, fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function fireConfetti() {
  const count = 80;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden';
  document.body.appendChild(container);
  const colors = ['#D4AF37', '#00e5ff', '#ff4444', '#44ff44', '#ffaa00', '#ff44ff'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    el.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:-10px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};opacity:1;`;
    const xDrift = (Math.random() - 0.5) * 200;
    const duration = Math.random() * 2000 + 1500;
    const delay = Math.random() * 400;
    el.animate([
      { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 50}px) translateX(${xDrift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration, delay, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });
    container.appendChild(el);
  }
  setTimeout(() => container.remove(), 4000);
}

type Tab = "geral" | "cpa" | "clientes";
type FilterPeriod = "hoje" | "semana" | "mes" | "todas";

function parseDate(d: string): Date {
  const [day, month, year] = d.split("/").map(Number);
  return new Date(year, month - 1, day);
}
function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/* Badge that fits text snugly */
function StatusBadge({ status }: { status: Operation["status"] }) {
  const cls = status === "PAGO" ? "status-paid" : status === "PENDENTE" ? "status-pending" : "status-unpaid";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide leading-tight whitespace-nowrap w-fit ${cls}`}>{status}</span>;
}

function FinalizadoBadge({ finalizado }: { finalizado: boolean }) {
  return finalizado
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 w-fit"><Check size={9} /> Finalizada</span>
    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/20 w-fit"><Clock size={9} /> Pendente</span>;
}

/* ═══ Share Victory Modal ═══ */
function ShareVictoryModal({ op, onClose }: { op: Operation; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 3, useCORS: true });
      const link = document.createElement("a"); link.download = `vitoria-netuno-${op.id}.png`; link.href = canvas.toDataURL("image/png"); link.click();
      toast.success("Imagem baixada!");
    } catch { toast.error("Erro ao gerar imagem."); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md glow-gold animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gradient-gold">🔱 Compartilhar</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div ref={cardRef} className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, hsl(220 50% 8%), hsl(225 67% 3%))", border: "3px solid transparent", borderImage: "linear-gradient(135deg, hsla(43,96%,56%,0.6), hsla(43,96%,56%,0.1), hsla(43,96%,56%,0.6)) 1", boxShadow: "0 0 60px hsla(43,96%,56%,0.15)" }}>
          <div className="relative z-10 p-8 text-center">
            <span className="text-4xl trident-glow">🔱</span>
            <p className="font-display text-xs font-bold text-primary tracking-[0.4em] mt-2 mb-1">VIP NETUNO</p>
            <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />
            <p className="text-xs text-muted-foreground mb-1">{op.platform} • {op.date}</p>
            <p className="text-5xl font-extrabold tracking-tighter text-gradient-profit my-5">+R$ {Math.abs(op.result).toLocaleString("pt-BR")}</p>
            <div className="flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><p className="text-xs text-emerald-400 font-display font-bold tracking-[0.2em]">LUCRO CONFIRMADO</p></div>
          </div>
        </div>
        <button onClick={handleDownload} className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all flex items-center justify-center gap-2"><Download size={16} /> Baixar Imagem</button>
      </div>
    </div>
  );
}

/* ═══ Image Upload ═══ */
function ImageUploadField({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => { onChange(reader.result as string); setShow(true); };
    reader.readAsDataURL(file);
  }, [onChange]);
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items; if (!items) return;
    for (const item of items) { if (item.type.startsWith("image/")) { const f = item.getAsFile(); if (f) handleFile(f); break; } }
  }, [handleFile]);
  return (
    <div onPaste={handlePaste}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      {value ? (
        <div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setShow(!show)} className="flex items-center gap-1.5 text-xs text-primary font-semibold"><Paperclip size={12} /> {show ? "Ocultar" : "Ver"} <ChevronDown size={12} className={`transition-transform ${show ? "rotate-180" : ""}`} /></button>
            <button type="button" onClick={() => { onChange(undefined); setShow(false); }} className="text-xs text-destructive">Remover</button>
          </div>
          {show && <img src={value} alt="" className="w-full h-28 object-cover rounded-lg border border-border mt-2 animate-fade-in" />}
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} className="w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/40 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-xs"><Upload size={14} /> Clique ou Cole (Ctrl+V)</button>
      )}
    </div>
  );
}

/* ═══ R$ Input ═══ */
function MoneyInput({ value, onChange, placeholder = "0.00" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-0 rounded-lg border border-border bg-secondary/30 overflow-hidden focus-within:border-primary/40 transition-colors">
      <span className="px-3 py-2.5 text-xs text-muted-foreground font-bold bg-secondary/50 border-r border-border select-none shrink-0">R$</span>
      <input type="number" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="flex-1 px-3 py-2.5 bg-transparent text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
    </div>
  );
}

function MF({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1.5">{label}</label>{children}</div>;
}

/* ═══ General Operation Modal — NO STATUS (item 3), fixed % text (item 4), field order (item 6) ═══ */
function NewOperationModal({ onClose, onSave, clients, editOp }: { onClose: () => void; onSave: (op: Operation) => void; clients: ClientData[]; editOp?: Operation }) {
  const [client, setClient] = useState(editOp?.clientName || clients[0]?.name || "");
  const [date, setDate] = useState(editOp ? "" : "");
  const [platform, setPlatform] = useState(editOp?.platform || "Betano");
  const [category, setCategory] = useState(editOp?.category || "Missões");
  const [email, setEmail] = useState(editOp?.email || "");
  const [investido, setInvestido] = useState(editOp ? String(editOp.valorInvestido) : "");
  const [final_, setFinal] = useState(editOp ? String(editOp.valorFinal) : "");
  const [pct, setPct] = useState(50);
  const [attachment, setAttachment] = useState<string | undefined>(editOp?.attachment);

  const handleSubmit = () => {
    const inv = parseFloat(investido) || 0; const fin = parseFloat(final_) || 0;
    const dateStr = date ? new Date(date).toLocaleDateString("pt-BR") : (editOp?.date || todayStr());
    const op: Operation = {
      id: editOp?.id || Date.now().toString(), platform, clientName: client, date: dateStr,
      status: "PAGO", // Always PAGO for general ops — no status selection
      result: fin - inv, category, email, valorCPA: 0, valorInvestido: inv, valorFinal: fin,
      attachment, isCPA: false, finalizado: editOp?.finalizado ?? true,
    };
    onSave(op);
    toast.success(editOp ? "✅ Operação atualizada!" : "✅ Operação registrada!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 60px hsla(43,96%,56%,0.08)" }}>
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-lg">⚡</div>
          <div className="flex-1"><h2 className="font-display text-base font-bold text-gradient-gold">{editOp ? "Editar Operação" : "Nova Operação"}</h2><p className="text-[11px] text-muted-foreground">Preencha os dados da operação</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Row 1: Cliente - Data */}
          <div className="grid grid-cols-2 gap-3">
            <MF label="👤 Cliente"><select className="modal-input" value={client} onChange={e => setClient(e.target.value)}>{clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></MF>
            <MF label="📅 Data"><input type="date" className="modal-input" value={date} onChange={e => setDate(e.target.value)} /></MF>
          </div>
          {/* Row 2: Plataforma - Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <MF label="🏢 Plataforma"><select className="modal-input" value={platform} onChange={e => setPlatform(e.target.value)}><option>Betano</option><option>Bet365</option><option>Sportingbet</option><option>KTO</option><option>Pinnacle</option></select></MF>
            <MF label="📂 Categoria"><select className="modal-input" value={category} onChange={e => setCategory(e.target.value)}><option>Missões</option><option>Métodos</option><option>Outro</option></select></MF>
          </div>
          {/* Email optional */}
          <MF label="📧 Email (opcional)"><input type="email" placeholder="email@exemplo.com" className="modal-input" value={email} onChange={e => setEmail(e.target.value)} /></MF>
          {/* Values */}
          <div className="grid grid-cols-2 gap-3">
            <MF label="💰 Valor Investido"><MoneyInput value={investido} onChange={setInvestido} /></MF>
            <MF label="💸 Valor Final"><MoneyInput value={final_} onChange={setFinal} /></MF>
          </div>
          {/* % slider — fixed text (item 4) */}
          <MF label={`📊 % do Cliente`}><input type="range" min="0" max="100" value={pct} onChange={e => setPct(Number(e.target.value))} className="w-full slider-gold" /><p className="text-xs text-muted-foreground mt-1 text-center">{pct}%</p></MF>
          <MF label="📎 Comprovante"><ImageUploadField value={attachment} onChange={setAttachment} /></MF>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-secondary text-muted-foreground font-display font-bold text-sm">Cancelar</button>
            <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all">🔱 {editOp ? "Salvar" : "Registrar"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ CPA Modal ═══ */
function NewCPAModal({ onClose, onSave, clients, editOp }: { onClose: () => void; onSave: (op: Operation) => void; clients: ClientData[]; editOp?: Operation }) {
  const [platform, setPlatform] = useState(editOp?.platform || "Betano");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState(editOp?.email || "");
  const [client, setClient] = useState(editOp?.clientName || "— Nenhum —");
  const [cpaPago, setCpaPago] = useState(editOp?.status === "PAGO");
  const [investido, setInvestido] = useState(editOp ? String(editOp.valorInvestido) : "");
  const [final_, setFinal] = useState(editOp ? String(editOp.valorFinal) : "");
  const [valorCPA, setValorCPA] = useState(editOp ? String(editOp.valorCPA) : "");
  const [pct, setPct] = useState(50);
  const [attachment, setAttachment] = useState<string | undefined>(editOp?.attachment);

  const handleSubmit = () => {
    const inv = parseFloat(investido) || 0; const fin = parseFloat(final_) || 0;
    const dateStr = date ? new Date(date).toLocaleDateString("pt-BR") : (editOp?.date || todayStr());
    const op: Operation = {
      id: editOp?.id || Date.now().toString(), platform, clientName: client === "— Nenhum —" ? "" : client,
      date: dateStr, status: cpaPago ? "PAGO" : "NÃO PAGO", result: fin - inv,
      category: "CPA", email, valorCPA: parseFloat(valorCPA) || 0, valorInvestido: inv, valorFinal: fin,
      attachment, isCPA: true, finalizado: editOp?.finalizado ?? true,
    };
    onSave(op);
    toast.success(editOp ? "✅ CPA atualizado!" : "✅ CPA registrado!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto" style={{ border: "1px solid hsla(43,96%,56%,0.15)", boxShadow: "0 0 60px hsla(43,96%,56%,0.08)" }}>
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-primary/20 flex items-center justify-center text-lg">💎</div>
          <div className="flex-1"><h2 className="font-display text-base font-bold text-gradient-gold">{editOp ? "Editar CPA" : "Novo Registro CPA"}</h2><p className="text-[11px] text-muted-foreground">Controle de afiliados e bônus</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MF label="🏢 Plataforma"><select className="modal-input" value={platform} onChange={e => setPlatform(e.target.value)}><option>Betano</option><option>Bet365</option><option>Sportingbet</option><option>KTO</option><option>Pinnacle</option><option>JogaoBet</option></select></MF>
            <MF label="📅 Data"><input type="date" className="modal-input" value={date} onChange={e => setDate(e.target.value)} /></MF>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MF label="📧 E-mail (opcional)"><input type="email" placeholder="exemplo@email.com" className="modal-input" value={email} onChange={e => setEmail(e.target.value)} /></MF>
            <MF label="👤 Cliente (opcional)">
              <select className="modal-input" value={client} onChange={e => setClient(e.target.value)}>
                <option>— Nenhum —</option>{clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </MF>
          </div>
          <button type="button" onClick={() => setCpaPago(!cpaPago)} className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${cpaPago ? "border-emerald-500/40 bg-emerald-500/5" : "border-destructive/40 bg-destructive/5"}`}>
            <div className="flex items-center gap-2"><span className="text-lg">{cpaPago ? "✅" : "⏳"}</span><div className="text-left"><p className={`text-sm font-bold ${cpaPago ? "text-emerald-400" : "text-destructive"}`}>{cpaPago ? "CPA PAGO" : "CPA NÃO PAGO"}</p><p className="text-[10px] text-muted-foreground">{cpaPago ? "Pagamento confirmado" : "Toque para marcar como pago"}</p></div></div>
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${cpaPago ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"}`}>Alterar</span>
          </button>
          <div className="grid grid-cols-3 gap-3">
            <MF label="💰 Depósito"><MoneyInput value={investido} onChange={setInvestido} /></MF>
            <MF label="💸 Saque"><MoneyInput value={final_} onChange={setFinal} /></MF>
            <MF label="🎁 Valor CPA"><MoneyInput value={valorCPA} onChange={setValorCPA} /></MF>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MF label={`📊 % do Cliente`}><input type="range" min="0" max="100" value={pct} onChange={e => setPct(Number(e.target.value))} className="w-full slider-gold" /><p className="text-xs text-muted-foreground mt-1 text-center">{pct}%</p></MF>
            <MF label="📎 Comprovante"><ImageUploadField value={attachment} onChange={setAttachment} /></MF>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-secondary text-muted-foreground font-display font-bold text-sm">Cancelar</button>
            <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all">🔱 {editOp ? "Salvar" : "Registrar CPA"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ New Client Modal ═══ */
function NewClientModal({ onClose, onSave }: { onClose: () => void; onSave: (c: ClientData) => void }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [pix, setPix] = useState("");
  const handleSubmit = () => {
    if (!name.trim()) { toast.error("Preencha o nome"); return; }
    const initials = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    onSave({ id: Date.now().toString(), name: name.trim(), phone: phone.replace(/\D/g, ""), pix: pix.trim(), avatar: initials });
    toast.success("✅ Cliente cadastrado!"); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in" style={{ border: "1px solid hsla(43,96%,56%,0.15)" }}>
        <div className="flex items-center justify-between mb-6"><h2 className="font-display text-lg font-bold text-gradient-gold">👤 Novo Cliente</h2><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button></div>
        <div className="space-y-4">
          <MF label="Nome"><input type="text" placeholder="Nome completo" className="modal-input" value={name} onChange={e => setName(e.target.value)} /></MF>
          <MF label="WhatsApp"><input type="tel" placeholder="(00) 00000-0000" className="modal-input" value={phone} onChange={e => setPhone(useApp().formatPhone(e.target.value))} /></MF>
          <MF label="Chave PIX"><input type="text" placeholder="CPF, Email ou Chave" className="modal-input" value={pix} onChange={e => setPix(e.target.value)} /></MF>
          <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:glow-gold-strong transition-all">🔱 Cadastrar</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Expanded Row Detail (item 7) ═══ */
function ExpandedRow({ op, onToggleFinalizado, onClose }: { op: Operation; onToggleFinalizado: () => void; onClose: () => void }) {
  return (
    <div className="px-4 py-3 bg-secondary/10 border-b border-border animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div><span className="text-muted-foreground">📧 Email:</span> <span className="text-foreground">{op.email || "—"}</span></div>
        <div><span className="text-muted-foreground">📂 Categoria:</span> <span className="text-foreground">{op.category}</span></div>
        <div><span className="text-muted-foreground">💰 Investido:</span> <span className="text-foreground">R$ {op.valorInvestido.toLocaleString("pt-BR")}</span></div>
        <div><span className="text-muted-foreground">💸 V. Final:</span> <span className="text-foreground">R$ {op.valorFinal.toLocaleString("pt-BR")}</span></div>
        {op.isCPA && <div><span className="text-muted-foreground">🎁 Valor CPA:</span> <span className="text-foreground">R$ {op.valorCPA.toLocaleString("pt-BR")}</span></div>}
        {op.isCPA && <div><span className="text-muted-foreground">📋 Status CPA:</span> <StatusBadge status={op.status} /></div>}
        {op.attachment && <div className="col-span-2"><span className="text-muted-foreground">📎 Comprovante:</span><img src={op.attachment} alt="" className="mt-1 h-20 rounded-lg border border-border" /></div>}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button onClick={onToggleFinalizado} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${op.finalizado ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
          {op.finalizado ? <><Clock size={10} /> Marcar Pendente</> : <><Check size={10} /> Marcar Finalizada</>}
        </button>
        <FinalizadoBadge finalizado={op.finalizado} />
        {!op.finalizado && <span className="text-[9px] text-amber-400 italic">Valores não contabilizados</span>}
      </div>
    </div>
  );
}

/* ═══ Desktop Table Row — with expandable (item 7), action buttons, correct columns (items 5,6) ═══ */
function DesktopTableRow({ op, tab, onShare, onEdit, onDelete, selected, onSelect, expanded, onToggleExpand, onToggleFinalizado }: {
  op: Operation; tab: Tab; onShare: (op: Operation) => void; onEdit: (op: Operation) => void; onDelete: (id: string) => void; selected: boolean; onSelect: (id: string) => void; expanded: boolean; onToggleExpand: () => void; onToggleFinalizado: () => void;
}) {
  const isCPA = tab === "cpa";
  // Geral: checkbox | Plataforma | Categoria | Cliente | Data | Investido | Valor Final | Resultado | Ações
  // CPA:   checkbox | Plataforma | Categoria | Cliente | Data | Investido | V. Final | V. CPA | Status | Resultado | Ações
  const geralCols = "grid-cols-[32px_1fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.8fr_90px]";
  const cpaCols = "grid-cols-[32px_1fr_0.6fr_0.7fr_0.6fr_0.6fr_0.6fr_0.6fr_75px_0.8fr_90px]";
  return (
    <>
      <div className={`border-b border-border transition-colors cursor-pointer ${!op.finalizado ? "bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-l-amber-500" : "hover:bg-secondary/20"}`} onClick={onToggleExpand}>
        <div className={`grid items-center gap-2 px-4 py-3 text-sm ${isCPA ? cpaCols : geralCols}`}>
          <button onClick={e => { e.stopPropagation(); onSelect(op.id); }}>{selected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} className="text-muted-foreground" />}</button>
          <span className="font-semibold text-foreground truncate">{op.platform}</span>
          <span className="text-muted-foreground truncate">{isCPA ? op.category : op.category}</span>
          <span className="text-foreground truncate">{op.clientName || "—"}</span>
          <span className="text-muted-foreground flex items-center">{op.date} {!op.finalizado && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-2 inline-block animate-pulse" title="Pendente" />}</span>
          <span className="text-foreground tabular-nums">R$ {op.valorInvestido.toLocaleString("pt-BR")}</span>
          <span className="text-foreground tabular-nums">R$ {op.valorFinal.toLocaleString("pt-BR")}</span>
          {isCPA && <span className="text-foreground tabular-nums">R$ {op.valorCPA.toLocaleString("pt-BR")}</span>}
          {isCPA && <StatusBadge status={op.status} />}
          <span className={`font-bold tabular-nums ${op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>{op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result).toLocaleString("pt-BR")}</span>
          <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
            {op.result > 0 && <button onClick={() => onShare(op)} title="Compartilhar" className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Share2 size={13} /></button>}
            <button onClick={() => onEdit(op)} title="Editar" className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
            <button onClick={() => { onDelete(op.id); toast.success("Excluído!"); }} title="Excluir" className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
          </div>
        </div>
      </div>
      {expanded && <ExpandedRow op={op} onToggleFinalizado={onToggleFinalizado} onClose={onToggleExpand} />}
    </>
  );
}

/* ═══ Mobile Card ═══ */
function MobileCard({ op, onShare, onEdit, onDelete, selected, onSelect, onToggleExpand, expanded, onToggleFinalizado }: {
  op: Operation; onShare: (op: Operation) => void; onEdit: (op: Operation) => void; onDelete: (id: string) => void; selected: boolean; onSelect: (id: string) => void; onToggleExpand: () => void; expanded: boolean; onToggleFinalizado: () => void;
}) {
  return (
    <div className={`glass rounded-xl overflow-hidden mb-2 hover:glow-gold transition-all ${!op.finalizado ? "opacity-60" : ""}`}>
      <div className="p-4 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={e => { e.stopPropagation(); onSelect(op.id); }} className="shrink-0">{selected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} className="text-muted-foreground" />}</button>
            <div className="min-w-0"><p className="text-sm font-semibold">{op.platform}</p><p className="text-xs text-muted-foreground">{op.clientName || "—"} • {op.date}</p></div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {op.isCPA && <StatusBadge status={op.status} />}
            <span className={`text-base font-bold ${op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>{op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result).toLocaleString("pt-BR")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-2" onClick={e => e.stopPropagation()}>
          {op.result > 0 && <button onClick={() => onShare(op)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold"><Share2 size={11} /> Compartilhar</button>}
          <button onClick={() => onEdit(op)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary text-muted-foreground text-[10px] font-semibold hover:text-foreground"><Edit2 size={11} /> Editar</button>
          <button onClick={() => { onDelete(op.id); toast.success("Excluído!"); }} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-[10px] font-semibold ml-auto"><Trash2 size={11} /></button>
        </div>
      </div>
      {expanded && <ExpandedRow op={op} onToggleFinalizado={onToggleFinalizado} onClose={onToggleExpand} />}
    </div>
  );
}

/* ═══ Client Card ═══ */
function ClientCard({ client, operations }: { client: ClientData; operations: Operation[] }) {
  const [showHist, setShowHist] = useState(false);
  const ops = operations.filter(op => op.clientName === client.name);
  const profit = ops.filter(o => o.result > 0 && o.finalizado).reduce((s, o) => s + o.result, 0);
  const loss = ops.filter(o => o.result < 0 && o.finalizado).reduce((s, o) => s + Math.abs(o.result), 0);
  const net = profit - loss;
  const copyPix = async () => { try { await navigator.clipboard.writeText(client.pix); toast.success("PIX copiado!"); } catch { } };
  return (
    <>
      <div className="glass rounded-2xl p-5 hover:glow-gold transition-all cursor-pointer group" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }} onClick={() => setShowHist(true)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-cyan-500/20 flex items-center justify-center font-display font-bold text-base text-primary border border-primary/20">{client.avatar}</div>
          <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{client.name}</p><p className="text-[10px] text-muted-foreground truncate">🔑 {client.pix || "—"}</p></div>
          <Eye size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-secondary/50 rounded-lg p-2 text-center"><p className="text-[9px] text-muted-foreground uppercase font-semibold">Lucro</p><p className="text-sm font-bold text-gradient-profit">+R$ {profit.toLocaleString("pt-BR")}</p></div>
          <div className="bg-secondary/50 rounded-lg p-2 text-center"><p className="text-[9px] text-muted-foreground uppercase font-semibold">Prejuízo</p><p className="text-sm font-bold text-gradient-loss">-R$ {loss.toLocaleString("pt-BR")}</p></div>
          <div className="bg-secondary/50 rounded-lg p-2 text-center"><p className="text-[9px] text-muted-foreground uppercase font-semibold">Resultado</p><p className={`text-sm font-bold ${net >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>{net >= 0 ? "+" : ""}R$ {Math.abs(net).toLocaleString("pt-BR")}</p></div>
        </div>
        <div className="flex gap-2">
          {client.phone && <a href={`https://wa.me/${client.phone}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20"><MessageCircle size={13} /> WhatsApp</a>}
          {client.pix && <button onClick={e => { e.stopPropagation(); copyPix(); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20"><Copy size={13} /> PIX</button>}
        </div>
      </div>
      {showHist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowHist(false)} />
          <div className="relative glass-strong rounded-2xl p-6 w-full max-w-lg animate-scale-in max-h-[85vh] overflow-y-auto" style={{ border: "1px solid hsla(43,96%,56%,0.15)" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-sm text-primary">{client.avatar}</div><div><h2 className="font-display text-base font-bold text-gradient-gold">{client.name}</h2><p className="text-xs text-muted-foreground">{ops.length} ops</p></div></div>
              <button onClick={() => setShowHist(false)} className="p-1.5 rounded-lg hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
            </div>
            {ops.length === 0 ? <p className="text-muted-foreground text-sm text-center py-8">Nenhuma operação.</p> : (
              <div className="space-y-2">{ops.map(op => (
                <div key={op.id} className="glass rounded-xl p-4 flex items-center justify-between" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
                  <div><p className="text-sm font-semibold">{op.platform}</p><p className="text-xs text-muted-foreground">{op.date}</p></div>
                  <div className="flex items-center gap-3"><FinalizadoBadge finalizado={op.finalizado} /><span className={`font-bold text-sm ${op.result >= 0 ? "text-gradient-profit" : "text-gradient-loss"}`}>{op.result >= 0 ? "+" : ""}R$ {Math.abs(op.result).toLocaleString("pt-BR")}</span></div>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function Operations() {
  const { operations, clients, addOperation, updateOperation, deleteOperations, addClient } = useApp();
  const [tab, setTab] = useState<Tab>("geral");
  const [filter, setFilter] = useState<FilterPeriod>("todas");
  const [showNewOp, setShowNewOp] = useState(false);
  const [showNewCPA, setShowNewCPA] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [shareOp, setShareOp] = useState<Operation | null>(null);
  const [editOp, setEditOp] = useState<Operation | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs: { key: Tab; label: string }[] = [{ key: "geral", label: "📊 Geral" }, { key: "cpa", label: "💎 CPA" }, { key: "clientes", label: "👤 Clientes" }];
  const filterLabels: { key: FilterPeriod; label: string }[] = [{ key: "hoje", label: "Hoje" }, { key: "semana", label: "Semana" }, { key: "mes", label: "Mês" }, { key: "todas", label: "Todas" }];

  const today = new Date();
  const filteredOps = operations.filter(op => {
    if (tab === "cpa" && !op.isCPA) return false;
    if (tab === "geral" && op.isCPA) return false;
    if (filter === "todas") return true;
    const opDate = parseDate(op.date);
    if (filter === "hoje") return opDate.toDateString() === today.toDateString();
    if (filter === "semana") { const w = new Date(today); w.setDate(today.getDate() - 7); return opDate >= w && opDate <= today; }
    if (filter === "mes") return opDate.getMonth() === today.getMonth() && opDate.getFullYear() === today.getFullYear();
    return true;
  });

  // Only count finalizado ops in totals (item 7)
  const finOps = filteredOps.filter(o => o.finalizado);
  const totI = finOps.reduce((s, o) => s + o.valorInvestido, 0);
  const totF = finOps.reduce((s, o) => s + o.valorFinal, 0);
  const totR = finOps.reduce((s, o) => s + o.result, 0);

  const sparkData = useMemo(() => {
    const iPts: { v: number; label: string }[] = []; const fPts: { v: number; label: string }[] = []; const rPts: { v: number; label: string }[] = [];
    const cpPts: { v: number; label: string }[] = []; // For CPA
    let cumI = 0, cumF = 0, cumCpa = 0;
    [...finOps].reverse().forEach(op => {
      cumI += op.valorInvestido; cumF += op.valorFinal;
      if (op.isCPA) cumCpa += op.valorCPA;

      iPts.push({ v: cumI, label: op.date }); fPts.push({ v: cumF, label: op.date }); rPts.push({ v: cumF - cumI, label: op.date });
      if (op.isCPA) cpPts.push({ v: cumCpa, label: op.date });
    });
    return { iPts, fPts, rPts, cpPts };
  }, [finOps]);

  const handleAddOp = (op: Operation) => { addOperation(op); if (op.result > 100 && op.finalizado) setTimeout(fireConfetti, 300); };
  const handleNew = () => { if (tab === "clientes") setShowNewClient(true); else if (tab === "cpa") setShowNewCPA(true); else setShowNewOp(true); };
  const toggleS = (id: string) => setSelectedIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelectedIds(selectedIds.size === filteredOps.length ? new Set() : new Set(filteredOps.map(o => o.id)));
  const bulkDel = () => { if (selectedIds.size === 0) return; deleteOperations(Array.from(selectedIds)); setSelectedIds(new Set()); };
  const singleDel = (id: string) => { deleteOperations([id]); setSelectedIds(p => { const n = new Set(p); n.delete(id); return n; }); };
  const handleEdit = (op: Operation) => setEditOp(op);
  const handleSaveEdit = (op: Operation) => { updateOperation(op); setEditOp(null); };
  const toggleFinalizado = (op: Operation) => { updateOperation({ ...op, finalizado: !op.finalizado }); };
  const isCPA = tab === "cpa";

  const geralHeader = "grid-cols-[32px_1fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.8fr_90px]";
  const cpaHeader = "grid-cols-[32px_1fr_0.6fr_0.7fr_0.6fr_0.6fr_0.6fr_0.6fr_75px_0.8fr_90px]";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-xl font-display font-bold text-gradient-gold">Operações</h1><p className="text-sm text-muted-foreground mt-1">Gerencie suas operações</p></div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.size > 0 && <button onClick={bulkDel} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20"><Trash2 size={14} /> Excluir ({selectedIds.size})</button>}
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-secondary text-muted-foreground text-xs font-semibold"><FileSpreadsheet size={14} /> Planilha</button>
          <button onClick={handleNew} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold font-display hover:glow-gold-strong transition-all"><Plus size={14} /> {tab === "clientes" ? "Novo Cliente" : isCPA ? "Novo CPA" : "Nova Operação"}</button>
        </div>
      </div>

      {tab === "cpa" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { l: "Investido", v: totI, g: "text-foreground", sp: sparkData.iPts, sc: "hsl(0,0%,50%)" },
            { l: "Retorno", v: totF, g: "text-gradient-profit", sp: sparkData.fPts, sc: "hsl(187,100%,50%)" },
            { l: "Valor CPA Total", v: finOps.filter(o => o.isCPA).reduce((s, o) => s + o.valorCPA, 0), g: "text-emerald-400", sp: sparkData.cpPts, sc: "hsl(142,71%,45%)" },
            { l: "Resultado", v: totR, g: "text-gradient-gold", sp: sparkData.rPts, sc: "hsl(43,96%,56%)" }
          ].map(c => (
            <div key={c.l} className="glass rounded-xl p-4 overflow-hidden"><span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{c.l}</span><p className={`text-xl md:text-2xl font-bold tracking-tighter ${c.g}`}>R$ {c.v.toLocaleString("pt-BR")}</p><SparkLine data={c.sp} color={c.sc} /></div>
          ))}
        </div>
      )}

      {tab === "geral" && (
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[{ l: "Investido", v: totI, g: "text-gradient-loss", sp: sparkData.iPts, sc: "hsl(0,84%,60%)" }, { l: "Retorno", v: totF, g: "text-gradient-profit", sp: sparkData.fPts, sc: "hsl(187,100%,50%)" }, { l: "Resultado", v: totR, g: "text-gradient-gold", sp: sparkData.rPts, sc: "hsl(43,96%,56%)" }].map(c => (
            <div key={c.l} className="glass rounded-xl p-4 overflow-hidden"><span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{c.l}</span><p className={`text-xl md:text-2xl font-bold tracking-tighter ${c.g}`}>R$ {c.v.toLocaleString("pt-BR")}</p><SparkLine data={c.sp} color={c.sc} /></div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {tabs.map(t => <button key={t.key} onClick={() => { setTab(t.key); setSelectedIds(new Set()); setExpandedId(null); }} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${tab === t.key ? "bg-primary/20 text-primary glow-gold" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>)}
        </div>
        {tab !== "clientes" && (
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            {filterLabels.map(f => <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-semibold transition-all ${filter === f.key ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{f.label}</button>)}
          </div>
        )}
      </div>

      {tab === "clientes" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{clients.map(c => <ClientCard key={c.id} client={c} operations={operations} />)}</div>
      ) : (
        <>
          {filteredOps.length > 0 && (
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
              <button onClick={toggleAll} className="flex items-center gap-1.5 hover:text-foreground">{selectedIds.size === filteredOps.length && filteredOps.length > 0 ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />} Selecionar todas</button>
              {selectedIds.size > 0 && <span className="text-primary font-semibold">{selectedIds.size} selecionada(s)</span>}
            </div>
          )}
          <div className="hidden md:block glass rounded-xl overflow-x-auto" style={{ border: "1px solid hsla(0,0%,100%,0.05)" }}>
            <div className="min-w-[900px]">
              <div className={`grid items-center gap-2 px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-secondary/30 ${isCPA ? cpaHeader : geralHeader}`}>
                <span></span>
                <span>Plataforma</span>
                <span>Categoria</span>
                <span>Cliente</span>
                <span>Data</span>
                <span>Investido</span>
                <span>V. Final</span>
                {isCPA && <span>V. CPA</span>}
                {isCPA && <span>Status</span>}
                <span>Resultado</span>
                <span>Ações</span>
              </div>
              {filteredOps.map(op => <DesktopTableRow key={op.id} op={op} tab={tab} onShare={setShareOp} onEdit={handleEdit} onDelete={singleDel} selected={selectedIds.has(op.id)} onSelect={toggleS} expanded={expandedId === op.id} onToggleExpand={() => setExpandedId(expandedId === op.id ? null : op.id)} onToggleFinalizado={() => toggleFinalizado(op)} />)}
              {filteredOps.length === 0 && <div className="px-4 py-12 text-center text-muted-foreground text-sm">{operations.length === 0 ? "Nenhuma operação. Clique em \"Nova Operação\" para começar." : "Nenhuma operação para este filtro."}</div>}
            </div>
          </div>
          {/* Mobile */}
          <div className="md:hidden space-y-2">
            {filteredOps.map(op => <MobileCard key={op.id} op={op} onShare={setShareOp} onEdit={handleEdit} onDelete={singleDel} selected={selectedIds.has(op.id)} onSelect={toggleS} expanded={expandedId === op.id} onToggleExpand={() => setExpandedId(expandedId === op.id ? null : op.id)} onToggleFinalizado={() => toggleFinalizado(op)} />)}
            {filteredOps.length === 0 && <div className="glass rounded-xl px-4 py-12 text-center text-muted-foreground text-sm">{operations.length === 0 ? "Nenhuma operação." : "Nenhuma operação para este filtro."}</div>}
          </div>
        </>
      )}

      {showNewOp && <NewOperationModal onClose={() => setShowNewOp(false)} onSave={handleAddOp} clients={clients} />}
      {showNewCPA && <NewCPAModal onClose={() => setShowNewCPA(false)} onSave={handleAddOp} clients={clients} />}
      {showNewClient && <NewClientModal onClose={() => setShowNewClient(false)} onSave={addClient} />}
      {editOp && (editOp.isCPA
        ? <NewCPAModal onClose={() => setEditOp(null)} onSave={handleSaveEdit} clients={clients} editOp={editOp} />
        : <NewOperationModal onClose={() => setEditOp(null)} onSave={handleSaveEdit} clients={clients} editOp={editOp} />
      )}
      {shareOp && <ShareVictoryModal op={shareOp} onClose={() => setShareOp(null)} />}
    </div>
  );
}
