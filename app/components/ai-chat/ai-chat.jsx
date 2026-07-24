import { useState, useRef, useEffect } from 'react';
import styles from './ai-chat.module.css';

const KNOWLEDGE_BASE = [
  {
    keywords: ['project', 'built', 'particleverse', 'jarvis', 'vahaan', 'work'],
    answer: "Siva has built 5 major projects: 1. ParticleVerse Studio (3D particle engine with 100K particles @ 60 FPS), 2. Jarvis AI Assistant (voice AI assistant with Speech Recognition & NLP), 3. Vahaan Bazar (AI vehicle marketplace with 80%+ resale value prediction accuracy), 4. AI Sales Forecast System (LSTM & Random Forest), 5. Interactive 3D Portfolio.",
  },
  {
    keywords: ['intern', 'experience', 'company', 'work', 'summit', 'swecha', 'lambentix', '3skill'],
    answer: "Siva has completed multiple industry internships: 1. AI Automation Intern at Summit Wealth Builders LLC (n8n & generative AI pipelines), 2. AI & ML Intern at 3Skill (CNNs & scikit-learn models), 3. AI Intern at Lambentix AI (dataset preprocessing & ML model optimization), 4. AI Developer Intern at Swecha Telangana (open-source AI tools & chatbot pipelines).",
  },
  {
    keywords: ['skill', 'python', 'langchain', 'n8n', 'tensorflow', 'pytorch', 'stack', 'tool'],
    answer: "Siva's core skills include: Python, TensorFlow, PyTorch, LangChain, OpenAI API, n8n, Make.com, Claude, Gemini, Groq, DALL-E, Three.js, React, TypeScript, Supabase, and REST APIs.",
  },
  {
    keywords: ['education', 'college', 'eswar', 'degree', 'cgpa', 'btech', 'marks'],
    answer: "Siva is a final year B.Tech student specializing in Artificial Intelligence & Machine Learning at Eswar College of Engineering, Narasaraopet (2023–Present) with a 7.0 CGPA.",
  },
  {
    keywords: ['hackathon', 'award', 'prize', 'winner', 'freedom', 'accomplishment', 'certification'],
    answer: "Siva won 2nd Place in the Freedom Fest 2026 Vibe Coding Hackathon (Swecha AP) and 2nd Prize in the National Level Idea Hackathon. He holds certifications from Anthropic AI, Google Gemini, Google Cloud Arcade, IBM Data Science, AWS, TATA, and Deloitte.",
  },
  {
    keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'hire', 'resume'],
    answer: "You can reach Siva via Email: peddapulisiva515@gmail.com, Phone: +91-9347701509, LinkedIn: linkedin.com/in/peddapudi-siva-5781b328a, GitHub: github.com/peddapudisiva, or download his PDF resume directly from the portfolio!",
  },
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Siva’s AI Assistant. Ask me anything about Siva’s projects, internships, skills, or certifications!' },
  ]);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0, baseLeft: 0, baseTop: 0, hasDragged: false });
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Keep the widget inside the viewport whenever it resizes (rotation, resize, etc.)
  useEffect(() => {
    const clampToViewport = () => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const baseLeft = rect.left - position.x;
      const baseTop = rect.top - position.y;
      const minX = -baseLeft;
      const maxX = window.innerWidth - rect.width - baseLeft;
      const minY = -baseTop;
      const maxY = window.innerHeight - rect.height - baseTop;

      setPosition(prev => ({
        x: Math.min(Math.max(prev.x, minX), Math.max(minX, maxX)),
        y: Math.min(Math.max(prev.y, minY), Math.max(minY, maxY)),
      }));
    };

    window.addEventListener('resize', clampToViewport);
    return () => window.removeEventListener('resize', clampToViewport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch and Mouse dragging logic
  const handlePointerDown = (e) => {
    // Only left click or touch
    if (e.button !== undefined && e.button !== 0) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      posX: position.x,
      posY: position.y,
      // Position the transform would need to be at to sit at viewport (0, 0)
      baseLeft: rect.left - position.x,
      baseTop: rect.top - position.y,
      rectWidth: rect.width,
      rectHeight: rect.height,
      hasDragged: false,
    };

    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragRef.current.startX;
      const deltaY = clientY - dragRef.current.startY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragRef.current.hasDragged = true;
      }

      const { baseLeft, baseTop, rectWidth, rectHeight } = dragRef.current;
      const minX = -baseLeft;
      const maxX = window.innerWidth - rectWidth - baseLeft;
      const minY = -baseTop;
      const maxY = window.innerHeight - rectHeight - baseTop;

      setPosition({
        x: Math.min(Math.max(dragRef.current.posX + deltaX, minX), Math.max(minX, maxX)),
        y: Math.min(Math.max(dragRef.current.posY + deltaY, minY), Math.max(minY, maxY)),
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  const handleToggle = () => {
    if (!dragRef.current.hasDragged) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMessages);
    if (!userText) setInput('');

    // Answer matching
    const query = textToSend.toLowerCase();
    let reply = "Siva is an AI & ML Developer specializing in LLM integration, prompt engineering, AI agents, and workflow automation. Feel free to ask about his projects, internships, or certifications!";

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((k) => query.includes(k))) {
        reply = item.answer;
        break;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none',
      }}
    >
      <button
        className={styles.toggleButton}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={handleToggle}
        title="Ask Siva AI (Drag to move)"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div
            className={styles.header}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            style={{ cursor: 'grab' }}
          >
            <div className={styles.headerTitle}>
              <span>🤖</span>
              <span>Ask Siva AI Assistant</span>
            </div>
            <button
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              ✕
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.sender === 'user' ? styles.user : styles.bot}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.quickPrompts}>
            <button className={styles.promptChip} onClick={() => handleSend('Tell me about your projects')}>
              💻 Projects
            </button>
            <button className={styles.promptChip} onClick={() => handleSend('What internships have you done?')}>
              💼 Internships
            </button>
            <button className={styles.promptChip} onClick={() => handleSend('What are your skills?')}>
              ⚡ Skills
            </button>
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ask about Siva..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className={styles.sendButton} onClick={() => handleSend()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
