import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetAll: () => void;
  onToggleConfigModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onResetAll,
  onToggleConfigModal,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-4 px-4 sm:px-8 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold text-base tracking-wider">
          🎲
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          Chính xác & Minh bạch
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Sound */}
        <button
          id="toggle-sound-btn"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onToggleSound();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            soundEnabled
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
          }`}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
        </button>

        {/* Configuration Button */}
        <button
          id="config-settings-btn"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onToggleConfigModal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
          title="Tùy chỉnh khoảng số"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Cài đặt số</span>
        </button>

        {/* Reset All */}
        <button
          id="reset-all-btn"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onResetAll();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
          title="Làm mới lại toàn bộ số"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Làm mới</span>
        </button>

        {/* Fullscreen Button */}
        <button
          id="fullscreen-toggle-btn"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onToggleFullscreen();
          }}
          className="p-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình trình chiếu'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
