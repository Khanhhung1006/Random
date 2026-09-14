import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Laptop, CheckCircle2, ShieldCheck, HardDriveDownload } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (isInstallable && !isInstalled) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        return;
      }
    }
    // Always open modal with detailed guide & offline status
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        id="pwa-install-btn"
        type="button"
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition-all cursor-pointer ${
          isInstalled
            ? 'border-emerald-300 bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400'
            : 'border-amber-300 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
        }`}
        title={
          isInstalled
            ? 'Ứng dụng đã được cài đặt vào máy của bạn - Sẵn sàng dùng Offline 100%'
            : 'Cài đặt ứng dụng về máy tính hoặc điện thoại để dùng offline không cần mạng'
        }
      >
        {isInstalled ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Offline sẵn sàng (Đã cài)</span>
            <span className="sm:hidden">Đã cài</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 shrink-0 animate-bounce" />
            <span className="hidden sm:inline">Cài đặt về máy (Offline)</span>
            <span className="sm:hidden">Cài về máy</span>
          </>
        )}
      </button>

      {/* Guide & Status Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
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

            {isInstalled ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ứng dụng đã được cài đặt vào máy!
                    </h3>
                    <p className="text-xs text-emerald-700 font-medium">
                      Đang hoạt động độc lập ở chế độ Offline
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 mb-5">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Không cần Internet:</strong> Toàn bộ giao diện, âm thanh và thuật toán quay đã được lưu trữ an toàn trong bộ nhớ máy của bạn.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Biểu tượng ngoài Desktop:</strong> Bạn có thể tắt trình duyệt và mở ứng dụng trực tiếp từ màn hình Desktop hoặc menu ứng dụng bất kỳ lúc nào.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Bảo toàn dữ liệu:</strong> Danh sách 42 học sinh và lịch sử quay được lưu trực tiếp trên thiết bị này.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Cài đặt ứng dụng để dùng Offline
                    </h3>
                    <p className="text-xs text-slate-500">
                      Chạy trực tiếp ngoài Desktop / Điện thoại không cần mạng
                    </p>
                  </div>
                </div>

                {/* Direct Install Button if supported by browser */}
                {isInstallable && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={async () => {
                        soundManager.playClick();
                        const outcome = await install();
                        if (outcome) {
                          setShowGuideModal(false);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Nhấn vào đây để Cài đặt ngay</span>
                    </button>
                  </div>
                )}

                {/* Instructions by Device */}
                <div className="space-y-3 mb-5">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <Laptop className="w-4 h-4 text-amber-600" />
                      <span>Trên máy tính (Chrome, Edge, Cốc Cốc, Brave):</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                      <li>• <strong>Cách 1:</strong> Nhìn lên góc phải thanh địa chỉ (URL) của trình duyệt, bấm vào biểu tượng <strong>Cài đặt ứng dụng</strong> (hình máy tính kèm mũi tên tải xuống).</li>
                      <li>• <strong>Cách 2:</strong> Nhấn nút <strong>3 chấm (...)</strong> ở góc trên bên phải trình duyệt $\rightarrow$ Chọn <strong>"Cài đặt Quay Số Ngẫu Nhiên"</strong>.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>Trên điện thoại (iOS Safari hoặc Android Chrome):</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                      <li>• <strong>iPhone / iPad:</strong> Nhấn nút <strong>Chia sẻ (Share)</strong> ở thanh dưới $\rightarrow$ Cuộn xuống chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</li>
                      <li>• <strong>Android:</strong> Nhấn menu <strong>3 chấm</strong> góc trên $\rightarrow$ Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setShowGuideModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};
