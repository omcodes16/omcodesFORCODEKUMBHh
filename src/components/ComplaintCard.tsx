import { Complaint, getAuthoritiesInformed, BRANCH_SHORT, CATEGORY_COLORS, URGENT_SUB_CATEGORIES } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { ArrowUpCircle, CheckCircle, Lock, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  complaint: Complaint;
  showActions?: boolean;
  isPublicFeed?: boolean;
}

export default function ComplaintCard({ complaint, showActions = true, isPublicFeed = false }: Props) {
  const { user } = useAuth();
  const { escalate, markSolved, addComment, setExpectedDate } = useComplaints();
  const [commentText, setCommentText] = useState('');
  const [dateValue, setDateValue] = useState(complaint.expectedDate || '');
  const [showComments, setShowComments] = useState(false);

  const c = complaint;
  const isOwner = user?.id === c.studentId;
  const isAuthority = user && (user.role === 'employee' || user.role === 'hod' || user.role === 'principal');
  const isResolved = c.status === 'resolved';
  const progress = c.authorityLevel * 25;
  const isOverdue = c.expectedDate && new Date(c.expectedDate) < new Date() && !isResolved;
  const branchShort = BRANCH_SHORT[c.branch] || c.branch;
  const isAutoUrgent = c.subCategory && URGENT_SUB_CATEGORIES.includes(c.subCategory);
  
  // Custom neon category colors mapping for Quantum Theme
  const getCatColor = (category: string) => {
    switch(category) {
      case 'Academic': return 'bg-[rgba(57,255,20,0.1)] text-[#39ff14] border-[#39ff14]/40';
      case 'Infrastructure': return 'bg-[rgba(204,255,0,0.1)] text-[#ccff00] border-[#ccff00]/40';
      case 'Hostel': return 'bg-[rgba(0,191,255,0.1)] text-[#00bfff] border-[#00bfff]/40';
      case 'Accounts': return 'bg-[rgba(255,255,255,0.1)] text-white border-white/40';
      case 'Student Welfare': return 'bg-[rgba(255,0,255,0.1)] text-[#ff00ff] border-[#ff00ff]/40';
      case 'IT Support': return 'bg-[rgba(0,255,255,0.1)] text-[#00ffff] border-[#00ffff]/40';
      default: return 'bg-[rgba(255,255,255,0.1)] text-white/80 border-white/20';
    }
  };
  const catColor = getCatColor(c.category);

  const levelLabel = (() => {
    if (isResolved) return 'RESOLVED SUCCESSFULLY';
    switch (c.authorityLevel) {
      case 1: return 'L1 • ASSIGNED EMPLOYEE';
      case 2: return 'L2 • HEAD OF DEPT';
      case 3: return 'L3 • BRANCH HOD';
      case 4: return 'L4 • PRINCIPAL';
      default: return '';
    }
  })();

  const badgeClass = isResolved ? 'jec-badge-success' : c.authorityLevel >= 3 ? 'jec-badge-danger shadow-[0_0_10px_rgba(255,7,58,0.5)] border-[#ff073a] bg-[#ff073a]/10' : c.authorityLevel === 2 ? 'jec-badge-warning' : 'jec-badge-info';

  return (
    <div className={`jec-card p-5 animate-fade-in ${isOverdue || c.authorityLevel >= 3 ? 'border-[#ff073a] shadow-[0_0_15px_rgba(255,7,58,0.2)]' : 'border-[#39ff14]/30'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className={`font-bold font-mono tracking-widest uppercase leading-snug ${isOverdue || c.authorityLevel >= 3 ? 'text-[#ff073a] animate-pulse' : 'text-[#ccff00]'}`}>{!isPublicFeed ? c.title : `${c.category} Issue Reported`}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-[10px] font-mono tracking-wider border ${catColor}`}>
              {c.category}
            </span>
            {!isPublicFeed && c.degree && (
              <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-mono tracking-wider bg-white/5 border border-white/10 text-white/70">
                {c.degree}
              </span>
            )}
            {isAutoUrgent && !isResolved && !isPublicFeed && (
              <span className="inline-flex items-center gap-1 rounded-sm px-2.5 py-0.5 text-[10px] font-mono tracking-widest bg-[rgba(255,7,58,0.2)] border border-[#ff073a] text-[#ff073a] animate-led-pulse">
                <AlertTriangle className="w-3 h-3" /> URGENT
              </span>
            )}
          </div>
        </div>
        <span className={`${badgeClass} shadow-md`}>{levelLabel}</span>
      </div>

      {!isPublicFeed ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-mono mb-4 text-[#39ff14]/70">
          <p><span className="font-bold text-[#ccff00]">TOKEN_ID:</span> {c.tokenId}</p>
          <p><span className="font-bold text-[#ccff00]">STUDENT:</span> {c.studentName.toUpperCase()}</p>
          <p><span className="font-bold text-[#ccff00]">BRANCH:</span> {branchShort.toUpperCase()}</p>
          <p><span className="font-bold text-[#ccff00]">TARGET_DEPT:</span> {c.targetDepartment.toUpperCase()}</p>
          <p><span className="font-bold text-[#ccff00]">CATEGORY:</span> {c.category.toUpperCase()}{c.subCategory ? ` → ${c.subCategory.toUpperCase()}` : ''}</p>
          <p><span className="font-bold text-[#ccff00]">URGENCY:</span> <span className={c.urgency === 'High' ? 'text-[#ff073a] font-bold animate-pulse' : 'text-[#39ff14]'}>{c.urgency.toUpperCase()}</span></p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-mono mb-4 text-[#39ff14]/70">
          <p><span className="font-bold text-[#ccff00]">TARGET_DEPT:</span> {c.targetDepartment.toUpperCase()}</p>
          <p><span className="font-bold text-[#ccff00]">STATUS:</span> {isResolved ? 'RESOLVED' : 'PENDING'}</p>
          <p><span className="font-bold text-[#ccff00]">LOG_DATE:</span> {new Date(c.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {!isPublicFeed && (
        <div className="bg-black/40 border border-[#39ff14]/20 rounded-none px-3 py-2 text-[10px] font-mono mb-4 text-[#39ff14]/80 uppercase tracking-wide">
          <span className="font-bold text-[#ccff00]">AUTHORITIES_INFORMED:</span> {getAuthoritiesInformed(c.authorityLevel, c.targetDepartment, c.branch)}
        </div>
      )}

      {/* Escalation Progress */}
      <div className="mb-4">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#39ff14]/60 mb-1">DATA_STREAM_PROGRESS</p>
        <div className="w-full bg-white/5 rounded-none h-1.5 overflow-hidden border border-[#39ff14]/20">
          <div
            className={`h-full transition-all duration-1000 ${isOverdue ? 'bg-[#ff073a] shadow-[0_0_10px_#ff073a]' : isResolved ? 'bg-[#39ff14] shadow-[0_0_10px_#39ff14]' : 'bg-[#ccff00] shadow-[0_0_10px_#ccff00]'}`}
            style={{ width: `${isResolved ? 100 : progress}%` }}
          />
        </div>
      </div>

      {c.expectedDate && !isPublicFeed && (
        <p className={`text-[10px] font-mono tracking-widest mb-3 uppercase ${isOverdue ? 'text-[#ff073a] font-bold animate-pulse' : 'text-[#ccff00]/80'}`}>
          <Calendar className="w-3 h-3 inline mr-1" />
          SLA_EXPECTED: {new Date(c.expectedDate).toLocaleDateString()}
          {isOverdue && ' // OVERDUE_DETECTED'}
        </p>
      )}

      {/* Admin comments */}
      {c.adminComments.length > 0 && !isPublicFeed && (
        <button onClick={() => setShowComments(!showComments)} className="text-[10px] font-mono text-[#ccff00] uppercase tracking-widest flex items-center gap-1 mb-2 hover:text-[#39ff14] transition-colors">
          <MessageSquare className="w-3 h-3" /> {c.adminComments.length} LOG_ENTRIES
        </button>
      )}
      {showComments && !isPublicFeed && c.adminComments.map(cm => (
        <div key={cm.id} className="bg-black/50 border-l border-[#ccff00]/50 px-3 py-2 text-[10px] font-mono mb-1 text-[#39ff14]/80">
          <span className="font-bold text-[#ccff00] uppercase">{cm.authorName}:</span> {cm.text}
          <span className="text-[#39ff14]/40 ml-2 tracking-widest">[{new Date(cm.timestamp).toLocaleTimeString()}]</span>
        </div>
      ))}

      {/* Actions */}
      {showActions && !isResolved && !isPublicFeed && (
        <div className="flex flex-wrap gap-2 mt-4">
          {isOwner && c.authorityLevel < 4 && (
            (() => {
              const isLocked = c.expectedDate && new Date() < new Date(c.expectedDate);

              if (isLocked) {
                return (
                  <button 
                    disabled 
                    className="border border-[#ff073a]/30 text-[#ff073a]/50 bg-black/50 cursor-not-allowed font-mono text-[10px] tracking-widest uppercase flex items-center gap-2 px-4 py-2"
                  >
                    <Lock className="w-3 h-3" /> TIME_LOCKED ({new Date(c.expectedDate).toLocaleDateString()})
                  </button>
                );
              } else {
                return (
                  <button 
                    onClick={() => escalate(c.id)} 
                    className="btn-quantum border-[#ff073a] text-[#ff073a] hover:bg-[rgba(255,7,58,0.15)] hover:border-[#ff073a] hover:text-[#ff073a] shadow-[0_0_10px_rgba(255,7,58,0.2)] animate-led-pulse text-[10px] px-4 py-2"
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" /> FORCE_ESCALATION
                  </button>
                );
              }
            })()
          )}
          {isOwner && (
            <button onClick={() => markSolved(c.id)} className="btn-quantum text-[10px] px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" /> ACKNOWLEDGE_FIX (L{c.authorityLevel})
            </button>
          )}

          {isAuthority && (
            <div className="flex flex-wrap items-center gap-2 w-full mt-2">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input type="date" value={dateValue} onChange={e => setDateValue(e.target.value)}
                  className="border border-[#39ff14]/40 bg-[#0a0a0a] px-2 py-1.5 text-[10px] font-mono text-gray-200 outline-none focus:border-[#ccff00]" />
                <button onClick={() => {
                  if (dateValue) {
                    setExpectedDate(c.id, dateValue);
                  }
                }}
                  className="btn-quantum text-[10px] px-3 py-1.5">
                  SET_SLA
                </button>
              </div>
              <div className="flex items-center gap-2 w-full">
                <input value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="ENTER_LOG_DATA..."
                  className="border border-[#39ff14]/40 bg-[#0a0a0a] px-2 py-1.5 text-[10px] font-mono text-gray-200 outline-none flex-1 focus:border-[#ccff00] placeholder:text-gray-500" />
                <button onClick={() => {
                  if (commentText.trim() && user) {
                    addComment(c.id, { authorId: user.id, authorName: user.name, text: commentText });
                    setCommentText('');
                  }
                }} className="btn-quantum text-[10px] px-3 py-1.5">
                  APPEND
                </button>
              </div>
              <button onClick={() => markSolved(c.id)}
                className="btn-quantum border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14]/10 text-[10px] px-4 py-2 w-full md:w-auto">
                <CheckCircle className="w-4 h-4 mr-2" /> MARK_RESOLVED
              </button>
            </div>
          )}

          {!isOwner && !isAuthority && !isPublicFeed && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-white/30 uppercase tracking-widest mt-2">
              <Lock className="w-3 h-3" /> READ_ONLY_ACCESS
            </span>
          )}
        </div>
      )}

      {isResolved && (
        <div className="mt-4">
          <span className="bg-[rgba(57,255,20,0.1)] text-[#39ff14] border border-[#39ff14]/40 px-3 py-1.5 rounded-none text-[10px] font-mono tracking-widest uppercase inline-flex items-center gap-2 shadow-[0_0_10px_rgba(57,255,20,0.2)] inset">
            <CheckCircle className="w-3 h-3" /> RESOLUTION_CONFIRMED
          </span>
        </div>
      )}
    </div>
  );
}
