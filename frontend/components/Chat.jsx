import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }))
    setAttachments([...attachments, ...newAttachments])
  }

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id))
  }

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
    setCopiedId(content)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const send = async () => {
    if ((!input.trim() && attachments.length === 0) || loading) return
    
    const userMessage = input.trim()
    const userAttachments = [...attachments]
    setInput('')
    setAttachments([])
    
    const newUserMsg = { 
      id: Date.now(), 
      role: 'user', 
      content: userMessage || '[Sent an attachment]',
      attachments: userAttachments,
      timestamp: new Date()
    }
    
    setMessages((prev) => [...prev, newUserMsg])
    setLoading(true)

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))
      
      // Process attachments if present
      let messageContent = userMessage
      const fileContents = []
      
      if (userAttachments.length > 0) {
        for (const att of userAttachments) {
          if (att.file.type.startsWith('image/')) {
            // Convert image to base64
            const base64 = await fileToBase64(att.file)
            fileContents.push({
              type: 'image',
              data: base64,
              mimeType: att.file.type
            })
          } else if (att.file.type === 'application/pdf' || att.file.name.endsWith('.pdf')) {
            // For PDF, we'll send it as base64 to backend
            const base64 = await fileToBase64(att.file)
            fileContents.push({
              type: 'document',
              data: base64,
              mimeType: 'application/pdf',
              name: att.file.name
            })
          } else {
            // For other documents, extract text if possible or inform user
            messageContent += `\n\n[Attached document: ${att.file.name}]`
          }
        }
      }
      
      conversationHistory.push({
        role: 'user',
        content: messageContent || 'Please analyze the attached file(s)',
        attachments: fileContents
      })

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '/_/backend' : 'http://127.0.0.1:8000')
      const resp = await fetch(`${apiBaseUrl}/krishna2/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: conversationHistory,
          model: 'gemini-2.5-flash',
          max_tokens: 2048
        }),
      })

      if (!resp.ok) {
        throw new Error(`API error: ${resp.status}`)
      }

      const data = await resp.json()
      
      let content = 'No response received'
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        content = data.candidates[0].content.parts[0].text
      } else if (data.choices && data.choices[0]?.message?.content) {
        content = data.choices[0].message.content
      } else if (data.output) {
        content = data.output
      } else if (typeof data === 'string') {
        content = data
      }
      
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `Error: ${error.message}. Please make sure the backend is running on port 8000.`,
        timestamp: new Date(),
        isError: true
      }])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(',')[1] // Remove data:image/jpeg;base64, prefix
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-violet-950">
      {/* Header with Avatar */}
      <Header loading={loading} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-3xl mx-auto px-4 py-6 lg:py-8">
          {messages.length === 0 ? (
            <WelcomeScreen setInput={setInput} />
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    onCopy={copyMessage}
                    copiedId={copiedId}
                  />
                ))}
              </AnimatePresence>

              {loading && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <InputBar 
        input={input}
        setInput={setInput}
        attachments={attachments}
        onSend={send}
        onKeyDown={handleKeyDown}
        onFileSelect={handleFileSelect}
        onRemoveAttachment={removeAttachment}
        fileInputRef={fileInputRef}
        textareaRef={textareaRef}
        loading={loading}
      />
    </div>
  )
}

function Header({ loading }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-20 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-violet-200/50 dark:border-violet-800/30' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-violet-200 dark:ring-violet-800">
            K
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
            loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
          }`} />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Krishna-2.0
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nitigya's Study Partner
          </p>
        </div>
        
        {/* Status */}
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {loading ? 'Thinking...' : 'Online'}
        </div>
      </div>
    </header>
  )
}

