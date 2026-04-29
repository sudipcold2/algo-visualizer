"use client";

import { useMemo } from "react";
import NonOverlappingVisualizer from "@/components/NonOverlappingVisualizer";
import ProblemLayout from "@/components/ProblemLayout";

export default function NonOverlappingPage() {
  const javaCodeRaw = `class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;

        // Sort by end time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 0;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < lastEnd) {
                // Overlaps, we must remove it
                count++;
            } else {
                // Non-overlapping, we keep it and update lastEnd
                lastEnd = intervals[i][1];
            }
        }
        return count;
    }
}`;

  const dryRunSteps = useMemo(() => {
    const steps = [];
    let intervals = [[1, 2], [2, 3], [3, 4], [1, 3]];
    
    // Simulate line by line execution
    steps.push({ line: 1, variables: { intervals: JSON.stringify(intervals) }, callStack: ["eraseOverlapIntervals"] });
    steps.push({ line: 2, variables: { intervals: "Array[4]" }, callStack: ["eraseOverlapIntervals"] });
    
    // sorting
    intervals.sort((a, b) => a[1] - b[1]);
    steps.push({ line: 5, variables: { intervals: JSON.stringify(intervals) }, callStack: ["eraseOverlapIntervals"] });

    let count = 0;
    steps.push({ line: 7, variables: { intervals: "Sorted Array", count }, callStack: ["eraseOverlapIntervals"] });

    let lastEnd = intervals[0][1];
    steps.push({ line: 8, variables: { intervals: "Sorted Array", count, lastEnd }, callStack: ["eraseOverlapIntervals"] });

    for (let i = 1; i < intervals.length; i++) {
      steps.push({ line: 10, variables: { count, lastEnd, i }, callStack: ["eraseOverlapIntervals"] });
      steps.push({ line: 11, variables: { count, lastEnd, i, "intervals[i][0]": intervals[i][0] }, callStack: ["eraseOverlapIntervals"] });
      if (intervals[i][0] < lastEnd) {
        count++;
        steps.push({ line: 13, variables: { count, lastEnd, i }, callStack: ["eraseOverlapIntervals"] });
      } else {
        lastEnd = intervals[i][1];
        steps.push({ line: 16, variables: { count, lastEnd, i }, callStack: ["eraseOverlapIntervals"] });
      }
    }
    
    steps.push({ line: 19, variables: { count, lastEnd }, callStack: ["eraseOverlapIntervals"] });
    steps.push({ line: 19, variables: { count, return: count }, callStack: ["eraseOverlapIntervals"] });

    return steps;
  }, []);

  const descriptionNode = (
    <>
      <p className="text-white/80 leading-relaxed mt-4">
        Given an array of N intervals in the form of <code>(start[i], end[i])</code>, where <code>start[i]</code> is the starting point of the interval and <code>end[i]</code> is the ending point of the interval, return the <strong>minimum number of intervals that need to be removed</strong> to make the remaining intervals non-overlapping.
      </p>
      <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-3 rounded-lg border border-white/10">
        <strong>Note:</strong> Intervals which only touch at a point are also considered as non-overlapping. For example, <code>[1, 3]</code> and <code>[3, 4]</code> are non-overlapping.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
        <h4 className="font-bold mb-2">Example 1</h4>
        <p className="text-sm font-mono text-white/70 mb-1">Input: Intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]</p>
        <p className="text-sm font-mono text-white/70 mb-2">Output: 1</p>
        <p className="text-sm text-white/60">Explanation: You can remove the interval [1, 3] to make the remaining intervals non-overlapping.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
        <h4 className="font-bold mb-2">Example 2</h4>
        <p className="text-sm font-mono text-white/70 mb-1">Input: Intervals = [[1, 3], [1, 4], [3, 5], [3, 4], [4, 5]]</p>
        <p className="text-sm font-mono text-white/70 mb-2">Output: 2</p>
        <p className="text-sm text-white/60">Explanation: You can remove the intervals [1, 4] and [3, 5] and the remaining intervals become non-overlapping.</p>
      </div>
    </>
  );

  const javaCodeNode = (
    <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
      <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span> {"{\n"}
      {"    "}<span className="text-blue-400">public int</span> <span className="text-yellow-200">eraseOverlapIntervals</span>{"(int[][] intervals) {\n"}
      {"        "}<span className="text-purple-400">if</span> (intervals.length == <span className="text-orange-400">0</span>) <span className="text-purple-400">return</span> <span className="text-orange-400">0</span>;{"\n\n"}
      {"        "}<span className="text-green-500">// Sort by end time</span>{"\n"}
      {"        "}Arrays.sort(intervals, (a, b) -&gt; Integer.compare(a[1], b[1]));{"\n\n"}
      {"        "}int count = <span className="text-orange-400">0</span>;{"\n"}
      {"        "}int lastEnd = intervals[0][1];{"\n\n"}
      {"        "}<span className="text-purple-400">for</span> (int i = 1; i &lt; intervals.length; i++) {"{\n"}
      {"            "}<span className="text-purple-400">if</span> (intervals[i][0] &lt; lastEnd) {"{\n"}
      {"                "}<span className="text-green-500">// Overlaps, we must remove it</span>{"\n"}
      {"                "}count++;{"\n"}
      {"            } else {\n"}
      {"                "}<span className="text-green-500">// Non-overlapping, we keep it and update lastEnd</span>{"\n"}
      {"                "}lastEnd = intervals[i][1];{"\n"}
      {"            }\n"}
      {"        }\n"}
      {"        "}<span className="text-purple-400">return</span> count;{"\n"}
      {"    }\n"}
      {"}\n"}
    </pre>
  );

  const pythonCodeNode = (
    <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
      <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span>{":\n"}
      {"    "}<span className="text-blue-400">def</span> <span className="text-yellow-200">eraseOverlapIntervals</span>{"(self, intervals: List[List[int]]) -> int:\n"}
      {"        "}<span className="text-purple-400">if</span> <span className="text-purple-400">not</span> intervals:{"\n"}
      {"            "}<span className="text-purple-400">return</span> <span className="text-orange-400">0</span>{"\n\n"}
      {"        "}<span className="text-green-500"># Sort by end time</span>{"\n"}
      {"        "}intervals.sort(key=<span className="text-purple-400">lambda</span> x: x[1]){"\n\n"}
      {"        "}count = <span className="text-orange-400">0</span>{"\n"}
      {"        "}last_end = intervals[0][1]{"\n\n"}
      {"        "}<span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-blue-300">range</span>(1, <span className="text-blue-300">len</span>(intervals)):{"\n"}
      {"            "}<span className="text-purple-400">if</span> intervals[i][0] &lt; last_end:{"\n"}
      {"                "}<span className="text-green-500"># Overlaps</span>{"\n"}
      {"                "}count += 1{"\n"}
      {"            "}<span className="text-purple-400">else</span>:{"\n"}
      {"                "}<span className="text-green-500"># Non-overlapping</span>{"\n"}
      {"                "}last_end = intervals[i][1]{"\n\n"}
      {"        "}<span className="text-purple-400">return</span> count{"\n"}
    </pre>
  );

  return (
    <ProblemLayout 
      title="Non-Overlapping Intervals"
      difficulty="Medium"
      category="Greedy"
      themeColor="purple"
      descriptionNode={descriptionNode}
      javaCodeNode={javaCodeNode}
      pythonCodeNode={pythonCodeNode}
      javaCodeRaw={javaCodeRaw}
      graphicalVisualizer={<NonOverlappingVisualizer />}
      dryRunSteps={dryRunSteps}
    />
  );
}
