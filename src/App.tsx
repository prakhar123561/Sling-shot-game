/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SlingShotGame } from './components/SlingShotGame';
import { Trophy, Target, RefreshCw, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#020617] text-[#e2e8f0] font-sans selection:bg-emerald-500 selection:text-white flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] -z-10" />

      <div className="w-full max-w-[1240px] aspect-[1024/768] grid grid-cols-4 grid-rows-6 gap-5 h-[90vh]">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 row-span-1 bg-slate-900/40 border border-slate-800/60 rounded-3xl flex flex-col justify-center px-6 backdrop-blur-sm"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Level Profile</span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <span className="text-emerald-400 font-black text-sm">04</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-black text-white uppercase tracking-tight">Neon Grotto</p>
              <p className="text-[10px] font-mono text-slate-500">Sector: 7-B</p>
            </div>
          </div>
        </motion.div>

        {/* Title Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 row-span-1 bg-slate-900/40 border-2 border-emerald-500/10 rounded-3xl flex items-center justify-between px-10 backdrop-blur-sm"
        >
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
            Vector<span className="text-emerald-500">Sling</span>
          </h1>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Session_Best</p>
              <p className="text-2xl font-mono text-emerald-400 font-black">94,200</p>
            </div>
            <div className="w-px h-10 bg-slate-800/50" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Multiplier</p>
              <p className="text-2xl font-mono text-blue-400 font-black">x1.5</p>
            </div>
          </div>
        </motion.div>

        {/* Latency Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 row-span-1 bg-slate-900/40 border border-slate-800/60 rounded-3xl flex items-center justify-center gap-4 backdrop-blur-sm"
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Link: Stable_4ms</span>
        </motion.div>

        {/* Main Stage Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-3 row-span-4 bg-slate-950/80 border border-slate-800/80 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)] ring-1 ring-white/5"
        >
          <div className="absolute inset-0 z-0">
             <SlingShotGame onScoreUpdate={(s) => setScore(s)} />
          </div>
          
          <div className="absolute top-8 left-8 flex gap-4 pointer-events-none z-10">
            <div className="bg-black/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Wind_Sim</p>
              <p className="text-sm font-mono text-emerald-400 font-bold">1.8 m/s WNW</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Gravity_G</p>
              <p className="text-sm font-mono text-blue-400 font-bold">0.85 G</p>
            </div>
          </div>
          
          <div className="absolute bottom-8 right-8 flex gap-3 pointer-events-none z-10">
            <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur border border-white/5 text-[10px] font-black rounded-lg text-slate-500 uppercase tracking-widest">TACTICAL_HUD_V4</span>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 row-span-2 bg-emerald-500 px-8 py-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl shadow-emerald-950/40 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Trophy size={80} strokeWidth={3} className="text-emerald-950" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-950 relative z-10">Live_Points</p>
          <motion.p 
            key={score}
            initial={{ scale: 1.2, filter: 'blur(4px)' }}
            animate={{ scale: 1, filter: 'blur(0)' }}
            className="text-7xl font-black tracking-tighter text-emerald-950 relative z-10 -ml-1"
          >
            {score.toLocaleString()}
          </motion.p>
          <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-[11px] font-black text-emerald-950 uppercase tracking-widest">
              <span>Next Milestone</span>
              <span>20,000</span>
            </div>
            <div className="w-full h-2 bg-emerald-950/10 rounded-full overflow-hidden border border-emerald-950/5">
              <motion.div 
                animate={{ width: `${Math.min((score/20000)*100, 100)}%` }}
                className="h-full bg-emerald-950" 
              />
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 row-span-2 bg-slate-900/40 border border-slate-800/60 p-8 rounded-[2.5rem] flex flex-col backdrop-blur-sm"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Leaderboard_Top</p>
          <div className="flex-1 space-y-5">
            {[
              { rank: '01', name: 'ZEPHYR_X', score: '84,200' },
              { rank: '02', name: 'KINETIC', score: '76,500' },
              { rank: '03', name: 'GLITCH_0', score: '62,900' }
            ].map(user => (
              <div key={user.rank} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-600 font-bold">{user.rank}</span>
                  <span className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">{user.name}</span>
                </div>
                <span className="font-mono font-bold text-white tracking-widest text-xs">{user.score}</span>
              </div>
            ))}
            <div className="pt-6 mt-6 border-t border-slate-800/50 flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-emerald-900/50 font-black">14</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">You</span>
              </div>
              <span className="font-mono font-black text-emerald-500 text-sm">{score.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Projectiles Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-1 row-span-1 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 flex flex-col justify-center backdrop-blur-sm"
        >
          <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-3">Loadout_Status</p>
          <div className="flex gap-2.5">
            {[1, 2, 3].map(i => (
               <div key={i} className="w-8 h-8 rounded-xl bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/50"></div>
            ))}
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/50"></div>
          </div>
        </motion.div>

        {/* Tension Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="col-span-2 row-span-1 bg-slate-900/40 border border-slate-800/60 rounded-3xl px-8 py-6 flex items-center gap-10 backdrop-blur-sm"
        >
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center leading-none">
              <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Launcher_Tension</p>
              <p className="text-[11px] font-black font-mono text-white">72%</p>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" 
              />
            </div>
          </div>
          <div className="h-10 w-px bg-slate-800/50" />
          <div className="flex flex-col justify-center leading-tight">
            <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1.5">Vector_Mode</p>
            <p className="text-sm font-black font-mono text-white italic tracking-tighter uppercase underline decoration-emerald-500 decoration-2 underline-offset-4">Parabolic</p>
          </div>
        </motion.div>

        {/* Reset Button Card */}
        <motion.button 
          whileHover={{ scale: 0.98, backgroundColor: '#1d4ed8' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.dispatchEvent(new CustomEvent('reset-game'))}
          className="col-span-1 row-span-1 bg-blue-600 rounded-3xl flex items-center justify-center cursor-pointer shadow-xl shadow-blue-900/20 active:bg-blue-800 group transition-all"
        >
          <div className="flex items-center gap-3">
            <RefreshCw size={24} className="text-white opacity-50 group-hover:rotate-180 group-hover:opacity-100 transition-all duration-700" />
            <span className="font-black italic text-3xl text-white tracking-tighter uppercase group-hover:tracking-wider transition-all">FIRE</span>
          </div>
        </motion.button>

      </div>
    </div>
  );
}



