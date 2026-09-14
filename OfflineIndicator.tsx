import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/95 text-white border border-slate-700/80 px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md animate-fade-in"
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400">
        <WifiOff className="w-3.5 h-3.5" />
      </div>
      <div>
        <span className="font-semibold text-amber-300">Chế độ Offline:</span>{' '}
        <span className="text-slate-200">Đang hoạt động không cần mạng. Quay số và lưu kết quả bình thường!</span>
      </div>
    </div>
  );
};
