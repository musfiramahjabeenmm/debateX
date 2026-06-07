import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Round3 from './Round3';
import Round4 from './Round4';
import Stage3 from './Stage3';
import './ChatInterface.css';

const BattleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
    <path d="m13 19 6 3 3-6-3-6-6 3" />
    <path d="M8 16 3 21" />
    <path d="m18 8 3-3" />
  </svg>
);



const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);

const SUGGESTIONS = [
  {
    title: "Quantum vs Classical Search",
    description: "Compare optimization speedups across algorithms.",
    text: "Compare quantum algorithms (like Grover's search) with classical algorithms for search optimization. Where does the speedup actually hold?",
    icon: "⚛️"
  },
  {
    title: "Global Trade Networks",
    description: "Debate the long-term impact of bilateral trade agreements.",
    text: "Debate the long-term economic and geopolitical impacts of bilateral trade agreements versus multilateral trade agreements.",
    icon: "📈"
  },
  {
    title: "Universal Basic Income",
    description: "Evaluate labor metrics and inflation risks.",
    text: "Synthesize a balanced debate on the social security benefits versus inflationary risks of implementing a nationwide Universal Basic Income (UBI).",
    icon: "💼"
  }
];

const ChevronIcon = ({ isOpen }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function DebateTimeline({ msg }) {
  const [expandedSteps, setExpandedSteps] = useState({
    round1: false,
    round2: false,
    round3: false,
    round4: false,
    round5: true
  });

  const round3 = msg.round3 || (msg.rounds?.find(r => r.type === 'revise_or_defend')?.data);
  const round4 = msg.round4 || (msg.rounds?.find(r => r.type === 'challenger')?.data);

  // Auto-expand/collapse rounds based on streaming status
  useEffect(() => {
    if (msg.stage3) {
      setExpandedSteps({
        round1: false,
        round2: false,
        round3: false,
        round4: false,
        round5: true
      });
    } else {
      setExpandedSteps({
        round1: !!msg.stage1,
        round2: !!msg.stage2,
        round3: !!round3,
        round4: !!round4,
        round5: !!msg.stage3
      });
    }
  }, [msg.stage1, msg.stage2, round3, round4, msg.stage3]);

  const toggleStep = (step) => {
    setExpandedSteps(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  return (
    <div className="debate-timeline">
      {/* Step 1: Initial Responses */}
      {(msg.loading?.stage1 || msg.stage1) && (
        <div className={`timeline-card round-1 ${msg.stage1 ? 'completed' : 'loading'}`}>
          <button className="timeline-header" onClick={() => msg.stage1 && toggleStep('round1')}>
            <div className="header-left">
              <span className="step-badge">01</span>
              <div className="step-info">
                <span className="step-title">Round 1: Initial Proposals</span>
                <span className="step-subtitle">Candidate solutions collected from the council models</span>
              </div>
            </div>
            {msg.stage1 && <ChevronIcon isOpen={expandedSteps.round1} />}
          </button>
          {msg.loading?.stage1 && <div className="timeline-loader">Gathering candidate responses...</div>}
          {msg.stage1 && expandedSteps.round1 && (
            <div className="timeline-body">
              <Stage1 responses={msg.stage1} />
            </div>
          )}
        </div>
      )}

      {/* Step 2: Peer Review & Standings */}
      {(msg.loading?.stage2 || msg.stage2) && (
        <div className={`timeline-card round-2 ${msg.stage2 ? 'completed' : 'loading'}`}>
          <button className="timeline-header" onClick={() => msg.stage2 && toggleStep('round2')}>
            <div className="header-left">
              <span className="step-badge">02</span>
              <div className="step-info">
                <span className="step-title">Round 2: Peer Review & Rankings</span>
                <span className="step-subtitle">Blind evaluations, rankings, and street cred calculations</span>
              </div>
            </div>
            {msg.stage2 && <ChevronIcon isOpen={expandedSteps.round2} />}
          </button>
          {msg.loading?.stage2 && <div className="timeline-loader">Analyzing feedback & compiling rankings...</div>}
          {msg.stage2 && expandedSteps.round2 && (
            <div className="timeline-body">
              <Stage2
                rankings={msg.stage2}
                labelToModel={msg.metadata?.label_to_model}
                aggregateRankings={msg.metadata?.aggregate_rankings}
              />
            </div>
          )}
        </div>
      )}

      {/* Step 3: Revise or Defend */}
      {(msg.loading?.round3 || round3) && (
        <div className={`timeline-card round-3 ${round3 ? 'completed' : 'loading'}`}>
          <button className="timeline-header" onClick={() => round3 && toggleStep('round3')}>
            <div className="header-left">
              <span className="step-badge">03</span>
              <div className="step-info">
                <span className="step-title">Round 3: Revise or Defend</span>
                <span className="step-subtitle">Models adapt based on criticism or defend their reasoning</span>
              </div>
            </div>
            {round3 && <ChevronIcon isOpen={expandedSteps.round3} />}
          </button>
          {msg.loading?.round3 && <div className="timeline-loader">Processing model shifts...</div>}
          {round3 && expandedSteps.round3 && (
            <div className="timeline-body">
              <Round3 results={round3} />
            </div>
          )}
        </div>
      )}

      {/* Step 4: Challenger Critique */}
      {(msg.loading?.round4 || round4) && (
        <div className={`timeline-card round-4 ${round4 ? 'completed' : 'loading'}`}>
          <button className="timeline-header" onClick={() => round4 && toggleStep('round4')}>
            <div className="header-left">
              <span className="step-badge">04</span>
              <div className="step-info">
                <span className="step-title">Round 4: Challenger Critique</span>
                <span className="step-subtitle">Worst-performing model stress-tests the leading answer</span>
              </div>
            </div>
            {round4 && <ChevronIcon isOpen={expandedSteps.round4} />}
          </button>
          {msg.loading?.round4 && <div className="timeline-loader">Stress testing leading response...</div>}
          {round4 && expandedSteps.round4 && (
            <div className="timeline-body">
              <Round4 result={round4} labelToModel={msg.metadata?.label_to_model} />
            </div>
          )}
        </div>
      )}

      {/* Step 5: Chairman Synthesis */}
      {(msg.loading?.stage3 || msg.stage3) && (
        <div className={`timeline-card round-5 ${msg.stage3 ? 'completed highlight-synthesis' : 'loading'}`}>
          <button className="timeline-header" onClick={() => msg.stage3 && toggleStep('round5')}>
            <div className="header-left">
              <span className="step-badge-star">★</span>
              <div className="step-info">
                <span className="step-title-final">Round 5: Chairman Synthesis</span>
                <span className="step-subtitle">Final moderated consensus answer synthesized by the Chairman</span>
              </div>
            </div>
            {msg.stage3 && <ChevronIcon isOpen={expandedSteps.round5} />}
          </button>
          {msg.loading?.stage3 && <div className="timeline-loader-final">Synthesizing master response...</div>}
          {msg.stage3 && expandedSteps.round5 && (
            <div className="timeline-body">
              <Stage3 finalResponse={msg.stage3} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Reset input when switching conversations
  useEffect(() => {
    setInput('');
  }, [conversation?.id]);

  // Auto-resize message text area
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isInitialState = !conversation || conversation.messages.length === 0;

  return (
    <div className="chat-interface">
      <div className={`main-content ${isInitialState ? 'centered' : ''}`}>
        {isInitialState ? (
          <div className="hero-section">
            <div className="hero-badge">Deliberative Consensus Engine</div>
            <h2 className="logo-text">debateX</h2>
            <h1 className="hero-headline">
              Experience the <span className="highlight">frontier</span> of multi-model deliberation
            </h1>
            <p className="hero-subtitle">
              Input a complex prompt. Watch a panel of models propose solutions, cross-evaluate and rank each other, shift positions, challenger stress-test, and synthesize a unified final consensus.
            </p>
            <div className="suggestion-cards">
              {SUGGESTIONS.map((s, idx) => (
                <button 
                  key={idx} 
                  className="suggestion-card" 
                  onClick={() => onSendMessage(s.text)}
                >
                  <span className="card-icon">{s.icon}</span>
                  <div className="card-texts">
                    <span className="card-title">{s.title}</span>
                    <span className="card-desc">{s.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {conversation.messages.map((msg, index) => {
              return (
                <div key={index} className={`message-group ${msg.role}`}>
                  <div className="message-content">
                    {msg.role === 'user' ? (
                      <div className="user-bubble">{msg.content}</div>
                    ) : (
                      <div className="assistant-stages">
                        <DebateTimeline msg={msg} />

                        {msg.error && (
                          <div className="error-panel">
                            {(() => {
                              const isGroqError = msg.error.toLowerCase().includes('groq') || msg.error.includes('gsk_');
                              if (isGroqError) {
                                return (
                                  <>
                                    <div className="error-header">
                                      <span className="error-badge groq-error">GROQ API ERROR</span>
                                      <span className="error-code">Groq Exception</span>
                                    </div>
                                    <p className="error-text">{msg.error}</p>
                                    <div className="error-action-box">
                                      <span className="action-title">How to Resolve:</span>
                                      <ol className="action-list">
                                        <li>Make sure you have added your Groq API Key to <code>.env</code> as <code>GROQ_API_KEY=your_key_here</code>.</li>
                                        <li>Verify if you have hit the **Requests Per Minute (RPM)** or **Tokens Per Minute (TPM)** limits on Groq's developer platform.</li>
                                        <li>Check the status of Groq service on the Groq Developer Console.</li>
                                      </ol>
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div className="error-header">
                                      <span className="error-badge">LIMIT EXCEEDED</span>
                                      <span className="error-code">OpenRouter 429</span>
                                    </div>
                                    <p className="error-text">{msg.error}</p>
                                    {msg.error.includes("free-models-per-day") && (
                                      <div className="error-action-box">
                                        <span className="action-title">How to Resolve:</span>
                                        <ol className="action-list">
                                          <li>Add <strong>$10 in credits</strong> to your OpenRouter account to unlock 1,000 requests/day.</li>
                                          <li>Configure a paid API key with credits in your <code>.env</code> file.</li>
                                          <li>Wait for the daily limit to reset at midnight UTC.</li>
                                        </ol>
                                      </div>
                                    )}
                                  </>
                                );
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="loading-global-container">
                <span className="loader-ring"></span>
                <span className="loader-text">Moderating Council...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-container">
        <form className="input-box" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder="Ask a complex question to initiate deliberation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <div className="input-footer">
            <button 
              type="submit" 
              className={`send-btn ${input.trim() ? 'active' : ''}`}
              disabled={!input.trim() || isLoading}
            >
              <SendIcon />
            </button>
          </div>
        </form>
        <p className="disclaimer">
          AI can make mistakes. Please check important information.
        </p>
      </div>
    </div>
  );
}
