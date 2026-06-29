const chatScroll = document.getElementById('chatScroll');
const emptyState = document.getElementById('emptyState');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let history = [];

userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);
userInput.focus();

function clearEmptyState() {
  if (emptyState && emptyState.parentNode) {
    emptyState.remove();
  }
}

function addUserBubble(text) {
  clearEmptyState();
  const row = document.createElement('div');
  row.className = 'msg-row user';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  row.appendChild(bubble);
  chatScroll.appendChild(row);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function addErrorBubble(text) {
  clearEmptyState();
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  const bubble = document.createElement('div');
  bubble.className = 'bubble error';
  bubble.textContent = text;
  row.appendChild(bubble);
  chatScroll.appendChild(row);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function addTypingIndicator() {
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  row.id = 'typingRow';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = '<div class="typing-pulse"><span></span><span></span><span></span><span></span><span></span></div>';
  row.appendChild(bubble);
  chatScroll.appendChild(row);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function removeTypingIndicator() {
  const row = document.getElementById('typingRow');
  if (row) row.remove();
}

/**
 * Renders bot reply with a word-by-word typing effect for a natural,
 * "thinking while speaking" feel.
 */
function typeOutBotReply(fullText) {
  return new Promise((resolve) => {
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    bubble.appendChild(cursor);
    row.appendChild(bubble);
    chatScroll.appendChild(row);

    const words = fullText.split(/(\s+)/); // keep whitespace tokens
    let i = 0;
    const textNode = document.createTextNode('');
    bubble.insertBefore(textNode, cursor);

    function step() {
      if (i < words.length) {
        textNode.textContent += words[i];
        i++;
        chatScroll.scrollTop = chatScroll.scrollHeight;
        setTimeout(step, 18 + Math.random() * 22);
      } else {
        cursor.remove();
        resolve();
      }
    }
    step();
  });
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addUserBubble(text);
  history.push({ role: 'user', parts: [{ text: text }] });
  userInput.value = '';
  userInput.style.height = 'auto';
  sendBtn.disabled = true;
  addTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: history })
    });

    const data = await response.json();
    removeTypingIndicator();

    if (data.error) {
      addErrorBubble('Xatolik: ' + data.error);
      history.pop();
    } else {
      const reply = data.reply || '(bo\'sh javob)';
      await typeOutBotReply(reply);
      history.push({ role: 'model', parts: [{ text: reply }] });
    }
  } catch (err) {
    removeTypingIndicator();
    addErrorBubble('Tarmoq xatoligi: ' + err.message);
    history.pop();
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}
