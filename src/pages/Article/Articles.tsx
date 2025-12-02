import type { Article } from '@/types';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '@/components/ArticleCard';

export default function Articles() {
  // Der Hook übernimmt alles. Wir geben nur an, welchen Typ <Article[]> wir erwarten.
  const { 
    data: articles, 
    loading, 
    error 
  } = useFetch<Article[]>('http://localhost:3000/articles');

  if (loading) return <div>Lade Artikel...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div className='py-20'>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance py-5">Artikel Liste</h1>
      
      <div className="grid gap-4 justify-items-center">
        {/* Optional Chaining (?.) schützt vor null-Zugriffen */}
        {articles?.map((article) => (
          <div className='max-w-3xl w-full'>
            <ArticleCard article={article} authorName='Bob' />
          </div>
        ))}
      </div>
    </div>
  );
}