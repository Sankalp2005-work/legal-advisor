import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateLegalRoadmap, AVAILABLE_MODELS } from './services/qwenService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List available AI models
app.get('/api/models', (req, res) => {
  res.json({ models: AVAILABLE_MODELS });
});

// Main Generate Procedure Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { query, category, apiKey, model } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query is required and must not be empty.' });
    }

    const validCategory = (category === 'industrial') ? 'industrial' : 'person';

    const result = await generateLegalRoadmap({
      query: query.trim(),
      category: validCategory,
      apiKey: apiKey || '',
      model: model || process.env.DEFAULT_MODEL
    });

    res.json({
      success: true,
      data: {
        query: query.trim(),
        category: validCategory,
        content: result.text,
        modelUsed: result.modelUsed,
        provider: result.provider,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('API /api/generate error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing legal procedure.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`⚖️ LegalLens Backend API Server is running on http://localhost:${PORT}`);
});
