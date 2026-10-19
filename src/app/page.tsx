import { CommandBasic } from "@/components/features/command-basic";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-4">
      <div>Foo</div>
      <Button>Save</Button>
      <CommandBasic></CommandBasic>
    </div>
  );
}
