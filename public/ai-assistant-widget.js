/**
 * AI 营销小助手 - 悬浮球组件
 * 适配现有网站，可嵌入任意页面
 * 界面语言与系统语言一致，AI 按提问者语言回复
 * 用法：<script src="/ai-assistant-widget.js"></script>
 * 可选：data-api 属性指定后端地址，默认走同源代理
 */
(function () {
  const script = document.currentScript;
  const API_BASE = window.__AI_ASSISTANT_API__ || script?.getAttribute("data-api") || "";

  // 从系统语言获取 locale（与 LocaleProvider 一致）
  function getLocale() {
    try {
      const lang = (document.documentElement.lang || "").toLowerCase();
      if (lang.startsWith("zh")) return "zh";
      if (lang === "ja" || lang.startsWith("ja")) return "ja";
      const m = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
      const v = m ? m[2] : "";
      if (v === "zh" || v === "ja" || v === "en") return v;
    } catch (_) {}
    return "en";
  }

  const TEXTS = {
    zh: {
      title: "Flyingnets AI 助手",
      ariaLabel: "AI 助手",
      placeholder: "输入您的问题...",
      send: "发送",
      welcome: "您好，我是 Flyingnets 销售顾问。请问有什么可以帮您？如需安排在线会议深入沟通，请直接告诉我。",
      limitReached: "今日 AI 使用已达上限，请明日再试。如需紧急咨询请联系人工客服。",
      errorGeneric: "暂无法回复，请稍后联系人工客服。",
      errorNetwork: "网络错误，请检查 AI 助手服务是否已启动。",
    },
    en: {
      title: "Flyingnets AI Assistant",
      ariaLabel: "AI Assistant",
      placeholder: "Type your question...",
      send: "Send",
      welcome: "Hello, I'm a Flyingnets sales consultant. How can I help you? If you'd like to schedule an online meeting, just let me know.",
      limitReached: "Daily AI usage limit reached. Please try again tomorrow or contact our team for urgent inquiries.",
      errorGeneric: "Unable to respond. Please contact our team later.",
      errorNetwork: "Network error. Please check if the AI assistant service is running.",
    },
    ja: {
      title: "Flyingnets AI アシスタント",
      ariaLabel: "AI アシスタント",
      placeholder: "ご質問を入力...",
      send: "送信",
      welcome: "こんにちは、Flyingnets の営業担当です。どのようなご用件でしょうか？オンライン会議をご希望の場合はお知らせください。",
      limitReached: "本日の AI 利用上限に達しました。明日再度お試しいただくか、緊急の場合はお問い合わせください。",
      errorGeneric: "応答できません。しばらくしてからお問い合わせください。",
      errorNetwork: "ネットワークエラー。AI アシスタントサービスが起動しているか確認してください。",
    },
  };

  const styles = `
    #ai-widget-ball {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #b8954a 0%, #8b6914 100%);
      color: white;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(184,149,74,0.4);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: transform 0.2s;
      user-select: none;
    }
    #ai-widget-ball:hover { transform: scale(1.05); }
    #ai-widget-ball.dragging { cursor: grabbing; }
    #ai-widget-panel {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 480px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    #ai-widget-panel.open { display: flex; }
    #ai-widget-header {
      padding: 16px;
      background: #1a1a1a;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }
    #ai-widget-close { float: right; cursor: pointer; opacity: 0.8; }
    #ai-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ai-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; }
    .ai-msg.user { align-self: flex-end; background: #b8954a; color: white; }
    .ai-msg.assistant { align-self: flex-start; background: #f5f5f5; color: #333; }
    #ai-widget-input-wrap {
      padding: 12px;
      border-top: 1px solid #eee;
    }
    #ai-widget-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      resize: none;
      min-height: 44px;
      max-height: 120px;
    }
    #ai-widget-send {
      margin-top: 8px;
      width: 100%;
      padding: 10px;
      background: #1a1a1a;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    #ai-widget-send:hover { background: #333; }
    #ai-widget-send:disabled { opacity: 0.6; cursor: not-allowed; }
    @media (max-width: 480px) {
      #ai-widget-panel { right: 12px; bottom: 80px; width: calc(100vw - 24px); }
      #ai-widget-ball { right: 12px; bottom: 16px; }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  let sessionId = "s_" + Math.random().toString(36).slice(2);
  let formContext = null;

  function getFormContext() {
    try {
      const forms = document.querySelectorAll("form");
      for (const f of forms) {
        const data = {};
        ["company", "contact", "phone", "email", "product_interest", "message", "coop_type", "region"].forEach(k => {
          const el = f.querySelector(`[name="${k}"]`);
          if (el && el.value) data[k] = el.value;
        });
        if (Object.keys(data).length) return data;
      }
    } catch (_) {}
    return null;
  }

  function t() {
    return TEXTS[getLocale()] || TEXTS.en;
  }

  const ball = document.createElement("div");
  ball.id = "ai-widget-ball";
  ball.innerHTML = "💬";
  ball.setAttribute("aria-label", t().ariaLabel);

  const panel = document.createElement("div");
  panel.id = "ai-widget-panel";
  function renderPanel() {
    const txt = t();
    panel.innerHTML = `
    <div id="ai-widget-header">
      ${txt.title} <span id="ai-widget-close">✕</span>
    </div>
    <div id="ai-widget-messages"></div>
    <div id="ai-widget-input-wrap">
      <textarea id="ai-widget-input" placeholder="${txt.placeholder}" rows="2"></textarea>
      <button id="ai-widget-send">${txt.send}</button>
    </div>
  `;
  }
  renderPanel();

  document.body.appendChild(ball);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector("#ai-widget-messages");
  const inputEl = panel.querySelector("#ai-widget-input");
  const sendBtn = panel.querySelector("#ai-widget-send");

  function addMsg(role, content) {
    const div = document.createElement("div");
    div.className = "ai-msg " + role;
    div.textContent = content;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  ball.addEventListener("click", () => {
    panel.classList.toggle("open");
    formContext = getFormContext();
    if (panel.classList.contains("open") && messagesEl.children.length === 0) {
      addMsg("assistant", t().welcome);
    }
  });

  panel.querySelector("#ai-widget-close").addEventListener("click", () => panel.classList.remove("open"));

  // 拖拽（支持 PC 与移动端）
  function getPos(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }
  function onDragStart(e) {
    if (e.target !== ball) return;
    e.preventDefault();
    var pos = getPos(e);
    var rect = ball.getBoundingClientRect();
    var startX = pos.x - rect.left;
    var startY = pos.y - rect.top;
    ball.classList.add("dragging");
    function onMove(e2) {
      var p = getPos(e2);
      ball.style.left = (p.x - startX) + "px";
      ball.style.right = "auto";
      ball.style.bottom = "auto";
      ball.style.top = (p.y - startY) + "px";
    }
    function onUp() {
      ball.classList.remove("dragging");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onUp);
  }
  ball.addEventListener("mousedown", onDragStart);
  ball.addEventListener("touchstart", onDragStart, { passive: false });

  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMsg("user", text);
    inputEl.value = "";
    sendBtn.disabled = true;

    try {
      const res = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          submission_context: formContext,
          locale: getLocale(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        addMsg("assistant", data.reply);
      } else {
        const txt = t();
        const msg = res.status === 429 ? txt.limitReached : txt.errorGeneric;
        addMsg("assistant", msg);
      }
    } catch (e) {
      addMsg("assistant", t().errorNetwork);
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener("click", send);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
})();

