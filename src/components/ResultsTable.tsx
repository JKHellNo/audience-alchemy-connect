
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Linkedin, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Person {
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  company: string;
  linkedin: string;
  email?: string | null;
}

interface ResultsTableProps {
  data: Person[];
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
  const [people, setPeople] = useState<Person[]>(data);
  const [loadingEmail, setLoadingEmail] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  const fetchEmail = async (person: Person, index: number) => {
    setLoadingEmail(prev => ({ ...prev, [index]: true }));
    try {
      const response = await Promise.race([
        fetch("http://localhost:5678/webhook-test/a1a85269-d359-4dd1-b57d-121274ea9717", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: person.first_name || person.firstName,
            last_name: person.last_name || person.lastName,
            company: person.company,
          }),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 120000)
        ),
      ]) as Response;

      if (!response.ok) throw new Error("Failed to fetch email");
      
      const responseData = await response.json();
      
      // Extract email from the nested data structure
      const email = responseData.data?.email || null;
      console.log("Email response:", email);
      
      setPeople(currentPeople =>
        currentPeople.map((p, i) =>
          i === index ? { ...p, email: email } : p
        )
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message === "Request timeout"
          ? "Request timed out after 2 minutes. Please try again."
          : "Failed to fetch email. Please try again.",
      });
    } finally {
      setLoadingEmail(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="w-full max-w-[95vw] mx-auto mt-8 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">First Name</TableHead>
            <TableHead className="whitespace-nowrap">Last Name</TableHead>
            <TableHead className="whitespace-nowrap">Company</TableHead>
            <TableHead className="whitespace-nowrap">LinkedIn</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person, index) => (
            <TableRow key={index}>
              <TableCell>{person.first_name || person.firstName || ""}</TableCell>
              <TableCell>{person.last_name || person.lastName || ""}</TableCell>
              <TableCell className="max-w-[200px] truncate">{person.company}</TableCell>
              <TableCell className="max-w-[200px] truncate">{person.linkedin}</TableCell>
              <TableCell className="max-w-[200px]">
                {person.email === null 
                  ? 'null' 
                  : person.email || (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchEmail(person, index)}
                    disabled={loadingEmail[index]}
                  >
                    {loadingEmail[index] ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Get Email
                  </Button>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2 whitespace-nowrap">
                <Button variant="outline" size="sm" className="space-x-2">
                  <Linkedin className="w-4 h-4" />
                  <span>Connect</span>
                </Button>
                {person.email && (
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Connect</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
