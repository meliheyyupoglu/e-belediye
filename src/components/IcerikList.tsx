import type { Icerik } from "@/lib/db";

interface IcerikListProps {
  items: Icerik[];
  emptyMessage: string;
}

export default function IcerikList({ items, emptyMessage }: IcerikListProps) {
  if (items.length === 0) {
    return (
      <div className="info-card text-center text-gray-500 text-sm py-10">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <article key={item.id} className="announcement-card">
          <time className="text-xs text-gray-400 block mb-2">
            {new Date(item.date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h2 className="font-semibold text-gray-900 mb-2">{item.title}</h2>
          <p className="text-sm text-gray-500 line-clamp-3 mb-3">{item.summary}</p>
          {item.content && item.content !== item.summary && (
            <p className="text-sm text-gray-600 line-clamp-4">{item.content}</p>
          )}
        </article>
      ))}
    </div>
  );
}
