import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Award, Hash } from 'lucide-react';

interface DisplayNumberProps {
  currentDisplay: string | number | null;
  isSpinning: boolean;
  hasDrawn: boolean;
  isFinished: boolean;
  drawOrder: number;
  totalRemaining: number;
  totalPool: number;
  uniqueOnly: boolean;
}

export const DisplayNumber: React.FC<DisplayNumberProps> = ({
  currentDisplay,
  isSpinning,
  hasDrawn,
  isFinished,
  drawOrder,
  totalRemaining,
  totalPool,
  uniqueOnly,
}) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-4 sm:my-6 flex flex-col items-center justify-center">
      {/* Decorative Outer Aura */}
      <div
        className={`absolute -inset-1 rounded-3xl blur-xl transition-all duration-700 pointer-events-none ${
          isSpinning
            ? 'bg-amber-400/30 opacity-80 scale-105'
            : hasDrawn && !isFinished
            ? 'bg-gradient-to-r from-amber-400/25 via-emerald-400/20 to-amber-500/25 opacity-70'
            : isFinished
            ? 'bg-rose-400/20 opacity-60'
            : 'bg-slate-200/50 opacity-40'
        }`}
      />

      {/* Main Display Stage Container */}
      <div
        id="main-number-display-card"
        className={`relative w-full rounded-3xl border transition-all duration-500 overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px] md:min-h-[540px] px-4 py-8 sm:py-12 ${
          isSpinning
            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/60 shadow-amber-500/20 text-white ring-4 ring-amber-400/30'
            : hasDrawn && !isFinished
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-400/50 text-white shadow-2xl shadow-slate-900/40'
            : isFinished
            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-rose-500/40 text-white'
            : 'bg-gradient-to-b from-white to-slate-50 border-slate-200/90 text-slate-900 shadow-xl'
        }`}
      >
        {/* Subtle grid and ornamental background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />

        {/* Top Header Badge */}
        <div className="z-10 mb-4 sm:mb-6 flex flex-wrap items-center justify-center gap-2">
          {isSpinning ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1, 1.04, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Đang quay ngẫu nhiên...
            </motion.div>
          ) : isFinished ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-rose-500/20 text-rose-300 border border-rose-400/40">
              <span>Đã quay hết số trong danh sách!</span>
            </div>
          ) : hasDrawn ? (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Số được chọn (Lần quay #{drawOrder})</span>
            </motion.div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sẵn sàng bắt đầu</span>
            </div>
          )}
        </div>

        {/* Core Number Output - Big, Bold, Tabular, Crystal Clear (+30% Larger) */}
        <div className="relative z-10 w-full flex items-center justify-center flex-1 my-auto overflow-hidden">
          <AnimatePresence mode="popLayout">
            {currentDisplay !== null ? (
              <motion.div
                key={String(currentDisplay)}
                initial={
                  isSpinning
                    ? { y: 20, opacity: 0.8, filter: 'blur(2px)' }
                    : { scale: 0.7, opacity: 0, y: -25 }
                }
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={
                  isSpinning
                    ? { y: -20, opacity: 0.4, filter: 'blur(2px)' }
                    : { scale: 1.1, opacity: 0 }
                }
                transition={{
                  type: isSpinning ? 'tween' : 'spring',
                  stiffness: 400,
                  damping: 25,
                  duration: isSpinning ? 0.05 : 0.4,
                }}
                className="relative select-none text-center px-4"
              >
                <span
                  id="target-selected-number"
                  className={`tabular-nums font-black tracking-tight leading-none transition-colors duration-300 ${
                    isSpinning
                      ? 'text-amber-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] text-[5.75rem] sm:text-[8rem] md:text-[10.5rem] lg:text-[14.5rem]'
                      : hasDrawn
                      ? 'text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_12px_30px_rgba(245,158,11,0.45)] text-[7.75rem] sm:text-[10.5rem] md:text-[14.5rem] lg:text-[17rem]'
                      : 'text-slate-800 text-[5.75rem] sm:text-[8rem] md:text-[10.5rem]'
                  }`}
                >
                  {currentDisplay}
                </span>

                {/* Subtitle / Order badge if winner */}
                {!isSpinning && hasDrawn && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center justify-center gap-2 mt-4 text-emerald-400 font-semibold text-sm sm:text-base"
                  >
                    <Award className="w-5 h-5" />
                    <span>Kết quả hợp lệ</span>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Welcome Placeholder */
              <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
                  <Hash className="w-12 h-12 text-slate-300" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-700 mb-1">
                  Chưa quay số nào
                </div>
                <p className="text-sm text-slate-500 max-w-sm">
                  Nhấn nút <strong className="text-amber-600 font-semibold">QUAY SỐ</strong> hoặc bấm{' '}
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono text-slate-700">
                    Phím Cách (Space)
                  </kbd>{' '}
                  để bắt đầu
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Pool & Counter Bar */}
        <div className="z-10 w-full mt-4 sm:mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between px-2 sm:px-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className={hasDrawn ? 'text-slate-400' : 'text-slate-500'}>
              {uniqueOnly ? 'Chế độ: Mỗi số 1 lần' : 'Chế độ: Lặp lại tự do'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Còn lại:{' '}
              <strong
                className={`font-semibold ${
                  totalRemaining === 0
                    ? 'text-rose-400'
                    : totalRemaining <= 3
                    ? 'text-amber-400'
                    : hasDrawn
                    ? 'text-white'
                    : 'text-slate-800'
                }`}
              >
                {totalRemaining}
              </strong>
              /{totalPool} số
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
