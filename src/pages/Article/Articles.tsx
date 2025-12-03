import type { Article } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import ArticleCard from "@/components/ArticleCard";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";

export default function Articles() {
  // Der Hook übernimmt alles. Wir geben nur an, welchen Typ <Article[]> wir erwarten.
  const {
    data: articles,
    loading,
    error,
  } = useFetch<Article[]>("http://localhost:3000/articles");

  if (loading) return <div>Lade Artikel...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div className="py-20">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance py-5">
        Artikel Liste
      </h1>

      <div className="grid gap-4 max-w-3xl m-auto">
        <div className="grid grid-cols-2 gap-2">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wähle eine Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kategorie</SelectLabel>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {articles?.map((article) => (
          <div className="w-full">
            <ArticleCard article={article} authorName="Bob" />
          </div>
        ))}
      </div>
    </div>
  );
}
