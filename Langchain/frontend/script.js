// ── Config ──────────────────────────────────────────────
const openAIApiKey = 'YOUR_OPENAI_API_KEY'   // replace with your key

// ── Initial greeting ────────────────────────────────────
const conversationHistory = [
  {
    role: 'system',
    content: 'You are a helpful Scrimba knowledge base assistant. Answer questions about programming and web development clearly and concisely.'
  }
]

// Show greeting on load
window.addEventListener('DOMContentLoaded', () => {
  addMessageToUI('ai', 'Hi! I\'m the Scrimba assistant. Ask me anything about programming or web development!')
})

// ── Form submit ─────────────────────────────────────────
document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})

// ── Core function ────────────────────────────────────────
async function progressConversation() {
  const userInput            = document.getElementById('user-input')
  const chatbotConversation  = document.getElementById('chatbot-conversation-container')
  const question             = userInput.value.trim()
  userInput.value            = ''

  if (!question) return

  // Add human message
  const newHumanSpeechBubble = document.createElement('div')
  newHumanSpeechBubble.classList.add('speech', 'speech-human')
  chatbotConversation.appendChild(newHumanSpeechBubble)
  newHumanSpeechBubble.textContent = question
  chatbotConversation.scrollTop    = chatbotConversation.scrollHeight

  // Add AI typing bubble
  const newAiSpeechBubble = document.createElement('div')
  newAiSpeechBubble.classList.add('speech', 'speech-ai')
  newAiSpeechBubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>'
  chatbotConversation.appendChild(newAiSpeechBubble)
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight

  // Add message to history
  conversationHistory.push({ role: 'user', content: question })

  try {
    const result = await fetchReply()

    // Replace typing indicator with result
    newAiSpeechBubble.textContent = result
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

    // Save assistant reply to history
    conversationHistory.push({ role: 'assistant', content: result })

  } catch (err) {
    newAiSpeechBubble.textContent = '⚠️ Something went wrong. Please try again.'
    console.error('Error:', err)
  }
}

// ── OpenAI API call ──────────────────────────────────────
async function fetchReply() {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${openAIApiKey}`
    },
    body: JSON.stringify({
      model:    'gpt-4o-mini',
      messages: conversationHistory
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// ── Helper ───────────────────────────────────────────────
function addMessageToUI(role, text) {
  const chatbotConversation = document.getElementById('chatbot-conversation-container')
  const bubble = document.createElement('div')
  bubble.classList.add('speech', role === 'human' ? 'speech-human' : 'speech-ai')
  bubble.textContent = text
  chatbotConversation.appendChild(bubble)
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}
