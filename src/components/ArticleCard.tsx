import * as React from 'react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/types';

// --- Props Definition ---
interface ArticleCardProps {
    article: Article;
    authorName: string; // Name wird fertig vom Parent übergeben
}

// --- Komponente ---
const ArticleCard= ({ article, authorName }: ArticleCardProps) => {
    

    return (
        <Card 
            key={article.id} 
            // Visuelle Übereinstimmung mit Articles.png Mockup
        >
            <CardHeader>
                {/* Haupttitel */}
                <CardTitle>
                    {article.title}
                </CardTitle>
                
                {/* Metadaten */}
                <div >
                    <span>@{authorName}</span> at {article.date}
                </div>
            </CardHeader>
            
            <CardFooter className='flex gap-3'>
                {/* Views Badge */}
                <Badge 
                    variant="secondary" 
                >
                    Views: {article.views}
                </Badge>
                {/* Kategorie Badge (hilfreich für Filter-Bestätigung) */}
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