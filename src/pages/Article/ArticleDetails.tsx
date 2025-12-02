import { useParams, Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "../../components/ui/button"; // Pfad ggf. anpassen
import { useFetch } from "../../hooks/useFetch";     // Pfad ggf. anpassen
import db from "../../../initialJsonDb.json"; // Import für Mock-User-Daten
import type { Article, Comment } from "@/types";
import { Textarea } from "@/components/ui/textarea";

export default function ArticleDetails() {
  const { id } = useParams<{ id: string }>();

  const { 
    data: article, 
    loading: articleLoading, 
    error: articleError 
  } = useFetch<Article>(`http://localhost:3000/articles/${id}`);

  const { 
    data: comments, 
    loading: commentsLoading 
  } = useFetch<Comment[]>(`http://localhost:3000/comments?articleId=${id}`);

  
  // Workaround to get username by userId from mock db
  const getUserName = (userId: number) => {
    const user = db.users.find((u) => u.id === userId);
    return user ? user.username : "Unbekannt";
  };

  if (articleLoading) return <div className="text-white text-center py-20">Lade Artikel...</div>;
  if (articleError || !article) return <div className="text-red-500 text-center py-20">Fehler: {articleError || "Artikel nicht gefunden"}</div>;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12 text-white">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Zurück zur Übersicht
        </Link>
      </div>

      <article>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center text-gray-400 mb-8 font-medium">
          <span className="text-white mr-1">@{getUserName(article.authorId)}</span> 
          <span>at {article.date}</span>
        </div>

        <div className="prose prose-invert max-w-none text-lg text-gray-300 leading-relaxed space-y-6">
          <p>{article.content}</p>
          <p>{article.summary}</p> 
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-20">
        
        {/* Comment List */}
        <div className="space-y-4 mb-8">
          {commentsLoading ? (
             <p className="text-gray-500">Lade Kommentare...</p>
          ) : (
            comments?.map((comment) => (
              <div key={comment.id} className="bg-[#111] border border-zinc-800 rounded-lg p-6">
                <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-semibold text-white">
                        @{getUserName(comment.userId)}
                    </h4>
                    <span className="text-xs text-gray-500">wrote at {comment.date}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        <div className="mt-8">
            <Textarea 
                placeholder="Geben Sie hier Ihren Kommentar ein."
            />
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