
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { CandidatesTable } from "@/components/CandidatesTable";
import { AddCandidateForm } from "@/components/AddCandidateForm";
import { getAllCandidates } from "@/services/database";
import { Candidate } from "@/types";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"cards" | "table">("cards");
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    fetchCandidates();
  }, []);
  
  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAllCandidates();
      setCandidates(data);
    } catch (err) {
      setError("Failed to load candidates. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCandidate = (candidate: Candidate) => {
    setCandidates(prev => [candidate, ...prev]);
    setShowForm(false);
  };
  
  const handleDeleteCandidate = (id: number) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Admission Test PDF Generator
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Generate and download admit cards for candidates
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button
                variant={viewType === "cards" ? "default" : "outline"}
                onClick={() => setViewType("cards")}
                className="transition-all"
              >
                Cards View
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "outline"}
                onClick={() => setViewType("table")}
                className="transition-all"
              >
                Table View
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {showForm ? "Add New Candidate" : `Candidates (${candidates.length})`}
            </h2>
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "outline" : "default"}
            >
              {showForm ? "Cancel" : "Add New Candidate"}
            </Button>
          </div>
        </header>
        
        {showForm ? (
          <div className="mb-8 animate-in fade-in slide-in">
            <AddCandidateForm onAdd={handleAddCandidate} />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-blue-200 dark:bg-blue-700"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Loading candidates...</p>
                </div>
              </div>
            ) : error ? (
              <Card className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <p>{error}</p>
                <Button 
                  onClick={fetchCandidates} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </Card>
            ) : candidates.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-4">
                  No candidates found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add your first candidate to get started
                </p>
                <Button onClick={() => setShowForm(true)}>
                  Add Candidate
                </Button>
              </Card>
            ) : viewType === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                {candidates.map(candidate => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onDelete={handleDeleteCandidate} 
                  />
                ))}
              </div>
            ) : (
              <div className="animate-in fade-in">
                <CandidatesTable 
                  candidates={candidates} 
                  onDelete={handleDeleteCandidate} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
