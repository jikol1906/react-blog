import { useParams, Link } from "react-router"; // Beachte: meist 'react-router-dom' statt 'react-router'
import { ChevronLeft } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import type { ArticleWithUser, CommentWithUser } from "@/types"; // Importiere die erweiterten Types
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function ArticleDetails() {
  // Wir sagen useParams, dass 'id' ein String ist (URL-Parameter sind immer Strings)
  const { id } = useParams<{ id: string }>();

  // 1. Fetch: Artikel + User
  // Wir nutzen den 'ArticleWithUser' Type, da json-server das User-Objekt einbettet
  const {
    data: article,
    loading: articleLoading,
    error: articleError,
  } = useFetch<ArticleWithUser>(
    `http://localhost:3000/articles/${id}?_expand=user`
  );

  // 2. Fetch: Kommentare + User
  // WICHTIG: Hier erwarten wir ein ARRAY von Kommentaren, daher 'CommentWithUser[]'
  const { data: comments, loading: commentsLoading } = useFetch<
    CommentWithUser[]
  >(`http://localhost:3000/comments?articleId=${id}&_expand=user`);

  // ... Rest des Codes (Error Handling, Rendering) ...

  if (articleLoading)
    return <div className="text-white text-center py-20">Lade Artikel...</div>;
  if (articleError || !article)
    return (
      <div className="text-red-500 text-center py-20">
        Fehler: {articleError || "Artikel nicht gefunden"}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12 text-white">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Zurück zur Übersicht
        </Link>
      </div>

      <article>
        {/* TypeScript weiß jetzt, dass article.title existiert */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center text-gray-400 mb-8 font-medium">
          {/* TypeScript weiß jetzt, dass article.user.username existiert */}
          <span className="text-white mr-1">@{article.user.username}</span>
          <span>at {article.date}</span>
        </div>

        <div className="max-w-none text-lg text-gray-300 leading-relaxed space-y-6">
          <p>{article.content}</p>
          <p>{article.summary}</p>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-20">
        <div className="space-y-4 mb-8">
          {/* Ladezustand für Kommentare berücksichtigen */}
          {commentsLoading ? (
            <p className="text-gray-500">Lade Kommentare...</p>
          ) : (
            comments?.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="grid gap-2">
                  <CardTitle className="grid gap-1">
                    @{comment.user.username}
                    <span className="text-xs text-gray-500">
                      wrote at {comment.date}
                    </span>
                  </CardTitle>
                  <CardDescription className="grid gap-2">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {comment.text}
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {/* Comment Form */}
        <div className="mt-8">
          <Textarea placeholder="Geben Sie hier Ihren Kommentar ein." />
          <div className="flex justify-end mt-4">
            <Button className="bg-white text-black hover:bg-gray-200 font-medium px-6">
              Kommentar posten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
