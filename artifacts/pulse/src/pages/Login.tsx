import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "signin" | "signup";

export default function Login() {
  const [, navigate] = useLocation();
  const { setDemoUser } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      setDemoUser();
      navigate("/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-[#0f0f1f] to-[#0a0a0f]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-indigo-500/8 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Omnia</span>
        </div>

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
              Omnia connects to your tools, analyzes your metrics, and tells you
              exactly what to focus on — before you even ask.
            </p>
          </motion.div>

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm space-y-3"
          >
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Omnia replaced three weekly reporting calls. I open it every morning
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
                <p className="text-white font-semibold text-lg tracking-tight">
                  {mode === "signin" ? "Authenticating securely..." : "Creating your account..."}
                </p>
                <p className="text-slate-500 text-sm">
                  Verifying your credentials with enterprise-grade encryption
                </p>
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
              <div className="flex lg:hidden items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Omnia</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-slate-400 text-sm">
                  {mode === "signin"
                    ? "Sign in to your workspace to continue"
                    : "Start your AI Chief of Staff journey"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400 text-sm text-center">Sign in with email and password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!email) { setError("Enter your email first."); return; }
                          const { error } = await supabase.auth.resetPasswordForEmail(email);
                          if (error) setError(error.message);
                          else setSuccess("Password reset email sent — check your inbox.");
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="h-11 bg-white/[0.05] border-white/[0.10] text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 focus-visible:bg-white/[0.07] transition-all pr-11"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
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
                  {success && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-emerald-400 text-xs font-medium px-1"
                    >
                      {success}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 text-sm tracking-wide"
                >
                  {mode === "signin" ? "Sign In to Omnia" : "Create Account"}
                </Button>
              </form>

              <div className="space-y-4">
                <p className="text-center text-slate-600 text-xs">
                  {mode === "signin" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Create one
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
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
