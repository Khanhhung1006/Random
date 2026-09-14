import React, { useState } from 'react';
import { X, Sparkles, Check, HelpCircle, ListFilter, Hash, AlertCircle } from 'lucide-react';
import { LotteryConfig, DrawMode } from '../types';
import { soundManager } from '../utils/audio';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LotteryConfig;
  onSaveConfig: (newConfig: LotteryConfig) => void;
  isSpinning: boolean;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  isSpinning,
}) => {
  const [mode, setMode] = useState<DrawMode>(config.mode);
  const [minVal, setMinVal] = useState<number>(config.min);
  const [maxVal, setMaxVal] = useState<number>(config.max);
  const [customText, setCustomText] = useState<string>(config.customListText);
  const [padZero, setPadZero] = useState<boolean>(config.padZero);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    { label: '1 - 10 (Mini)', min: 1, max: 10 },
    { label: '1 - 50 (Vừa)', min: 1, max: 50 },
    { label: '1 - 100 (Phổ biến)', min: 1, max: 100 },
    { label: '1 - 90 (Lô tô)', min: 1, max: 90 },
    { label: '1 - 500 (Sự kiện)', min: 1, max: 500 },
  ];

  const handleApplyPreset = (min: number, max: number) => {
    soundManager.playClick();
    setMode('range');
    setMinVal(min);
    setMaxVal(max);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSpinning) return;

    if (mode === 'range') {
      if (isNaN(minVal) || isNaN(maxVal)) {
        setErrorMsg('Vui lòng nhập giá trị số hợp lệ');
        return;
      }
      if (minVal >= maxVal) {
        setErrorMsg('Số bắt đầu (Min) phải nhỏ hơn số kết thúc (Max)');
        return;
      }
      if (maxVal - minVal > 10000) {
        setErrorMsg('Khoảng cách số tối đa khuyến nghị là 10.000 số');
        return;
      }
    } else {
      const items = customText
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (items.length === 0) {
        setErrorMsg('Vui lòng nhập ít nhất một số vào danh sách tùy chọn');
        return;
      }
    }

    soundManager.playClick();
    onSaveConfig({
      ...config,
      mode,
      min: minVal,
      max: maxVal,
      customListText: customText,
      padZero,
    });
    onClose();
  };

  // Calculate total items preview
  const previewCount =
    mode === 'range'
      ? Math.max(0, maxVal - minVal + 1)
      : customText
          .split(/[\n,;]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h2 className="text-lg font-bold text-slate-900">Cài Đặt Số Quay Thưởng</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Mode Switch Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Hình thức chọn số
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('range');
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  mode === 'range'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Hash className="w-4 h-4 text-amber-600" />
                <span>Theo khoảng số (Min - Max)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('custom');
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  mode === 'custom'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-4 h-4 text-amber-600" />
                <span>Danh sách tự chọn</span>
              </button>
            </div>
          </div>

          {/* Mode = Range */}
          {mode === 'range' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Số bắt đầu (Từ)
                  </label>
                  <input
                    type="number"
                    value={minVal}
                    onChange={(e) => setMinVal(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold text-slate-800 text-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Số kết thúc (Đến)
                  </label>
                  <input
                    type="number"
                    value={maxVal}
                    onChange={(e) => setMaxVal(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold text-slate-800 text-lg tabular-nums"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Bộ số mẫu nhanh:
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyPreset(p.min, p.max)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        minVal === p.min && maxVal === p.max
                          ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Mode = Custom List */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-600">
                  Nhập danh sách số hoặc mã:
                </label>
                <span className="text-xs text-slate-500">Phân tách bằng dấu phẩy hoặc xuống dòng</span>
              </div>
              <textarea
                rows={5}
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Ví dụ: 08, 15, 23, 42, 68, 79, 88, 99&#10;hoặc dán danh sách số báo danh vào đây..."
                className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 text-sm font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Options: Leading Zero */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="pad-zero-checkbox"
                type="checkbox"
                checked={padZero}
                onChange={(e) => setPadZero(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <label htmlFor="pad-zero-checkbox" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                Tự động đệm số 0 ở đầu (ví dụ: 01, 02... hoặc 001, 002...)
              </label>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Pool Summary Box */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <span>Tổng số lượng số trong danh sách:</span>
            <strong className="text-sm font-bold text-amber-800">{previewCount} số</strong>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng & Làm mới</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
