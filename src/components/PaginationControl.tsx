
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
  } from "@/components/ui/pagination";
  
  // Definition des Interface für die Props [cite: 2861]
  interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export default function PaginationControl({
    currentPage,
    totalPages,
    onPageChange,
  }: PaginationControlProps) {
    
    // Hilfsfunktion zur Generierung der Seitenzahlen
    const generatePaginationItems = () => {
      const items = [];
      const maxVisiblePages = 5; // Wie viele Buttons sollen maximal sichtbar sein?
  
      if (totalPages <= maxVisiblePages) {
        // Wenn wenige Seiten, zeige alle an
        for (let i = 1; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        // Logik für viele Seiten mit Ellipsis (...)
        items.push(1); // Immer die erste Seite
  
        if (currentPage > 3) {
          items.push("ellipsis-start");
        }
  
        // Bereich um die aktuelle Seite
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
  
        for (let i = start; i <= end; i++) {
          items.push(i);
        }
  
        if (currentPage < totalPages - 2) {
          items.push("ellipsis-end");
        }
  
        items.push(totalPages); // Immer die letzte Seite
      }
      return items;
    };
  
    // Handler um Default-Link-Verhalten zu verhindern
    const handlePageClick = (e: React.MouseEvent, page: number) => {
      e.preventDefault();
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };
  
    if (totalPages <= 1) return null;
  
    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {/* Vorherige Seite */}
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => handlePageClick(e, currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
  
          {/* Generierte Seitenzahlen */}
          {generatePaginationItems().map((item, index) => {
            if (item === "ellipsis-start" || item === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
  
            return (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === item}
                  onClick={(e) => handlePageClick(e, item as number)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}
  
          {/* Nächste Seite */}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => handlePageClick(e, currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }