import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import type { Article } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import ArticleCard from "@/components/Article/ArticleCard";
import PaginationControl from "@/components/PaginationControl"; // Deine neue Komponente
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

export default function Articles() {
  // URL Params für die Seitenzahl nutzen
  const [searchParams, setSearchParams] = useSearchParams("?page=1");
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const debouncedSearch = useDebounce(searchTerm, 200);

  // Wir setzen das Limit auf 5, damit wir bei 15 Artikeln 3 Seiten sehen
  const ITEMS_PER_PAGE = 5;


  const getQueryURL = () => {
    const baseUrl = "http://localhost:3000/articles";
    const params = new URLSearchParams();

    // Pagination Parameter hinzufügen
    params.append("_page", currentPage.toString());
    params.append("_limit", ITEMS_PER_PAGE.toString());

    if (debouncedSearch) {
      params.append("title_like", debouncedSearch);
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const { data: articles, loading, error } = useFetch<Article[]>(getQueryURL());

  // Handler für den Seitenwechsel
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const totalItems = 15;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="py-20">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance py-5">
        Artikel Liste
      </h1>

      <div className="grid gap-4 max-w-3xl m-auto">
        <div className="grid grid-cols-2 gap-2">
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wähle eine Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kategorie</SelectLabel>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Lade Ergebnisse...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && articles?.length === 0 && (
          <p className="text-center text-gray-500">Keine Artikel gefunden.</p>
        )}

        <div>
          {articles?.map((article) => (
            <div key={article.id} className="w-full mb-4">
              <ArticleCard article={article} authorName="Bob" />
            </div>
          ))}
        </div>

        {!loading && !error && articles && articles.length > 0 && (
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
