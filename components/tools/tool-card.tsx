import Link from "next/link";
import { ExternalLink, Star, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiToolPreview } from "@/lib/data/types";

export function ToolCard({ tool }: { tool: AiToolPreview }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-50 text-lg font-bold text-orange-600">
            {tool.name.charAt(0)}
          </div>
          {tool.isFeatured && <Badge variant="warning">精选</Badge>}
        </div>
        <CardTitle className="mt-3">
          <Link href={`/hub/${tool.slug}`} className="hover:text-orange-600">
            {tool.name}
          </Link>
        </CardTitle>
        {tool.categoryName && (
          <Badge variant="secondary" className="w-fit">
            {tool.categoryName}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-slate-600">{tool.tagline}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {tool.rating.toFixed(1)}
          </span>
          <span>{tool.clickCount} 次点击</span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            {tool.likeCount}
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/go/${tool.id}`} className="flex-1" target="_blank" rel="noopener noreferrer">
          <Button className="w-full" size="sm">
            直达网站
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <Link href={`/hub/${tool.slug}`}>
          <Button variant="outline" size="sm">
            详情
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
