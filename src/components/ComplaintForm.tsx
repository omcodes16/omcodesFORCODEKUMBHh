import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import { DEGREE_PROGRAMS, DEGREE_BRANCHES, DEPARTMENTS, CATEGORIES, SUB_CATEGORIES, URGENT_SUB_CATEGORIES, UrgencyLevel, ComplaintCategory, DegreeProgram } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ComplaintForm() {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [subCategory, setSubCategory] = useState('');
  const [degree, setDegree] = useState<DegreeProgram | ''>(user?.degree || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [department, setDepartment] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Low');
  const [submitted, setSubmitted] = useState(false);
  const [branchAnimating, setBranchAnimating] = useState(false);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);

  useEffect(() => {
    if (category) {
      setDepartment(category);
    }
  }, [category]);

  useEffect(() => {
    if (subCategory && URGENT_SUB_CATEGORIES.includes(subCategory)) {
      setUrgency('High');
    }
  }, [subCategory]);

  if (!user) return null;

  const availableBranches = degree ? DEGREE_BRANCHES[degree] : [];
  const availableSubCategories = category ? SUB_CATEGORIES[category] : [];

  const handleDegreeChange = (val: string) => {
    setDegree(val as DegreeProgram | '');
    setBranch('');
    setBranchAnimating(true);
    setTimeout(() => setBranchAnimating(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !branch || !department) return;
    setShowReviewDrawer(true);
  };

  const confirmAndSubmit = () => {
    const newGrievance = {
      title,
      description,
      category: category as ComplaintCategory,
      subCategory: subCategory || undefined,
      targetDepartment: department,
      branch,
      degree: degree as DegreeProgram || undefined,
      studentId: user.id,
      studentName: user.name,
      urgency,
      imageUrl: undefined,
      resolutionProofUrl: undefined,
      expectedDate: undefined,
      resolvedAt: undefined,
      status: 'pending',
      authorityLevel: 1,
      adminComments: [],
      createdAt: new Date().toISOString(),
      id: String(Date.now()),
      tokenId: `JEC-2026-${String(Date.now()).slice(-4)}`
    };

    addComplaint(newGrievance);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#39ff14', '#ccff00']
    });

    setTitle(''); setDescription(''); setCategory(''); setSubCategory(''); setDepartment(''); setUrgency('Low');
    setShowReviewDrawer(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="jec-card p-6 border-l-4 border-l-[#ccff00] border-[#39ff14]/30 text-[#39ff14]">
      <h2 className="text-[14px] font-mono font-bold text-[#39ff14] mb-1 uppercase tracking-widest">INITIALIZE_ISSUE_NODE</h2>
      <p className="text-[10px] font-mono text-[#ccff00]/70 mb-5 uppercase tracking-widest">SUBMIT_TARGET_DATA_FOR_ESCALATION.</p>

      {submitted && (
        <div className="bg-[rgba(57,255,20,0.1)] border border-[#39ff14]/50 rounded-none p-4 mb-4 animate-scale-in text-center shadow-[0_0_15px_rgba(57,255,20,0.2)]">
          <p className="text-[#39ff14] font-mono font-bold text-sm tracking-widest uppercase mb-1">DATA_PACKET_TRANSMITTED_SUCCESSFULLY.</p>
          <p className="text-[10px] text-[#ccff00]/80 font-mono tracking-widest uppercase">ASSIGNED_TO_LEVEL_1_PROCESSING.</p>
        </div>
      )}

      {/* Review Drawer */}
      <AnimatePresence>
        {showReviewDrawer && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewDrawer(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-black/90 h-full shadow-2xl flex flex-col border-l border-[#39ff14]/30 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#39ff14]/20 bg-black/50">
                <h2 className="text-sm font-mono font-bold text-[#ccff00] uppercase tracking-widest">VERIFY_DATA_PACKET</h2>
                <button
                  onClick={() => setShowReviewDrawer(false)}
                  className="p-2 rounded-none hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-[#39ff14]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-4 text-[#39ff14] font-mono">
                  <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                    <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">NODE_TITLE</p>
                    <p className="font-bold text-xs uppercase tracking-wider">{title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                      <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">CATEGORY</p>
                      <p className="font-bold text-[10px] uppercase tracking-wider">{category}</p>
                    </div>
                    {subCategory && (
                      <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                        <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">SUB_CLASS</p>
                        <p className="font-bold text-[10px] uppercase tracking-wider">{subCategory}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                      <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">BRANCH</p>
                      <p className="font-bold text-[10px] uppercase tracking-wider">{branch}</p>
                    </div>
                    <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                      <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">PRIORITY</p>
                      <p className={`font-bold text-[10px] uppercase tracking-wider ${
                        urgency === 'High' ? 'text-[#ff073a] animate-pulse' : 
                        urgency === 'Medium' ? 'text-[#ccff00]' : 'text-[#39ff14]'
                      }`}>{urgency}</p>
                    </div>
                  </div>

                  <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                    <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">TARGET_SYSTEM</p>
                    <p className="font-bold text-xs uppercase tracking-wider">{department}</p>
                  </div>

                  <div className="bg-[rgba(57,255,20,0.05)] p-4 rounded-none border border-[#39ff14]/20">
                    <p className="text-[9px] text-[#ccff00]/60 uppercase font-bold tracking-widest mb-1">RAW_DATA_PAYLOAD</p>
                    <p className="text-[10px] text-[#39ff14]/80 whitespace-pre-wrap uppercase tracking-wider leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#39ff14]/20 bg-black/80 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewDrawer(false)}
                  className="flex-1 py-3 font-mono text-[10px] font-bold tracking-widest uppercase border border-[#39ff14]/50 hover:bg-[#39ff14]/10 transition-colors text-[#39ff14]"
                >
                  ABORT
                </button>
                <button
                  type="button"
                  onClick={confirmAndSubmit}
                  className="flex-1 btn-quantum font-bold tracking-widest flex items-center justify-center gap-2 text-[10px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  TRANSMIT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 font-mono">
        <div>
          <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">NODE_IDENTIFIER</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="ENTER_SHORT_IDENTIFIER"
            className="w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 placeholder:text-gray-500 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all" required />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">USER_IDENTITY</label>
          <input value={user.name} disabled className="w-full border border-[#39ff14]/10 rounded-none px-3 py-3 text-xs bg-[#0a0a0a]/50 text-gray-400 cursor-not-allowed uppercase tracking-wider" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">PROG_SELECTION</label>
            <select value={degree} onChange={e => handleDegreeChange(e.target.value)}
              className="w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all uppercase" required>
              <option value="">AWAITING_INPUT</option>
              {DEGREE_PROGRAMS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">BRANCH_SELECTION</label>
            <select value={branch} onChange={e => setBranch(e.target.value)}
              disabled={!degree}
              className={`w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs outline-none transition-all duration-300 uppercase ${
                !degree ? 'bg-[#0a0a0a]/50 cursor-not-allowed opacity-50 text-gray-400 border-transparent' : 'bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00]'
              }`}
              required>
              <option value="">{degree ? 'AWAITING_INPUT' : 'SELECT_PROG_FIRST'}</option>
              {availableBranches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">CATEGORY_TAG</label>
            <select value={category} onChange={e => { setCategory(e.target.value as ComplaintCategory | ''); setSubCategory(''); }}
              className="w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all uppercase" required>
              <option value="">AWAITING_INPUT</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">SUB_CLASS_TAG</label>
            <select value={subCategory} onChange={e => setSubCategory(e.target.value)}
              className={`w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs outline-none uppercase ${
                !category ? 'bg-[#0a0a0a]/50 cursor-not-allowed opacity-50 text-gray-400 border-transparent' : 'bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00]'
              }`} disabled={!category}>
              <option value="">AWAITING_INPUT</option>
              {availableSubCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">ROUTED_TO (AUTO)</label>
            <input value={department || '—'} disabled
              className="w-full border border-[#39ff14]/10 rounded-none px-3 py-3 text-xs bg-[#0a0a0a]/50 text-gray-400 cursor-not-allowed uppercase" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">PRIORITY_OVERRIDE</label>
            <select value={urgency} onChange={e => setUrgency(e.target.value as UrgencyLevel)}
              className="w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] outline-none uppercase">
              <option value="Low">LOW_PRIORITY</option>
              <option value="Medium">MEDIUM_PRIORITY</option>
              <option value="High">HIGH_PRIORITY</option>
            </select>
            {subCategory && URGENT_SUB_CATEGORIES.includes(subCategory) && (
              <p className="text-[9px] text-[#ff073a] tracking-widest uppercase font-bold mt-1 animate-pulse">⚠ AUTO_ELEVATED: HIGH</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">PAYLOAD_DATA</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            placeholder="ENTER_DETAILS..."
            className="w-full border border-[#39ff14]/30 rounded-none px-3 py-3 text-xs bg-[#0a0a0a] text-gray-200 placeholder:text-gray-500 resize-y focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all uppercase" required />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mb-1">ATTACH_BINARY</label>
          <input type="file" accept="image/*" className="w-full border border-[#39ff14]/30 rounded-none px-3 py-2 text-xs bg-[#0a0a0a] text-gray-200 file:bg-[#39ff14]/20 file:border-0 file:text-[#39ff14] file:px-2 file:py-1 file:uppercase file:font-mono file:text-[10px] file:tracking-widest" />
          <p className="text-[9px] text-[#39ff14]/40 mt-1 uppercase tracking-widest">OPTIONAL: ATTACH_IMAGE_PAYLOAD</p>
        </div>
        <button type="submit" className="w-full btn-quantum font-bold tracking-widest py-3 mt-2 text-xs">
          TRANSMIT_TO_LEVEL_1
        </button>
      </form>
    </div>
  );
}
