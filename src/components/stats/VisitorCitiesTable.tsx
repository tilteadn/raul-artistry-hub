
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CityData } from "@/utils/visitorTrackingService";

interface VisitorCitiesTableProps {
  cities: CityData[];
}

export function VisitorCitiesTable({ cities }: VisitorCitiesTableProps) {
  // Combine all cities from different countries and sort by visits
  const sortedCities = cities
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10); // Show top 10 cities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead className="text-right">Porcentaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCities.length > 0 ? (
              sortedCities.map((city, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {city.city}
                    </div>
                  </TableCell>
                  <TableCell>{city.visits}</TableCell>
                  <TableCell className="text-right">{city.percentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                  No hay datos de ciudades todavía
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
