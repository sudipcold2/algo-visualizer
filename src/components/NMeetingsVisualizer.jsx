"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

export default function NMeetingsVisualizer() {
  const [startsStr, setStartsStr] = useState("1, 3, 0, 5, 8, 5");
  const [endsStr, setEndsStr] = useState("2, 4, 6, 7, 9, 9");
  
  const [originalMeetings, setOriginalMeetings] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Parse inputs and generate steps
  const generateSteps = () => {
    const starts = startsStr.split(",").map((s) => parseInt(s.trim()));
    const ends = endsStr.split(",").map((s) => parseInt(s.trim()));

    if (starts.some(isNaN) || ends.some(isNaN) || starts.length !== ends.length) {
      alert("Invalid input. Please ensure comma-separated numbers of equal length.");
      return;
    }

    const meetings = starts.map((s, i) => ({ id: i + 1, start: s, end: ends[i], originalIdx: i }));
    setOriginalMeetings(meetings);

    const newSteps = [];
    
    // Step 0: Initial
    newSteps.push({
      message: "Initial meetings loaded. The greedy approach requires us to sort them by end time first.",
      meetings: [...meetings],
      states: meetings.reduce((acc, m) => ({ ...acc, [m.id]: "pending" }), {}),
      lastSelectedEnd: -1,
      selectedCount: 0,
      checkingId: null,
    });

    // Step 1: Sorted
    const sorted = [...meetings].sort((a, b) => {
      if (a.end === b.end) return a.start - b.start;
      return a.end - b.end;
    });

    newSteps.push({
      message: "Step 1: Meetings sorted by End Time. We will now iterate through them.",
      meetings: [...sorted],
      states: sorted.reduce((acc, m) => ({ ...acc, [m.id]: "pending" }), {}),
      lastSelectedEnd: -1,
      selectedCount: 0,
      checkingId: null,
    });

    let lastSelectedEnd = -1;
    let selectedCount = 0;
    const currentStates = sorted.reduce((acc, m) => ({ ...acc, [m.id]: "pending" }), {});

    for (let i = 0; i < sorted.length; i++) {
      const m = sorted[i];
      
      // Checking
      newSteps.push({
        message: `Checking M${m.id} (Start: ${m.start}, End: ${m.end}). Is Start (${m.start}) > Last End (${lastSelectedEnd})?`,
        meetings: [...sorted],
        states: { ...currentStates, [m.id]: "checking" },
        lastSelectedEnd,
        selectedCount,
        checkingId: m.id,
      });

      if (m.start > lastSelectedEnd) {
        lastSelectedEnd = m.end;
        selectedCount++;
        currentStates[m.id] = "selected";
        
        newSteps.push({
          message: `✅ M${m.id} selected! Start (${m.start}) > previous end. Last End updated to ${lastSelectedEnd}.`,
          meetings: [...sorted],
          states: { ...currentStates },
          lastSelectedEnd,
          selectedCount,
          checkingId: null,
        });
      } else {
        currentStates[m.id] = "rejected";
        newSteps.push({
          message: `❌ M${m.id} overlaps. Start (${m.start}) is NOT > ${lastSelectedEnd}. Skipped.`,
          meetings: [...sorted],
          states: { ...currentStates },
          lastSelectedEnd,
          selectedCount,
          checkingId: null,
        });
      }
    }

    newSteps.push({
      message: `🎉 Algorithm complete! Maximum non-overlapping meetings: ${selectedCount}.`,
      meetings: [...sorted],
      states: { ...currentStates },
      lastSelectedEnd,
      selectedCount,
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
  const maxTime = currentStep ? Math.max(...currentStep.meetings.map((m) => m.end)) + 2 : 15;

  const stateColors = {
    pending: "bg-surface-700/80 border-surface-600 text-white/70",
    checking: "bg-warning-500 border-warning-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] z-10",
    selected: "bg-success-500 border-success-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    rejected: "bg-error-500/20 border-error-500/30 text-white/40",
  };

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Visualizer Header Controls */}
      <div className="p-4 border-b border-white/10 bg-surface-900/50 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="space-y-1 flex-1">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Start Times</label>
            <input 
              value={startsStr} onChange={(e) => setStartsStr(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full md:w-48 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">End Times</label>
            <input 
              value={endsStr} onChange={(e) => setEndsStr(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full md:w-48 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
          <button onClick={generateSteps} className="mb-0.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto mt-2 sm:mt-0">
            Apply
          </button>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
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
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-primary-400"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={currentStepIdx === steps.length - 1} className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30">
            <SkipForward size={18} />
          </button>
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
              {currentStep.lastSelectedEnd !== -1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, left: `${(currentStep.lastSelectedEnd / maxTime) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="absolute top-0 bottom-0 w-0.5 bg-primary-500 z-0 shadow-[0_0_10px_rgba(59,130,246,1)]"
                >
                  <div className="absolute -top-8 -left-10 bg-primary-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap font-bold shadow-lg">
                    Last End: {currentStep.lastSelectedEnd}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Meetings */}
            <div className="relative mt-8 space-y-3 z-10">
              {currentStep.meetings.map((m) => {
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

      {/* Status Footer */}
      <div className="p-4 bg-surface-900 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xs uppercase text-white/50 font-bold tracking-wider mb-1">Algorithm Status</h3>
            <p className="text-sm font-medium text-white/90">
              {currentStep?.message || "Ready"}
            </p>
          </div>
          <div className="bg-success-500/20 border border-success-500/30 px-4 py-2 rounded-xl text-center self-end sm:self-auto shrink-0">
            <div className="text-[10px] uppercase font-bold text-success-500 mb-0.5">Selected</div>
            <div className="text-xl font-black text-white leading-none">{currentStep?.selectedCount || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
