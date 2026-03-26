import { useState, useEffect, useRef } from "react";

const ORANGE = "#EE4D2D";
const ORANGE_LIGHT = "#FF6B47";
const DARK = "#1A0A00";
const CARD = "#1E1008";
const SURFACE = "#2A1505";
const MUTED = "#7A4A2A";
const TEXT = "#FFE8D6";
const GREEN = "#22C55E";
const YELLOW = "#F59E0B";
const RED = "#EF4444";

const METRICAS_DEFAULT = {
  impressoes: 0,
  cliques: 0,
  pedidos: 0,
  gasto: 0,
  receita: 0,
  ctr: 0,
  cpc: 0,
  roas: 0,
  conversao: 0,
};

const tips = {
  inicio: [
    {
      fase: "Dia 1–3: Fase de Aprendizado",
      icon: "🔥",
      cor: YELLOW,
      passos: [
        "Lance com orçamento BAIXO: R$10–R$20/dia para o algoritmo aprender",
        "Use lance automático nos primeiros 3 dias — não mexa!",
        "Adicione 15–25 palavras-chave amplas + 5 exatas do produto",
        "Ative apenas 1 anúncio por produto no início",
        "Horário ideal para início: 8h–10h da manhã",
      ],
    },
    {
      fase: "Dia 4–7: Aquecimento",
      icon: "📈",
      cor: ORANGE,
      passos: [
        "Se CTR > 1,5%: aumente orçamento 20%",
        "Se CTR < 0,8%: troque a imagem principal",
        "Analise quais palavras-chave geraram cliques",
        "Pause palavras com 0 cliques após 200 impressões",
        "Comece a ajustar lances manualmente nas top keywords",
      ],
    },
    {
      fase: "Dia 7–14: Otimização Inicial",
      icon: "⚡",
      cor: GREEN,
      passos: [
        "Aumento de orçamento de 30–50% se ROAS > 3x",
        "Negative keywords: pause termos irrelevantes",
        "Duplique o anúncio que performou melhor",
        "Teste novos ângulos de imagem (produto isolado vs. em uso)",
        "Meta de CPC ideal: 2–5% do preço do produto",
      ],
    },
  ],
  escala: [
    {
      fase: "Escala Horizontal",
      icon: "🚀",
      cor: GREEN,
      passos: [
        "Crie campanhas separadas: Marca | Categoria | Competidor",
        "Lance para novos segmentos de público-alvo",
        "Adicione variações do produto com anúncios próprios",
        "Expanda para palavras-chave de cauda longa",
        "Teste anúncios Discovery para alcance",
      ],
    },
    {
      fase: "Escala Vertical (Budget)",
      icon: "💰",
      cor: ORANGE,
      passos: [
        "Regra dos 20%: aumente orçamento no máximo 20% a cada 3 dias",
        "Se ROAS cair após aumento, volte ao budget anterior",
        "Orçamento mínimo viável para escala: R$50/dia",
        "Distribua budget: 70% top performers / 30% testes",
        "Monitore custo por pedido — deve cair com escala",
      ],
    },
    {
      fase: "Automação Avançada",
      icon: "🤖",
      cor: "#8B5CF6",
      passos: [
        "Configure regras automáticas: pause se CPC > R$X",
        "Ative aumento automático em horários de pico",
        "Use lances inteligentes para maximizar conversões",
        "Sincronize campanhas com promoções da loja",
        "Relatório semanal: compare semana vs. semana",
      ],
    },
  ],
};

