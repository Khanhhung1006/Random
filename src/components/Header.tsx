import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetAll: () => void;
  onToggleConfigModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isNameMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onResetAll,
  onToggleConfigModal,
  isFullscreen,
  onToggleFullscreen,
  isNameMode = false,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-3 sm:py-3.5 px-4 sm:px-8 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-2.5">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold text-base tracking-wider"
          title={isNameMode ? 'Chế độ: Chọn theo danh sách tên' : 'Chế độ: Quay số ngẫu nhiên'}
        >
          {isNameMode ? '👥' : '🎲'}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Toggle Sound */}
        <button
          id="toggle-sound-btn"
          type="button"
          aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          onClick={() => {
            soundManager.playClick();
            onToggleSound();
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-2xs'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
          }`}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* Configuration Button */}
        <button
          id="config-settings-btn"
          type="button"
          aria-label={isNameMode ? 'Đổi danh sách' : 'Cài đặt số'}
          onClick={() => {
            soundManager.playClick();
            onToggleConfigModal();
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
          title={isNameMode ? 'Đổi danh sách tên' : 'Cài đặt khoảng số'}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        {/* Reset All */}
        <button
          id="reset-all-btn"
          type="button"
          aria-label="Làm mới lại toàn bộ danh sách"
          onClick={() => {
            soundManager.playClick();
            onResetAll();
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs"
          title="Làm mới lại toàn bộ"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Fullscreen Button */}
        <button
          id="fullscreen-toggle-btn"
          type="button"
          aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          onClick={() => {
            soundManager.playClick();
            onToggleFullscreen();
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs"
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình trình chiếu'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
