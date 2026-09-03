import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Building2, 
  User, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Copy, 
  Check, 
  Settings, 
  X, 
  Key, 
  Cpu, 
  ExternalLink,
  Printer,
  RotateCcw,
  Server
} from 'lucide-react';
import { marked } from 'marked';
import { requestLegalProcedure, AVAILABLE_MODELS } from './services/api';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('person'); // 'industrial' | 'person'
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Settings Modal state
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('legallens_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('legallens_model') || 'qwen/qwen-2.5-72b-instruct:free');

  useEffect(() => {
    localStorage.setItem('legallens_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('legallens_model', selectedModel);
  }, [selectedModel]);

  const sampleQueries = {
    person: [
      "What is the procedure to file a consumer complaint for defective goods?",
      "How to draft and serve a legal notice for non-payment of rent?",
      "Step-by-step procedure for mutual consent divorce petition",
      "Process to file a cyber fraud police complaint and FIR"
    ],
    industrial: [
      "Procedure for obtaining Consent to Establish (CTE) under Pollution Control Act",
      "Process for resolution of industrial disputes under the Industrial Disputes Act",
      "Factory license registration and renewal compliance procedure",
      "Steps for trademark infringement injunction in commercial court"
    ]
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || isGenerating) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await requestLegalProcedure({
        query: query.trim(),
        category,
        apiKey,
        model: selectedModel
      });

      setResult({
        query: query.trim(),
        category,
        content: response.text,
        modelUsed: response.modelUsed,
        provider: response.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('Generation failed:', err);
      setResult({
        query: query.trim(),
        category,
        content: "### ❌ Error Generating Response\n\nCould not process the request. Please ensure the backend server (`npm run dev` in `backend/`) is running or check your network connection.",
        modelUsed: 'Error',
        provider: 'System'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070b14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex flex-col justify-between text-slate-100 antialiased font-sans px-4 py-6 sm:py-10">
      
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setResult(null)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <Scale className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-serif-heading">LegalLens</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Qwen AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Procedural Legal Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-slate-400">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backend: :5000</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[150px]">
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name.split(' (')[0] || 'Qwen 2.5'}
            </span>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium"
            title="Configure AI Model & API Key"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">AI Settings</span>
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8 flex flex-col items-center">
        
        {/* Title / Hero */}
        <div className="text-center mb-7 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 backdrop-blur-md mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Powered by Qwen 2.5 Procedural Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Understand Any Legal Procedure
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Choose your domain, ask your query, and generate accurate procedural roadmaps in seconds.
          </p>
        </div>

        {/* Central Card Container */}
        <div className="w-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 sm:p-7 shadow-2xl glow-subtle space-y-6">
          
          {/* Toggle Switch: "industrial" vs "person" */}
          <div className="flex flex-col items-center space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Legal Domain
            </label>
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl w-full max-w-md">
              <button
                type="button"
                onClick={() => setCategory('industrial')}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  category === 'industrial'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Industrial</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('person')}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  category === 'person'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Person</span>
              </button>
            </div>
          </div>

          {/* Form with Middle Text Bar & Generate Button */}
          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Middle Text Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FileText className="w-5 h-5 text-amber-500/70" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ask about legal procedure"
                className="w-full pl-12 pr-4 py-4 bg-slate-950/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
              />
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Suggested {category === 'industrial' ? 'Industrial' : 'Personal'} Procedures:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleQueries[category].slice(0, 3).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(sample)}
                    className="text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg transition-colors text-left"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating || !query.trim()}
              className="w-full py-4 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Qwen AI Backend Analyzing Procedure...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Generated Result Section */}
        {result && (
          <div className="w-full mt-8 bg-slate-900/95 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {/* Result Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {result.category === 'industrial' ? 'Industrial Law' : 'Personal Law'}
                  </span>
                  <span className="text-xs text-slate-400">Generated via {result.modelUsed}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {result.query}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
                  title="Copy Markdown"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
                  title="Print / Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
                  title="Regenerate Answer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Markdown Body */}
            <div 
              className="prose prose-invert prose-slate max-w-none prose-headings:text-amber-300 prose-headings:font-bold prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-amber-200 prose-hr:border-slate-800 prose-ul:my-2 prose-ol:my-2"
              dangerouslySetInnerHTML={{ __html: marked.parse(result.content) }}
            />

            {/* Footer Disclaimer */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500/80" /> Generated at {result.timestamp} • Procedural Reference
              </span>
              <span>Always verify procedural jurisdiction with a legal advocate.</span>
            </div>

          </div>
        )}

      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">AI Model & API Settings</h3>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Model Choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select AI Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Default free Qwen models run via OpenRouter free tier or instant Public Gateway.
                </p>
              </div>

              {/* API Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    OpenRouter API Key (Optional)
                  </label>
                  <a 
                    href="https://openrouter.ai/keys" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4 text-amber-500/70" />
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Leave blank to use the built-in free public AI gateway without requiring an account.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md transition-all"
              >
                Save & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 border-t border-slate-800/60 text-xs text-slate-500">
        <p>© 2026 LegalLens AI. Procedural Intelligence for Industrial & Personal Law.</p>
      </footer>

    </div>
  );
}
