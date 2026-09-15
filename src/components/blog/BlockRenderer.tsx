
import React from 'react';
import Image from 'next/image';

interface BlockRendererProps {
  blocksData: string;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocksData }) => {
  let blocks = [];
  try {
    const data = JSON.parse(blocksData);
    blocks = data.blocks || [];
  } catch (e) {
    console.error("Failed to parse blocks data", e);
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block: any) => {
        switch (block.type) {
          case 'header':
            const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeaderTag key={block.id} className="font-bold mt-8 mb-4 text-foreground" style={{
                  fontSize: block.data.level === 2 ? '1.875rem' : block.data.level === 3 ? '1.5rem' : '1.25rem',
                  lineHeight: '1.25'
              }}>
                {block.data.text}
              </HeaderTag>
            );

          case 'paragraph':
            return (
              <p key={block.id} className="leading-relaxed text-lg text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: block.data.text }} />
            );

          case 'image':
            return (
              <div key={block.id} className="my-8">
                <div className="relative w-full rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={block.data.file.url}
                    alt={block.data.caption || "Blog image"}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                    className="w-full h-auto object-cover"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                {block.data.caption && (
                  <p className="text-center text-sm text-muted-foreground mt-2 italic">
                    {block.data.caption}
                  </p>
                )}
              </div>
            );

          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={block.id} className={`my-4 ml-6 space-y-2 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                {block.data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} className="text-lg text-muted-foreground" />
                ))}
              </ListTag>
            );

          case 'quote':
            return (
              <blockquote key={block.id} className="border-l-4 border-primary pl-4 italic text-xl text-muted-foreground my-8">
                <p>"{block.data.text}"</p>
                {block.data.caption && <cite className="block text-sm mt-2 not-italic font-medium">— {block.data.caption}</cite>}
              </blockquote>
            );

          case 'embed':
            // Check if it's a YouTube embed and format accordingly
            let embedUrl = block.data.embed;
            if (block.data.service === 'youtube' && !embedUrl.includes('embed')) {
                 // Try to fix if somehow raw URL got here
                 // But we fixed it in editor, so should be fine. 
                 // Just in case, ensure it's embeddable
            }

            return (
               <div key={block.id} className="my-8 w-full">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border bg-black">
                    <iframe
                        src={embedUrl}
                        title={block.data.caption || "Embedded content"}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                  </div>
                  {block.data.caption && (
                      <p className="text-center text-sm text-muted-foreground mt-2 italic">
                          {block.data.caption}
                      </p>
                  )}
               </div>
            );
            
           case 'table':
              const content = block.data.content || [];
              return (
                  <div key={block.id} className="my-8 w-full overflow-x-auto">
                      <table className="w-full border-collapse border rounded-lg overflow-hidden">
                          <tbody>
                              {content.map((row: string[], rowIndex: number) => (
                                  <tr key={rowIndex} className={rowIndex === 0 && block.data.withHeadings ? "bg-muted font-bold" : "border-b"}>
                                      {row.map((cell: string, cellIndex: number) => {
                                          const CellTag = rowIndex === 0 && block.data.withHeadings ? 'th' : 'td';
                                          return (
                                              <CellTag key={cellIndex} className="p-3 border text-left" dangerouslySetInnerHTML={{ __html: cell }} />
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              );

          case 'delimiter':
             return <div key={block.id} className="text-center text-2xl my-8 text-muted-foreground tracking-widest">***</div>;

          case 'checklist':
             return (
                 <div key={block.id} className="my-4 space-y-2">
                     {block.data.items.map((item: any, i: number) => (
                         <div key={i} className="flex items-start gap-3">
                             <div className={`mt-1 h-5 w-5 rounded border flex items-center justify-center ${item.checked ? 'bg-primary border-primary text-primary-foreground' : 'border-input'}`}>
                                 {item.checked && (
                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                         <polyline points="20 6 9 17 4 12"></polyline>
                                     </svg>
                                 )}
                             </div>
                             <span className={`text-lg ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`} dangerouslySetInnerHTML={{ __html: item.text }} />
                         </div>
                     ))}
                 </div>
             );

          case 'warning':
             return (
                 <div key={block.id} className="my-8 p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                     <div className="flex items-start gap-3">
                         <div className="text-yellow-600 dark:text-yellow-500 mt-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                 <circle cx="12" cy="12" r="10"></circle>
                                 <line x1="12" x2="12" y1="8" y2="12"></line>
                                 <line x1="12" x2="12.01" y1="16" y2="16"></line>
                             </svg>
                         </div>
                         <div>
                             {block.data.title && <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-1">{block.data.title}</h4>}
                             <p className="text-yellow-800 dark:text-yellow-300" dangerouslySetInnerHTML={{ __html: block.data.message }} />
                         </div>
                     </div>
                 </div>
             );

          case 'raw':
             return (
                 <div key={block.id} className="my-8" dangerouslySetInnerHTML={{ __html: block.data.html }} />
             );

          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
