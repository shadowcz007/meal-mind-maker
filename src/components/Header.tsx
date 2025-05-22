
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import ApiSettingsDialog from "./ApiSettingsDialog";

const Header = () => {
  const { currentStep } = useUser();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="w-full bg-nutrition-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-white">
            <path d="M20 11H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zm-1 4H5c-.55 0-1-.45-1-1v-1h16v1c0 .55-.45 1-1 1zM12 5c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5z" />
          </svg>
          <h1 className="text-2xl font-bold">减脂营养师</h1>
        </div>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-nutrition-secondary hover:text-white"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={20} />
          <span className="ml-2">API设置</span>
        </Button>
      </div>
      <ApiSettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
    </div>
  );
};

export default Header;
