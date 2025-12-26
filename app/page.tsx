"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements } from "@/lib/layout"; 
import { Activity, GitMerge, Swords, ShieldAlert, RefreshCw, X, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

// --- TYPES ---
interface FlowData { nodes: any[]; edges: any[]; }

interface Scenario {
  id: string;
  title: string;
  outcome_3m: string;
  outcome_12m: string;
  risk_score: number;
  competitor_reaction: string;
}

interface TwinResult {
  twin_status: string;
  competitor_profile: {
    name: string;
    archetype: string;
    likely_counter_move: string;
    threat_level: string;
  };
  scenarios: Scenario[];
  recommended_id: string;
  implementation_flowchart: FlowData;
}

export default function LivingStrategicTwin() {
  const [step, setStep] = useState<"input" | "syncing" | "dashboard">("input");
  const [formData, setFormData] = useState({ companyName: "", context: "", options: "" });
  const [result, setResult] = useState<TwinResult | null>(null);
  
  // Modal State
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [log, setLog] = useState("");

  const handleSimulate = async () => {
    setStep("syncing");
    
    const logs = ["Connecting to Market API...", "Ingesting Competitor 10-K Filings...", "Calibrating Game Theory Weights...", "Building Digital Twin Model..."];
    let i = 0;
    const interval = setInterval(() => { setLog(logs[i++ % logs.length]); }, 1200);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // Node Processing
      const initialNodes: Node[] = data.implementation_flowchart.nodes.map((n: any) => ({ 
            id: n.id,
            position: { x: 0, y: 0 }, 
            data: { label: n.label },
            type: n.type || 'default',
            style: { 
                background: '#0f172a', 
                color: '#fff', 
                border: '1px solid #334155', 
                borderRadius: '8px', 
                padding: '10px', 
                fontSize: '12px',
                width: 150 
            } 
        }));

      const initialEdges: Edge[] = data.implementation_flowchart.edges.map((e: any) => ({ 
          id: `e${e.source}-${e.target}`,
          source: e.source, 
          target: e.target, 
          animated: true, 
          label: e.label,
          style: { stroke: '#06b6d4' },
          labelStyle: { fill: '#94a3b8', fontSize: 10 }
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setResult(data);
      setStep("dashboard");
    } catch (e) {
      console.error(e);
      alert("Twin Sync Failed. Check console for details.");
      setStep("input");
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">STRATEGIC TWIN</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Gemini 3 Pro Engine</p>
            </div>
          </div>
          {step === "dashboard" && (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              LIVE MODEL SYNCED
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          
          {/* INPUT MODE */}
          {step === "input" && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">
                  Build Your Digital Twin.
                </h2>
                <p className="text-lg text-slate-400">
                  Don't just guess. Create a living simulation of your company and competitors.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Company Profile</label>
                  <input 
                    placeholder="e.g. Nvidia"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition"
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Strategic Context</label>
                  <textarea 
                    placeholder="Describe market conditions, recent stock performance, or internal constraints..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 resize-none focus:border-cyan-500 outline-none transition"
                    onChange={e => setFormData({...formData, context: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Options to Simulate</label>
                  <textarea 
                    placeholder="List specific strategic moves you are considering..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 resize-none focus:border-cyan-500 outline-none transition"
                    onChange={e => setFormData({...formData, options: e.target.value})}
                  />
                </div>
                <button 
                  onClick={handleSimulate}
                  disabled={!formData.companyName}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2"
                >
                  <GitMerge className="w-5 h-5" /> Initialize Twin
                </button>
              </div>
            </motion.div>
          )}

          {/* SYNCING MODE */}
          {step === "syncing" && (
            <motion.div 
              key="syncing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin box-decoration-clone"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Synchronizing Twin</h3>
              <p className="font-mono text-cyan-400 text-sm animate-pulse">{log}</p>
            </motion.div>
          )}

          {/* DASHBOARD MODE */}
          {step === "dashboard" && result && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-8 pb-20"
            >
              {/* TOP ROW: COMPETITOR INTEL & STATS */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Competitor Card */}
                <div className="md:col-span-1 bg-linear-to-br from-red-950/40 to-black border border-red-900/50 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Swords className="w-24 h-24 text-red-500" />
                  </div>
                  <h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Primary Antagonist</h3>
                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-2xl font-bold text-white">{result.competitor_profile.name}</p>
                      <p className="text-sm text-red-200/60">{result.competitor_profile.archetype}</p>
                    </div>
                    <div className="bg-red-950/50 border border-red-500/20 p-3 rounded-lg">
                      <p className="text-xs text-red-400 mb-1">PREDICTED COUNTER-MOVE</p>
                      <p className="text-sm font-medium text-white">"{result.competitor_profile.likely_counter_move}"</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                       <ShieldAlert className="w-4 h-4 text-red-500" />
                       Threat Level: <span className="font-bold text-white">{result.competitor_profile.threat_level}</span>
                    </div>
                  </div>
                </div>

                {/* Scenario Comparison */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  {result.scenarios.map((scen) => (
                    <div 
                      key={scen.id}
                      onClick={() => setSelectedScenario(scen)} // OPEN MODAL ON CLICK
                      className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95
                        ${scen.id === result.recommended_id 
                          ? "bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                          : "bg-white/5 border-white/10 hover:border-white/20"}`}
                    >
                      <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400">SCENARIO {scen.id}</span>
                        {scen.id === result.recommended_id && <span className="text-[10px] bg-cyan-500 text-black font-bold px-2 py-0.5 rounded">RECOMMENDED</span>}
                      </div>
                      <h4 className="font-bold text-white mb-2">{scen.title}</h4>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{scen.outcome_12m}</p>
                      
                      {/* Mini Risk Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                         <div 
                            className={`h-full ${scen.risk_score > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${scen.risk_score}%` }}
                         ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-[10px] text-slate-500">Success Probability</p>
                        <p className="text-[10px] font-bold text-slate-300">{scen.risk_score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM ROW: INTERACTIVE FLOWCHART */}
              <div className="h-125 bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-cyan-400" /> Implementation Blueprint
                  </h3>
                </div>
                
                <ReactFlow 
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  attributionPosition="bottom-right"
                  className="bg-black"
                  colorMode="dark"
                >
                  <Background color="#334155" gap={20} />
                  <Controls className="bg-slate-800 border-slate-700 fill-white" />
                </ReactFlow>
              </div>

              <button onClick={() => setStep("input")} className="mx-auto flex items-center gap-2 text-slate-500 hover:text-white transition">
                <RefreshCw className="w-4 h-4" /> Reset Twin
              </button>

            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SCENARIO DETAIL MODAL --- */}
        <AnimatePresence>
          {selectedScenario && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScenario(null)}
              className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">
                            SCENARIO {selectedScenario.id}
                        </span>
                        {/* If it's the recommended one */}
                        {result && selectedScenario.id === result.recommended_id && (
                             <span className="text-[10px] bg-emerald-500 text-black font-bold px-2 py-1 rounded flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> BEST CHOICE
                             </span>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedScenario(null)}
                    className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto space-y-8">
                    
                    {/* Section 1: Competitor War Game */}
                    <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5">
                        <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3">
                            <Swords className="w-4 h-4" />
                            GAME THEORY: COMPETITOR REACTION
                        </div>
                        <p className="text-slate-200 leading-relaxed">
                            {selectedScenario.competitor_reaction}
                        </p>
                        <div className="mt-3 text-xs text-red-300/60 font-mono">
                            Probability of retaliation: High
                        </div>
                    </div>

                    {/* Section 2: Timeline */}
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4">
                            <Calendar className="w-4 h-4" />
                            OUTCOME PROJECTIONS
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                <span className="text-xs text-cyan-500 font-bold block mb-2">SHORT TERM (3 MONTHS)</span>
                                <p className="text-sm text-slate-300">{selectedScenario.outcome_3m}</p>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                <span className="text-xs text-purple-500 font-bold block mb-2">LONG TERM (12 MONTHS)</span>
                                <p className="text-sm text-slate-300">{selectedScenario.outcome_12m}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Risk Analysis */}
                    <div>
                         <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4">
                            <AlertTriangle className="w-4 h-4" />
                            RISK VS. REWARD
                        </div>
                        <div className="space-y-3">
                             <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Success Probability</span>
                                <span className="text-white font-bold">{selectedScenario.risk_score}%</span>
                             </div>
                             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedScenario.risk_score}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-linear-to-r from-emerald-500 to-cyan-500"
                                />
                             </div>
                             <p className="text-xs text-slate-500 mt-2">
                                * Calculated based on market volatility and competitor aggression indices.
                             </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
                    <button 
                        onClick={() => setSelectedScenario(null)}
                        className="text-sm text-slate-400 hover:text-white transition"
                    >
                        Close Report
                    </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}