function animateNumber(start, end, duration, callback) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    callback(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function MetricCard({ label, value, format, trend, color, icon, delay }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
      animateNumber(0, value, 1200, setDisplayValue);
    }, delay);
  }, [value, delay]);
  const formatted = () => {
    if (format === "currency") return `R$${displayValue.toFixed(2).replace(".", ",")}`;
    if (format === "percent") return `${displayValue.toFixed(2).replace(".", ",")}%`;
    if (format === "integer") return Math.round(displayValue).toLocaleString("pt-BR");
    if (format === "decimal") return `R$${displayValue.toFixed(2).replace(".", ",")}`;
    return displayValue.toFixed(2);
  };
  return (
    <div style={{ background: CARD, border: `1px solid ${color}33`, borderRadius: 16, padding: "14px 16px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(.16,1,.3,1)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at top right, ${color}22, transparent 70%)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace" }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginTop: 6, fontFamily: "monospace" }}>{formatted()}</div>
      {trend !== undefined && (
        <div style={{ fontSize: 11, color: trend > 0 ? GREEN : RED, marginTop: 4 }}>
          {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs. ontem
        </div>
      )}
    </div>
  );
}

function HealthBar({ label, value, max, color }) {
  const [width, setWidth] = useState(0);
  const numericValue = parseFloat(String(value).replace("x", "").replace("%", "").replace("R$", "").replace(",", ".")) || 0;
  useEffect(() => { setTimeout(() => setWidth(Math.min((numericValue / max) * 100, 100)), 300); }, [numericValue, max]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: TEXT }}>{label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ background: SURFACE, borderRadius: 999, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 999, transition: "width 1.2s cubic-bezier(.16,1,.3,1)" }} />
      </div>
    </div>
  );
}

