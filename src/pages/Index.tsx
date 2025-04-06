import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CandidateCard } from "@/components/CandidateCard";
import { CandidatesTable } from "@/components/CandidatesTable";
import { AddCandidateForm } from "@/components/AddCandidateForm";
import { EditCandidateDialog } from "@/components/EditCandidateDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { getAllCandidates, getPaginatedCandidates, searchCandidates } from "@/services/database";
import { Candidate } from "@/types";
import { Card } from "@/components/ui/card";
import { Search, Settings } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Index = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"cards" | "table">("cards");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      fetchCandidates();
    }
  }, [currentPage, searchQuery]);
  
  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { candidates: data, total } = await getPaginatedCandidates(currentPage, pageSize);
      setCandidates(data);
      setFilteredCandidates(data);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / pageSize));
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
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCandidates();
      return;
    }
    
    setIsSearching(true);
    setIsLoading(true);
    
    try {
      const results = await searchCandidates(searchQuery);
      setFilteredCandidates(results);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      fetchCandidates();
    }
  };
  
  const handleAddCandidate = (candidate: Candidate) => {
    fetchCandidates();
    setShowForm(false);
  };
  
  const handleDeleteCandidate = (id: number) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    setFilteredCandidates(prev => prev.filter(c => c.id !== id));
    
    if (filteredCandidates.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      fetchCandidates();
    }
  };
  
  const handleEditCandidate = (candidate: Candidate) => {
    setCurrentCandidate(candidate);
    setEditDialogOpen(true);
  };
  
  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(prev => 
      prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c)
    );
    setFilteredCandidates(prev => 
      prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c)
    );
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
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettingsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Settings size={16} />
                <span>Settings</span>
              </Button>
              <div className="flex gap-2">
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
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {showForm ? "Add New Candidate" : `Candidates (${totalItems})`}
            </h2>
            
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              {!showForm && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="pl-9"
                  />
                </div>
              )}
              
              <Button 
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? "outline" : "default"}
              >
                {showForm ? "Cancel" : "Add New Candidate"}
              </Button>
            </div>
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
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    {isSearching ? "Searching candidates..." : "Loading candidates..."}
                  </p>
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
            ) : filteredCandidates.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-4">
                  {searchQuery ? "No candidates match your search" : "No candidates found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ? (
                    <>
                      Try using different keywords or
                      <Button 
                        variant="link" 
                        className="px-1 py-0 h-auto" 
                        onClick={() => setSearchQuery("")}
                      >
                        clear your search
                      </Button>
                    </>
                  ) : "Add your first candidate to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowForm(true)}>
                    Add Candidate
                  </Button>
                )}
              </Card>
            ) : viewType === "cards" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                  {filteredCandidates.map(candidate => (
                    <CandidateCard 
                      key={candidate.id} 
                      candidate={candidate} 
                      onDelete={handleDeleteCandidate}
                      onEdit={handleEditCandidate}
                    />
                  ))}
                </div>
                {!searchQuery && totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => (
                            page === 1 || 
                            page === totalPages || 
                            Math.abs(page - currentPage) <= 1
                          ))
                          .map((page, i, arr) => {
                            if (i > 0 && page > arr[i - 1] + 1) {
                              return (
                                <PaginationItem key={`ellipsis-${page}`}>
                                  <span className="flex h-9 items-center justify-center px-3">
                                    ...
                                  </span>
                                </PaginationItem>
                              );
                            }
                            
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={page === currentPage}
                                  onClick={() => setCurrentPage(page)}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })
                        }
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="animate-in fade-in">
                  <CandidatesTable 
                    candidates={filteredCandidates} 
                    onDelete={handleDeleteCandidate} 
                    onEdit={handleEditCandidate}
                  />
                </div>
                {!searchQuery && totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => (
                            page === 1 || 
                            page === totalPages || 
                            Math.abs(page - currentPage) <= 1
                          ))
                          .map((page, i, arr) => {
                            if (i > 0 && page > arr[i - 1] + 1) {
                              return (
                                <PaginationItem key={`ellipsis-${page}`}>
                                  <span className="flex h-9 items-center justify-center px-3">
                                    ...
                                  </span>
                                </PaginationItem>
                              );
                            }
                            
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={page === currentPage}
                                  onClick={() => setCurrentPage(page)}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })
                        }
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        <EditCandidateDialog 
          candidate={currentCandidate} 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen}
          onUpdate={handleUpdateCandidate}
        />
        
        <SettingsDialog 
          open={settingsDialogOpen} 
          onOpenChange={setSettingsDialogOpen}
        />
      </div>
    </div>
  );
};

export default Index;
