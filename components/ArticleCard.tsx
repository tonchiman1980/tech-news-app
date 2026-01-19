
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 active:scale-[0.99] transition-transform">
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">Breaking</span>
          <span className="text-yellow-400 font-bold text-sm tracking-widest">{article.importance}</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
      </div>
      
      <div className="p-5">
        <h2 className="text-xl font-extrabold text-slate-900 leading-tight mb-4">{article.title}</h2>
        
        <div className="space-y-4">
          <section className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded-r-lg">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-1">ニュース要旨</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{article.originalText}</p>
          </section>

          <section className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-blue-700 flex items-center gap-2 mb-2 uppercase">
              <span>🧠</span> わかりやすく解説
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">{article.summary}</p>
          </section>

          <section className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-indigo-700 flex items-center gap-2 mb-2 uppercase">
              <span>💡</span> 投資ポイント
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">{article.whyImportant}</p>
          </section>

          <section className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-orange-700 flex items-center gap-2 mb-2 uppercase">
              <span>⚠️</span> リスク分析
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">{article.risks}</p>
          </section>

          {(article.companies.japan.length > 0 || article.companies.us.length > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">関連銘柄</h3>
              <div className="flex flex-wrap gap-2">
                {article.companies.japan.map((c, i) => (
                  <span key={`jp-${i}`} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-mono font-medium border border-slate-200">
                    🇯🇵 {c}
                  </span>
                ))}
                {article.companies.us.map((c, i) => (
                  <span key={`us-${i}`} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-mono font-medium border border-slate-200">
                    🇺🇸 {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