function TipCard({ tip, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ background: CARD, border: `1px solid ${tip.cor}44`, borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 22 }}>{tip.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: tip.cor, flex: 1 }}>{tip.fase}</span>
        <span style={{ color: MUTED, fontSize: 16 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {tip.passos.map((passo, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: `${tip.cor}22`, border: `1px solid ${tip.cor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: tip.cor, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <span style={{ fontSize: 12.5, color: TEXT, lineHeight: 1.6 }}>{passo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AIPanel({ metricas }) {
  const [pergunta, setPergunta] = useState("");
  const [conversa, setConversa] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shopee_chat") || "[]"); } catch { return []; }
  });
  const [carregando, setCarregando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("shopee_chat", JSON.stringify(conversa.slice(-30)));
  }, [conversa]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversa, carregando]);

  const enviarPergunta = async () => {
    if (!pergunta.trim()) return;
    const novaPergunta = pergunta.trim();
    setPergunta("");
    const novaConversa = [...conversa, { tipo: "user", texto: novaPergunta }];
    setConversa(novaConversa);
    setCarregando(true);
    try {
      const msgs = novaConversa.map(m => ({ role: m.tipo === "user" ? "user" : "assistant", content: m.texto }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Você é um especialista em Shopee Ads e performance de vendas no marketplace Shopee Brasil.
Responda de forma direta, prática e com exemplos numéricos quando possível.
Use emojis para deixar mais visual. Sempre foque em ações concretas que o vendedor pode tomar agora.
Métricas atuais do vendedor: Impressões: ${metricas.impressoes}, Cliques: ${metricas.cliques}, CTR: ${metricas.ctr}%, ROAS: ${metricas.roas}x, CPC: R$${metricas.cpc}, Conversão: ${metricas.conversao}%, Gasto: R$${metricas.gasto}, Receita: R$${metricas.receita}, Pedidos: ${metricas.pedidos}.
Formate com tópicos quando houver mais de uma dica.`,
          messages: msgs,
        }),
      });
      const data = await res.json();
      const resposta = data.content?.[0]?.text || "Não consegui responder agora.";
      setConversa(prev => [...prev, { tipo: "ai", texto: resposta }]);
    } catch {
      setConversa(prev => [...prev, { tipo: "ai", texto: "❌ Erro ao conectar. Verifique sua internet." }]);
    } finally {
      setCarregando(false);
    }
  };

  const limparChat = () => {
    if (window.confirm("Limpar histórico do chat?")) {
      setConversa([]);
      localStorage.removeItem("shopee_chat");
    }
  };

  const sugestoes = ["Meu CTR caiu hoje, o que fazer?", "Como escalar com meu ROAS atual?", "Melhor horário para aumentar budget?", "Quanto devo gastar por produto?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {conversa.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button onClick={limparChat} style={{ background: "none", border: `1px solid ${MUTED}`, borderRadius: 8, padding: "4px 10px", color: MUTED, fontSize: 11, cursor: "pointer" }}>🗑️ Limpar chat</button>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {conversa.length === 0 && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${ORANGE}22, transparent)`, border: `1px solid ${ORANGE}44`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ORANGE, marginBottom: 6 }}>Consultor de Shopee Ads</div>
              <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.6 }}>Tire dúvidas sobre suas campanhas com base nas suas métricas reais.</div>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Sugestões rápidas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sugestoes.map((s, i) => (
                <button key={i} onClick={() => setPergunta(s)} style={{ background: SURFACE, border: `1px solid ${ORANGE}33`, borderRadius: 12, padding: "10px 14px", color: TEXT, fontSize: 12, cursor: "pointer", textAlign: "left" }}>💬 {s}</button>
              ))}
            </div>
          </div>
        )}
        {conversa.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.tipo === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: msg.tipo === "user" ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})` : SURFACE, borderRadius: msg.tipo === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px", padding: "10px 14px", fontSize: 12.5, color: msg.tipo === "user" ? "#fff" : TEXT, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg.texto}</div>
        ))}
        {carregando && (
          <div style={{ alignSelf: "flex-start", background: SURFACE, borderRadius: "4px 16px 16px 16px", padding: "10px 14px", display: "flex", gap: 5 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input value={pergunta} onChange={e => setPergunta(e.target.value)} onKeyDown={e => e.key === "Enter" && enviarPergunta()} placeholder="Pergunte sobre suas campanhas..." style={{ flex: 1, background: SURFACE, border: `1px solid ${ORANGE}44`, borderRadius: 12, padding: "10px 14px", color: TEXT, fontSize: 13, outline: "none" }} />
        <button onClick={enviarPergunta} disabled={carregando || !pergunta.trim()} style={{ background: carregando || !pergunta.trim() ? SURFACE : `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`, border: "none", borderRadius: 12, width: 44, height: 44, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
      </div>
    </div>
  );
}

function MetricasForm({ metricas, onSave }) {
  const [form, setForm] = useState(metricas);
  const campos = [
    { key: "impressoes", label: "Impressões", placeholder: "ex: 45200" },
    { key: "cliques", label: "Cliques", placeholder: "ex: 1356" },
    { key: "pedidos", label: "Pedidos", placeholder: "ex: 47" },
    { key: "gasto", label: "Gasto (R$)", placeholder: "ex: 312.50" },
    { key: "receita", label: "Receita (R$)", placeholder: "ex: 2180.00" },
    { key: "ctr", label: "CTR (%)", placeholder: "ex: 3.0" },
    { key: "cpc", label: "CPC (R$)", placeholder: "ex: 0.23" },
    { key: "roas", label: "ROAS (x)", placeholder: "ex: 6.97" },
    { key: "conversao", label: "Conversão (%)", placeholder: "ex: 3.46" },
  ];

  const calcularAutomatico = () => {
    const gasto = parseFloat(form.gasto) || 0;
    const receita = parseFloat(form.receita) || 0;
    const cliques = parseFloat(form.cliques) || 0;
    const impressoes = parseFloat(form.impressoes) || 0;
    const pedidos = parseFloat(form.pedidos) || 0;
    setForm(prev => ({
      ...prev,
      roas: gasto > 0 ? parseFloat((receita / gasto).toFixed(2)) : 0,
      cpc: cliques > 0 ? parseFloat((gasto / cliques).toFixed(2)) : 0,
      ctr: impressoes > 0 ? parseFloat(((cliques / impressoes) * 100).toFixed(2)) : 0,
      conversao: cliques > 0 ? parseFloat(((pedidos / cliques) * 100).toFixed(2)) : 0,
    }));
  };

  return (
    <div>
      <div style={{ background: `${ORANGE}22`, border: `1px solid ${ORANGE}44`, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.6 }}>
          📝 Digite os dados da sua campanha Shopee. Clique em <strong style={{ color: ORANGE }}>"Calcular Automático"</strong> para gerar CTR, CPC, ROAS e Conversão automaticamente.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {campos.map(c => (
          <div key={c.key}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</div>
            <input
              type="number"
              value={form[c.key]}
              onChange={e => setForm(prev => ({ ...prev, [c.key]: parseFloat(e.target.value) || 0 }))}
              placeholder={c.placeholder}
              style={{ width: "100%", background: SURFACE, border: `1px solid ${ORANGE}33`, borderRadius: 10, padding: "9px 12px", color: TEXT, fontSize: 13, outline: "none" }}
            />
          </div>
        ))}
      </div>
      <button onClick={calcularAutomatico} style={{ width: "100%", background: SURFACE, border: `1px solid ${ORANGE}`, borderRadius: 12, padding: "11px 0", color: ORANGE, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
        🧮 Calcular Automático (CTR, CPC, ROAS, Conversão)
      </button>
      <button onClick={() => onSave(form)} style={{ width: "100%", background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`, border: "none", borderRadius: 12, padding: "13px 0", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
        💾 Salvar Métricas
      </button>
    </div>
  );
}

