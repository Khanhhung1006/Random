import React from 'react';
import { Trophy, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FinishedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  totalDrawn: number;
  isNameMode?: boolean;
}

export const FinishedModal: React.FC<FinishedModalProps> = ({
  isOpen,
  onClose,
  onReset,
  totalDrawn,
  isNameMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/80 w-full max-w-md overflow-hidden text-center p-6 sm:p-8 flex flex-col items-center relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-5">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {isNameMode ? 'ĐÃ CHỌN HẾT TÊN!' : 'ĐÃ QUAY HẾT SỐ!'}
        </h3>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Tất cả <strong className="text-amber-600 font-bold text-base">{totalDrawn}</strong> {isNameMode ? 'người / tên' : 'số'} trong danh sách đã được bốc thăm đầy đủ và không còn ai trong danh sách chờ.
        </p>

        <div className="w-full bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            Mỗi {isNameMode ? 'tên' : 'số'} đều đã xuất hiện đúng 1 lần theo quy định bốc thăm minh bạch. Bạn có thể làm mới để bắt đầu một lượt quay mới bất kỳ lúc nào.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onReset();
              onClose();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt lại & Quay tiếp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="py-3.5 px-5 rounded-2xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Đóng xem kết quả
          </button>
        </div>
      </div>
    </div>
  );
};
