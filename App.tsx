
import React, { useState, useEffect } from 'react';
import { Article, GroundingSource } from './types';
import { fetchBreakingNews } from './services/geminiService';
import { ArticleCard } from './components/ArticleCard';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleFetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBreakingNews();
      setArticles(result.data.articles);
      setSources(result.sources);
      setLastUpdated(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "ニュースの取得に失敗しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative content-area shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl safe-top">
        <div className="px-5 py-4 pt-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-red-500">TECH INSIGHTS</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment Intel</p>
          </div>
          <div className="text-right pb-0.5">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-ping' : 'bg-green-500'} shadow-[0_0_8px_rgba(34,197,94,0.6)]`}></div>
              <span className="text-[10px] font-mono text-slate-300 uppercase">{loading ? 'Searching' : 'Live Feed'}</span>
            </div>
            {lastUpdated && <span className="text-[9px] text-slate-500">REFRESHED: {lastUpdated}</span>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6 mb-24">
        {articles.length === 0 && !loading && !error && (
          <div className="mt-12 text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📡</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase">Ready for Analysis</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">タップして最新のテック投資ニュースを生成します。AIがリアルタイムで市場を調査します。</p>
            <button 
              onClick={handleFetchNews}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
            >
              Get Breaking News
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-1">Scanning Markets</p>
              <p className="text-xs text-slate-400">最新ニュースを分析中...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center shadow-sm">
            <span className="text-3xl mb-3 block">⚠️</span>
            <p className="text-red-700 text-sm font-bold leading-relaxed">{error}</p>
            <button 
              onClick={handleFetchNews}
              className="mt-4 px-6 py-2 bg-red-600 text-white text-xs font-black rounded-full shadow-md uppercase"
            >
              再試行する
            </button>
          </div>
        )}

        {!loading && articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}

        {/* Grounding Sources */}
        {!loading && sources.length > 0 && (
          <div className="mt-12 mb-10 px-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-300"></span> Information Sources
            </h4>
            <div className="space-y-2">
              {sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-medium text-slate-600 hover:text-blue-600 active:bg-blue-50 transition-colors"
                >
                  <span className="text-blue-500 flex-shrink-0">🔗</span>
                  <span className="truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Persistent CTA Button (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent safe-bottom z-40">
        <div className="max-w-md mx-auto">
          <button 
            disabled={loading}
            onClick={handleFetchNews}
            className="w-full bg-slate-900 disabled:bg-slate-700 text-white font-black py-4 rounded-2xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              <>
                Update Intel
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
