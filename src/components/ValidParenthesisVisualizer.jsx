"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

export default function ValidParenthesisVisualizer() {
  const [inputStr, setInputStr] = useState("(*))");
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSteps = () => {
    const s = inputStr.trim();
    if (!s) return;

    if (!/^[()*]+$/.test(s)) {
      alert("Invalid input. Only '(', ')', and '*' are allowed.");
      return;
    }

    const newSteps = [];
    
    // Step 0: Initial
    newSteps.push({
      message: "Ready to validate string. We will track the minimum (cmin) and maximum (cmax) possible open parentheses.",
      s: s,
      charIdx: -1,
      cmin: 0,
      cmax: 0,
      status: "pending" // pending, valid, invalid
    });

    let cmin = 0;
    let cmax = 0;
    let failedEarly = false;

    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      let msg = `Processing '${char}' at index ${i}. `;

      if (char === '(') {
        cmax++;
        cmin++;
        msg += "It's an open bracket, so we must increment BOTH cmax and cmin.";
      } else if (char === ')') {
        cmax--;
        cmin = Math.max(0, cmin - 1);
        msg += "It's a close bracket, so we decrement cmax. We also decrement cmin (but keep it >= 0).";
      } else if (char === '*') {
        cmax++;
        cmin = Math.max(0, cmin - 1);
        msg += "It's a wildcard! It could be '(', so cmax increases. It could be ')', so cmin decreases (kept >= 0).";
      }

      // Check for early failure
      if (cmax < 0) {
        newSteps.push({
          message: msg + `🚨 cmax is < 0! This means we have more ')' than possible '(' + '*'. The string is definitely INVALID.`,
          s: s,
          charIdx: i,
          cmin: cmin,
          cmax: cmax,
          status: "invalid"
        });
        failedEarly = true;
        break;
      }

      // Normal step
      newSteps.push({
        message: msg,
        s: s,
        charIdx: i,
        cmin: cmin,
        cmax: cmax,
        status: "pending"
      });
    }

    if (!failedEarly) {
      if (cmin === 0) {
        newSteps.push({
          message: `🎉 Reached the end! cmin is 0, which means all open parentheses can be matched. The string is VALID!`,
          s: s,
          charIdx: s.length - 1,
          cmin: cmin,
          cmax: cmax,
          status: "valid"
        });
      } else {
        newSteps.push({
          message: `🚨 Reached the end, but cmin is ${cmin} (> 0). This means there are too many open '(' that cannot be closed. INVALID.`,
          s: s,
          charIdx: s.length - 1,
          cmin: cmin,
          cmax: cmax,
          status: "invalid"
        });
      }
    }

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
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIdx] || null;

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Visualizer Header Controls */}
      <div className="p-4 border-b border-white/10 bg-surface-900/50 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">
        {/* Inputs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full xl:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Input String</label>
            <input 
              value={inputStr} onChange={(e) => setInputStr(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full sm:w-64 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono tracking-widest text-lg"
              placeholder="(*))"
            />
          </div>
          <button onClick={generateSteps} className="px-5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto h-[38px]">
            Validate
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
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-cyan-400"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))} disabled={currentStepIdx === steps.length - 1} className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30">
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Algorithm Status Dashboard */}
      <div className="bg-surface-800/80 border-b border-white/10 relative overflow-hidden shadow-inner min-h-[90px]">
        {/* Progress Bar Background */}
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-500/10 transition-all duration-500 ease-out border-r border-cyan-500/30" 
          style={{ width: `${steps.length > 1 ? (currentStepIdx / (steps.length - 1)) * 100 : 0}%` }}
        />
        
        <div className="relative p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 h-full">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                Execution Status
              </h3>
              <span className="text-xs font-mono text-white/30 px-2 py-0.5 rounded-md bg-black/30 border border-white/5">Step {currentStepIdx + 1} of {steps.length || 1}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white/90 leading-tight max-w-2xl">
              {currentStep?.message || "Ready to begin"}
            </p>
          </div>
          
          <div className="bg-black/30 border border-white/10 px-4 py-2.5 rounded-xl text-center self-end sm:self-auto shrink-0 flex items-center gap-4 shadow-lg">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-cyan-500/70 mb-0.5 tracking-wider">cmin</div>
              <div className="text-2xl font-black text-white leading-none">{currentStep?.cmin || 0}</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-cyan-500/70 mb-0.5 tracking-wider">cmax</div>
              <div className="text-2xl font-black text-cyan-400 leading-none">{currentStep?.cmax || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 relative p-6 overflow-auto bg-[#0f172a] flex flex-col items-center justify-center">
        {currentStep && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-16">
            
            {/* The String Display */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 w-full relative">
              {currentStep.s.split('').map((char, idx) => {
                const isCurrent = idx === currentStep.charIdx;
                const isPast = idx < currentStep.charIdx;
                
                let boxStyle = "bg-surface-800 text-white/40 border-white/5";
                let textStyle = "text-2xl sm:text-4xl";
                
                if (isCurrent) {
                  boxStyle = "bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] z-10 scale-110";
                  textStyle = "text-cyan-400 font-bold text-3xl sm:text-5xl";
                } else if (isPast) {
                  boxStyle = "bg-surface-700 text-white border-white/20";
                }

                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: idx * 0.05 }}
                    className={`relative w-12 h-16 sm:w-16 sm:h-20 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${boxStyle}`}
                  >
                    <span className={`font-mono transition-all duration-300 ${textStyle}`}>
                      {char}
                    </span>
                    {/* Index Label */}
                    <span className="absolute -bottom-6 text-[10px] text-white/30 font-mono">
                      {idx}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Range Visualization */}
            <div className="w-full flex flex-col items-center gap-4">
              <h4 className="text-xs uppercase font-bold text-white/40 tracking-widest">Possible Open Parentheses Range</h4>
              
              <div className="relative w-full max-w-xl h-12 bg-white/5 rounded-full border border-white/10 overflow-hidden flex items-center px-4">
                {/* Visualizer Scale Marks */}
                <div className="absolute top-0 left-0 w-full h-full flex justify-between px-4 pointer-events-none opacity-20">
                  {Array.from({ length: Math.max(10, currentStep.cmax + 2) }).map((_, i) => (
                    <div key={i} className="h-full border-l border-white border-dashed relative">
                      <span className="absolute -top-5 -left-1 text-[8px] font-mono">{i}</span>
                    </div>
                  ))}
                </div>

                {/* Range Bar */}
                <AnimatePresence>
                  {currentStep.cmax >= 0 && (
                    <motion.div
                      layout
                      initial={false}
                      animate={{
                        left: `${(currentStep.cmin / Math.max(10, currentStep.cmax + 2)) * 100}%`,
                        width: `${((currentStep.cmax - currentStep.cmin) / Math.max(10, currentStep.cmax + 2)) * 100}%`
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="absolute h-8 bg-gradient-to-r from-cyan-600/50 to-cyan-400/50 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] min-w-[24px] flex items-center justify-between px-2"
                    >
                       <span className="text-[10px] font-bold text-white shadow-sm">{currentStep.cmin}</span>
                       {currentStep.cmax > currentStep.cmin && (
                           <span className="text-[10px] font-bold text-white shadow-sm">{currentStep.cmax}</span>
                       )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Indicator */}
              <AnimatePresence mode="wait">
                {currentStep.status === "valid" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 px-6 py-3 bg-success-500/20 border border-success-500/50 text-success-400 font-bold rounded-xl text-lg flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                    <span className="text-2xl">✅</span> STRING IS VALID
                  </motion.div>
                )}
                {currentStep.status === "invalid" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 px-6 py-3 bg-error-500/20 border border-error-500/50 text-error-400 font-bold rounded-xl text-lg flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                  >
                    <span className="text-2xl">❌</span> STRING IS INVALID
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
