"use client";

import { useState } from "react";
import CodeDebugger from "@/components/CodeDebugger";
import { Code2, MonitorPlay } from "lucide-react";

export default function ProblemLayout({ 
  title, 
  difficulty, 
  category, 
  descriptionNode, 
  javaCodeNode,
  pythonCodeNode,
  javaCodeRaw, // For debugger
  graphicalVisualizer,
  dryRunSteps,
  themeColor = "primary" // cyan, purple, orange, primary(green)
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [visMode, setVisMode] = useState("graphical"); // 'graphical' or 'dryrun'

  const colorMap = {
    primary: "border-primary-500 bg-primary-500/20 text-primary-400 focus:ring-primary-500",
    cyan: "border-cyan-500 bg-cyan-500/20 text-cyan-400 focus:ring-cyan-500",
    purple: "border-purple-500 bg-purple-500/20 text-purple-400 focus:ring-purple-500",
    orange: "border-orange-500 bg-orange-500/20 text-orange-400 focus:ring-orange-500",
  };

  const activeColor = colorMap[themeColor] || colorMap.primary;
  const activeBorder = activeColor.split(' ')[0]; // e.g. border-cyan-500
  const activeBgText = activeColor.split(' ').slice(1, 3).join(' '); // e.g. bg-cyan-500/20 text-cyan-400

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] overflow-y-auto md:overflow-hidden">
      {/* Left Pane: Content */}
      <div className="w-full md:w-1/2 lg:w-2/5 border-r border-white/10 flex flex-col bg-background/50 md:overflow-hidden min-h-[50vh]">
        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-surface-900/50 px-2 pt-2">
          {["description", "java", "python"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                activeTab === tab
                  ? \`bg-surface-800 text-white border-b-2 \${activeBorder}\`
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
          {activeTab === "description" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-500/20 text-yellow-400">{difficulty}</span>
                <span className={\`px-2 py-1 text-xs font-semibold rounded-md \${activeBgText}\`}>{category}</span>
              </div>
              
              {descriptionNode}
            </div>
          )}

          {activeTab === "java" && (
            <div className="h-full">
              {javaCodeNode}
            </div>
          )}

          {activeTab === "python" && (
            <div className="h-full">
              {pythonCodeNode}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Visualizer */}
      <div className="w-full md:w-1/2 lg:w-3/5 p-4 lg:p-6 bg-[#0f172a] flex flex-col gap-4">
        
        {/* Toggle Bar */}
        {dryRunSteps && (
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 self-start">
            <button 
              onClick={() => setVisMode("graphical")}
              className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors \${visMode === "graphical" ? activeBgText : "text-white/50 hover:text-white"}\`}
            >
              <MonitorPlay size={16} /> Graphical Visualizer
            </button>
            <button 
              onClick={() => setVisMode("dryrun")}
              className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors \${visMode === "dryrun" ? activeBgText : "text-white/50 hover:text-white"}\`}
            >
              <Code2 size={16} /> Dry Run Debugger
            </button>
          </div>
        )}

        {/* Dynamic Visualizer View */}
        <div className="flex-1 min-h-0">
          {visMode === "graphical" || !dryRunSteps ? (
            graphicalVisualizer
          ) : (
            <CodeDebugger code={javaCodeRaw} steps={dryRunSteps} />
          )}
        </div>
      </div>
    </div>
  );
}
