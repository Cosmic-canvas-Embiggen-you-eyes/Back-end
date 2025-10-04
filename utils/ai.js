import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadInstructions(state = 'default') {
    let instructionsPath = path.join(__dirname, 'instructions_beginner.txt');
    
    switch (state) {
        case 'Earth Json':
            instructionsPath = path.join(__dirname , 'instructions_Earth.txt');
            break;
        case 'Search cosmic':
            instructionsPath = path.join(__dirname , 'instructions_cosmic.txt');
            break;
        case 'beginner':
            instructionsPath = path.join(__dirname , 'instructions_beginner.txt');
            break;
        case 'advanced':
            instructionsPath = path.join(__dirname , 'instructions_advanced.txt');
            break;
    }

    try {
    const instructions = fs.readFileSync(instructionsPath, 'utf-8');
        return instructions;
    } catch (error) {
        console.error(`Error loading instructions file (${instructionsPath}):`, error.message);
        return '';
    }
}

// Utility: Clean LLM response text based on mode
function cleanLLMResponse(text, mode = 'default') {
    if (!text || typeof text !== 'string') return '';
    let cleaned = text.trim();

    // Strip leading/trailing code fence markers (```json / ```)
    cleaned = cleaned.replace(/^```json\s*|^```\s*/i, '');
    cleaned = cleaned.replace(/```\s*$/i, '');

    // Remove any remaining fenced blocks inside just in case
    cleaned = cleaned.replace(/```[\s\S]*?```/g, m => m.replace(/^```\w*\s*/i, '').replace(/```$/, ''));

    cleaned = cleaned.trim();

    // Apply Earth Json mode trimming: remove first 7 and last 3 characters
    if (mode === 'Earth Json') {
        if (cleaned.length >= 10) {
            cleaned = cleaned.slice(7, -3);
        } else {
            cleaned = '';
        }
    }
    return cleaned;
}

// Initialize Gemini AI
let genAI = null;
function ensureGenAI() {
    if (!genAI) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY environment variable is required for AI features');
        }
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
}

// Gemini chat function - accepts per-request system instructions
async function chat(prompt, systemInstructions = '', mode = 'default') {
    try {
        let generationConfig = {
            temperature: 0,
        };

        // Apply token constraints for advanced mode
        if (mode === 'advanced') {
            generationConfig.maxOutputTokens = 500; // Constrain to 1000 tokens for advanced mode
            generationConfig.temperature = 0.3; // Lower temperature for more focused responses
        }

        const model = ensureGenAI().getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            systemInstruction: systemInstructions,
            generationConfig: generationConfig
        });

        const result = await model.generateContent(prompt);
        console.log('Gemini API response:', result);
        const response = await result.response;
        return response.text();
    } catch (error) {
    console.error('Error calling Gemini API:', error);
        throw error;
    }
}
export { chat, cleanLLMResponse, loadInstructions };