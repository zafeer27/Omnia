import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter your work email and password.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    navigate("/dashboard");
  };

  const handleSSO = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-[#0f0f1f] to-[#0a0a0f]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-indigo-500/8 blur-[80px]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Pulse</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI Chief of Staff
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              Your entire business,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                understood at a glance.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Pulse connects to your tools, analyzes your metrics, and tells you
              exactly what to focus on — before you even ask.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { value: "2,400+", label: "Founders" },
              { value: "$4.2B", label: "Revenue tracked" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm space-y-3"
          >
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Pulse replaced three weekly reporting calls. I open it every morning
              and I know exactly what's on fire and what's working."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              <div>
                <div className="text-white text-xs font-semibold">Sarah A.</div>
                <div className="text-slate-500 text-xs">CEO, Meridian Labs · Series B</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom badges */}
        <div className="relative z-10 flex items-center gap-4">
          {[
            { icon: ShieldCheck, text: "SOC 2 Type II" },
            { icon: ShieldCheck, text: "GDPR Compliant" },
            { icon: ShieldCheck, text: "256-bit encryption" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Icon className="h-3.5 w-3.5 text-slate-600" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-[#0c0c14]" />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex flex-col items-center gap-6 text-center"
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <Loader2 className="h-7 w-7 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 blur-xl opacity-40 -z-10" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-semibold text-lg tracking-tight">Authenticating securely...</p>
                <p className="text-slate-500 text-sm">Verifying your credentials with enterprise-grade encryption</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[400px] space-y-8"
            >
              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Pulse</span>
              </div>

              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-slate-400 text-sm">Sign in to your workspace to continue</p>
              </div>

              {/* SSO Button */}
              <Button
                type="button"
                onClick={handleSSO}
                className="w-full h-11 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] hover:border-white/20 text-white font-medium rounded-xl transition-all duration-200 gap-3 text-sm"
                variant="ghost"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#4285F4" />
                  <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#34A853" />
                  <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#FBBC05" />
                  <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#EA4335" />
                </svg>
                Continue with Single Sign-On (SSO)
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-slate-600 text-xs font-medium tracking-wide">or sign in with email</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* Email / Password form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="h-11 bg-white/[0.05] border-white/[0.10] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 focus-visible:bg-white/[0.07] transition-all"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="h-11 bg-white/[0.05] border-white/[0.10] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 focus-visible:bg-white/[0.07] transition-all pr-11"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-red-400 text-xs font-medium px-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 text-sm tracking-wide"
                >
                  Sign In to Pulse
                </Button>
              </form>

              {/* Footer */}
              <div className="space-y-4">
                <p className="text-center text-slate-600 text-xs">
                  Don't have an account?{" "}
                  <a href="/onboarding" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Request access
                  </a>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Enterprise-grade security · SOC 2 Type II certified</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
