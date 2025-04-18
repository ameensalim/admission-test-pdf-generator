
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { downloadPDF } from "@/services/pdfService";
import { deleteCandidate } from "@/services/database";
import { Edit, FileDown, Trash2 } from "lucide-react";

interface CandidatesTableProps {
  candidates: Candidate[];
  onDelete: (id: number) => void;
  onEdit: (candidate: Candidate) => void;
}

export const CandidatesTable = ({ candidates, onDelete, onEdit }: CandidatesTableProps) => {
  const handleGeneratePDF = async (candidate: Candidate) => {
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

  const handleDelete = async (candidate: Candidate) => {
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
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Form No.</TableHead>
            <TableHead>Token No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>{candidate.form_no}</TableCell>
              <TableCell>{candidate.token_no}</TableCell>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.dob}</TableCell>
              <TableCell>{candidate.contact_no}</TableCell>
              <TableCell>{candidate.place}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleDelete(candidate)}
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
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex gap-1 items-center"
                  onClick={() => handleGeneratePDF(candidate)}
                >
                  <FileDown size={16} />
                  <span>Generate PDF</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
