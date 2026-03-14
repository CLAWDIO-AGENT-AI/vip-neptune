import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

export interface Operation { id: string; platform: string; clientName: string; date: string; status: "PAGO" | "PENDENTE" | "NÃO PAGO"; result: number; category: string; email: string; valorCPA: number; valorInvestido: number; valorFinal: number; attachment?: string; isCPA?: boolean; finalizado: boolean; }
export interface ClientData { id: string; name: string; phone: string; pix: string; avatar: string; email?: string; }
export interface HistoryEntry { id: string; type: "operacao" | "cpa" | "cliente" | "delete" | "edit"; action: string; detail: string; date: string; result?: number; }
export interface AuthUser { id: string; name: string; user: string; pass: string; role: "admin" | "member"; avatar: string; createdAt: string; vipDaysRemaining: number; }
export interface PendingRequest { id: string; name: string; user: string; pass: string; phone: string; date: string; status: "pending"; }
export interface UsefulLink { id: string; title: string; url: string; icon: string; description: string; }

interface AppContextType {
    operations: Operation[]; clients: ClientData[]; history: HistoryEntry[]; links: UsefulLink[];
    addOperation: (op: Operation) => void; updateOperation: (op: Operation) => void; deleteOperations: (ids: string[]) => void; addClient: (c: ClientData) => void;
    addLink: (link: UsefulLink) => void; updateLink: (link: UsefulLink) => void; deleteLink: (id: string) => void;
    // Auth & Admin
    currentUser: AuthUser | null;
    isLoggedIn: boolean; isAdmin: boolean;
    login: (user: string, pass: string) => boolean; logout: () => void;
    requestAccess: (req: Omit<PendingRequest, "id" | "date" | "status">) => boolean;
    pendingRequests: PendingRequest[];
    users: AuthUser[];
    approveUser: (id: string) => void; rejectUser: (id: string, removeUser?: boolean) => void; updateVipDays: (id: string, days: number) => void;
    formatPhone: (value: string) => string;
}

const STORAGE_KEYS = { ops: "vn_operations", clients: "vn_clients", history: "vn_history", currentUser: "vn_current_user", users: "vn_users", pending: "vn_pending", links: "vn_links" };
function loadJSON<T>(key: string, fallback: T): T { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; } }

const TEST_ADMIN: AuthUser = { id: "admin-0", name: "Caio", user: "admin", pass: "netuno2026", role: "admin", avatar: "Ψ", createdAt: new Date().toISOString(), vipDaysRemaining: 999 };
const defaultClients: ClientData[] = [{ id: "0", name: "Eu", phone: "", pix: "", avatar: "EU" }];
const defaultLinks: UsefulLink[] = [{ id: "link-1", title: "Calculadora Deduthing", url: "https://deduthing.com/calculadora", icon: "🧮", description: "Calculadora segura sugerida." }];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [operations, setOperations] = useState<Operation[]>(() => loadJSON(STORAGE_KEYS.ops, []));
    const [clients, setClients] = useState<ClientData[]>(() => loadJSON(STORAGE_KEYS.clients, defaultClients));
    const [history, setHistory] = useState<HistoryEntry[]>(() => loadJSON(STORAGE_KEYS.history, []));

    // Auth & Global State
    const [users, setUsers] = useState<AuthUser[]>(() => loadJSON(STORAGE_KEYS.users, [TEST_ADMIN]));
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(() => loadJSON(STORAGE_KEYS.pending, []));
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => loadJSON(STORAGE_KEYS.currentUser, null));
    const [links, setLinks] = useState<UsefulLink[]>(() => loadJSON(STORAGE_KEYS.links, defaultLinks));

    useEffect(() => { localStorage.setItem(STORAGE_KEYS.ops, JSON.stringify(operations)); }, [operations]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history)); }, [history]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.pending, JSON.stringify(pendingRequests)); }, [pendingRequests]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser)); }, [currentUser]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links)); }, [links]);

    const formatPhone = useCallback((value: string) => {
        const v = value.replace(/\D/g, "");
        if (v.length <= 2) return v ? `(${v}` : "";
        if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
        return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
    }, []);

    const login = useCallback((u: string, p: string) => {
        const found = users.find(x => x.user === u && x.pass === p);
        if (found) { setCurrentUser(found); return true; }
        return false;
    }, [users]);

    const logout = useCallback(() => setCurrentUser(null), []);

    const requestAccess = useCallback((req: Omit<PendingRequest, "id" | "date" | "status">) => {
        if (users.some(u => u.user === req.user) || pendingRequests.some(p => p.user === req.user)) return false;
        setPendingRequests(prev => [...prev, { ...req, id: Date.now().toString(), date: new Date().toLocaleDateString("pt-BR"), status: "pending" }]);
        return true;
    }, [users, pendingRequests]);

    const approveUser = useCallback((id: string) => {
        setPendingRequests(prev => {
            const req = prev.find(p => p.id === id);
            if (req) {
                const initials = req.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
                const newUser: AuthUser = { id: req.id, name: req.name, user: req.user, pass: req.pass, role: "member", avatar: initials, createdAt: new Date().toISOString(), vipDaysRemaining: 30 };
                setUsers(u => [...u, newUser]);
            }
            return prev.filter(p => p.id !== id);
        });
    }, []);

    const rejectUser = useCallback((id: string, removeUser = false) => {
        if (removeUser) setUsers(prev => prev.filter(u => u.id !== id && u.role !== "admin"));
        else setPendingRequests(prev => prev.filter(p => p.id !== id));
    }, []);

    const updateVipDays = useCallback((id: string, days: number) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, vipDaysRemaining: days } : u));
    }, []);

    const addOperation = useCallback((op: Operation) => { setOperations(prev => [op, ...prev]); }, []);
    const updateOperation = useCallback((op: Operation) => { setOperations(prev => prev.map(o => o.id === op.id ? op : o)); }, []);
    const deleteOperations = useCallback((ids: string[]) => { setOperations(prev => prev.filter(o => !ids.includes(o.id))); }, []);
    const addClient = useCallback((c: ClientData) => { setClients(prev => [...prev, c]); }, []);

    const addLink = useCallback((link: UsefulLink) => setLinks(prev => [...prev, link]), []);
    const updateLink = useCallback((link: UsefulLink) => setLinks(prev => prev.map(l => l.id === link.id ? link : l)), []);
    const deleteLink = useCallback((id: string) => setLinks(prev => prev.filter(l => l.id !== id)), []);

    return (
        <AppContext.Provider value={{
            operations, clients, history, links, addOperation, updateOperation, deleteOperations, addClient,
            addLink, updateLink, deleteLink,
            currentUser, isLoggedIn: !!currentUser, isAdmin: currentUser?.role === "admin",
            login, logout, requestAccess, pendingRequests, users, approveUser, rejectUser, updateVipDays, formatPhone
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() { const ctx = useContext(AppContext); if (!ctx) throw new Error("error"); return ctx; }
