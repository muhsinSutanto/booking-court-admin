import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { DEMO_ACCOUNT, useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/schedule" replace />;

  function submit(event) {
    event.preventDefault();
    const message = login(email, password);
    if (message) {
      setError(message);
      return;
    }
    navigate("/schedule");
  }

  return (
    <div className="grid min-h-svh place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-border">
        <div className="flex items-center gap-2">
          <BrandMark className="size-6" />
          <span className="text-sm font-semibold tracking-[0.16em]">SAMPLE</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Konsol venue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola jadwal lapangan, pelanggan, match, klinik, dan pembayaran.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
          <Field label="Email">
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@samplepadel.id"
            />
          </Field>
          <Field label="Kata sandi">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-16"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Sembunyi" : "Lihat"}
              </button>
            </div>
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="h-10">
            Masuk
          </Button>
        </form>

        <div className="mt-5 rounded-xl bg-accent/70 px-4 py-3 text-sm">
          <p className="font-medium">Akun demo super admin</p>
          <p className="mt-1 text-muted-foreground">
            {DEMO_ACCOUNT.email}
            <br />
            {DEMO_ACCOUNT.password}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 bg-white"
            onClick={() => {
              setEmail(DEMO_ACCOUNT.email);
              setPassword(DEMO_ACCOUNT.password);
              setError("");
            }}
          >
            Isi akun demo
          </Button>
        </div>
      </div>
    </div>
  );
}
