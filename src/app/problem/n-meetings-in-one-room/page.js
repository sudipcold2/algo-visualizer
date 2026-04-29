"use client";

import { useMemo } from "react";
import NMeetingsVisualizer from "@/components/NMeetingsVisualizer";
import ProblemLayout from "@/components/ProblemLayout";

export default function NMeetingsPage() {
  const javaCodeRaw = `class Solution {
    public int maxMeetings(int start[], int end[], int n) {
        // Group into objects and sort by end time
        int[][] m = new int[n][2];
        for (int i=0; i<n; i++) {
            m[i][0] = start[i];
            m[i][1] = end[i];
        }

        Arrays.sort(m, (a,b) -> a[1] - b[1]);

        int count = 1;
        int lastEnd = m[0][1];

        for (int i=1; i<n; i++) {
            if (m[i][0] > lastEnd) {
                count++;
                lastEnd = m[i][1];
            }
        }
        return count;
    }
}`;

  const dryRunSteps = useMemo(() => {
    const steps = [];
    const start = [1, 3, 0, 5, 8, 5];
    const end = [2, 4, 6, 7, 9, 9];
    const n = 6;
    
    // Simulate line by line execution
    steps.push({ line: 1, variables: { start, end, n }, callStack: ["maxMeetings"] });
    
    let m = [];
    for (let i = 0; i < n; i++) {
      m.push([start[i], end[i]]);
    }
    steps.push({ line: 3, variables: { start, end, n, m: "int[6][2]" }, callStack: ["maxMeetings"] });
    
    // sorting
    m.sort((a, b) => a[1] - b[1]);
    steps.push({ line: 9, variables: { n, m: JSON.stringify(m) }, callStack: ["maxMeetings"] });

    let count = 1;
    steps.push({ line: 11, variables: { n, m: "Sorted Array", count }, callStack: ["maxMeetings"] });

    let lastEnd = m[0][1];
    steps.push({ line: 12, variables: { n, count, lastEnd }, callStack: ["maxMeetings"] });

    for (let i = 1; i < n; i++) {
      steps.push({ line: 14, variables: { n, count, lastEnd, i }, callStack: ["maxMeetings"] });
      steps.push({ line: 15, variables: { n, count, lastEnd, i, "m[i][0]": m[i][0] }, callStack: ["maxMeetings"] });
      if (m[i][0] > lastEnd) {
        count++;
        steps.push({ line: 16, variables: { n, count, lastEnd, i }, callStack: ["maxMeetings"] });
        lastEnd = m[i][1];
        steps.push({ line: 17, variables: { n, count, lastEnd, i }, callStack: ["maxMeetings"] });
      }
    }
    
    steps.push({ line: 20, variables: { count, lastEnd }, callStack: ["maxMeetings"] });
    steps.push({ line: 20, variables: { count, return: count }, callStack: ["maxMeetings"] });

    return steps;
  }, []);

  const descriptionNode = (
    <>
      <p className="text-white/80 leading-relaxed mt-4">
        Given one meeting room and N meetings represented by two arrays, <code>start</code> and <code>end</code>, where <code>start[i]</code> represents the start time of the ith meeting and <code>end[i]</code> represents the end time of the ith meeting.
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
    </>
  );

  const javaCodeNode = (
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
  );

  const pythonCodeNode = (
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
  );

  return (
    <ProblemLayout 
      title="N Meetings in One Room"
      difficulty="Easy"
      category="Greedy"
      themeColor="primary"
      descriptionNode={descriptionNode}
      javaCodeNode={javaCodeNode}
      pythonCodeNode={pythonCodeNode}
      javaCodeRaw={javaCodeRaw}
      graphicalVisualizer={<NMeetingsVisualizer />}
      dryRunSteps={dryRunSteps}
    />
  );
}
