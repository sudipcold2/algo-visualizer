"use client";

import { useMemo } from "react";
import ValidParenthesisVisualizer from "@/components/ValidParenthesisVisualizer";
import ProblemLayout from "@/components/ProblemLayout";

export default function ValidParenthesisPage() {
  const javaCodeRaw = `class Solution {
    public boolean checkValidString(String s) {
        int cmin = 0;
        int cmax = 0;

        for (char c : s.toCharArray()) {
            if (c == '(') {
                cmax++;
                cmin++;
            } else if (c == ')') {
                cmax--;
                cmin = Math.max(cmin - 1, 0);
            } else if (c == '*') {
                cmax++;
                cmin = Math.max(cmin - 1, 0);
            }

            if (cmax < 0) return false;
        }

        return cmin == 0;
    }
}`;

  const dryRunSteps = useMemo(() => {
    const s = "(*))";
    const steps = [];
    let cmin = 0;
    let cmax = 0;

    steps.push({ line: 1, variables: { s: "(*))" }, callStack: ["checkValidString(s)"] });
    steps.push({ line: 2, variables: { s, cmin: 0 }, callStack: ["checkValidString(s)"] });
    steps.push({ line: 3, variables: { s, cmin: 0, cmax: 0 }, callStack: ["checkValidString(s)"] });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      steps.push({ line: 5, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
      
      steps.push({ line: 6, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
      if (c === '(') {
        cmax++;
        cmin++;
        steps.push({ line: 7, variables: { s, cmin: cmin - 1, cmax, c }, callStack: ["checkValidString(s)"] });
        steps.push({ line: 8, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
      } else {
        steps.push({ line: 9, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
        if (c === ')') {
          cmax--;
          steps.push({ line: 10, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
          cmin = Math.max(cmin - 1, 0);
          steps.push({ line: 11, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
        } else {
          steps.push({ line: 12, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
          if (c === '*') {
            cmax++;
            steps.push({ line: 13, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
            cmin = Math.max(cmin - 1, 0);
            steps.push({ line: 14, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
          }
        }
      }

      steps.push({ line: 17, variables: { s, cmin, cmax, c }, callStack: ["checkValidString(s)"] });
      if (cmax < 0) {
        steps.push({ line: 17, variables: { s, cmin, cmax, c, return: false }, callStack: ["checkValidString(s)"] });
        return steps;
      }
    }

    steps.push({ line: 20, variables: { s, cmin, cmax }, callStack: ["checkValidString(s)"] });
    steps.push({ line: 20, variables: { s, cmin, cmax, return: cmin === 0 }, callStack: ["checkValidString(s)"] });
    
    return steps;
  }, []);

  const descriptionNode = (
    <>
      <p className="text-white/80 leading-relaxed mt-4">
        Find the validity of an input string <code>s</code> that only contains the letters <code>'('</code>, <code>')'</code> and <code>'*'</code>.
      </p>
      
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
        <h4 className="font-bold text-white mb-2">A string is legitimate if:</h4>
        <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
          <li>Any left parenthesis <code>'('</code> must have a corresponding right parenthesis <code>')'</code>.</li>
          <li>Any right parenthesis <code>')'</code> must have a corresponding left parenthesis <code>'('</code>.</li>
          <li>Left parenthesis <code>'('</code> must go before the corresponding right parenthesis <code>')'</code>.</li>
          <li><code>'*'</code> could be treated as a single right parenthesis <code>')'</code> or a single left parenthesis <code>'('</code> or an empty string <code>""</code>.</li>
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
        <h4 className="font-bold mb-2">Example 1</h4>
        <p className="text-sm font-mono text-white/70 mb-1">Input: s = "(*))"</p>
        <p className="text-sm font-mono text-white/70 mb-2">Output: true</p>
        <p className="text-sm text-white/60">Explanation: The <code>*</code> can be replaced by an opening <code>'('</code> bracket. The string after replacing the <code>*</code> mark is <code>"(())"</code> and is a valid string.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
        <h4 className="font-bold mb-2">Example 2</h4>
        <p className="text-sm font-mono text-white/70 mb-1">Input: s = "*(()"</p>
        <p className="text-sm font-mono text-white/70 mb-2">Output: false</p>
        <p className="text-sm text-white/60">Explanation: The <code>*</code> replaced with any bracket does not form a valid string.</p>
      </div>
    </>
  );

  const javaCodeNode = (
    <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
      <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span> {"{\n"}
      {"    "}<span className="text-blue-400">public boolean</span> <span className="text-yellow-200">checkValidString</span>{"(String s) {\n"}
      {"        "}int cmin = <span className="text-orange-400">0</span>; <span className="text-green-500">// Minimum possible open brackets</span>{"\n"}
      {"        "}int cmax = <span className="text-orange-400">0</span>; <span className="text-green-500">// Maximum possible open brackets</span>{"\n\n"}
      {"        "}<span className="text-purple-400">for</span> (char c : s.toCharArray()) {"{\n"}
      {"            "}<span className="text-purple-400">if</span> (c == <span className="text-green-300">'('</span>) {"{\n"}
      {"                "}cmax++;{"\n"}
      {"                "}cmin++;{"\n"}
      {"            } "}<span className="text-purple-400">else if</span> (c == <span className="text-green-300">')'</span>) {"{\n"}
      {"                "}cmax--;{"\n"}
      {"                "}cmin = Math.max(cmin - 1, <span className="text-orange-400">0</span>);{"\n"}
      {"            } "}<span className="text-purple-400">else if</span> (c == <span className="text-green-300">'*'</span>) {"{\n"}
      {"                "}cmax++; <span className="text-green-500">// if `*` becomes `(`</span>{"\n"}
      {"                "}cmin = Math.max(cmin - 1, <span className="text-orange-400">0</span>); <span className="text-green-500">// if `*` becomes `)`</span>{"\n"}
      {"            }\n\n"}
      {"            "}<span className="text-purple-400">if</span> (cmax &lt; <span className="text-orange-400">0</span>) <span className="text-purple-400">return false</span>; <span className="text-green-500">// Too many closing brackets</span>{"\n"}
      {"        }\n\n"}
      {"        "}<span className="text-purple-400">return</span> cmin == <span className="text-orange-400">0</span>;{"\n"}
      {"    }\n"}
      {"}\n"}
    </pre>
  );

  const pythonCodeNode = (
    <pre className="p-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-sm overflow-x-auto h-full">
      <code className="text-blue-400">class</code> <span className="text-yellow-300">Solution</span>{":\n"}
      {"    "}<span className="text-blue-400">def</span> <span className="text-yellow-200">checkValidString</span>{"(self, s: str) -> bool:\n"}
      {"        "}cmin = <span className="text-orange-400">0</span>{"\n"}
      {"        "}cmax = <span className="text-orange-400">0</span>{"\n\n"}
      {"        "}<span className="text-purple-400">for</span> char <span className="text-purple-400">in</span> s:{"\n"}
      {"            "}<span className="text-purple-400">if</span> char == <span className="text-green-300">'('</span>:{"\n"}
      {"                "}cmax += 1{"\n"}
      {"                "}cmin += 1{"\n"}
      {"            "}<span className="text-purple-400">elif</span> char == <span className="text-green-300">')'</span>:{"\n"}
      {"                "}cmax -= 1{"\n"}
      {"                "}cmin = <span className="text-blue-300">max</span>(cmin - 1, <span className="text-orange-400">0</span>){"\n"}
      {"            "}<span className="text-purple-400">elif</span> char == <span className="text-green-300">'*'</span>:{"\n"}
      {"                "}cmax += 1{"\n"}
      {"                "}cmin = <span className="text-blue-300">max</span>(cmin - 1, <span className="text-orange-400">0</span>){"\n\n"}
      {"            "}<span className="text-purple-400">if</span> cmax &lt; <span className="text-orange-400">0</span>:{"\n"}
      {"                "}<span className="text-purple-400">return False</span>{"\n\n"}
      {"        "}<span className="text-purple-400">return</span> cmin == <span className="text-orange-400">0</span>{"\n"}
    </pre>
  );

  return (
    <ProblemLayout 
      title="Valid Parenthesis String"
      difficulty="Medium"
      category="Greedy"
      themeColor="cyan"
      descriptionNode={descriptionNode}
      javaCodeNode={javaCodeNode}
      pythonCodeNode={pythonCodeNode}
      javaCodeRaw={javaCodeRaw}
      graphicalVisualizer={<ValidParenthesisVisualizer />}
      dryRunSteps={dryRunSteps}
    />
  );
}
