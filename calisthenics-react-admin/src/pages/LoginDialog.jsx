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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError("Username and password are required.");
      return;
    }

    // Placeholder until backend login is wired; replace with API call + real role.
    dispatch(
      login({
        username: trimmedUsername,
        userRole: "SA",
      })
    );
    navigate("/home", { replace: true });
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
              <h3 className="text-lg font-bold text-left">Username</h3>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
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
