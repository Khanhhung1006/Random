import React, { useState } from 'react';
import {
  X,
  Check,
  ListFilter,
  Hash,
  AlertCircle,
  BookmarkPlus,
  Trash2,
  Users,
  FileText,
  Sparkles,
  Zap,
  Clock,
  Hourglass,
  Timer,
} from 'lucide-react';
import { LotteryConfig, DrawMode, SavedList, SpinDuration } from '../types';
import { soundManager } from '../utils/audio';
import { SAMPLE_STUDENTS_42 } from '../utils/storage';

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
  const [duration, setDuration] = useState<SpinDuration>(config.duration);
  const [savedLists, setSavedLists] = useState<SavedList[]>(config.savedLists || []);
  const [newListName, setNewListName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const numberPresets = [
    { label: '1 - 10 (Mini)', min: 1, max: 10 },
    { label: '1 - 50 (Vừa)', min: 1, max: 50 },
    { label: '1 - 100 (Phổ biến)', min: 1, max: 100 },
    { label: '1 - 90 (Lô tô)', min: 1, max: 90 },
    { label: '1 - 500 (Sự kiện)', min: 1, max: 500 },
  ];

  const sampleNameSets = [
    {
      title: 'Mẫu 42 học sinh',
      text: SAMPLE_STUDENTS_42,
    },
    {
      title: 'Mẫu 12 nhân viên',
      text: `Nguyễn Văn An\nTrần Thị Mai\nLê Hoàng Phúc\nPhạm Minh Tuấn\nĐỗ Quỳnh Chi\nVũ Gia Bảo\nBùi Thu Trang\nNgô Đức Trọng\nĐặng Hải Yến\nHoàng Kim Ngân\nLý Khánh Linh\nĐinh Quốc Anh`,
    },
  ];

  const handleApplyNumberPreset = (min: number, max: number) => {
    soundManager.playClick();
    setMode('range');
    setMinVal(min);
    setMaxVal(max);
    setErrorMsg(null);
  };

  const handleApplySampleNames = (text: string) => {
    soundManager.playClick();
    setCustomText(text);
    setErrorMsg(null);
    setSuccessNotice('Đã áp dụng danh sách mẫu');
    setTimeout(() => setSuccessNotice(null), 2500);
  };

  const handleLoadSavedList = (item: SavedList) => {
    soundManager.playClick();
    setCustomText(item.content);
    setSuccessNotice(`Đã tải danh sách: "${item.name}"`);
    setTimeout(() => setSuccessNotice(null), 2500);
    setErrorMsg(null);
  };

  const handleSaveCurrentList = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newListName.trim();
    if (!trimmedName) {
      setErrorMsg('Vui lòng nhập tên để lưu danh sách');
      return;
    }

    const items = customText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (items.length === 0) {
      setErrorMsg('Danh sách đang trống, hãy nhập tên trước khi lưu');
      return;
    }

    soundManager.playClick();
    const newList: SavedList = {
      id: `list-${Date.now()}`,
      name: trimmedName,
      content: customText,
      updatedAt: Date.now(),
    };

    const updated = [newList, ...savedLists];
    setSavedLists(updated);
    setNewListName('');
    setErrorMsg(null);
    setSuccessNotice(`Đã lưu thành công: "${trimmedName}"`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleDeleteSavedList = (id: string, name: string) => {
    soundManager.playClick();
    const filtered = savedLists.filter((l) => l.id !== id);
    setSavedLists(filtered);
    setSuccessNotice(`Đã xóa danh sách "${name}"`);
    setTimeout(() => setSuccessNotice(null), 2000);
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
        setErrorMsg('Vui lòng nhập ít nhất một tên hoặc số vào danh sách');
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
      savedLists,
      duration,
    });
    onClose();
  };

  // Calculate parsed items count
  const parsedItems = customText
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const previewCount =
    mode === 'range' ? Math.max(0, maxVal - minVal + 1) : parsedItems.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
              ⚙️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                Cài Đặt Danh Sách & Chế Độ Quay
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập tên, số và lưu danh sách tự động cho những lần sau
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Mode Switch Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Chọn chế độ quay
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('custom');
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
                  mode === 'custom'
                    ? 'bg-white text-amber-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-amber-600" />
                <span>Danh sách Tên / Người</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('range');
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all cursor-pointer ${
                  mode === 'range'
                    ? 'bg-white text-amber-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Hash className="w-4 h-4 text-amber-600" />
                <span>Khoảng số (Min - Max)</span>
              </button>
            </div>
          </div>

          {/* Mode = Custom (Name / Custom list) */}
          {mode === 'custom' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Danh sách Tên người tham gia:
                  </label>
                  <span className="text-xs text-slate-500">
                    Mỗi tên trên một dòng (hoặc cách nhau bằng dấu phẩy)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {sampleNameSets.map((sample) => (
                    <button
                      key={sample.title}
                      type="button"
                      onClick={() => handleApplySampleNames(sample.text)}
                      className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {sample.title}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomText('');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] text-slate-500 hover:text-rose-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Xóa trắng
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  rows={6}
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Nhập hoặc dán danh sách tên tại đây, ví dụ:&#10;Nguyễn Văn An&#10;Trần Thị Mai&#10;Lê Hoàng Phúc&#10;Phạm Minh Tuấn..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 text-sm font-medium leading-relaxed bg-slate-50/50 focus:bg-white transition-all resize-y"
                />
                <div className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 text-slate-600 shadow-xs">
                  {parsedItems.length} tên hợp lệ
                </div>
              </div>

              {/* Save List Section */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <BookmarkPlus className="w-4 h-4 text-amber-600" />
                    <span>Lưu danh sách để dùng lần sau</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Tự động ghi nhớ trên máy
                  </span>
                </div>

                {/* Save input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Đặt tên danh sách (VD: Phòng Marketing, Lớp 12A...)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCurrentList}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Lưu danh sách này
                  </button>
                </div>

                {/* List of Saved Presets */}
                {savedLists.length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                      Các danh sách đã lưu sẵn:
                    </span>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {savedLists.map((item) => (
                        <div
                          key={item.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs text-slate-800 shadow-xs hover:border-amber-400 transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => handleLoadSavedList(item)}
                            className="font-medium text-slate-800 hover:text-amber-700 cursor-pointer text-left"
                            title="Bấm để tải danh sách này vào ô nhập"
                          >
                            {item.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedList(item.id, item.name)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                            title="Xóa danh sách này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Mode = Range */
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
                  {numberPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyNumberPreset(p.min, p.max)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
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
                  <label
                    htmlFor="pad-zero-checkbox"
                    className="text-sm font-medium text-slate-700 select-none cursor-pointer"
                  >
                    Tự động đệm số 0 ở đầu (ví dụ: 01, 02... hoặc 001, 002...)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Duration Selector */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Thời gian quay mỗi lượt:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setDuration('fast');
                }}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  duration === 'fast'
                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Nhanh (1.5s)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setDuration('normal');
                }}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  duration === 'normal'
                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Vừa (3s)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setDuration('suspense');
                }}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  duration === 'suspense'
                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Hourglass className="w-3.5 h-3.5" />
                <span>Kịch tính (5s)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setDuration('tenSec');
                }}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  duration === 'tenSec'
                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>10s (Hồi hộp)</span>
              </button>
            </div>
          </div>

          {/* Feedback Notices */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successNotice && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Pool Summary Box */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <span>Tổng số lượng {mode === 'custom' ? 'tên/người' : 'số'} trong danh sách:</span>
            <strong className="text-sm font-bold text-amber-800">{previewCount}</strong>
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
              <span>Áp dụng & Bắt đầu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
