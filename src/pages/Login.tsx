import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jecLogo from '@/assets/jec-logo.png';
import { GraduationCap, Shield } from 'lucide-react';
import SystemBootLoader from '@/components/SystemBootLoader';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [portal, setPortal] = useState<'student' | 'authority'>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login({ id, password, portal });
      if (success) {
        navigate('/');
      } else {
        setError(portal === 'student' ? 'INVALID_ENROLLMENT_OR_PASSWORD' : 'INVALID_AUTHORITY_CREDENTIALS');
      }
    } catch (err) {
      setError('CONNECTION_ERROR: SUPABASE_UNREACHABLE.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SystemBootLoader isLoading={true}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-transparent z-10">

        <div className="w-full max-w-md z-10 animate-fade-in">
          {/* Logo and Institution Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-black/40 border border-[#39ff14]/30 shadow-[0_0_15px_rgba(57,255,20,0.2)] mb-4 transform hover:scale-110 transition-transform cursor-pointer">
              <img src={jecLogo} alt="JEC Logo" className="w-16 h-16 md:w-20 md:h-20" style={{ filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.5))' }} />
            </div>
            <h2 className="text-[#39ff14] text-2xl font-mono font-bold tracking-widest uppercase text-shadow-sm">JEC-RESOLVE</h2>
            <p className="text-[#ccff00]/80 text-xs font-mono tracking-widest mt-2 uppercase">Cyber-Terminal Gateway</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-black/40 border border-[#39ff14]/20 p-1 mb-6 shadow-inner relative z-10">
            <button
              onClick={() => { setPortal('student'); setError(''); setId(''); setPassword(''); }}
              className={`flex-1 py-3 text-xs font-mono tracking-wider uppercase transition-all border ${portal === 'student' ? 'border-[#ccff00] bg-[rgba(204,255,0,0.1)] text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.2)]' : 'border-transparent text-[#39ff14]/60 hover:text-[#39ff14]'}`}
            >
              STUDENT
            </button>
            <button
              onClick={() => { setPortal('authority'); setError(''); setId(''); setPassword(''); }}
              className={`flex-1 py-3 text-xs font-mono tracking-wider uppercase transition-all border ${portal === 'authority' ? 'border-[#ccff00] bg-[rgba(204,255,0,0.1)] text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.2)]' : 'border-transparent text-[#39ff14]/60 hover:text-[#39ff14]'}`}
            >
              AUTHORITY
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-black/80 p-8 shadow-[0_0_30px_rgba(57,255,20,0.1)] border border-[#39ff14]/40 backdrop-blur-md relative z-10">
            <h3 className="text-lg font-mono tracking-widest text-[#39ff14] mb-6 flex items-center gap-3 uppercase">
              {portal === 'student' ? <GraduationCap className="w-5 h-5 text-[#ccff00]" /> : <Shield className="w-5 h-5 text-[#ccff00]" />}
              {portal === 'student' ? 'Student Access' : 'Authority Auth'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-2 ml-1">Unique Identifier</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full border border-[#39ff14]/30 rounded-none px-4 py-3 text-sm bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all placeholder:text-gray-500 font-mono uppercase tracking-wider"
                    placeholder={portal === 'student' ? 'ENROLLMENT NUM' : 'EMPLOYEE ID'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-2 ml-1">Access Key</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[#39ff14]/30 rounded-none px-4 py-3 text-sm bg-[#0a0a0a] text-gray-200 focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] outline-none transition-all placeholder:text-gray-500 font-mono tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-950/50 text-[#ff073a] border border-[#ff073a]/50 font-mono text-[10px] tracking-wider py-3 px-4 flex items-center gap-2 animate-led-pulse">
                  <Shield className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-quantum py-4 mt-2"
              >
                {loading ? 'AUTHENTICATING...' : 'INITIALIZE CONNECTION'}
              </button>
            </form>

            {/* Interactive Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-[#39ff14]/20 text-center">
              <p className="text-[10px] font-mono text-[#39ff14]/60 uppercase tracking-widest mb-4">Click to Auto-fill Demo Access</p>
              <div className="grid grid-cols-2 gap-3">
                {portal === 'student' ? (
                  <>
                    <button type="button" onClick={() => { setId('0201EC25101'); setPassword('student123'); }} className="text-[10px] p-2 bg-black/40 hover:bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] font-mono transition-colors">
                      ID: 0201EC25101
                    </button>
                    <button type="button" onClick={() => { setId('0201CS25102'); setPassword('student123'); }} className="text-[10px] p-2 bg-black/40 hover:bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] font-mono transition-colors">
                      ID: 0201CS25102
                    </button>
                  </>
                ) : (
                  <>
                    <div className="col-span-2 grid grid-cols-3 gap-2">
                      {['HOSTEL_ADMIN', 'ACAD_ADMIN', 'INFRA_ADMIN', 'ACCOUNTS_ADMIN', 'IT_ADMIN', 'WELFARE_ADMIN'].map(aid => (
                        <button key={aid} type="button" onClick={() => { setId(aid); setPassword('admin123'); }} className="text-[8px] p-2 bg-black/40 hover:bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] font-mono transition-colors truncate">
                          {aid}
                        </button>
                      ))}
                    </div>

                    <div className="col-span-2 border-t border-[#39ff14]/20 my-3"></div>
                    <p className="col-span-2 text-[9px] font-mono text-[#ccff00]/60 uppercase tracking-wider mb-2">Escalation Authorities (Level 2, 3 & 4)</p>
                    
                    <div className="col-span-2 grid grid-cols-3 gap-2">
                      {['DEPT_HEAD_01', 'BRANCH_HOD_01', 'PRINCIPAL_JEC'].map(aid => (
                        <button key={aid} type="button" onClick={() => { setId(aid); setPassword('admin123'); }} className="text-[8px] p-2 bg-black/40 hover:bg-[#ff073a]/10 border border-[#ff073a]/30 text-[#ff073a] font-mono transition-colors truncate">
                          {aid}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p className="text-[9px] text-[#39ff14]/50 mt-4 font-mono uppercase tracking-widest">Internal System — JEC IT CELL (M.P.)</p>
            </div>
          </div>
        </div>
      </div>
    </SystemBootLoader>
  );
}
