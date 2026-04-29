"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, StepForward, RotateCcw, ListTree, Variable } from "lucide-react";

export default function CodeDebugger({ code, steps }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const codeRef = useRef(null);
  
  const codeLines = code.trim().split('\n');
  const currentStep = steps[currentStepIdx] || { line: -1, variables: {}, callStack: [] };

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
      }, 1000); // 1 second per line
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Auto-scroll to active line
  useEffect(() => {
    if (currentStep.line >= 0 && codeRef.current) {
      const activeLineEl = codeRef.current.querySelector(`[data-line="${currentStep.line}"]`);
      if (activeLineEl) {
        activeLineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep.line]);

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] rounded-2xl border border-white/10 overflow-hidden shadow-2xl font-mono text-sm">
      
      {/* Top Toolbar */}
      <div className="p-3 border-b border-white/10 bg-[#111827] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-error-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-warning-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-success-500/80"></div>
          </div>
          <span className="text-white/40 text-xs ml-4 uppercase tracking-widest font-bold">Dry Run Debugger</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setCurrentStepIdx(0)} 
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white" 
            title="Restart"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={() => {
              if (currentStepIdx >= steps.length - 1) setCurrentStepIdx(0);
              setIsPlaying(!isPlaying);
            }} 
            className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition-colors text-cyan-400"
            title={isPlaying ? "Pause" : "Auto Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button 
            onClick={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))} 
            disabled={currentStepIdx === steps.length - 1 || isPlaying} 
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-white"
            title="Step Forward"
          >
            <StepForward size={16} />
          </button>
        </div>
      </div>

      {/* Main Content: Split Pane */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        
        {/* Left Pane: Code Editor */}
        <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-[#0f172a] relative">
          
          <div className="flex-1 overflow-y-auto p-4" ref={codeRef}>
            <div className="relative">
              {/* Highlight Background */}
              <AnimatePresence>
                {currentStep.line >= 0 && (
                  <motion.div 
                    initial={false}
                    animate={{ top: `${currentStep.line * 24}px` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute left-0 right-0 h-[24px] bg-cyan-500/10 border-l-2 border-cyan-400 pointer-events-none"
                    style={{ zIndex: 0 }}
                  />
                )}
              </AnimatePresence>

              {/* Code Lines */}
              {codeLines.map((line, idx) => {
                const isActive = idx === currentStep.line;
                return (
                  <div 
                    key={idx} 
                    data-line={idx}
                    className={`flex items-center h-[24px] px-2 relative z-10 transition-colors duration-200 ${isActive ? "text-cyan-100" : "text-white/60"}`}
                  >
                    <span className={`w-8 text-right mr-4 select-none text-xs ${isActive ? "text-cyan-500/80 font-bold" : "text-white/20"}`}>
                      {idx + 1}
                    </span>
                    <pre className="m-0 p-0 bg-transparent text-sm whitespace-pre">
                      {line || " "}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane: State Viewers (Variables & Stack) */}
        <div className="w-full lg:w-2/5 flex flex-col bg-[#111827]">
          
          {/* Variables Panel */}
          <div className="flex-1 flex flex-col border-b border-white/10 min-h-[50%]">
            <div className="px-3 py-2 bg-black/20 border-b border-white/5 flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest">
              <Variable size={14} className="text-purple-400" /> Variables
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence mode="popLayout">
                {Object.entries(currentStep.variables || {}).map(([key, value]) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={key} 
                    className="flex items-center justify-between bg-white/5 border border-white/5 rounded-md px-3 py-2"
                  >
                    <span className="text-purple-300 font-medium">{key}</span>
                    <span className="text-green-300 font-bold">{JSON.stringify(value)}</span>
                  </motion.div>
                ))}
                {Object.keys(currentStep.variables || {}).length === 0 && (
                  <div className="text-white/20 text-xs italic text-center mt-4">No variables initialized</div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Call Stack Panel */}
          <div className="flex-1 flex flex-col min-h-[50%]">
            <div className="px-3 py-2 bg-black/20 border-b border-white/5 flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest">
              <ListTree size={14} className="text-orange-400" /> Call Stack
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col-reverse gap-2"> {/* Reverse so top of stack is visually at the top/bottom depending on preference. Let's do top of stack at the top. */}
                <AnimatePresence>
                  {(currentStep.callStack || []).map((frame, idx) => {
                    const isTop = idx === (currentStep.callStack.length - 1);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={`${frame}-${idx}`}
                        className={`px-3 py-2 border rounded-md text-sm ${
                          isTop 
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-200" 
                            : "bg-white/5 border-white/10 text-white/50"
                        }`}
                      >
                        {frame}
                      </motion.div>
                    );
                  })}
                  {(currentStep.callStack || []).length === 0 && (
                    <div className="text-white/20 text-xs italic text-center mt-4">Stack empty</div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Status Bar */}
      <div className="p-2 border-t border-white/10 bg-[#0f172a] flex justify-between items-center text-xs text-white/30">
        <div>Step {currentStepIdx + 1} of {steps.length || 1}</div>
        <div>{isPlaying ? "Running..." : "Paused"}</div>
      </div>
    </div>
  );
}
