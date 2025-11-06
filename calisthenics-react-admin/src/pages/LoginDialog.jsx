import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/ui/shine-border";

export function LoginDialog() {
  return (
    <Card className="relative w-full max-w-[350px] overflow-hidden">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
      </CardHeader>      
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
            <h3 className="text-lg font-bold text-left">Username</h3>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-bold text-left">Password</h3>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-black text-white border-black hover:border-black">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
