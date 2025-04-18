
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FormProps {
  onSubmit: (text: string) => void;
}

export const AudienceForm = ({ onSubmit }: FormProps) => {
  const [input, setInput] = useState("");
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount <= 100 && wordCount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="(e.g., industry, company size, location, job roles, keywords, etc)"
        className="min-h-[120px] bg-background/50 border-gray-700 focus:border-blue-500 transition-colors"
      />
      <div className="flex justify-between items-center">
        <span className={`text-sm ${wordCount > 100 ? "text-red-500" : "text-gray-400"}`}>
          {wordCount}/100 words
        </span>
        <Button 
          type="submit" 
          disabled={!isValid}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
