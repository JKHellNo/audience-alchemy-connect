import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Linkedin, Mail, Loader2, Send } from "lucide-react";
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
  const [selectedLinkedin, setSelectedLinkedin] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchEmail = async (person: Person, index: number) => {
    setLoadingEmail(prev => ({ ...prev, [index]: true }));
    try {
      const response = await Promise.race([
        fetch("http://localhost:5678/webhook/a1a85269-d359-4dd1-b57d-121274ea9717", {
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
        description:
          error instanceof Error && error.message === "Request timeout"
            ? "Request timed out after 2 minutes. Please try again."
            : "Failed to fetch email. Please try again.",
      });
    } finally {
      setLoadingEmail(prev => ({ ...prev, [index]: false }));
    }
  };

  const toggleLinkedinSelection = (linkedin: string) => {
    setSelectedLinkedin(prev => 
      prev.includes(linkedin)
        ? prev.filter(l => l !== linkedin)
        : [...prev, linkedin]
    );
  };

  const handleSubmitConnections = async () => {
    fetch("http://localhost:5678/webhook/cabbeb46-7fa1-413b-96ac-41d421a0aba0", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ linkedin_urls: selectedLinkedin }),
    });

    toast({
      title: "Success",
      description: "No need to wait — your connections will go out gradually over the day.",
    });
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
              <TableCell className="max-w-[200px] break-words">
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 hover:text-blue-800 break-words"
                  style={{ display: "inline-block", wordBreak: "break-word"}}
                >
                  {person.linkedin}
                </a>
              </TableCell>
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
              <TableCell className="text-right flex flex-col items-end space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-24 space-x-2 ${
                    selectedLinkedin.includes(person.linkedin)
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => toggleLinkedinSelection(person.linkedin)}
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect</span>
                </Button>
                {person.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-24 space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Connect</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {selectedLinkedin.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmitConnections} className="space-x-2">
            <Send className="w-4 h-4" />
            <span>Submit Connections ({selectedLinkedin.length})</span>
          </Button>
        </div>
      )}
    </div>
  );
};
