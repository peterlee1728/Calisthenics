import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShineBorder } from "@/components/ui/shine-border";
import { login } from "@/redux/authSlice";

export function LoginDialog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returned 401 with { "error": "..." }
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Success — store token + user info in Redux/sessionStorage
      dispatch(
        login({
          email: data.email,
          userRole: data.role,
          token: data.token,
        })
      );

      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative w-full max-w-[350px] overflow-hidden">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-bold text-left">Email</h3>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold text-left">Password</h3>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600 text-left">{error}</p>
            ) : null}
          </div>
          <CardFooter className="px-0 pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white border-black hover:border-black"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
