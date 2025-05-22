
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface ApiSettingsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ApiSettingsDialog = ({ open, setOpen }: ApiSettingsDialogProps) => {
  const { settings, setSettings } = useUser();
  const [tempSettings, setTempSettings] = useState({...settings});

  const handleSave = () => {
    setSettings(tempSettings);
    setOpen(false);
    toast.success("API设置已保存");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API设置</DialogTitle>
          <DialogDescription>
            设置调用API所需的参数。请确保您的API密钥正确无误。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API密钥
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="请输入您的API密钥"
              className="col-span-3"
              value={tempSettings.apiKey}
              onChange={(e) =>
                setTempSettings({...tempSettings, apiKey: e.target.value})
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiUrl" className="text-right">
              API地址
            </Label>
            <Input
              id="apiUrl"
              className="col-span-3"
              value={tempSettings.apiUrl}
              onChange={(e) =>
                setTempSettings({...tempSettings, apiUrl: e.target.value})
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              模型名称
            </Label>
            <Input
              id="model"
              className="col-span-3"
              value={tempSettings.model}
              onChange={(e) =>
                setTempSettings({...tempSettings, model: e.target.value})
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-nutrition-primary hover:bg-nutrition-secondary">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiSettingsDialog;
