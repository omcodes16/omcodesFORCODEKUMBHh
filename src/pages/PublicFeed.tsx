import Header from '@/components/Header';
import ComplaintCard from '@/components/ComplaintCard';
import { useComplaints } from '@/context/ComplaintContext';
import { Search } from 'lucide-react';
import { useState } from 'react';
import SystemBootLoader from '@/components/SystemBootLoader';

export default function PublicFeed() {
  const { complaints, stats } = useComplaints();
  const [search, setSearch] = useState('');

  const filtered = complaints.filter(c =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SystemBootLoader isLoading={true}>
      <div className="min-h-screen bg-transparent relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'TOTAL_QUERIES', value: stats.total },
              { label: 'QUERIES_RESOLVED', value: stats.solved },
              { label: 'AVG_RESOLUTION_TIME', value: stats.avgResolutionTime },
            ].map(s => (
              <div key={s.label} className="jec-card p-4 animate-fade-in border-l-4 border-[#39ff14]/30 border-l-[#ccff00]">
                <p className="text-[10px] font-mono text-[#39ff14]/60 tracking-widest">{s.label}</p>
                <p className="text-2xl font-mono font-bold text-[#39ff14] mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="jec-card p-6 border-l-4 border-l-[#ccff00]">
            <h2 className="text-xl font-mono font-bold text-[#39ff14] mb-1 tracking-widest uppercase">Public Accountability Feed</h2>
            <p className="text-[10px] font-mono text-[#ccff00]/70 mb-4 tracking-widest uppercase">Transparent tracking of all recorded data streams.</p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39ff14]/50" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="SEARCH_BY_NODE_OR_TOKEN_ID..."
                className="w-full border border-[#39ff14]/30 rounded-none pl-9 pr-3 py-3 text-xs font-mono bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all placeholder:text-gray-500" />
            </div>

            <div className="space-y-4">
              {filtered.map(c => <ComplaintCard key={c.id} complaint={c} isPublicFeed={true} />)}
              {filtered.length === 0 && <p className="text-[10px] font-mono tracking-widest uppercase text-[#39ff14]/40 text-center py-8">NO_DATA_FOUND.</p>}
            </div>
          </div>
        </div>
      </div>
    </SystemBootLoader>
  );
}
