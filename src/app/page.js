import Link from "next/link";
import { ArrowRight, Activity, Code2, PlaySquare } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-12 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Master Algorithms <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500">
            Visually
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Stop staring at static code. Interactive animations help you build true intuition for complex algorithmic patterns.
        </p>
      </section>

      {/* Problems Grid */}
      <section className="space-y-12">
        
        {/* Greedy Algorithms Pattern Group */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <span className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                <Activity size={20} />
              </span>
              Greedy Algorithms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/problem/n-meetings-in-one-room" className="group block">
              <div className="glass-panel p-6 h-full rounded-2xl hover:border-primary-500/50 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full group-hover:bg-primary-500/30 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-white/5 rounded-xl text-primary-400">
                    <PlaySquare size={24} />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Greedy</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors relative z-10">N Meetings in One Room</h3>
                <p className="text-sm text-white/50 mb-6 relative z-10">Find the maximum number of meetings that can be accommodated in a single room given start and end times.</p>
                <div className="flex items-center text-sm font-medium text-primary-500 relative z-10">
                  Visualize Algorithm <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/problem/non-overlapping-intervals" className="group block">
              <div className="glass-panel p-6 h-full rounded-2xl hover:border-purple-500/50 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-white/5 rounded-xl text-purple-400">
                    <PlaySquare size={24} />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Greedy</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors relative z-10">Non-Overlapping Intervals</h3>
                <p className="text-sm text-white/50 mb-6 relative z-10">Find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.</p>
                <div className="flex items-center text-sm font-medium text-purple-500 relative z-10">
                  Visualize Algorithm <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/problem/minimum-platforms" className="group block">
              <div className="glass-panel p-6 h-full rounded-2xl hover:border-orange-500/50 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full group-hover:bg-orange-500/30 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-white/5 rounded-xl text-orange-400">
                    <PlaySquare size={24} />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Greedy</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange-400 transition-colors relative z-10">Minimum Number of Platforms</h3>
                <p className="text-sm text-white/50 mb-6 relative z-10">Determine the minimum number of platforms required at a railway station so that no train is kept waiting.</p>
                <div className="flex items-center text-sm font-medium text-orange-500 relative z-10">
                  Visualize Algorithm <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/problem/valid-parenthesis" className="group block">
              <div className="glass-panel p-6 h-full rounded-2xl hover:border-cyan-500/50 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-500/30 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-white/5 rounded-xl text-cyan-400">
                    <Code2 size={24} />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Greedy</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors relative z-10">Valid Parenthesis String</h3>
                <p className="text-sm text-white/50 mb-6 relative z-10">Determine if a string of parentheses and wildcards is valid using an O(N) range-tracking greedy approach.</p>
                <div className="flex items-center text-sm font-medium text-cyan-500 relative z-10">
                  Visualize Algorithm <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Future Category Example: Dynamic Programming */}
        <div className="space-y-6 opacity-50 grayscale pointer-events-none">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <Code2 size={20} />
              </span>
              Dynamic Programming
            </h2>
            <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-white/30 border border-white/10">Coming Soon</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 h-full rounded-2xl border-dashed border-white/10">
               <h3 className="text-xl font-bold mb-2 text-white/30">0/1 Knapsack</h3>
               <p className="text-sm text-white/20">Visualize DP table population and state transitions.</p>
            </div>
            <div className="glass-panel p-6 h-full rounded-2xl border-dashed border-white/10">
               <h3 className="text-xl font-bold mb-2 text-white/30">Longest Common Subsequence</h3>
               <p className="text-sm text-white/20">Visualize string matching through a 2D matrix.</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
