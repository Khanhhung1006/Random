import { LotteryConfig, SavedList } from '../types';

const STORAGE_KEY = 'lucky_draw_config_v3';

export const SAMPLE_STUDENTS_42 = `LÊ QUỐC AN
ĐỖ BÁ TÙNG ANH
NGUYỄN QUỲNH ANH
VŨ QUANG ANH
PHÙNG NGỌC BẢO
NGUYỄN NGỌC MINH CHÂU
BÙI MINH ĐỨC
NGUYỄN MINH ĐỨC
LÊ ĐÌNH DŨNG
NGUYỄN TUẤN DŨNG
HOÀNG HẢI DƯƠNG
NGUYỄN THÙY DƯƠNG
HOÀNG NGÔ VÂN HÀ
LÃ THANH HÀ
NGUYỄN NGỌC HÀ
HOÀNG NAM HẢI
NGUYỄN HỮU GIA HƯNG
PHẠM TRẦN TẤN HƯNG
TRẦN GIA HƯNG
LÂM ĐỨC VIỆT KHANG
NGUYỄN GIA KHÁNH
NGUYỄN KIM KHÁNH
LÊ ĐĂNG KHÔI
TỐNG KHÁNH LINH
PHẠM GIA MINH
CHU ĐỨC MINH
VŨ ĐỨC MINH
NGÔ HẢI NAM
NGUYỄN TÀI NHẬT NAM
PHẠM THÀNH NAM
TRẦN GIA NGHĨA
PHẠM KHÔI NGUYÊN
ĐỖ HUY PHÚC
PHẠM MINH QUANG
VŨ GIA THANH
VŨ NGUYÊN THẢO
NGÔ THANH THỦY
KIỀU DUY TÙNG
NGUYỄN NGUYÊN TÙNG
NGUYỄN THANH TÙNG
NGUYỄN HÀ VI
ĐỖ QUANG VINH`;

export const DEFAULT_SAVED_LISTS: SavedList[] = [
  {
    id: 'sample-students-42',
    name: 'Danh sách 42 học sinh (Mẫu)',
    content: SAMPLE_STUDENTS_42,
    updatedAt: Date.now(),
  },
  {
    id: 'sample-numbers-1',
    name: 'Mã số may mắn (Mẫu)',
    content: `08, 15, 23, 42, 68, 79, 88, 99, 102, 115, 128, 168`,
    updatedAt: Date.now(),
  },
];

export const DEFAULT_CONFIG: LotteryConfig = {
  mode: 'custom',
  min: 1,
  max: 100,
  customListText: SAMPLE_STUDENTS_42,
  uniqueOnly: true,
  padZero: true,
  padLength: 2,
  duration: 'normal',
  soundEnabled: true,
  savedLists: DEFAULT_SAVED_LISTS,
  activeListId: 'sample-students-42',
};

export function loadSavedConfig(): LotteryConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);

    // Merge with defaults in case of missing fields
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      savedLists: Array.isArray(parsed.savedLists) && parsed.savedLists.length > 0
        ? parsed.savedLists
        : DEFAULT_SAVED_LISTS,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfigToStorage(config: LotteryConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save configuration to localStorage', err);
  }
}