const ABAS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "editar", label: "Inserir", icon: "✏️" },
  { id: "inicio", label: "Início", icon: "🚀" },
  { id: "escala", label: "Escalar", icon: "📈" },
  { id: "ia", label: "IA", icon: "🤖" },
];

export default function App() {
  const [aba, setAba] = useState("dashboard");
  const [metricas, setMetricas] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shopee_metricas") || "null") || METRICAS_DEFAULT; } catch { return METRICAS_DEFAULT; }
  });
  const [salvou, setSalvou] = useState(false);

  const salvarMetricas = (novas) => {
    setMetricas(novas);
    localStorage.setItem("shopee_metricas", JSON.stringify(novas));
    setSalvou(true);
    setTimeout(() => { setSalvou(false); setAba("dashboard"); }, 1500);
  };

  const diagnostico = () => {
    const msgs = [];
    if (metricas.roas >= 5) msgs.push({ cor: GREEN, texto: `✅ ROAS excelente (${metricas.roas}x) — considere escalar +20% no budget` });
    else if (metricas.roas >= 3) msgs.push({ cor: YELLOW, texto: `⚠️ ROAS bom (${metricas.roas}x) — otimize antes de escalar` });
    else if (metricas.roas > 0) msgs.push({ cor: RED, texto: `❌ ROAS baixo (${metricas.roas}x) — pause e revise segmentação` });
    if (metricas.ctr >= 2) msgs.push({ cor: GREEN, texto: `✅ CTR ótimo (${metricas.ctr}%) — criativo funcionando bem` });
    else if (metricas.ctr >= 1) msgs.push({ cor: YELLOW, texto: `⚠️ CTR mediano (${metricas.ctr}%) — teste novas imagens` });
    else if (metricas.ctr > 0) msgs.push({ cor: RED, texto: `❌ CTR baixo (${metricas.ctr}%) — troque a imagem principal urgente` });
    if (metricas.conversao >= 3) msgs.push({ cor: GREEN, texto: `✅ Conversão boa (${metricas.conversao}%) — página do produto está convertendo` });
    else if (metricas.conversao > 0) msgs.push({ cor: YELLOW, texto: `⚠️ Conversão baixa (${metricas.conversao}%) — melhore fotos e descrição` });
    if (msgs.length === 0) msgs.push({ cor: MUTED, texto: "📝 Insira suas métricas na aba ✏️ Inserir para ver o diagnóstico" });
    return msgs;
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'Segoe UI', system-ui, sans-serif", color: TEXT, maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${ORANGE}44; border-radius: 4px; } @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } } @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } } input::placeholder { color: ${MUTED}; }`}</style>

      {/* HEADER */}
      <div style={{ padding: "16px 20px 14px", background: `linear-gradient(180deg, ${CARD}, transparent)`, borderBottom: `1px solid ${ORANGE}22`, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: `linear-gradie
