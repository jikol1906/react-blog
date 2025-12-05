import type { CommentWithUser } from "@/types";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";

type CommentItemProps = {
  comment: CommentWithUser;
};

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>
            @{comment.user?.username}
          </span>
          <span className="text-xs text-gray-500 font-normal">
            {comment.date}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <p className="text-gray-300 text-sm leading-relaxed">
          {comment.text}
        </p>
      </CardContent>
    </Card>
  );
}
