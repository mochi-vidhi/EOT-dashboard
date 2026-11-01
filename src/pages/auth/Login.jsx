import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Sun, Moon, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { FormField } from "../../components/ui/form-field";
import {
  setLoginMethod, setAuthMethod, clearError,
  loginWithPassword, sendOtp, verifyOtp,
  selectLoginMethod, selectAuthMethod, selectIsLoading,
  selectError, selectOtpSent, selectOtpCountdown,
} from "../../store/authSlice";
import { filledArray, handleOtpChange, handleOtpKeyDown, handleOtpPaste } from "../../utils/iismethod";

const LOGIN_METHODS = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "username", label: "Username" },
];
const AUTH_OPTIONS = [
  { id: "password", label: "Login with password" },
  { id: "otp", label: "Login with OTP" },
];
const FIELD_META = {
  email: { label: "Email address", placeholder: "Enter your email address", type: "email" },
  phone: { label: "Phone number", placeholder: "Enter your phone number", type: "tel" },
  username: { label: "Username", placeholder: "Enter your username", type: "text" },
};
const OTP_LENGTH = 6;

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => { document.documentElement.classList.toggle("dark", !dark); setDark(!dark); };
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-foreground text-xs font-medium cursor-pointer hover:bg-accent hover:border-ring transition-colors shadow-sm">
      {dark ? <Sun size={13} /> : <Moon size={13} />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}

function OtpInput({ length = OTP_LENGTH, value, onChange }) {
  const refs = useRef([]);
  return (
    <div className="flex gap-2 justify-between">
      {Array.from({ length }).map((_, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleOtpChange(e, i, value, length, onChange, refs)}
          onKeyDown={(e) => handleOtpKeyDown(e, i, value, refs)}
          onPaste={(e) => handleOtpPaste(e, length, onChange, refs)}
          aria-label={`OTP digit ${i + 1}`}
          className="w-10 h-12 text-center text-lg font-bold font-mono rounded-lg border border-input bg-transparent outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
        />
      ))}
    </div>
  );
}

export default function Login() {
  const dispatch = useDispatch();
  const loginMethod = useSelector(selectLoginMethod);
  const authMethod = useSelector(selectAuthMethod);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const otpSent = useSelector(selectOtpSent);
  const countdown = useSelector(selectOtpCountdown);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(filledArray(OTP_LENGTH));

  const meta = FIELD_META[loginMethod];
  const canUseOtp = loginMethod !== "username";

  const onMethodChange = (id) => {
    dispatch(setLoginMethod(id));
    dispatch(clearError());
    setIdentifier(""); setPassword(""); setOtp(filledArray(OTP_LENGTH));
  };
  const onAuthChange = (id) => {
    dispatch(setAuthMethod(id));
    dispatch(clearError());
    setOtp(filledArray(OTP_LENGTH));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (authMethod === "password") dispatch(loginWithPassword({ identifier, password, loginMethod }));
    else if (otpSent) dispatch(verifyOtp({ identifier, otp: otp.join(""), loginMethod }));
    else dispatch(sendOtp({ identifier, loginMethod }));
  };
  const onResend = () => {
    if (countdown > 0) return;
    setOtp(filledArray(OTP_LENGTH));
    dispatch(sendOtp({ identifier, loginMethod }));
  };
  const buttonLabel = () => {
    if (isLoading) return authMethod === "otp" ? (otpSent ? "Verifying…" : "Sending OTP…") : "Signing in…";
    if (authMethod === "otp") return otpSent ? "Verify & Sign In" : "Send OTP";
    return "Login";
  };

  return (
    <div className="login-page">
      <ThemeToggle />

      {/* Left — Form */}
      <div className="login-left">
        <div className="login-card">
          <div className="flex flex-col items-center mb-6 text-center">
            <img
              src="/etech-logo.png"
              alt="ETech Digital Solutions - Elevating Innovation"
              className="h-14 w-auto object-contain dark:hidden drop-shadow-xs"
            />
            <img
              src="/etech-logo-white.png"
              alt="ETech Digital Solutions - Elevating Innovation"
              className="h-14 w-auto object-contain hidden dark:block drop-shadow-xs"
            />
            <h1 className="text-xl font-bold text-foreground tracking-tight mt-3">EOT Crane Management</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Sign in to your account</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-destructive/25 bg-destructive/8 text-destructive text-sm mb-4" role="alert">
              <AlertCircle size={15} className="shrink-0" />{error}
            </div>
          )}

          {/* Login-with tabs */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-foreground mb-2">Login with</p>
            <div role="tablist" aria-label="Login method"
              className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-secondary border border-border">
              {LOGIN_METHODS.map((m) => (
                <button key={m.id} role="tab" aria-selected={loginMethod === m.id}
                  onClick={() => onMethodChange(m.id)}
                  className={cn(
                    "py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                    loginMethod === m.id
                      ? "bg-card text-primary font-semibold shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  )}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auth method radios */}
          {canUseOtp && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-foreground mb-2.5">Authentication method</p>
              <div className="flex flex-col gap-2">
                {AUTH_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="radio" name="authMethod" value={opt.id}
                      checked={authMethod === opt.id}
                      onChange={() => onAuthChange(opt.id)}
                      className="w-4 h-4 accent-primary cursor-pointer" />
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} noValidate>
            <FormField label={meta.label}>
              <Input type={meta.type} placeholder={meta.placeholder}
                value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                autoComplete={meta.type} className="h-11 px-3.5 text-sm rounded-xl" required />
            </FormField>

            {authMethod === "password" && (
              <FormField label="Password">
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} placeholder="Enter your password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password" className="h-11 px-3.5 pr-11 text-sm rounded-xl" required />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
            )}

            {authMethod === "password" && (
              <div className="flex justify-end mb-4 -mt-2">
                <a href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {authMethod === "otp" && !otpSent && (
              <p className="text-sm text-muted-foreground mb-4">
                An OTP will be sent to your registered {loginMethod === "email" ? "email address" : "phone number"}.
              </p>
            )}

            {authMethod === "otp" && otpSent && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Enter the 6-digit code sent to <strong className="text-foreground">{identifier}</strong>
                </p>
                <OtpInput value={otp} onChange={setOtp} />
                <div className="text-center mt-3 text-sm text-muted-foreground">
                  Didn&apos;t receive it?{" "}
                  <button type="button" onClick={onResend} disabled={countdown > 0}
                    className={cn("font-semibold cursor-pointer",
                      countdown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline")}>
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" size="lg" disabled={isLoading}
              className="w-full h-11 text-sm font-semibold rounded-xl mt-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer">
              {isLoading && <Spinner size={14} className="text-primary-foreground" />}
              {buttonLabel()}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Secure authentication for EOT Crane Management
          </p>
        </div>
      </div>

      {/* Right — Image */}
      <div className="login-right" aria-hidden="true">
        <img src="/EOTCrane.png" alt="EOT Crane" className="login-right-image" draggable={false} />
        <div className="login-right-overlay" />
        <div className="login-right-content">
          <span className="login-right-badge">
            <img src="/etech-icon.png" alt="" className="w-4 h-3.5 object-contain brightness-0 invert" />
            Industrial IoT Platform
          </span>
          <h2 className="login-right-title">Precision monitoring<br />for EOT Cranes</h2>
          <p className="login-right-subtitle">
            Real-time telemetry, predictive maintenance alerts, and
            operational insights — all from a single unified dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
