"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

export default function NonOverlappingVisualizer() {
  const [intervalsStr, setIntervalsStr] = useState("[1, 2], [2, 3], [3, 4], [1, 3]");
  
  const [originalIntervals, setOriginalIntervals] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Parse inputs and generate steps
  const generateSteps = () => {
    // Parse "[1, 2], [2, 3]" format
    let parsed = [];
    try {
      const cleanStr = intervalsStr.replace(/\s/g, "");
      const matches = cleanStr.match(/\[\d+,\d+\]/g);
      if (!matches) throw new Error("Invalid format");
      
      parsed = matches.map(m => {
        const [start, end] = m.replace("[", "").replace("]", "").split(",");
        return { start: parseInt(start), end: parseInt(end) };
      });
    } catch (e) {
      alert("Invalid input format. Please use: [start, end], [start, end]");
      return;
    }

    if (parsed.some(m => isNaN(m.start) || isNaN(m.end))) {
      alert("Invalid numbers in input.");
      return;
    }

    const intervals = parsed.map((m, i) => ({ id: i + 1, start: m.start, end: m.end, originalIdx: i }));
    setOriginalIntervals(intervals);

    const newSteps = [];
    
    // Step 0: Initial
    newSteps.push({
      message: "Initial intervals loaded. The greedy approach requires us to sort them by end time first.",
      intervals: [...intervals],
      states: intervals.reduce((acc, m) => ({ ...acc, [m.id]: "pending" }), {}),
      lastSelectedEnd: -1,
      removedCount: 0,
      checkingId: null,
    });

    // Step 1: Sorted
    const sorted = [...intervals].sort((a, b) => {
      if (a.end === b.end) return a.start - b.start;
      return a.end - b.end;
    });

    newSteps.push({
      message: "Step 1: Intervals sorted by End Time. We will now iterate through them.",
      intervals: [...sorted],
      states: sorted.reduce((acc, m) => ({ ...acc, [m.id]: "pending" }), {}),
      lastSelectedEnd: -1,
      removedCount: 0,
      checkingId: null,
    });

    // Handle first element edge case since we might need to set lastSelectedEnd safely
    let lastSelectedEnd = -Infinity;
    let removedCount = 0;
    const currentStates = sorted.reduce((acc, m) => ({ ...acc, [m.id]: "pending" }), {});

    for (let i = 0; i < sorted.length; i++) {
      const m = sorted[i];
      
      if (lastSelectedEnd === -Infinity) {
          // First item always kept
          lastSelectedEnd = m.end;
          currentStates[m.id] = "selected";
          newSteps.push({
            message: `Keeping first interval M${m.id} [${m.start}, ${m.end}]. Last End initialized to ${lastSelectedEnd}.`,
            intervals: [...sorted],
            states: { ...currentStates },
            lastSelectedEnd,
            removedCount,
            checkingId: null,
          });
          continue;
      }

      // Checking
      newSteps.push({
        message: `Checking M${m.id} [${m.start}, ${m.end}]. Does it overlap? (Start ${m.start} < Last End ${lastSelectedEnd}?)`,
        intervals: [...sorted],
        states: { ...currentStates, [m.id]: "checking" },
        lastSelectedEnd,
        removedCount,
        checkingId: m.id,
      });

      if (m.start >= lastSelectedEnd) {
        lastSelectedEnd = m.end;
        currentStates[m.id] = "selected";
        
        newSteps.push({
          message: `✅ M${m.id} does NOT overlap! Start (${m.start}) >= previous end. Kept. Last End updated to ${lastSelectedEnd}.`,
          intervals: [...sorted],
          states: { ...currentStates },
          lastSelectedEnd,
          removedCount,
          checkingId: null,
        });
      } else {
        removedCount++;
        currentStates[m.id] = "rejected";
        newSteps.push({
          message: `❌ M${m.id} OVERLAPS! Start (${m.start}) < ${lastSelectedEnd}. Removing interval.`,
          intervals: [...sorted],
          states: { ...currentStates },
          lastSelectedEnd,
          removedCount,
          checkingId: null,
        });
      }
    }

    newSteps.push({
      message: `🎉 Algorithm complete! Minimum intervals removed to avoid overlap: ${removedCount}.`,
      intervals: [...sorted],
      states: { ...currentStates },
      lastSelectedEnd,
      removedCount,
      checkingId: null,
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSteps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playback logic
  useEffect(() => {
    let interval;
    if (isPlaying && steps.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIdx] || null;

  // Max time for scale
  const maxTime = currentStep ? Math.max(...currentStep.intervals.map((m) => m.end)) + 2 : 15;

  const stateColors = {
    pending: "bg-surface-700/80 border-surface-600 text-white/70",
    checking: "bg-warning-500 border-warning-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] z-10",
    selected: "bg-success-500 border-success-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    rejected: "bg-error-500 border-error-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]",
  };

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Visualizer Header Controls */}
      <div className="p-4 border-b border-white/10 bg-surface-900/50 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">
        {/* Inputs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full xl:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Intervals</label>
            <input 
              value={intervalsStr} onChange={(e) => setIntervalsStr(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full sm:w-80 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              placeholder="[[1, 2], [2, 3]]"
            />
          </div>
          <button onClick={generateSteps} className="px-5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto h-[34px]">
            Apply
          </button>
        </div>

        {/* Playback */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 self-end xl:self-auto w-full sm:w-auto justify-center">
          <button onClick={() => setCurrentStepIdx(0)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white" title="Reset">
            <RotateCcw size={18} />
          </button>
          <button onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))} disabled={currentStepIdx === 0} className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30">
            <SkipBack size={18} />
          </button>
          <button 
            onClick={() => {
              if (currentStepIdx >= steps.length - 1) setCurrentStepIdx(0);
              setIsPlaying(!isPlaying);
            }} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-purple-400"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={currentStepIdx === steps.length - 1} className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30">
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Algorithm Status Dashboard */}
      <div className="bg-surface-800/80 border-b border-white/10 relative overflow-hidden shadow-inner">
        {/* Progress Bar Background */}
        <div 
          className="absolute top-0 left-0 h-full bg-purple-500/10 transition-all duration-500 ease-out border-r border-purple-500/30" 
          style={{ width: `${steps.length > 1 ? (currentStepIdx / (steps.length - 1)) * 100 : 0}%` }}
        />
        
        <div className="relative p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-[10px] uppercase text-purple-400 font-bold tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Execution Status
              </h3>
              <span className="text-xs font-mono text-white/30 px-2 py-0.5 rounded-md bg-black/30 border border-white/5">Step {currentStepIdx + 1} of {steps.length || 1}</span>
            </div>
            <p className="text-base font-medium text-white/90">
              {currentStep?.message || "Ready to begin"}
            </p>
          </div>
          
          <div className="bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-center self-end sm:self-auto shrink-0 flex items-center shadow-lg">
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-error-400/80 mb-0.5 tracking-wider">Intervals Removed</div>
              <div className="text-2xl font-black text-error-500 leading-none">{currentStep?.removedCount || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 relative p-6 overflow-auto pattern-grid">
        {currentStep && (
          <div className="relative min-w-[500px] w-full min-h-[300px]">
            {/* X-Axis scale */}
            <div className="absolute top-0 w-full h-full flex justify-between pointer-events-none opacity-20">
              {Array.from({ length: maxTime + 1 }).map((_, i) => (
                <div key={i} className="h-full border-l border-white border-dashed relative">
                  <span className="absolute -top-6 -left-2 text-xs font-mono">{i}</span>
                </div>
              ))}
            </div>

            {/* Timeline Pointer */}
            <AnimatePresence>
              {currentStep.lastSelectedEnd !== -Infinity && currentStep.lastSelectedEnd !== -1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, left: `${(currentStep.lastSelectedEnd / maxTime) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="absolute top-0 bottom-0 w-0.5 bg-purple-500 z-0 shadow-[0_0_10px_rgba(168,85,247,1)]"
                >
                  <div className="absolute -top-8 -left-10 bg-purple-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap font-bold shadow-lg">
                    Last End: {currentStep.lastSelectedEnd}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Intervals */}
            <div className="relative mt-8 space-y-3 z-10">
              {currentStep.intervals.map((m) => {
                const state = currentStep.states[m.id];
                const widthPercent = ((m.end - m.start) / maxTime) * 100;
                const leftPercent = (m.start / maxTime) * 100;

                return (
                  <motion.div
                    layout
                    key={m.id}
                    transition={{ type: "spring", stiffness: 60, damping: 14 }}
                    className="relative h-12 w-full group"
                  >
                    <motion.div
                      layout
                      initial={false}
                      animate={{
                        width: `${Math.max(widthPercent, 2)}%`,
                        left: `${leftPercent}%`,
                      }}
                      className={`absolute h-full rounded-xl border flex items-center justify-center font-bold text-sm transition-colors duration-300 ${stateColors[state]}`}
                    >
                      M{m.id}
                      
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50">
                        Start: {m.start} | End: {m.end}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
