import authRouter from './auth.js';
import guestRouter from './guest.js';
import labelRouter from './labels.js';
import { chat, cleanLLMResponse, loadInstructions } from '../../utils/ai.js';
const injectRoutes = (app) => {
  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication routes
   */
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/guest', guestRouter);
    app.use('/api/v1/labels', labelRouter);
    app.use('/api/v1/ai/chat', async (req, res) => {
       try {
        let { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Determine mode based on prompt prefix and load corresponding instructions
    let perRequestInstructions = loadInstructions('default');
    let modeUsed = 'default';

        if (prompt.toLowerCase().startsWith('use earth methods')) {
            prompt = prompt.substring('use earth methods'.length).trim();
            perRequestInstructions = loadInstructions('Earth Json');
            modeUsed = 'Earth Json';
        } else if (prompt.toLowerCase().startsWith('search cosmic')) {
            prompt = prompt.substring('search cosmic'.length).trim();
            perRequestInstructions = loadInstructions('Search cosmic');
            modeUsed = 'Search cosmic';
        } else if (prompt.toLowerCase().startsWith('beginner mode')) {
            prompt = prompt.substring('beginner mode'.length).trim();
            perRequestInstructions = loadInstructions('beginner');
            modeUsed = 'beginner';
        } else if (prompt.toLowerCase().startsWith('advanced mode')) {
            prompt = prompt.substring('advanced mode'.length).trim();
            perRequestInstructions = loadInstructions('advanced');
            modeUsed = 'advanced';
        }

        const responseText = await chat(prompt, perRequestInstructions, modeUsed);
        const cleaned = cleanLLMResponse(responseText, modeUsed);
        res.json({ response: cleaned });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});
}
export default injectRoutes;
