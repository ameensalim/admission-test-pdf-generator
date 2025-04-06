
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Settings } from "@/types";
import { getSettings, updateSettings } from "@/services/database";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    nextFormNumber: 0,
    nextTokenNumber: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSettings(settings);
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Numbering Settings</DialogTitle>
          <DialogDescription>
            Configure auto-generated form and token numbers
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nextFormNumber" className="text-right">
              Next Form #
            </Label>
            <Input
              id="nextFormNumber"
              type="number"
              value={settings.nextFormNumber}
              onChange={(e) => setSettings({
                ...settings,
                nextFormNumber: Number(e.target.value)
              })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nextTokenNumber" className="text-right">
              Next Token #
            </Label>
            <Input
              id="nextTokenNumber"
              type="number"
              value={settings.nextTokenNumber}
              onChange={(e) => setSettings({
                ...settings,
                nextTokenNumber: Number(e.target.value)
              })}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
