import type { Article } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import ArticleCard from "@/components/ArticleCard";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const debouncedSearch = useDebounce(searchTerm, 200);

  const getQueryURL = () => {
    const baseUrl = "http://localhost:3000/articles";
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.append("title_like", debouncedSearch);
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }

    params.append("_limit", "10");

    const queryString = params.toString();
    return `${baseUrl}?${queryString}`
  };

  const { data: articles, loading, error } = useFetch<Article[]>(getQueryURL());

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
