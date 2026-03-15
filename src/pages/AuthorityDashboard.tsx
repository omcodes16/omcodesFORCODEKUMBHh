import Header from '@/components/Header';
import ComplaintCard from '@/components/ComplaintCard';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { DEGREE_PROGRAMS, URGENT_SUB_CATEGORIES, DegreeProgram } from '@/types';
import SystemBootLoader from '@/components/SystemBootLoader';

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const { complaints, stats } = useComplaints();
  const [search, setSearch] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<DegreeProgram | ''>('');
  if (!user || user.role === 'student') return <Navigate to="/login" />;

  const relevantComplaints = complaints.filter(c => {
    const level = Number(c.authorityLevel);
    const dept = user.department;

    if (dept === 'Department Head') return level === 2;
    if (dept === 'Branch HOD') return level === 3;
    if (dept === 'Principal / Apex Authority') return level === 4;
    return c.targetDepartment === dept && (level === 1 || !level);
  });

  const filtered = relevantComplaints.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.tokenId.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchesDegree = !degreeFilter || c.degree === degreeFilter;
    return matchesSearch && matchesDegree;
  });

  const pending = filtered.filter(c => c.status !== 'resolved');
  const resolved = filtered.filter(c => c.status === 'resolved');

  const sortedPending = [...pending].sort((a, b) => {
    const aAutoUrgent = a.subCategory && URGENT_SUB_CATEGORIES.includes(a.subCategory) ? 0 : 1;
    const bAutoUrgent = b.subCategory && URGENT_SUB_CATEGORIES.includes(b.subCategory) ? 0 : 1;
    if (aAutoUrgent !== bAutoUrgent) return aAutoUrgent - bAutoUrgent;
    const urgencyOrder = { High: 0, Medium: 1, Low: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <SystemBootLoader isLoading={true}>
      <div className="min-h-screen bg-transparent relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'NODES_ASSIGNED', value: relevantComplaints.length },
              { label: 'PENDING_TASKS', value: relevantComplaints.filter(c => c.status !== 'resolved').length },
              { label: 'RESOLVED_TASKS', value: relevantComplaints.filter(c => c.status === 'resolved').length },
            ].map(s => (
              <div key={s.label} className="jec-card p-4 animate-fade-in border-l-4 border-l-[#ccff00]">
                <p className="text-[10px] text-[#39ff14]/60 font-mono tracking-widest">{s.label}</p>
                <p className="text-2xl font-mono font-bold text-[#39ff14] mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="jec-card p-6 mb-6 border-l-4 border-l-[#ccff00]">
            <h2 className="text-xl font-mono font-bold text-[#39ff14] mb-1 uppercase tracking-widest">Authority Task Inbox</h2>
            <p className="text-[10px] font-mono text-[#ccff00]/70 mb-4 tracking-widest uppercase">
              AUTHORIZED_USER_DETECTED: <strong className="text-[#39ff14]">{user.name}</strong> ({user.role}
              {user.department ? ` // ${user.department}` : ''}).
              AWAITING_COMMANDS.
            </p>

            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#39ff14]/50" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="SEARCH_LOGS..."
                  className="w-full border border-[#39ff14]/30 font-mono rounded-none pl-9 pr-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all placeholder:text-gray-500" />
              </div>
              <select value={degreeFilter} onChange={e => setDegreeFilter(e.target.value as DegreeProgram | '')}
                className="border border-[#39ff14]/30 font-mono rounded-none px-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] outline-none min-w-[140px] uppercase">
                <option value="">ALL_PROTOCOLS</option>
                {DEGREE_PROGRAMS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <h3 className="font-mono font-bold text-[#39ff14] mb-4 flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <span className="w-2 h-2 rounded-none bg-[#ff073a] animate-pulse"></span>
              PENDING_LOGS ({sortedPending.length})
            </h3>
            <div className="space-y-4 mb-8">
              {sortedPending.map(c => <ComplaintCard key={c.id} complaint={c} />)}
              {sortedPending.length === 0 && <p className="text-[10px] text-[#39ff14]/40 font-mono tracking-widest uppercase text-center py-6 border border-dashed border-[#39ff14]/20 rounded-none bg-black/20">NO_PENDING_TASKS_DETECTED</p>}
            </div>

            {resolved.length > 0 && (
              <>
                <h3 className="font-mono font-bold text-[#39ff14] mb-4 flex items-center gap-2 uppercase tracking-widest text-[11px]">
                  <span className="w-2 h-2 rounded-none bg-[#39ff14]"></span>
                  RESOLVED_TASKS ({resolved.length})
                </h3>
                <div className="space-y-4">
                  {resolved.map(c => <ComplaintCard key={c.id} complaint={c} showActions={false} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SystemBootLoader>
  );
}
