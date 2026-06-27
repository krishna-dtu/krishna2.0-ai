# ⚡ Quick Features Guide - Krishna-2.0

## 🚀 Access
**URL**: http://localhost:3001

---

## ✨ Key Features

### 💬 Chat
- **Send message**: Type and press Enter (or click send button)
- **New line**: Shift + Enter
- **Copy message**: Hover over assistant message → click copy icon

### 📎 Attachments
1. Click paperclip icon (left of input)
2. Select images (jpg/png/webp) or documents (pdf/docx)
3. Multiple files supported
4. Preview appears above input
5. Click X to remove before sending
6. Images display inline after sending

### 📱 Mobile Features
- Auto-expanding text input (up to 5 lines)
- Safe for notched/dynamic island devices
- 44px minimum touch targets
- Smooth scrolling to latest messages

### 🎨 Visual Elements
- **Status Indicator**: 
  - Green dot = Online
  - Amber pulse = Thinking
- **Typing Indicator**: Animated dots while AI responds
- **Timestamps**: Hover over messages to see time
- **Avatars**: 
  - "K" = Krishna-2.0 (gradient)
  - "N" = Nitigya (gray)

### 💡 Suggested Prompts
Click any suggestion card on welcome screen to quick-start:
- Break down the Basic Structure Doctrine
- Connect Monsoons with Agriculture & Economy
- Get 5 UPSC-style questions on Federalism
- Help explain concepts to younger sister

---

## 📝 Markdown Support

All formatting now works properly:

### Bold Text
Type: `**important text**`  
Shows: **important text**

### Italic Text
Type: `*emphasis*`  
Shows: *emphasis*

### Bullet Lists
Type:
```
- Point one
- Point two
- Point three
```
Shows properly formatted list with violet bullets

### Numbered Lists
Type:
```
1. First
2. Second
3. Third
```
Shows properly formatted numbered list

### Code
Type: `` `code here` ``  
Shows: `code here` (with gray background)

### Code Blocks
Type:
```
\`\`\`python
def hello():
    print("Hello")
\`\`\`
```
Shows formatted code block with monospace font

### Headings
Type: `## Main Topic`  
Shows: Properly formatted heading

---

## 🎯 Example Queries to Try

### UPSC Study
- "Explain the Basic Structure Doctrine from multiple angles"
- "Give me a mnemonic for Fundamental Rights"
- "Create 5 practice questions on Federalism"
- "Connect monsoons to agriculture and economy"

### Teaching Help
- "How do I explain democracy to a 10-year-old?"
- "Make simple questions on the Constitution for my sister"

### Study Plan
- "Review my study plan: [describe your plan]"
- "I want to cover Polity in 2 weeks" (AI will challenge if unrealistic!)

### Concept Clarity
- "I'm confused about Money Bills vs Financial Bills"
- "What's the difference between Article 370 and 35A?"

### Creative
- "Critique this Hindi poem: [paste poem]"
- "Give me ideas for a Kathak piece on monsoons"

---

## 🔧 Technical Notes

### Ports
- Frontend: 3001
- Backend: 8000

### Restart Servers
If needed:
```bash
# Backend
python -m backend.run_server

# Frontend
cd frontend
npm run dev -- -p 3001
```

### File Upload Limits
- Images: Any reasonable size
- Documents: PDF, DOCX supported
- Multiple files per message

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS safe-area works!)
- Mobile browsers: ✅ Optimized for mobile

---

## 🎨 Color Scheme

### Light Mode
- Background: Warm violet-indigo gradient
- Messages: White (assistant), violet gradient (user)
- Text: Dark gray

### Dark Mode
- Background: Deep violet-indigo gradient
- Messages: Gray-800 (assistant), violet gradient (user)
- Text: Light gray

**Note**: Automatically detects system preference

---

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Ctrl/Cmd + C** (after copying): Copies message to clipboard

---

## 💡 Pro Tips

1. **Long Messages**: Use Shift+Enter for paragraphs, input auto-expands
2. **File Attachments**: Add context in your message about what the file contains
3. **Copy Responses**: Hover and click copy to save AI answers
4. **Mobile Typing**: Input grows with your text, scrolls after 5 lines
5. **Timestamps**: Hover any message to see exact time sent
6. **Challenge Mode**: Ask AI to review/critique your plans for honest feedback

---

## 🐛 Troubleshooting

### Messages Not Sending
- Check backend is running on port 8000
- Look for error message in chat
- Check browser console (F12)

### Markdown Not Rendering
- This is now fixed! Bold, lists, code all work
- If issues, refresh browser

### Attachments Not Working
- Check file type (jpg/png/webp/pdf/docx)
- Try smaller file size
- Check browser console for errors

### Port Already in Use
- Frontend runs on 3001 (not 3000)
- If 3001 busy, stop other Next.js instances

---

## 📱 Mobile Tips

1. **Notch/Island**: Input bar respects safe area
2. **Touch Targets**: All buttons are finger-friendly (44px+)
3. **Scrolling**: Auto-scrolls to new messages
4. **Keyboard**: Input bar stays visible while typing
5. **Zoom**: Optimized to prevent unwanted zoom on input focus

---

**Enjoy your personalized Krishna-2.0 experience!** 🎉

For detailed technical documentation, see `UI_REDESIGN_COMPLETE.md`
