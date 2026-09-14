import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Hide button completely if already launched as standalone app
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-btn"
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-amber-100/90 text-amber-900 hover:from-amber-100 hover:to-amber-200/90 text-xs font-semibold shadow-xs transition-all cursor-pointer hover:shadow-sm"
        title="Cài đặt ứng dụng về máy tính hoặc điện thoại để dùng offline không cần mạng"
      >
        <Download className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
        <span className="hidden sm:inline">Cài đặt về máy (Dùng Offline)</span>
        <span className="sm:hidden">Cài Offline</span>
      </button>

      {/* Guide Modal for iOS or manual install on Chrome/Edge */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowGuideModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                {isIOS ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isIOS ? 'Cài đặt trên iPhone / iPad' : 'Cài đặt ứng dụng vào máy'}
                </h3>
                <p className="text-xs text-slate-500">Mở và quay số mọi lúc không cần mạng</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/70 mb-5">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>
                    Nhấn vào biểu tượng <strong>Chia sẻ (Share)</strong> ở thanh dưới trình duyệt Safari.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>
                    Cuộn xuống và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>
                    Nhấn <strong>Thêm (Add)</strong> ở góc trên bên phải để hoàn tất.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/70 mb-5">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>
                    Trên thanh địa chỉ trình duyệt Chrome / Edge / Cốc Cốc, nhấn vào biểu tượng <strong>Cài đặt ứng dụng</strong> (hình máy tính có mũi tên xuống ở góc phải thanh URL).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>
                    Nhấn nút <strong>Cài đặt (Install)</strong> trong thông báo xác nhận.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>
                    Ứng dụng sẽ xuất hiện như một phần mềm độc lập ngoài màn hình Desktop / Menu ứng dụng.
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowGuideModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
