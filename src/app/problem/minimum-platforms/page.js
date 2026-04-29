"use client";

import { useMemo } from "react";
import MinPlatformsVisualizer from "@/components/MinPlatformsVisualizer";
import ProblemLayout from "@/components/ProblemLayout";

export default function MinPlatformsPage() {
  const javaCodeRaw = `class Solution {
    static int findPlatform(int arr[], int dep[], int n) {
        Arrays.sort(arr);
        Arrays.sort(dep);

        int plat_needed = 1, result = 1;
        int i = 1, j = 0;

        while (i < n && j < n) {
            if (arr[i] <= dep[j]) {
                plat_needed++;
                i++;
            } else if (arr[i] > dep[j]) {
                plat_needed--;
                j++;
            }

            if (plat_needed > result) {
                result = plat_needed;
            }
        }
        return result;
    }
}`;

  const dryRunSteps = useMemo(() => {
    const steps = [];
    const arr = [900, 940, 950, 1100, 1500, 1800];
    const dep = [910, 1200, 1120, 1130, 1900, 2000];
    const n = 6;
    
    // Simulate line by line execution
    steps.push({ line: 1, variables: { arr: "Array[6]", dep: "Array[6]", n }, callStack: ["findPlatform"] });
    
    arr.sort((a,b) => a-b);
    steps.push({ line: 2, variables: { arr: JSON.stringify(arr), dep: "Array[6]", n }, callStack: ["findPlatform"] });
    
    dep.sort((a,b) => a-b);
    steps.push({ line: 3, variables: { arr: "Sorted", dep: JSON.stringify(dep), n }, callStack: ["findPlatform"] });

    let plat_needed = 1, result = 1;
    steps.push({ line: 5, variables: { arr: "Sorted", dep: "Sorted", n, plat_needed, result }, callStack: ["findPlatform"] });

    let i = 1, j = 0;
    steps.push({ line: 6, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });

    while (i < n && j < n) {
      steps.push({ line: 8, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
      steps.push({ line: 9, variables: { plat_needed, result, i, j, "arr[i]": arr[i], "dep[j]": dep[j] }, callStack: ["findPlatform"] });
      
      if (arr[i] <= dep[j]) {
        plat_needed++;
        steps.push({ line: 10, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
        i++;
        steps.push({ line: 11, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
      } else {
        steps.push({ line: 12, variables: { plat_needed, result, i, j, "arr[i]": arr[i], "dep[j]": dep[j] }, callStack: ["findPlatform"] });
        plat_needed--;
        steps.push({ line: 13, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
        j++;
        steps.push({ line: 14, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
      }

      steps.push({ line: 17, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
      if (plat_needed > result) {
        result = plat_needed;
        steps.push({ line: 18, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
      }
    }
    
    steps.push({ line: 21, variables: { plat_needed, result, i, j }, callStack: ["findPlatform"] });
    steps.push({ line: 21, variables: { plat_needed, result, i, j, return: result }, callStack: ["findPlatform"] });

    return steps;
  }, []);

  const descriptionNode = (
    <>
      <p className="text-white/80 leading-relaxed mt-4">
        Given the arrival and departure times of all trains reaching a particular railway station, determine the <strong>minimum number of platforms required</strong> so that no train is kept waiting. Consider all trains arrive and depart on the same day.
      </p>
      
      <p className="text-white/80 leading-relaxed">
        In any particular instance, the same platform cannot be used for both the departure of one train and the arrival of another train, necessitating the use of different platforms in such cases.
      </p>

      <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-3 rounded-lg border border-white/10">
        <strong>Note:</strong> Time intervals are in minutes. Leading zeros for minutes less than 1000 are optional (e.g., 0900 is the same as 900).
      </p>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
        <h4 className="font-bold mb-2">Example 1</h4>
        <p className="text-sm font-mono text-white/70 mb-1">Input: Arrival = [900, 940, 950, 1100, 1500, 1800], Departure = [910, 1200, 1120, 1130, 1900, 2000]</p>
        <p className="text-sm font-mono text-white/70 mb-2">Output: 3</p>
        <p className="text-sm text-white/60">Explanation: <br/>The 1st, 2nd, and 5th trains can use Platform 1. <br/>The 3rd and 6th train can use Platform 2. <br/>The 4th train will use Platform 3.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
        <h4 className="font-bold mb-2">Example 2</h4>
        <p className="text-sm font-mono text-white/70 mb-1">Input: Arrival = [900, 1100, 1235], Departure = [1000, 1200, 1240]</p>
        <p className="text-sm font-mono text-white/70 mb-2">Output: 1</p>
        <p className="text-sm text-white/60">Explanation: All the three trains can use Platform 1.</p>
      </div>
    </>
  );

  const javaCodeNode = (
    <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
      <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span> {"{\n"}
      {"    "}<span className="text-green-500">// Function to find the minimum number of platforms required</span>{"\n"}
      {"    "}<span className="text-blue-400">static int</span> <span className="text-yellow-200">findPlatform</span>{"(int arr[], int dep[], int n) {\n"}
      {"        "}<span className="text-green-500">// Sort arrival and departure arrays</span>{"\n"}
      {"        "}Arrays.sort(arr);{"\n"}
      {"        "}Arrays.sort(dep);{"\n\n"}
      {"        "}int plat_needed = <span className="text-orange-400">1</span>, result = <span className="text-orange-400">1</span>;{"\n"}
      {"        "}int i = <span className="text-orange-400">1</span>, j = <span className="text-orange-400">0</span>;{"\n\n"}
      {"        "}<span className="text-green-500">// Similar to merge in merge sort to process all events in sorted order</span>{"\n"}
      {"        "}<span className="text-purple-400">while</span> (i &lt; n && j &lt; n) {"{\n"}
      {"            "}<span className="text-green-500">// If next event in sorted order is arrival, increment count of platforms needed</span>{"\n"}
      {"            "}<span className="text-purple-400">if</span> (arr[i] &lt;= dep[j]) {"{\n"}
      {"                "}plat_needed++;{"\n"}
      {"                "}i++;{"\n"}
      {"            } "}<span className="text-green-500">// Else decrement count of platforms needed</span>{"\n"}
      {"            "}<span className="text-purple-400">else if</span> (arr[i] &gt; dep[j]) {"{\n"}
      {"                "}plat_needed--;{"\n"}
      {"                "}j++;{"\n"}
      {"            }\n\n"}
      {"            "}<span className="text-green-500">// Update result if needed</span>{"\n"}
      {"            "}<span className="text-purple-400">if</span> (plat_needed &gt; result) {"{\n"}
      {"                "}result = plat_needed;{"\n"}
      {"            }\n"}
      {"        }\n"}
      {"        "}<span className="text-purple-400">return</span> result;{"\n"}
      {"    }\n"}
      {"}\n"}
    </pre>
  );

  const pythonCodeNode = (
    <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
      <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span>{":\n"}
      {"    "}<span className="text-blue-400">def</span> <span className="text-yellow-200">minimumPlatform</span>{"(self, n, arr, dep):\n"}
      {"        "}<span className="text-green-500"># Sort arrival and departure arrays</span>{"\n"}
      {"        "}arr.sort(){"\n"}
      {"        "}dep.sort(){"\n\n"}
      {"        "}plat_needed = <span className="text-orange-400">1</span>{"\n"}
      {"        "}result = <span className="text-orange-400">1</span>{"\n"}
      {"        "}i = <span className="text-orange-400">1</span>{"\n"}
      {"        "}j = <span className="text-orange-400">0</span>{"\n\n"}
      {"        "}<span className="text-green-500"># Process events in sorted order</span>{"\n"}
      {"        "}<span className="text-purple-400">while</span> i &lt; n <span className="text-purple-400">and</span> j &lt; n:{"\n"}
      {"            "}<span className="text-purple-400">if</span> arr[i] &lt;= dep[j]:{"\n"}
      {"                "}<span className="text-green-500"># Train arrives, need a platform</span>{"\n"}
      {"                "}plat_needed += 1{"\n"}
      {"                "}i += 1{"\n"}
      {"            "}<span className="text-purple-400">else</span>:{"\n"}
      {"                "}<span className="text-green-500"># Train departs, free a platform</span>{"\n"}
      {"                "}plat_needed -= 1{"\n"}
      {"                "}j += 1{"\n\n"}
      {"            "}<span className="text-green-500"># Update result</span>{"\n"}
      {"            "}result = <span className="text-blue-300">max</span>(result, plat_needed){"\n\n"}
      {"        "}<span className="text-purple-400">return</span> result{"\n"}
    </pre>
  );

  return (
    <ProblemLayout 
      title="Minimum Number of Platforms"
      difficulty="Medium"
      category="Greedy"
      themeColor="orange"
      descriptionNode={descriptionNode}
      javaCodeNode={javaCodeNode}
      pythonCodeNode={pythonCodeNode}
      javaCodeRaw={javaCodeRaw}
      graphicalVisualizer={<MinPlatformsVisualizer />}
      dryRunSteps={dryRunSteps}
    />
  );
}
