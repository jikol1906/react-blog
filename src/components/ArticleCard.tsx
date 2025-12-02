import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/types';

interface ArticleCardProps {
    article: Article;
    authorName: string;
}

const ArticleCard= ({ article, authorName }: ArticleCardProps) => {
    

    return (
        <Card 
            key={article.id} 
        
        >
            <CardHeader>
                <CardTitle>
                    {article.title}
                </CardTitle>
                <div >
                    <span>@{authorName}</span> at {article.date}
                </div>
            </CardHeader>
            
            <CardFooter className='flex gap-3'>
                <Badge 
                    variant="secondary" 
                >
                    Views: {article.views}
                </Badge>
                <Badge 
                    variant="secondary" 
                >
                    {article.category}
                </Badge>
            </CardFooter>
        </Card>
    );
};

export default ArticleCard;