(function () {
  'use strict';

  // ── 1. Read config from <script> tag ──────────────────────────
  var script = document.currentScript;
  var company   = script.getAttribute('data-company')  || 'Support';
  var position  = script.getAttribute('data-position') || 'right';
  var botId     = script.getAttribute('data-bot-id')   || '';
  var docId     = script.getAttribute('data-doc-id')   || '';
  var theme     = script.getAttribute('data-theme')    || '#2563eb';

  // ── 2. Inject CSS ─────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#_cb_bubble {',
      'position:fixed;',
      position + ':24px;',
      'bottom:24px;',
      'width:56px;height:56px;',
      'border-radius:50%;',
      'background:' + theme + ';',
      'cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 4px 24px rgba(0,0,0,0.35);',
      'z-index:2147483647;',
      'transition:transform 0.2s ease,box-shadow 0.2s ease;',
    '}',
    '#_cb_bubble:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(0,0,0,0.45);}',
    '#_cb_bubble svg{width:26px;height:26px;fill:#fff;}',

    '#_cb_window {',
      'position:fixed;',
      position + ':24px;',
      'bottom:92px;',
      'width:320px;height:460px;',
      'background:#0f172a;',
      'border:1px solid rgba(255,255,255,0.12);',
      'border-radius:16px;',
      'display:none;flex-direction:column;',
      'z-index:2147483646;',
      'overflow:hidden;',
      'box-shadow:0 20px 60px rgba(0,0,0,0.5);',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'animation:_cb_slide 0.25s ease;',
    '}',
    '#_cb_window.open{display:flex;}',

    '@keyframes _cb_slide{',
      'from{opacity:0;transform:translateY(16px);}',
      'to  {opacity:1;transform:translateY(0);}',
    '}',

    // Header
    '#_cb_header{',
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:14px 16px;',
      'background:' + theme + ';',
      'color:#fff;',
    '}',
    '#_cb_header span{font-weight:600;font-size:14px;}',
    '#_cb_close{cursor:pointer;font-size:18px;line-height:1;opacity:0.8;}',
    '#_cb_close:hover{opacity:1;}',

    // Messages
    '#_cb_messages{',
      'flex:1;overflow-y:auto;',
      'padding:16px;',
      'display:flex;flex-direction:column;gap:10px;',
    '}',
    '._cb_msg{',
      'max-width:80%;padding:10px 14px;border-radius:12px;',
      'font-size:13px;line-height:1.5;word-break:break-word;',
    '}',
    '._cb_bot{',
      'background:#1e293b;color:#cbd5e1;',
      'border-bottom-left-radius:4px;align-self:flex-start;',
    '}',
    '._cb_user{',
      'background:' + theme + ';color:#fff;',
      'border-bottom-right-radius:4px;align-self:flex-end;',
    '}',
    '._cb_loading{',
      'font-style:italic;opacity:0.7;font-size:11px;',
    '}',

    // Input row
    '#_cb_input_row{',
      'display:flex;gap:8px;',
      'padding:12px;border-top:1px solid rgba(255,255,255,0.08);',
    '}',
    '#_cb_input{',
      'flex:1;padding:10px 14px;',
      'border-radius:12px;border:1px solid rgba(255,255,255,0.1);',
      'background:#1e293b;color:#f1f5f9;font-size:13px;outline:none;',
    '}',
    '#_cb_input:disabled{opacity:0.6;cursor:not-allowed;}',
    '#_cb_input::placeholder{color:#475569;}',
    '#_cb_send{',
      'padding:10px 14px;border-radius:12px;',
      'background:' + theme + ';color:#fff;',
      'border:none;cursor:pointer;font-size:13px;font-weight:600;',
      'transition:opacity 0.15s;',
    '}',
    '#_cb_send:hover:not(:disabled){opacity:0.85;}',
    '#_cb_send:disabled{opacity:0.5;cursor:not-allowed;}',
  ].join('');
  document.head.appendChild(style);

  // ── 3. Inject HTML ────────────────────────────────────────────

  // Bubble icon
  var bubble = document.createElement('div');
  bubble.id = '_cb_bubble';
  bubble.setAttribute('title', 'Open ' + company + ' chat');
  bubble.innerHTML =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>' +
    '</svg>';
  document.body.appendChild(bubble);

  // Chat window
  var win = document.createElement('div');
  win.id = '_cb_window';
  win.innerHTML =
    '<div id="_cb_header">' +
      '<span>🤖 ' + company + ' Support</span>' +
      '<span id="_cb_close">✕</span>' +
    '</div>' +
    '<div id="_cb_messages">' +
      '<div class="_cb_msg _cb_bot">👋 Hi! Welcome to <strong>' + company + '</strong>. How can I help you today?</div>' +
    '</div>' +
    '<div id="_cb_input_row">' +
      '<input id="_cb_input" type="text" placeholder="Type a message..." />' +
      '<button id="_cb_send">Send</button>' +
    '</div>';
  document.body.appendChild(win);

  // ── 4. Logic ──────────────────────────────────────────────────
  var messagesEl = document.getElementById('_cb_messages');
  var inputEl    = document.getElementById('_cb_input');
  var sendEl     = document.getElementById('_cb_send');
  var closeEl    = document.getElementById('_cb_close');

  function addMessage(text, type) {
    var msg = document.createElement('div');
    msg.className = '_cb_msg ' + (type === 'user' ? '_cb_user' : '_cb_bot') + (type === 'loading' ? ' _cb_loading' : '');
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || inputEl.disabled) return;
    
    addMessage(text, 'user');
    inputEl.value = '';
    
    // Disable inputs while loading
    inputEl.disabled = true;
    sendEl.disabled = true;
    
    var loadingMsg = addMessage('Thinking...', 'loading');

    try {
      var response = await fetch("https://aidreamadoration.cloud/chatbot/v1/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_id: docId,
          question: text
        })
      });

      var data = await response.json();
      loadingMsg.remove();
      
      if (data && data.answer) {
        addMessage(data.answer, 'bot');
      } else if (data && data.detail) {
        addMessage('Error: ' + data.detail, 'bot');
      } else {
        addMessage('Sorry, I couldn\'t process that. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Chat error:', error);
      loadingMsg.remove();
      addMessage('Network error. Please check your connection.', 'bot');
    } finally {
      inputEl.disabled = false;
      sendEl.disabled = false;
      inputEl.focus();
    }
  }

  // Toggle open/close
  bubble.addEventListener('click', function () {
    win.classList.toggle('open');
    if (win.classList.contains('open')) inputEl.focus();
  });

  closeEl.addEventListener('click', function () {
    win.classList.remove('open');
  });

  sendEl.addEventListener('click', sendMessage);

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendMessage();
  });

})();
