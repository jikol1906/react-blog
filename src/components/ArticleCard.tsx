import { Link } from 'react-router'; // 1. Import Link
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/types';

interface ArticleCardProps {
    article: Article;
    authorName: string;
}

const ArticleCard = ({ article, authorName }: ArticleCardProps) => {
    // 2. Construct the path (must match your Route in App.tsx)
    const detailPath = `/article/${article.id}`;

    return (
        // 3. Wrap the Card in the Link
        // We add 'block' to ensure it takes up space and remove default link styles
        <Link to={detailPath} className="block w-full transition-opacity hover:opacity-90">
            <Card className="cursor-pointer hover:border-zinc-500 transition-colors">
                <CardHeader>
                    <CardTitle>
                        {article.title}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                        <span>@{authorName}</span> at {article.date}
                    </div>
                </CardHeader>
                
                <CardFooter className='flex gap-3'>
                    <Badge variant="secondary">
                        Views: {article.views}
                    </Badge>
                    <Badge variant="secondary">
                        {article.category}
                    </Badge>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default ArticleCard;