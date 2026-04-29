"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

export default function MinPlatformsVisualizer() {
  const [arrStr, setArrStr] = useState("900, 940, 950, 1100, 1500, 1800");
  const [depStr, setDepStr] = useState("910, 1200, 1120, 1130, 1900, 2000");
  
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to convert time "940" to minutes from 00:00 "580"
  const toMinutes = (time) => {
    const t = parseInt(time);
    const hours = Math.floor(t / 100);
    const minutes = t % 100;
    return hours * 60 + minutes;
  };

  // Helper to format minutes "580" back to "0940"
  const toTimeStr = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}`;
  };

  const generateSteps = () => {
    const arrivals = arrStr.split(",").map(s => s.trim());
    const departures = depStr.split(",").map(s => s.trim());

    if (arrivals.some(s => isNaN(parseInt(s))) || departures.some(s => isNaN(parseInt(s))) || arrivals.length !== departures.length) {
      alert("Invalid input. Please ensure comma-separated numbers of equal length.");
      return;
    }

    const trains = arrivals.map((arr, i) => {
      const startMin = toMinutes(arr);
      const endMin = toMinutes(departures[i]);
      return { 
        id: i + 1, 
        startRaw: arr, 
        endRaw: departures[i],
        start: startMin, 
        end: endMin,
        originalIdx: i 
      };
    });

    if (trains.some(t => t.start > t.end)) {
        alert("Departure time cannot be before arrival time.");
        return;
    }

    // Sort by arrival time for platform assignment simulation
    const sortedTrains = [...trains].sort((a, b) => a.start - b.start);
    
    const newSteps = [];
    
    newSteps.push({
      message: "Initial trains loaded and sorted by Arrival Time to simulate chronological events.",
      platforms: [], // Array of arrays: [ [train1, train2], [train3] ]
      activeTrainId: null,
      maxPlatforms: 0,
      minTime: Math.min(...sortedTrains.map(t => t.start)),
      maxTime: Math.max(...sortedTrains.map(t => t.end))
    });

    let currentPlatforms = [];

    for (let i = 0; i < sortedTrains.length; i++) {
      const train = sortedTrains[i];
      
      // Step: Checking train
      newSteps.push({
        message: `Train ${train.id} arriving at ${train.startRaw}. Checking if any existing platform is free...`,
        platforms: JSON.parse(JSON.stringify(currentPlatforms)),
        activeTrainId: train.id,
        checking: true,
        maxPlatforms: currentPlatforms.length,
        minTime: newSteps[0].minTime,
        maxTime: newSteps[0].maxTime
      });

      let assignedPlatformIdx = -1;
      
      // Find first free platform
      for (let p = 0; p < currentPlatforms.length; p++) {
        const platformTrains = currentPlatforms[p];
        const lastTrain = platformTrains[platformTrains.length - 1];
        if (lastTrain.end <= train.start) {
          assignedPlatformIdx = p;
          break;
        }
      }

      if (assignedPlatformIdx !== -1) {
        // Platform found
        const lastTrain = currentPlatforms[assignedPlatformIdx][currentPlatforms[assignedPlatformIdx].length - 1];
        currentPlatforms[assignedPlatformIdx].push(train);
        newSteps.push({
            message: `Platform ${assignedPlatformIdx + 1} is free! (Previous train departed at ${lastTrain.endRaw}). Train ${train.id} parks here.`,
            platforms: JSON.parse(JSON.stringify(currentPlatforms)),
            activeTrainId: train.id,
            checking: false,
            maxPlatforms: currentPlatforms.length,
            minTime: newSteps[0].minTime,
            maxTime: newSteps[0].maxTime
        });
      } else {
        // No platform found, create new
        currentPlatforms.push([train]);
        newSteps.push({
            message: `No existing platforms are free (all currently occupied). Opening a NEW Platform ${currentPlatforms.length} for Train ${train.id}.`,
            platforms: JSON.parse(JSON.stringify(currentPlatforms)),
            activeTrainId: train.id,
            checking: false,
            maxPlatforms: currentPlatforms.length,
            minTime: newSteps[0].minTime,
            maxTime: newSteps[0].maxTime
        });
      }
    }

    newSteps.push({
      message: `🎉 All trains processed! Maximum number of overlapping trains is ${currentPlatforms.length}, so we need ${currentPlatforms.length} platforms.`,
      platforms: JSON.parse(JSON.stringify(currentPlatforms)),
      activeTrainId: null,
      checking: false,
      maxPlatforms: currentPlatforms.length,
      minTime: newSteps[0].minTime,
      maxTime: newSteps[0].maxTime
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
      }, 1500); // Slightly slower for this one to read messages
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIdx] || null;

  // Scale calculations
  const minTime = currentStep ? currentStep.minTime - 60 : 0; // Padding 1 hr
  const maxTime = currentStep ? currentStep.maxTime + 60 : 1440; // Padding 1 hr
  const timeSpan = maxTime - minTime || 1;

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Visualizer Header Controls */}
      <div className="p-4 border-b border-white/10 bg-surface-900/50 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end">
        {/* Inputs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full xl:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Arrivals</label>
            <input 
              value={arrStr} onChange={(e) => setArrStr(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full sm:w-48 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
            />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Departures</label>
            <input 
              value={depStr} onChange={(e) => setDepStr(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-full sm:w-48 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
            />
          </div>
          <button onClick={generateSteps} className="px-5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto h-[34px]">
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
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-orange-400"
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
          className="absolute top-0 left-0 h-full bg-orange-500/10 transition-all duration-500 ease-out border-r border-orange-500/30" 
          style={{ width: `${steps.length > 1 ? (currentStepIdx / (steps.length - 1)) * 100 : 0}%` }}
        />
        
        <div className="relative p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-[10px] uppercase text-orange-400 font-bold tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
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
              <div className="text-[10px] uppercase font-bold text-orange-400/80 mb-0.5 tracking-wider">Platforms Required</div>
              <div className="text-2xl font-black text-orange-500 leading-none">{currentStep?.maxPlatforms || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 relative p-6 overflow-auto pattern-grid bg-[#0f172a]">
        {currentStep && (
          <div className="relative min-w-[700px] w-full min-h-[300px] flex flex-col gap-6 pt-10">
            {/* Timeline markers */}
            <div className="absolute top-0 left-0 w-full flex justify-between pointer-events-none opacity-30 px-16">
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const markerTime = minTime + (timeSpan * pct);
                return (
                  <div key={i} className="h-[500px] border-l border-white border-dashed relative">
                    <span className="absolute -top-6 -left-4 text-xs font-mono bg-[#0f172a] px-1">{toTimeStr(markerTime)}</span>
                  </div>
                );
              })}
            </div>

            {/* Platforms rendering */}
            {currentStep.platforms.length === 0 && (
              <div className="text-center text-white/30 mt-20 italic">Click Play to begin assigning trains to platforms.</div>
            )}
            
            <AnimatePresence>
              {currentStep.platforms.map((platformTrains, pIdx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`plat-${pIdx}`} 
                  className="relative h-16 w-full flex items-center border border-white/5 bg-white/[0.02] rounded-xl pl-16 pr-4"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/5 border-r border-white/10 flex items-center justify-center font-bold text-white/50 rounded-l-xl text-sm">
                    P{pIdx + 1}
                  </div>
                  
                  {/* Container for absolute trains relative to the timeline (excluding the P1 label width) */}
                  <div className="relative w-full h-full">
                    {platformTrains.map(train => {
                      const leftPct = ((train.start - minTime) / timeSpan) * 100;
                      const widthPct = ((train.end - train.start) / timeSpan) * 100;
                      const isChecking = currentStep.checking && currentStep.activeTrainId === train.id;
                      const isJustAdded = !currentStep.checking && currentStep.activeTrainId === train.id;

                      let blockStyle = "bg-surface-700/80 border-surface-600 text-white/70";
                      if (isChecking) {
                        blockStyle = "bg-warning-500 border-warning-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20 scale-105";
                      } else if (isJustAdded) {
                        blockStyle = "bg-orange-500 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] z-10";
                      } else {
                        blockStyle = "bg-orange-500/20 border-orange-500/30 text-orange-400";
                      }

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            left: `${leftPct}%`,
                            width: `${Math.max(widthPct, 2)}%`
                          }}
                          transition={{ type: "spring", stiffness: 60, damping: 12 }}
                          key={`train-${train.id}`}
                          className={`absolute top-1/2 -translate-y-1/2 h-10 rounded-lg border flex items-center justify-center font-bold text-xs transition-all duration-300 group ${blockStyle}`}
                        >
                          T{train.id}
                          {/* Tooltip */}
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50">
                            Arr: {train.startRaw} | Dep: {train.endRaw}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
