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
import { ShinyButton } from "@/components/ui/shiny-button";

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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div>
          {/* <div classname="flex border-solid">
            <div classname="flex gap-x-4 gap-y-4 flex-row">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div classname="flex gap-x-4 gap-y-4 flex-row">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div> */}
        </form>
      </CardContent>
      <CardFooter>
        {/* <ShinyButton className="w-full bg-black text-white hover:border-black">Login</ShinyButton> */}
        <Button className="w-full bg-black text-white border-black hover:border-black">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
