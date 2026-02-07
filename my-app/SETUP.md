# PharmaShe - Women's Drug Interaction & Analysis Platform

## Overview

PharmaShe is a comprehensive drug analysis platform specifically designed to analyze medication interactions and their specific effects on women's health. It integrates with the Google Gemini API for intelligent analysis and the FDA Drugs database for accurate pharmaceutical data.

## Features

- 🔍 **Drug Interaction Analysis**: Enter multiple medications to check for potential interactions
- 👩‍⚕️ **Women's Health Focus**: Specialized analysis considering hormonal factors, pregnancy/breastfeeding, and sex-based differences
- 📊 **FDA Data Integration**: Access to the FDA Drugs@FDA database for accurate pharmaceutical information
- 🤖 **AI-Powered Insights**: Uses Google Gemini to provide detailed, evidence-based analysis
- 🎨 **Intuitive Interface**: Clean, modern design with custom color scheme supporting women's health theme

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Google Generative AI API key (Gemini)
- Internet connection for FDA API access

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example file and add your API key:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   **How to get a Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Get API Key"
   - Create a new API key
   - Copy and paste it into `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## How to Use

1. **Enter Medications**: Type the name of a medication in the search box
2. **Add Multiple Drugs**: Click "Add Drug" to include additional medications
3. **Analyze**: Click "Analyze Interactions" to get a comprehensive report
4. **Review Results**: The analysis will show:
   - Potential drug-drug interactions
   - Women-specific health considerations
   - Pregnancy/breastfeeding implications
   - Dosage considerations for women
   - Recommended monitoring approaches

## Project Structure

```
my-app/
├── app/
│   ├── components/
│   │   ├── drugSearch.tsx           # Drug search input component
│   │   ├── analysisResults.tsx      # Results display component
│   │   ├── womenHealthConsiderations.tsx  # Women's health info
│   │   ├── drug.tsx                 # (Existing) Drug component
│   │   └── profile.tsx              # (Existing) Profile component
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main page with UI
│   └── globals.css                  # Global styles and theme
├── lib/
│   ├── gemini.ts                    # Gemini API integration
│   └── drugsAtFDA.ts                # FDA Drugs@FDA API integration
├── package.json
├── .env.local                       # Environment variables (create from .env.local.example)
├── .env.local.example               # Template for environment variables
└── tsconfig.json
```

## API Integration

### Google Gemini API

Used for intelligent drug interaction analysis with women's health focus:
- `analyzeDrugInteractions()`: Main analysis function
- `getDrugSideEffects()`: Detailed side effect information
- `getWomenHealthGuidance()`: Women-specific health guidance

### FDA Drugs@FDA API

Free API for accessing FDA drug data:
- No authentication required
- Provides active ingredients, dosage forms, manufacturers
- Real-time access to FDA-approved drug information

## Color Scheme

The application uses a custom color palette designed for the women's health theme:

- **White**: `#FFFFFF` - Primary background
- **Magenta**: `rgb(163, 75, 103)` - Primary accent color
- **Light Pink**: `rgb(205, 160, 177)` - Secondary accent
- **Blue**: `rgb(86, 109, 150)` - Tertiary accent

## Important Disclaimers

⚠️ **This application is for educational purposes only.**

- PharmaShe should not replace professional medical advice
- Always consult with a licensed healthcare provider before making medication changes
- The analysis is AI-generated and should be verified by healthcare professionals
- Do not use for emergency medical situations - call emergency services instead

## Technologies Used

- **Frontend Framework**: Next.js 16.1.6 with TypeScript
- **UI Styling**: Tailwind CSS v4
- **AI Integration**: Google Generative AI (@google/generative-ai)
- **APIs**: FDA Drugs@FDA (OpenFDA API)
- **Runtime**: React 19 with App Router

## Development

### Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Build production bundle
npm start      # Run production server
npm run lint   # Run ESLint
```

### Adding New Features

When adding new features:
1. Create components in `app/components/`
2. Add API utilities in `lib/`
3. Update the main page or create new routes
4. Test thoroughly before deploying

## Troubleshooting

### API Key Not Working
- Verify the key is correctly added to `.env.local`
- Check that the key has API access enabled
- Restart the development server after adding the key

### FDA API Errors
- The FDA API is free but may have rate limits
- Check internet connection
- Verify the drug name exists in FDA database

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Future Enhancements

- [ ] User accounts and saved drug histories
- [ ] Integration with pharmacy databases
- [ ] Personalized risk assessment
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Integration with medical records
- [ ] Pill identifier feature

## Contact & Support

For questions or issues, please create an issue in the repository.

## License

See LICENSE file for details.

---

**Note**: This project was created as part of the InnovateHer initiative to improve women's health awareness through technology.
