import Header from '@/components/Header';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintCard from '@/components/ComplaintCard';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { ESCALATION_LABELS } from '@/types';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SystemBootLoader from '@/components/SystemBootLoader';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { complaints, stats } = useComplaints();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'public'>('personal');

  if (!user || user.role !== 'student') return <Navigate to="/login" />;

  const myComplaints = complaints.filter(c => c.studentId === user.id);
  const feedComplaints = complaints.filter(c =>
    c.studentId !== user.id && (
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <SystemBootLoader isLoading={true}>
      <div className="min-h-screen bg-transparent relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'QUERIES_RAISED', value: stats.total },
              { label: 'QUERIES_RESOLVED', value: stats.solved },
              { label: 'AVG_RESOLUTION_TIME', value: stats.avgResolutionTime },
            ].map(s => (
              <div key={s.label} className="jec-card p-4 animate-fade-in border-l-4 border-[#39ff14]/30 border-l-[#ccff00]">
                <p className="text-[10px] font-mono text-[#39ff14]/60 tracking-widest">{s.label}</p>
                <p className="text-2xl font-mono font-bold text-[#39ff14] mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Info panel */}
          <div className="jec-card p-6 mb-6 animate-fade-in border-l-4 border-[#39ff14]/30 border-l-[#ccff00]">
            <h2 className="text-xl font-mono font-bold text-[#39ff14] mb-2 uppercase tracking-widest">Student Node Interface</h2>
            <p className="text-[10px] font-mono text-[#ccff00]/70 mb-4 tracking-widest uppercase">DIRECT_DATA_LINK ESTABLISHED. LODGE YOUR QUERIES DIRECTLY.</p>
            <h3 className="text-[10px] font-mono font-bold text-[#ccff00] mb-2 uppercase tracking-widest">ESCALATION_PROTOCOL</h3>
            <ol className="list-decimal list-inside text-[10px] font-mono text-[#39ff14]/80 space-y-1 mb-4">
              {Object.entries(ESCALATION_LABELS).map(([level, label]) => (
                <li key={level}><strong className="text-[#39ff14]">Level_{level}:</strong> {label}</li>
              ))}
            </ol>
            <div className="bg-black/40 rounded-none p-3 text-[10px] font-mono text-[#39ff14]/60 border border-[#39ff14]/20 uppercase tracking-widest">
              SYSTEM_NOTE: SUBMISSIONS ARE VISIBLE IN THE PUBLIC DATA STREAM WITH THEIR ESCALATION LEVEL.
            </div>
          </div>

          {/* Main content - Tabbed Interface */}
          <div className="mb-6 flex space-x-2 bg-black/40 p-1.5 rounded-none border border-[#39ff14]/30 shadow-inner w-fit font-mono text-xs uppercase tracking-widest relative z-20">
            <button
              onClick={() => setActiveTab('personal')}
              className={`relative px-6 py-3 transition-all duration-300 ${
                activeTab === 'personal' ? 'text-black shadow-[0_0_10px_rgba(57,255,20,0.5)]' : 'text-[#39ff14]/60 hover:text-[#39ff14]'
              }`}
            >
              {activeTab === 'personal' && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-[#39ff14]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                PERSONAL_LOGS
                <span className={`px-2 py-0.5 text-[10px] ${activeTab === 'personal' ? 'bg-black/20 text-black' : 'bg-black/40 border border-[#39ff14]/30 text-[#39ff14]'}`}>{myComplaints.length}</span>
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('public')}
              className={`relative px-6 py-3 transition-all duration-300 ${
                activeTab === 'public' ? 'text-black shadow-[0_0_10px_rgba(57,255,20,0.5)]' : 'text-[#39ff14]/60 hover:text-[#39ff14]'
              }`}
            >
              {activeTab === 'public' && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-[#39ff14]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                CAMPUS_FEED
                <span className={`px-2 py-0.5 text-[10px] ${activeTab === 'public' ? 'bg-black/20 text-black' : 'bg-black/40 border border-[#39ff14]/30 text-[#39ff14]'}`}>{feedComplaints.length}</span>
              </span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 relative z-10">
            <ComplaintForm />
            
            <AnimatePresence mode="wait">
              {activeTab === 'personal' ? (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="jec-card p-6 border-l-4 border-l-[#ccff00] border-[#39ff14]/30">
                    <h2 className="text-xl font-mono font-bold text-[#39ff14] mb-1 uppercase tracking-widest">Personal Data Logs</h2>
                    <p className="text-[10px] font-mono text-[#ccff00]/70 mb-4 tracking-widest uppercase">TRACKING YOUR INBOUND SUBMISSIONS.</p>
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {myComplaints.map(c => <ComplaintCard key={c.id} complaint={c} showActions={true} />)}
                      {myComplaints.length === 0 && <p className="text-[10px] font-mono text-[#39ff14]/40 text-center py-8 tracking-widest uppercase shadow-inner bg-black/20 border border-dashed border-[#39ff14]/20">NO_RECORDS_LOCATED.</p>}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="public"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="jec-card p-6 border-l-4 border-l-[#ccff00] border-[#39ff14]/30">
                    <h2 className="text-xl font-mono font-bold text-[#39ff14] mb-1 uppercase tracking-widest">Public Data Stream</h2>
                    <p className="text-[10px] font-mono text-[#ccff00]/70 mb-4 tracking-widest uppercase">READ_ONLY ACCESS TO ALL CAMPUS SUBMISSIONS.</p>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39ff14]/50" />
                      <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="SEARCH_BY_NODE_OR_TOKEN_ID"
                        className="w-full border border-[#39ff14]/30 rounded-none pl-9 pr-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 font-mono outline-none transition-all placeholder:text-gray-500 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00]" />
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {feedComplaints.map(c => <ComplaintCard key={c.id} complaint={c} showActions={false} isPublicFeed={true} />)}
                      {feedComplaints.length === 0 && <p className="text-[10px] font-mono text-[#39ff14]/40 text-center py-8 tracking-widest uppercase shadow-inner bg-black/20 border border-dashed border-[#39ff14]/20">NO_RECORDS_LOCATED.</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SystemBootLoader>
  );
}
