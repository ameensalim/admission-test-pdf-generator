import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Candidate } from "@/types";
import { updateCandidate } from "@/services/database";

interface EditCandidateDialogProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedCandidate: Candidate) => void;
}

export const EditCandidateDialog = ({
  candidate,
  open,
  onOpenChange,
  onUpdate,
}: EditCandidateDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({ ...candidate });
    }
  }, [candidate]);

  const handleChange = (field: keyof Candidate, value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      const updatedCandidate = await updateCandidate(formData);
      onUpdate(updatedCandidate);
      toast({
        title: "Success",
        description: "Candidate updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="form_no" className="text-right">
              Form No.
            </Label>
            <Input
              id="form_no"
              value={formData.form_no}
              onChange={(e) => handleChange("form_no", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="token_no" className="text-right">
              Token No.
            </Label>
            <Input
              id="token_no"
              value={formData.token_no}
              onChange={(e) => handleChange("token_no", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Date of Birth
            </Label>
            <Input
              id="dob"
              value={formData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="place" className="text-right">
              Place
            </Label>
            <Input
              id="place"
              value={formData.place}
              onChange={(e) => handleChange("place", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
