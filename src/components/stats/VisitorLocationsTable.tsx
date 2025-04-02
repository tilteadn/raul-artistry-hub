
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CountryData } from "@/utils/visitorTrackingService";

interface VisitorLocationsTableProps {
  topCountries: CountryData[];
}

export function VisitorLocationsTable({ topCountries }: VisitorLocationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitas por Ubicación</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>País</TableHead>
              <TableHead>Visitas</TableHead>
              <TableHead className="text-right">Porcentaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCountries.length > 0 ? (
              topCountries.map((country, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {country.country}
                    </div>
                  </TableCell>
                  <TableCell>{country.visits}</TableCell>
                  <TableCell className="text-right">{country.percentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                  No hay datos de ubicaciones todavía
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
