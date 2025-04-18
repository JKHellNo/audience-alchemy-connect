
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Linkedin } from "lucide-react";

interface Person {
  firstName: string;
  lastName: string;
  company: string;
  linkedin: string;
}

interface ResultsTableProps {
  data: Person[];
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((person, index) => (
            <TableRow key={index}>
              <TableCell>{person.firstName}</TableCell>
              <TableCell>{person.lastName}</TableCell>
              <TableCell>{person.company}</TableCell>
              <TableCell>{person.linkedin}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="space-x-2">
                  <Linkedin className="w-4 h-4" />
                  <span>Connect</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
