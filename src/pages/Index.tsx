import { useState } from "react";
import { AudienceForm } from "@/components/AudienceForm";
import { ResultsTable } from "@/components/ResultsTable";
import { IntegrationFooter } from "@/components/IntegrationFooter";
import { useToast } from "@/components/ui/use-toast";

interface Person {
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  company: string;
  linkedin: string;
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Person[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (text: string) => {
    setLoading(true);
    try {
      const response = await Promise.race([
        fetch(
          "http://localhost:5678/webhook/86ec2ca0-822b-43cf-99c4-b2f550e5cd27",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "Describe your audience in plain English.": text,
            }),
          }
        ),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 120000)
        ),
      ]) as Response; // Type assertion to tell TypeScript this is a Response object

      if (!response.ok) throw new Error("Failed to submit");
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message === "Request timeout" 
          ? "Request timed out after 2 minutes. Please try again."
          : "Failed to process your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold">Describe your audience</h1>
        </div>

        <AudienceForm onSubmit={handleSubmit} />

        {loading && (
          <div className="flex justify-center">
            <img src="/n8n-loading.gif" alt="Loading..." className="w-16 h-16" />
          </div>
        )}

        {results.length > 0 && <ResultsTable data={results} />}
      </main>

      {!loading && results.length > 0 && <IntegrationFooter />}
      {!loading && results.length === 0 && <IntegrationFooter />}
    </div>
  );
};

export default Index;
