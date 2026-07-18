import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { 
  HardHat, 
  Sparkles, 
  Calculator, 
  Building2, 
  FileSpreadsheet, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Next-Gen AI Civil Engineering Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-900 dark:text-white"
          >
            Precision Construction Material Estimation & Cost Analytics
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            ConstructAI empowers civil engineers, architects, contractors, and homeowners to calculate exact material quantities, compare top brand prices, generate instant BOQ reports, and streamline project costs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              Start Free Estimation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/estimator"
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              Interactive Material Calculator
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            {[
              { label: 'Calculated Accuracy', val: '99.2%', desc: 'Based on IS/ACI standard codes' },
              { label: 'Time Saved', val: '10x Faster', desc: 'Instant multi-category BOQ' },
              { label: 'Material Cost Saved', val: 'Up to 12%', desc: 'Via brand price comparison' },
              { label: 'Projects Estimations', val: '50,000+', desc: 'Calculated seamlessly' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-subtle">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.val}</div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{stat.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Modules */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Engineering-Grade Features</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
              All the tools required for residential, commercial, and heavy structural material estimations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: 'Civil Material Calculator',
                desc: 'Calculate Cement, Sand, Aggregates, Bricks, Steel TMT Bars, Tiles, Paint, and Conduits with wet/dry volume ratios and wastage allowances.'
              },
              {
                icon: Sparkles,
                title: 'AI Prompt Estimator',
                desc: 'Describe your project specs (e.g. "2000 sq ft 3-story house") and get an instant AI-powered BOQ and cost schedule.'
              },
              {
                icon: Building2,
                title: 'Brand Price Comparison',
                desc: 'Compare cement grades (UltraTech, ACC), steel rebar brands (Tata Tiscon, JSW), paints, and pipes to select optimal quality and pricing.'
              },
              {
                icon: FileSpreadsheet,
                title: 'Instant BOQ Reports',
                desc: 'Generate professional, print-ready Bill of Quantities (BOQ) PDF reports to share with clients, suppliers, and contractors.'
              },
              {
                icon: TrendingUp,
                title: 'Project Cost Management',
                desc: 'Track structural expenses, track budget vs actual spending, and manage multi-stage construction estimations.'
              },
              {
                icon: ShieldCheck,
                title: 'Code Standard Compliant',
                desc: 'Utilizes standardized mix ratios (M15, M20, M25), dry volume factors (1.54), and density norms for precise field accuracy.'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Roles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tailored for Every Stakeholder</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
              Designed to suit the specific workflows of construction industry professionals and site owners.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Civil Engineers', points: ['Structural mix ratios', 'Steel density calculations', 'Wastage percentage analysis'] },
              { role: 'Architects', points: ['Material takeoff sheets', 'Specification comparison', 'Client cost presentations'] },
              { role: 'Builders & Contractors', points: ['Bulk brand price matrix', 'PDF BOQ exports', 'Project budget tracking'] },
              { role: 'Homeowners', points: ['Simplified prompt estimation', 'Transparent cost overview', 'Supplier vendor guidance'] }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.role}</div>
                <ul className="mt-4 space-y-2.5">
                  {item.points.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 font-bold text-xl text-slate-900 dark:text-white">
            <HardHat className="w-6 h-6 text-blue-600" />
            ConstructAI
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Build smarter, estimate with total confidence, and keep every construction project within budget.
          </p>
          <div className="mt-6 text-xs text-slate-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} ConstructAI Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
