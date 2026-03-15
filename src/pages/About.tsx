import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Eye, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Award,
  Phone,
  Mail,
  Building,
  Terminal
} from 'lucide-react';
import SystemBootLoader from '@/components/SystemBootLoader';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function About() {
  const pillars = [
    {
      icon: <Zap className="w-8 h-8 text-[#ccff00]" />,
      title: "DYNAMIC_ESCALATION",
      desc: "NO_DATA_IGNORED. THE 4-TIER ARCHITECTURE ENSURES THAT UNRESOLVED PACKETS AUTOMATICALLY PROPAGATE TO APEX NODES."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#ccff00]" />,
      title: "SLA_ENFORCEMENT",
      desc: "TIME-LOCK. ONCE A NODE COMMITS TO A RESOLUTION TIMESTAMP, THE SYSTEM LOCKS THE ENTRY TO ENSURE DATA INTEGRITY."
    },
    {
      icon: <Eye className="w-8 h-8 text-[#ccff00]" />,
      title: "PUBLIC_ACCOUNTABILITY",
      desc: "EVERY RECORD IS ASSIGNED A UNIQUE HASH AND TRACKED VIA PUBLIC LEDGER FOR TOTAL NETWORK TRANSPARENCY."
    }
  ];

  const roadmap = [
    {
      phase: "L1_NODE",
      title: "GRASSROOT_LEVEL",
      action: "DIRECT RESOLUTION BY LOCAL STAFF/WARDEN ASSIGNMENT.",
      icon: <Users className="w-5 h-5 text-[#000a12]" />
    },
    {
      phase: "L2_NODE",
      title: "ADMINISTRATIVE_OVERSIGHT",
      action: "DEPARTMENTAL OVERRIDE FOR PERSISTENT ANOMALIES.",
      icon: <Building className="w-5 h-5 text-[#000a12]" />
    },
    {
      phase: "L3_NODE",
      title: "STRATEGIC_ESCALATION",
      action: "INTEGRATION OF BRANCH_HOD AND SENIOR NETWORK ADMINS.",
      icon: <ShieldCheck className="w-5 h-5 text-[#000a12]" />
    },
    {
      phase: "L4_APEX",
      title: "APEX_AUTHORITY",
      action: "FINAL_REVIEW EXECUTED BY PRINCIPAL_JEC SECURE_NODE.",
      icon: <Award className="w-5 h-5 text-[#000a12]" />
    }
  ];

  return (
    <SystemBootLoader isLoading={true}>
      <div className="min-h-screen bg-transparent text-[#39ff14] font-mono relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <motion.div {...fadeInUp} className="p-8 border border-[#39ff14]/30 bg-black/50 shadow-[0_0_30px_rgba(57,255,20,0.1)] inline-block">
              <h1 className="text-xl md:text-3xl font-black text-[#39ff14] mb-4 tracking-[0.2em] uppercase">
                <Terminal className="w-8 h-8 inline mr-4 mb-2" />
                JEC-RESOLVE // CORE_ARCHIVES
              </h1>
              <p className="text-[10px] md:text-xs text-[#ccff00] font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto border-t border-[#39ff14]/30 pt-4">
                EMPOWERING TERMINALS VIA TRANSPARENT DATA STREAMING
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Pillars Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {pillars.map((pillar, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  className="jec-card p-8 group hover:-translate-y-2"
                >
                  <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ccff00]/10 transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                    {pillar.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[#ccff00] mb-4 uppercase tracking-[0.1em]">{pillar.title}</h3>
                  <p className="text-[#39ff14]/70 leading-loose text-[10px] uppercase font-bold tracking-wider">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Vertical Roadmap */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-xl font-bold text-[#39ff14] uppercase tracking-widest mb-4">ESCALATION_HIERARCHY</h2>
              <div className="w-24 h-0.5 bg-[#ccff00] mx-auto shadow-[0_0_10px_#ccff00]" />
            </motion.div>

            <div className="relative">
              {/* Roadmap Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#39ff14]/20 -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-12 relative overflow-hidden">
                {roadmap.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Content Card */}
                    <div className="flex-1 w-full">
                      <div className="jec-card p-6 border-l-4 border-l-[#ccff00] relative group hover:shadow-[0_0_20px_rgba(204,255,0,0.2)] transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-[0.2em]">{item.phase}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#39ff14] mb-2 tracking-widest uppercase">{item.title}</h4>
                        <p className="text-[#39ff14]/60 text-[10px] font-bold uppercase tracking-wider leading-relaxed"><span className="text-[#ccff00] font-bold mr-2">EXECUTION:</span> {item.action}</p>
                      </div>
                    </div>

                    {/* Icon Marker */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 bg-[#39ff14] flex items-center justify-center shadow-[0_0_15px_#39ff14] border-2 border-[#ccff00] transform group-hover:scale-125 transition-transform duration-300 rounded-none">
                        {item.icon}
                      </div>
                    </div>

                    {/* Spacer for 2nd column */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Footer Info */}
        <section className="py-12 bg-black/60 border-t border-[#39ff14]/30 relative z-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInUp}>
                <h3 className="text-sm font-bold mb-8 uppercase tracking-[0.2em] text-[#ccff00]">COMM_LINKS</h3>
                <div className="space-y-4 text-[10px]">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 border border-[#39ff14]/30 bg-black/40 flex items-center justify-center group-hover:border-[#ccff00] group-hover:text-[#ccff00] transition-all">
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="font-bold tracking-widest">+91_7612331953</p>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 border border-[#39ff14]/30 bg-black/40 flex items-center justify-center group-hover:border-[#ccff00] group-hover:text-[#ccff00] transition-all">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="font-bold tracking-widest">PRINJEC.JBP@MP.GOV.IN</p>
                  </div>
                  <div className="flex items-center gap-4 group mt-8 pt-4 border-t border-[#39ff14]/20 text-[#39ff14]/60">
                    <MapPin className="w-6 h-6 flex-shrink-0 text-[#39ff14]" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                      JABALPUR_ENGINEERING_COLLEGE // EST_1947
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="jec-card p-8 border border-[#ccff00]/40"
              >
                <h4 className="text-[#ff073a] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 animate-pulse">OFFICIAL_DIRECTIVE</h4>
                <p className="text-[10px] font-bold tracking-widest leading-loose text-[#39ff14]/80 uppercase">
                  &gt; "TECHNICAL EDUCATION = NATIONAL PROGRESS. JEC-RESOLVE SECURES AN ENVIRONMENT TO FOSTER GROWTH, ELIMINATING ADMINISTRATIVE_DRIFT."
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </SystemBootLoader>
  );
}
