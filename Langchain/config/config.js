import dotenv from 'dotenv';
dotenv.config();

const config = {
    sbAPIkey: process.env.sbAPIkey,
    sbURL: process.env.sbURL,
    openAIKey: process.env.openAIKey,
    geminiAPIKey: process.env.GEMINI_API_KEY,
};

// Simple check
if (!config.sbAPIkey || !config.sbURL || !config.openAIKey) {
    console.warn('Warning: Missing some configuration in .env');
}

export default config;
