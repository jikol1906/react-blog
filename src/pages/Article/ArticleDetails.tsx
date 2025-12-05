import { useState } from "react"; // NEU: useState importieren
import { useParams, Link } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react"; // Loader Icon hinzugefügt
import { useFetch } from "../../hooks/useFetch";
import type { ArticleWithUser, CommentWithUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentItem } from "@/components/Article/CommentItem";

export default function ArticleDetails() {
  const { id } = useParams<{ id: string }>();
  
  // Zugriff auf den eingeloggten User
  const { user } = useAuth(); 

  // State für das Eingabefeld und den Ladezustand beim Senden
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trick zum Neu-Laden der Kommentare: Wir ändern diesen Key, was die URL ändert
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Fetch: Artikel
  const {
    data: article,
    loading: articleLoading,
    error: articleError,
  } = useFetch<ArticleWithUser>(
    `http://localhost:3000/articles/${id}?_expand=user`
  );

  // 2. Fetch: Kommentare
  // Wir hängen '&_t={refreshKey}' an. Das ignoriert json-server, aber React denkt, 
  // die URL ist neu und lädt die Daten nochmal.
  const { data: comments, loading: commentsLoading } = useFetch<CommentWithUser[]>(
    `http://localhost:3000/comments?articleId=${id}&_expand=user&_sort=date&_order=desc&_t=${refreshKey}`
  );

  // Funktion zum Senden des Kommentars
  const handlePostComment = async () => {
    if (!commentText.trim()) return; // Nichts tun, wenn leer
    if (!user) {
      setErrorMsg("Sie müssen eingeloggt sein.");
      return;
    }

    setIsPosting(true);
    setErrorMsg(null);

    const newComment = {
      articleId: Number(id), // json-server nutzt meist numbers für IDs
      userId: user.id,
      text: commentText,
      date: new Date().toISOString().split("T")[0], // Einfaches Datum Format YYYY-MM-DD
    };

    try {
      // Kapitel 8: Serverkommunikation (POST Request)
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Senden");
      }

      // Erfolg!
      setCommentText(""); // Textfeld leeren
      setRefreshKey((prev) => prev + 1); // Kommentare neu laden erzwingen
    } catch (err) {
      console.error(err);
      setErrorMsg("Konnte Kommentar nicht speichern.");
    } finally {
      setIsPosting(false);
    }
  };

  // Rendering (Loading / Error wie gehabt)
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center text-gray-400 mb-8 font-medium">
          <span className="text-white mr-1">@{article.user.username}</span>
          <span>at {article.date}</span>
        </div>

        <div className="max-w-none text-lg text-gray-300 leading-relaxed space-y-6">
          <p>{article.content}</p>
          <p>{article.summary}</p>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-20 border-t border-gray-800 pt-10">
        <h3 className="text-2xl font-bold mb-6">Kommentare</h3>
        
        <div className="space-y-4 mb-8">
          {commentsLoading ? (
            <p className="text-gray-500">Lade Kommentare...</p>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 italic">Noch keine Kommentare.</p>
          )}
        </div>

        {/* Comment Form */}
        <div className="mt-8 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h4 className="text-lg font-medium mb-4">Schreiben Sie einen Kommentar</h4>
          
          {user ? (
            <>
              <Textarea
                placeholder="Geben Sie hier Ihren Kommentar ein..."
                className="bg-black border-zinc-700 text-white min-h-[100px]"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isPosting}
              />
              {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handlePostComment}
                  disabled={isPosting || !commentText.trim()}
                  className="bg-white text-black hover:bg-gray-200 font-medium px-6"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Postet...
                    </>
                  ) : (
                    "Kommentar posten"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 bg-black rounded border border-zinc-800 border-dashed">
              <p className="text-gray-400 mb-2">Bitte melden Sie sich an, um zu kommentieren.</p>
              <Link to="/login">
                <Button variant="outline" className="text-black">Zum Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}