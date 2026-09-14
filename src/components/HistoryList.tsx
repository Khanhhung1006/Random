import React, { useState } from 'react';
import { DrawHistoryItem } from '../types';
import { Trophy, Copy, Check, Trash2, History } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HistoryListProps {
  history: DrawHistoryItem[];
  onClearHistory: () => void;
  totalPool: number;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onClearHistory,
  totalPool,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    soundManager.playClick();
    const text = history
      .map((item) => `Lần ${item.order}: ${item.number}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-white/80 backdrop-blur-sm border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-base sm:text-lg">
            Danh Sách Số Đã Quay ({history.length}/{totalPool})
          </h3>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
              title="Sao chép danh sách kết quả"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClearHistory();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              title="Xóa lịch sử đã quay"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xóa lịch sử</span>
            </button>
          </div>
        )}
      </div>

      {/* List content */}
      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Chưa có số nào được quay. Hãy nhấn nút "Quay Số" ở trên.
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2.5 max-h-60 overflow-y-auto p-1">
            {history.map((item, index) => {
              const isLatest = index === 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isLatest
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105 border border-amber-600'
                      : 'bg-slate-100/90 text-slate-800 hover:bg-slate-200/90 border border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                      isLatest ? 'bg-amber-600/60 text-amber-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    #{item.order}
                  </span>
                  <span className="text-base font-bold tabular-nums tracking-wide">
                    {item.number}
                  </span>
                  {isLatest && <Trophy className="w-3.5 h-3.5 text-amber-200 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
