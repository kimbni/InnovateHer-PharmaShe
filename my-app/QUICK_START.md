# PharmaShe - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Add Your Gemini API Key (2 minutes)

1. Create a file named `.env.local` in the `my-app` directory
2. Add this line:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
3. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 2: Install Dependencies (2 minutes)

```bash
cd my-app
npm install
```

### Step 3: Start the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Using PharmaShe

### Basic Workflow

1. **Search Page**: Enter medication names
   - Type a drug name (e.g., "Ibuprofen")
   - Click "Add Drug" or press Enter
   - Add multiple drugs if checking interactions

2. **Analyze**: Click "Analyze Interactions"
   - Gemini AI analyzes drug interactions
   - Analysis includes women-specific health considerations
   - Results display potential concerns and recommendations

3. **Review Results**: 
   - Read the comprehensive analysis
   - Check women's health considerations
   - Copy results if needed
   - Start a new search anytime

### Example Searches

- Single drug: Type "Metformin" to learn about side effects
- Drug interactions: Add "Aspirin" + "Ibuprofen" to check for conflicts
- Hormone interactions: Add "Birth Control Pills" + "Antibiotics"

---

## 🔧 Troubleshooting

### Issue: "API key not set"
**Solution**: Make sure `.env.local` exists in the `my-app` folder with your Gemini API key

### Issue: Page shows spinner but doesn't finish
**Solution**: 
- Check internet connection
- Verify API key is valid
- Check browser console for errors (F12)

### Issue: "Failed to analyze drugs"
**Solution**:
- Confirm `.env.local` has the correct API key
- Restart development server (Ctrl+C, then `npm run dev`)
- Try with a simpler drug name

---

## 📚 Data Sources

- **Drug Information**: FDA Drugs@FDA Database (free, no key needed)
- **Interaction Analysis**: Google Gemini API (requires API key)
- **Women's Health Insights**: AI-generated based on pharmaceutical knowledge

---

## ⚖️ Important Notes

✅ **Do Use PharmaShe For**:
- Learning about drug interactions
- Understanding women-specific medication concerns
- Getting started information before consulting a doctor
- Educational purposes

❌ **Don't Use PharmaShe For**:
- Medical emergencies (call 911)
- Replacing doctor's advice
- Making medication decisions without consulting healthcare provider
- Any life-threatening situations

---

## 📞 Support

If you encounter issues:
1. Check the SETUP.md file for detailed documentation
2. Verify your API key is working
3. Check browser console (F12) for error messages
4. Restart the development server

---

**Built with ❤️ for women's health awareness**
