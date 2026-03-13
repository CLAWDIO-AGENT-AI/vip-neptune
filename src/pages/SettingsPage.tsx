import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-bold text-gradient-gold">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Ajuste suas preferências</p>
      </div>
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <SettingsIcon size={48} className="text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm">Painel de configurações em breve</p>
      </div>
    </div>
  );
}
