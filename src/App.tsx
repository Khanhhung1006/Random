import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { DisplayNumber } from './components/DisplayNumber';
import { Controls } from './components/Controls';
import { ConfigurationModal } from './components/ConfigurationModal';
import { HistoryList } from './components/HistoryList';
import { FinishedModal } from './components/FinishedModal';
import { LotteryConfig, DrawHistoryItem, SpinDuration } from './types';
import { soundManager } from './utils/audio';
import { triggerCelebration, triggerGrandFinish } from './utils/confetti';

const DEFAULT_CONFIG: LotteryConfig = {
  mode: 'range',
  min: 1,
  max: 100,
  customListText: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
  uniqueOnly: true,
  padZero: true,
  padLength: 2,
  duration: 'normal',
  soundEnabled: true,
};

export default function App() {
  const [config, setConfig] = useState<LotteryConfig>(DEFAULT_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Pool management
  const [remainingPool, setRemainingPool] = useState<string[]>([]);
  const [history, setHistory] = useState<DrawHistoryItem[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState<boolean>(false);

  // Sound sync
  useEffect(() => {
    soundManager.setMuted(!config.soundEnabled);
  }, [config.soundEnabled]);

  // Generate complete pool based on config
  const fullPool = useMemo(() => {
    let rawItems: string[] = [];
    if (config.mode === 'range') {
      const min = Math.min(config.min, config.max);
      const max = Math.max(config.min, config.max);
      const maxDigits = String(max).length;

      for (let i = min; i <= max; i++) {
        if (config.padZero) {
          rawItems.push(String(i).padStart(maxDigits, '0'));
        } else {
          rawItems.push(String(i));
        }
      }
    } else {
      const parts = config.customListText
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      rawItems = Array.from(new Set(parts)); // unique items
    }
    return rawItems;
  }, [config.mode, config.min, config.max, config.customListText, config.padZero]);

  // Initialize or reset remaining pool when full pool changes
  useEffect(() => {
    setRemainingPool(fullPool);
    setHistory([]);
    setCurrentDisplay(null);
  }, [fullPool]);

  // Fullscreen state handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Animation references
  const timerRef = useRef<number | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Spin Logic with realistic deceleration physics
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    // Determine current pool to draw from
    const pool = config.uniqueOnly ? remainingPool : fullPool;

    if (pool.length === 0) {
      soundManager.playEmptyAlert();
      setIsFinishedModalOpen(true);
      return;
    }

    setIsSpinning(true);

    // Duration mapping in milliseconds
    const durationMap: Record<SpinDuration, number> = {
      fast: 1500,
      normal: 3000,
      suspense: 5000,
    };
    const totalDuration = durationMap[config.duration];
    const startTime = Date.now();

    // Select the final chosen item beforehand from the available pool
    const chosenIndex = Math.floor(Math.random() * pool.length);
    const finalWinner = pool[chosenIndex];

    // For spinning effect, pick randomly from fullPool to make animation dynamic
    const animationSamplePool = fullPool.length > 0 ? fullPool : pool;

    let currentInterval = 40; // starts super fast

    const runTick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      if (progress < 1) {
        // Still spinning: pick a random item to display
        const randomTemp =
          animationSamplePool[Math.floor(Math.random() * animationSamplePool.length)];
        setCurrentDisplay(randomTemp);

        // Calculate pitch multiplier for audio: slightly slows pitch as it decelerates
        const pitchMultiplier = 1.2 - progress * 0.4;
        soundManager.playTick(pitchMultiplier);

        // Deceleration formula (cubic ease-out curve)
        // Interval slows down from 40ms to ~350ms towards the end
        currentInterval = 40 + Math.pow(progress, 3) * 320;

        timerRef.current = window.setTimeout(runTick, currentInterval);
      } else {
        // Finish Spin!
        setCurrentDisplay(finalWinner);
        setIsSpinning(false);

        // Update history
        const newHistoryItem: DrawHistoryItem = {
          id: `${Date.now()}-${Math.random()}`,
          number: finalWinner,
          order: history.length + 1,
          timestamp: new Date(),
        };

        const updatedHistory = [newHistoryItem, ...history];
        setHistory(updatedHistory);

        // Update remaining pool if unique only
        let remainingAfterDraw = pool;
        if (config.uniqueOnly) {
          const newRemaining = remainingPool.filter((_, idx) => idx !== chosenIndex);
          setRemainingPool(newRemaining);
          remainingAfterDraw = newRemaining;
        }

        // Sound & Confetti celebration
        soundManager.playWinFanfare();
        triggerCelebration();

        // Check if finished
        if (config.uniqueOnly && remainingAfterDraw.length === 0) {
          setTimeout(() => {
            triggerGrandFinish();
            setIsFinishedModalOpen(true);
          }, 800);
        }
      }
    };

    runTick();
  }, [isSpinning, config.uniqueOnly, config.duration, remainingPool, fullPool, history]);

  // Reset entire draw session
  const handleReset = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setIsSpinning(false);
    setRemainingPool(fullPool);
    setHistory([]);
    setCurrentDisplay(null);
    setIsFinishedModalOpen(false);
  };

  // Keyboard shortcut listener for Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea or modal is open
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        isConfigOpen
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isSpinning && (config.uniqueOnly ? remainingPool.length > 0 : fullPool.length > 0)) {
          handleSpin();
        } else if (remainingPool.length === 0 && config.uniqueOnly) {
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, isConfigOpen, remainingPool.length, fullPool.length, config.uniqueOnly, handleSpin]);

  const isFinished = config.uniqueOnly && remainingPool.length === 0 && history.length > 0;
  const canSpin = config.uniqueOnly ? remainingPool.length > 0 : fullPool.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-radial from-slate-100 via-amber-50/30 to-slate-200/90 text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Navigation / App Header */}
      <Header
        soundEnabled={config.soundEnabled}
        onToggleSound={() =>
          setConfig((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onResetAll={handleReset}
        onToggleConfigModal={() => setIsConfigOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col items-center justify-center">
        {/* Large Prominent Display Card */}
        <DisplayNumber
          currentDisplay={currentDisplay}
          isSpinning={isSpinning}
          hasDrawn={history.length > 0 && currentDisplay !== null}
          isFinished={isFinished}
          drawOrder={history.length}
          totalRemaining={config.uniqueOnly ? remainingPool.length : fullPool.length}
          totalPool={fullPool.length}
          uniqueOnly={config.uniqueOnly}
        />

        {/* Spin & Quick Controls */}
        <Controls
          isSpinning={isSpinning}
          isFinished={isFinished}
          uniqueOnly={config.uniqueOnly}
          onToggleUnique={() =>
            setConfig((prev) => ({ ...prev, uniqueOnly: !prev.uniqueOnly }))
          }
          duration={config.duration}
          onChangeDuration={(dur) =>
            setConfig((prev) => ({ ...prev, duration: dur }))
          }
          onSpin={handleSpin}
          onReset={handleReset}
          canSpin={canSpin}
        />

        {/* History of Drawn Numbers */}
        <HistoryList
          history={history}
          onClearHistory={() => setHistory([])}
          totalPool={fullPool.length}
        />
      </main>

      {/* Footer info */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-auto">
        <span>Quay Số Ngẫu Nhiên • Trực quan, ngẫu nhiên tuyệt đối, hỗ trợ bốc thăm & trúng thưởng</span>
      </footer>

      {/* Configuration Modal */}
      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => {
          setConfig(newConfig);
          // Remaining pool will automatically re-derive
        }}
        isSpinning={isSpinning}
      />

      {/* Finished Modal Notice when all numbers have been drawn */}
      <FinishedModal
        isOpen={isFinishedModalOpen}
        onClose={() => setIsFinishedModalOpen(false)}
        onReset={handleReset}
        totalDrawn={history.length}
      />
    </div>
  );
}
