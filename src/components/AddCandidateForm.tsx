import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { addCandidate } from "@/services/database";
import { Candidate } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddCandidateFormProps {
  onAdd: (candidate: Candidate) => void;
}

export const AddCandidateForm = ({ onAdd }: AddCandidateFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    contactNo: "",
    place: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.contactNo) newErrors.contactNo = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNo))
      newErrors.contactNo = "Enter a valid 10-digit number";
    if (!formData.place) newErrors.place = "Place is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newCandidate = await addCandidate(formData);

      toast({
        title: "Candidate Added",
        description: "The candidate has been added successfully.",
      });

      // Reset form
      setFormData({
        name: "",
        dob: "",
        contactNo: "",
        place: "",
      });

      // Notify parent component
      onAdd(newCandidate);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full lg:max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <CardTitle className="text-center">Add New Candidate</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="dob" className="text-sm font-medium">
                Date of Birth *
              </label>
              <input
                id="dob"
                name="dob"
                type="text"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.dob ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="DD-MM-YYYY"
              />
              {errors.dob && (
                <p className="text-red-500 text-xs">{errors.dob}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contactNo" className="text-sm font-medium">
                Contact Number *
              </label>
              <input
                id="contactNo"
                name="contactNo"
                type="text"
                value={formData.contactNo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.contactNo ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="10-digit number"
              />
              {errors.contactNo && (
                <p className="text-red-500 text-xs">{errors.contactNo}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="place" className="text-sm font-medium">
                Place *
              </label>
              <input
                id="place"
                name="place"
                type="text"
                value={formData.place}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.place ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter place"
              />
              {errors.place && (
                <p className="text-red-500 text-xs">{errors.place}</p>
              )}
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Please fill in all required fields correctly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: "",
                dob: "",
                contactNo: "",
                place: "",
              });
              setErrors({});
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Candidate"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
