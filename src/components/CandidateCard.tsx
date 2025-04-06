
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { downloadPDF } from "@/services/pdfService";
import { deleteCandidate } from "@/services/database";
import { Edit, Trash2, FileDown } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (id: number) => void;
  onEdit: (candidate: Candidate) => void;
}

export const CandidateCard = ({ candidate, onDelete, onEdit }: CandidateCardProps) => {
  const handleGeneratePDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your PDF...",
      });
      
      await downloadPDF(candidate);
      
      toast({
        title: "PDF Generated",
        description: "Your PDF has been generated and downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    
    try {
      const success = await deleteCandidate(candidate.id);
      
      if (success) {
        toast({
          title: "Candidate Deleted",
          description: "The candidate has been deleted successfully.",
        });
        onDelete(candidate.id);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete candidate. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <CardTitle className="flex justify-between items-center">
          <span>{candidate.name}</span>
          <span className="text-sm bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
            Form #{candidate.formNo}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Token No.</div>
            <div className="text-sm font-medium">{candidate.tokenNo}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</div>
            <div className="text-sm font-medium">{candidate.dob}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Contact</div>
            <div className="text-sm font-medium">{candidate.contactNo}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Place</div>
            <div className="text-sm font-medium">{candidate.place}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Exam Date</div>
            <div className="text-sm font-medium">{candidate.examDate || "21-04-2024"}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
            <div className="text-sm font-medium">{candidate.examTime || "12.00 - 1.30 pm"}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 gap-2">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            title="Delete candidate"
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(candidate)}
            title="Edit candidate"
          >
            <Edit size={16} />
          </Button>
        </div>
        <Button
          onClick={handleGeneratePDF}
          className="flex gap-1 items-center"
        >
          <FileDown size={16} />
          <span>Generate PDF</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