function WelcomeScreen({ setInput }) {
  const suggestions = [
    'Break down the Basic Structure Doctrine for me',
    'Connect Monsoons with Indian Agriculture & Economy',
    'Give me 5 UPSC-style questions on Federalism',
    'Help me explain Separation of Powers to my sister'
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl mb-6 ring-4 ring-violet-200 dark:ring-violet-800/50"
      >
        K
      </motion.div>
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center"
      >
        Hey Nitigya! 👋
      </motion.h2>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-10 px-4 leading-relaxed"
      >
        Ready to crush UPSC? I'm here for late-night doubts, concept clarity, answer practice, or just brainstorming. Let's make this work.
      </motion.p>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4"
      >
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setInput(suggestion)}
            className="p-4 text-left text-sm bg-white dark:bg-gray-800 border border-violet-200 dark:border-violet-800/50 rounded-2xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200 font-medium"
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

function MessageBubble({ message, onCopy, copiedId }) {
  const [showActions, setShowActions] = useState(false)
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => !isUser && setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
          K
        </div>
      )}
      
      <div className={`flex-1 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* Timestamp on hover */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-gray-400 mb-1 px-1"
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Content */}
        <div className={`relative group ${
          isUser 
            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-[20px] rounded-tr-md px-4 py-3 shadow-lg' 
            : message.isError
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-[20px] rounded-tl-md px-4 py-3'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-[20px] rounded-tl-md px-4 py-3 shadow-sm'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </div>
          ) : (
            <MarkdownContent content={message.content} isError={message.isError} />
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map(att => (
                <AttachmentPreview key={att.id} attachment={att} />
              ))}
            </div>
          )}

          {/* Copy button */}
          {!isUser && !message.isError && (
            <button
              onClick={() => onCopy(message.content)}
              className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600"
              title="Copy message"
            >
              {copiedId === message.content ? (
                <CheckIcon />
              ) : (
                <CopyIcon />
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          N
        </div>
      )}
    </motion.div>
  )
}

function MarkdownContent({ content, isError }) {
  if (isError) {
    return <div className="whitespace-pre-wrap break-words">{content}</div>
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed mb-3">{children}</p>,
          ul: ({ children }) => <ul className="space-y-1 pl-5 my-2 list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-1 pl-5 my-2 list-decimal">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-3 text-gray-900 dark:text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-2 text-gray-900 dark:text-white">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-bold mt-3 mb-2 text-gray-900 dark:text-white uppercase tracking-wide">{children}</h4>,
          code: ({ inline, children }) => {
            if (inline) {
              return <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">{children}</code>
            }
            return <code className="text-sm">{children}</code>
          },
          pre: ({ children }) => <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl overflow-x-auto border border-gray-200 dark:border-gray-700 my-4">{children}</pre>,
          hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} className="text-violet-600 dark:text-violet-400 underline hover:text-violet-700 dark:hover:text-violet-300" target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
        K
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[20px] rounded-tl-md px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </div>
      </div>
    </motion.div>
  )
}

function Dot({ delay }) {
  return (
    <motion.span
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.4, 1, 0.4]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.2, 
        delay: delay / 1000,
        ease: 'easeInOut'
      }}
      className="w-2 h-2 bg-violet-500 rounded-full inline-block"
    />
  )
}

function InputBar({ input, setInput, attachments, onSend, onKeyDown, onFileSelect, onRemoveAttachment, fileInputRef, textareaRef, loading }) {
  const canSend = (input.trim() || attachments.length > 0) && !loading

  return (
    <div className="sticky bottom-0 border-t border-violet-200/50 dark:border-violet-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl pb-safe">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map(att => (
              <AttachmentChip key={att.id} attachment={att} onRemove={() => onRemoveAttachment(att.id)} />
            ))}
          </div>
        )}

        {/* Input Container */}
        <div className="relative flex items-end gap-2 bg-white dark:bg-gray-800 rounded-[24px] shadow-lg border-2 border-violet-200 dark:border-violet-800/50 focus-within:border-violet-400 dark:focus-within:border-violet-600 transition-all p-2">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex-shrink-0 p-2.5 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors disabled:opacity-50 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20"
            aria-label="Attach file"
          >
            <PaperclipIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={onFileSelect}
            className="hidden"
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="What's on your mind, Nitigya?"
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none py-2.5 px-2 disabled:opacity-50 leading-relaxed"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={!canSend}
            className="flex-shrink-0 p-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:hover:shadow-md"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-2 px-2">
          I'm here to help you think, not replace your judgment. Always verify critical info.
        </p>
      </div>
    </div>
  )
}

function AttachmentChip({ attachment, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl px-3 py-2 text-sm">
      {attachment.preview ? (
        <img src={attachment.preview} alt={attachment.name} className="w-8 h-8 rounded object-cover" />
      ) : (
        <FileIcon />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-gray-900 dark:text-gray-100 font-medium truncate">{attachment.name}</div>
        <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
        aria-label="Remove attachment"
      >
        <XIcon />
      </button>
    </div>
  )
}

function AttachmentPreview({ attachment }) {
  if (attachment.preview) {
    return (
      <img 
        src={attachment.preview} 
        alt={attachment.name} 
        className="max-w-full rounded-xl border border-gray-200 dark:border-gray-700"
      />
    )
  }
  
  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
      <FileIcon />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{attachment.name}</div>
        <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
      </div>
    </div>
  )
}

// Utility Functions
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Icons
function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function PaperclipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
