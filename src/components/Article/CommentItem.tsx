import { useState } from "react";
import type { CommentWithUser } from "@/types";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Falls vorhanden, sonst Input
import { SquarePen, Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type CommentItemProps = {
  comment: CommentWithUser;
  // Callback-Funktionen, damit die Eltern-Komponente die Liste neu lädt
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
};

export function CommentItem({ comment, onCommentUpdated, onCommentDeleted }: CommentItemProps) {
  const { user } = useAuth();
  
  // State für den Bearbeitungsmodus
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isLoading, setIsLoading] = useState(false);

  // Prüfen, ob der Kommentar dem aktuellen User gehört
  // (Optional chaining '?.', falls user null ist)
  const isOwner = user?.id === comment.userId;

  // LÖSCHEN
  const handleDelete = async () => {
    if (!window.confirm("Möchten Sie diesen Kommentar wirklich löschen?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onCommentDeleted(); // Eltern-Komponente benachrichtigen
      } else {
        console.error("Fehler beim Löschen");
      }
    } catch (error) {
      console.error("Netzwerkfehler beim Löschen", error);
    } finally {
      setIsLoading(false);
    }
  };

  // SPEICHERN (Update)
  const handleUpdate = async () => {
    if (!editText.trim()) return; // Leere Kommentare verhindern

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/comments/${comment.id}`, {
        method: "PATCH", // PATCH ändert nur die gesendeten Felder
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        setIsEditing(false);
        onCommentUpdated(); // Eltern-Komponente benachrichtigen
      } else {
        console.error("Fehler beim Speichern");
      }
    } catch (error) {
      console.error("Netzwerkfehler beim Speichern", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ABBRECHEN
  const handleCancelEdit = () => {
    setEditText(comment.text); // Text zurücksetzen
    setIsEditing(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-blue-400 text-sm">
              @{comment.user?.username || "Unbekannt"}
            </span>
            <span className="text-xs text-gray-500 font-normal mt-1">
              {comment.date}
            </span>
          </div>

          {/* Buttons nur rendern, wenn es der eigene Kommentar ist */}
          {isOwner && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  {/* Speichern Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="text-green-500 hover:text-green-400 hover:bg-zinc-800"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  {/* Abbrechen Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  {/* Editieren Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white hover:bg-zinc-800"
                  >
                    <SquarePen className="h-4 w-4" />
                  </Button>
                  {/* Löschen Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-red-500 hover:text-red-400 hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-2">
        {isEditing ? (
          <Textarea 
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-black border-zinc-700 text-white min-h-[80px]"
          />
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}