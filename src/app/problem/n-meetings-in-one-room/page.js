"use client";

import { useState } from "react";
import NMeetingsVisualizer from "@/components/NMeetingsVisualizer";

export default function NMeetingsPage() {
  const [activeTab, setActiveTab] = useState("description");

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
                  ? "bg-surface-800 text-white border-b-2 border-primary-500"
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
              <h2 className="text-2xl font-bold text-white">N Meetings in One Room</h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-500/20 text-green-400">Easy</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-md bg-primary-500/20 text-primary-400">Greedy</span>
              </div>
              
              <p className="text-white/80 leading-relaxed mt-4">
                Given one meeting room and N meetings represented by two arrays, `start` and `end`, where `start[i]` represents the start time of the ith meeting and `end[i]` represents the end time of the ith meeting.
              </p>
              <p className="text-white/80 leading-relaxed">
                Determine the maximum number of meetings that can be accommodated in the meeting room if only one meeting can be held at a time.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
                <h4 className="font-bold mb-2">Example 1</h4>
                <p className="text-sm font-mono text-white/70 mb-1">Input: Start = [1, 3, 0, 5, 8, 5] , End = [2, 4, 6, 7, 9, 9]</p>
                <p className="text-sm font-mono text-white/70 mb-2">Output: 4</p>
                <p className="text-sm text-white/60">Explanation: The meetings that can be accommodated are (1,2), (3,4), (5,7), (8,9).</p>
              </div>
            </div>
          )}

          {activeTab === "java" && (
            <div className="h-full">
              <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
                <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span> {"{\n"}
                {"    "}<span className="text-blue-400">public int</span> <span className="text-yellow-200">maxMeetings</span>{"(int start[], int end[], int n) {\n"}
                {"        "}<span className="text-green-500">// Group into objects and sort by end time</span>{"\n"}
                {"        "}int[][] m = new int[n][2];{"\n"}
                {"        "}<span className="text-purple-400">for</span> (int i=0; i&lt;n; i++) {"{\n"}
                {"            "}m[i][0] = start[i];{"\n"}
                {"            "}m[i][1] = end[i];{"\n"}
                {"        }\n\n"}
                {"        "}Arrays.sort(m, (a,b) -&gt; a[1] - b[1]);{"\n\n"}
                {"        "}int count = <span className="text-orange-400">1</span>;{"\n"}
                {"        "}int lastEnd = m[0][1];{"\n\n"}
                {"        "}<span className="text-purple-400">for</span> (int i=1; i&lt;n; i++) {"{\n"}
                {"            "}<span className="text-purple-400">if</span> (m[i][0] &gt; lastEnd) {"{\n"}
                {"                "}count++;{"\n"}
                {"                "}lastEnd = m[i][1];{"\n"}
                {"            }\n"}
                {"        }\n"}
                {"        "}<span className="text-purple-400">return</span> count;{"\n"}
                {"    }\n"}
                {"}\n"}
              </pre>
            </div>
          )}

          {activeTab === "python" && (
            <div className="h-full">
              <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
                <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span>{":\n"}
                {"    "}<span className="text-blue-400">def</span> <span className="text-yellow-200">maximumMeetings</span>{"(self,n,start,end):\n"}
                {"        "}<span className="text-green-500"># Zip and sort by end time</span>{"\n"}
                {"        "}meetings = sorted(zip(start, end), key=<span className="text-purple-400">lambda</span> x: x[1]){"\n\n"}
                {"        "}count = <span className="text-orange-400">1</span>{"\n"}
                {"        "}last_end = meetings[0][1]{"\n\n"}
                {"        "}<span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-blue-300">range</span>(1, n):{"\n"}
                {"            "}<span className="text-purple-400">if</span> meetings[i][0] &gt; last_end:{"\n"}
                {"                "}count += 1{"\n"}
                {"                "}last_end = meetings[i][1]{"\n\n"}
                {"        "}<span className="text-purple-400">return</span> count{"\n"}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Visualizer */}
      <div className="w-full md:w-1/2 lg:w-3/5 p-4 lg:p-6 bg-[#0f172a]">
        <NMeetingsVisualizer />
      </div>
    </div>
  );
}
