import React from 'react';
import { Play, RotateCcw, Zap, Clock, Hourglass, CheckSquare, Square } from 'lucide-react';
import { SpinDuration } from '../types';
import { soundManager } from '../utils/audio';

interface ControlsProps {
  isSpinning: boolean;
  isFinished: boolean;
  uniqueOnly: boolean;
  onToggleUnique: () => void;
  duration: SpinDuration;
  onChangeDuration: (dur: SpinDuration) => void;
  onSpin: () => void;
  onReset: () => void;
  canSpin: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isSpinning,
  isFinished,
  uniqueOnly,
  onToggleUnique,
  duration,
  onChangeDuration,
  onSpin,
  onReset,
  canSpin,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
      {/* Primary Action Button Area */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        {isFinished ? (
          <button
            id="reset-draw-btn"
            type="button"
            onClick={() => {
              soundManager.playClick();
              onReset();
            }}
            className="w-full sm:w-auto min-w-[280px] px-8 py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6 animate-spin-reverse" />
            <span>HẾT SỐ • BẤM ĐẶT LẠI</span>
          </button>
        ) : (
          <button
            id="spin-number-btn"
            type="button"
            disabled={!canSpin || isSpinning}
            onClick={() => {
              if (canSpin && !isSpinning) {
                soundManager.playClick();
                onSpin();
              }
            }}
            className={`w-full sm:w-auto min-w-[280px] px-10 py-5 rounded-2xl font-extrabold text-xl tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer select-none ${
              isSpinning
                ? 'bg-amber-600 text-amber-100 cursor-not-allowed opacity-90 scale-[0.99]'
                : canSpin
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white hover:from-amber-400 hover:to-amber-600 shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {isSpinning ? (
              <>
                <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang quay số...</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                <span>QUAY SỐ</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Keyboard Hint */}
      <p className="text-xs text-slate-500 text-center">
        Mẹo: Có thể bấm phím <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-xs font-mono font-medium text-slate-700">Space</kbd> (phím cách) trên bàn phím để quay nhanh
      </p>

      {/* Auxiliary Settings Bar */}
      <div className="w-full bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Toggle Unique Only */}
        <div
          id="toggle-unique-feature"
          onClick={() => {
            soundManager.playClick();
            onToggleUnique();
          }}
          className="flex items-center gap-3 cursor-pointer select-none p-2 rounded-xl hover:bg-slate-50 transition-colors w-full md:w-auto"
        >
          <div className="text-amber-600">
            {uniqueOnly ? (
              <CheckSquare className="w-5 h-5 fill-amber-600 text-white" />
            ) : (
              <Square className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">
              Mỗi số chỉ xuất hiện 1 lần
            </div>
            <div className="text-xs text-slate-500">
              {uniqueOnly ? 'Đã bật: Không bị trùng lặp số đã quay' : 'Tắt: Các số có thể lặp lại ngẫu nhiên'}
            </div>
          </div>
        </div>

        {/* Speed / Duration Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline mr-1">
            Tốc độ:
          </span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onChangeDuration('fast');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                duration === 'fast'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Nhanh (1.5s)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onChangeDuration('normal');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                duration === 'normal'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Vừa (3s)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onChangeDuration('suspense');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                duration === 'suspense'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hourglass className="w-3.5 h-3.5 text-purple-500" />
              <span>Kịch tính (5s)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
