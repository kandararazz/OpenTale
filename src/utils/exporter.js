/**
 * Client-Side Exporter Utility for OpenTale.
 * Supports exporting stories to formatted EPUB (clean package format),
 * PDF (styled printable layout), Markdown (.md), and JSON.
 */

/**
 * Export story as Markdown file download
 */
export const exportToMarkdown = (story) => {
  let mdContent = `# ${story.title}\n`;
  mdContent += `**Author:** ${story.author || 'OpenTale Author'}\n`;
  mdContent += `**Genre:** ${story.genre || 'General'}\n`;
  mdContent += `**Description:** ${story.description || ''}\n\n`;
  mdContent += `---\n\n`;

  if (story.pages && story.pages.length > 0) {
    story.pages.forEach((page, index) => {
      mdContent += `## ${page.title || `Chapter ${index + 1}`}\n\n`;
      mdContent += `${page.text}\n\n`;
    });
  }

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Export story as JSON file download
 */
export const exportToJSON = (story) => {
  const jsonContent = JSON.stringify(story, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Export story to printable PDF window
 */
export const exportToPDF = (story) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const chaptersHtml = (story.pages || []).map((page, index) => `
    <div class="chapter">
      <h2>${page.title || `Chapter ${index + 1}`}</h2>
      <div class="chapter-body">${page.text.replace(/\n\n/g, '</p><p>')}</div>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${story.title} - OpenTale PDF Export</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@400;600;800&display=swap');
          body {
            font-family: 'Merriweather', Georgia, serif;
            color: #1e293b;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            color: #0f172a;
            margin-bottom: 8px;
            text-align: center;
          }
          .meta {
            text-align: center;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            color: #64748b;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
          }
          h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            color: #ea580c;
            margin-top: 40px;
            margin-bottom: 16px;
            page-break-before: always;
          }
          .chapter:first-child h2 {
            page-break-before: avoid;
          }
          p {
            margin-bottom: 1.5em;
            text-align: justify;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${story.title}</h1>
        <div class="meta">
          By <strong>${story.author || 'OpenTale Author'}</strong> • ${story.genre || 'Story'} • ${story.estimatedMinutes || 5} min read
        </div>
        <div>${chaptersHtml}</div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Export story as EPUB HTML package format (.epub/.html)
 */
export const exportToEPUB = (story) => {
  let epubHtml = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <title>${story.title}</title>
  <meta name="author" content="${story.author || 'OpenTale'}" />
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; padding: 2em; }
    h1 { font-size: 2.2em; text-align: center; color: #111; }
    .author { text-align: center; font-style: italic; margin-bottom: 3em; }
    h2 { font-size: 1.5em; color: #e65100; margin-top: 2em; border-bottom: 1px solid #ccc; }
    p { text-indent: 1.5em; margin: 0.5em 0; }
  </style>
</head>
<body>
  <h1>${story.title}</h1>
  <div class="author">By ${story.author || 'OpenTale Author'}</div>
`;

  if (story.pages && story.pages.length > 0) {
    story.pages.forEach((page, index) => {
      epubHtml += `<section class="chapter">\n`;
      epubHtml += `<h2>${page.title || `Chapter ${index + 1}`}</h2>\n`;
      const paragraphs = page.text.split('\n\n').filter(p => p.trim());
      paragraphs.forEach(p => {
        epubHtml += `<p>${p.trim()}</p>\n`;
      });
      epubHtml += `</section>\n`;
    });
  }

  epubHtml += `</body>\n</html>`;

  const blob = new Blob([epubHtml], { type: 'application/epub+zip' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.epub`;
  link.click();
  URL.revokeObjectURL(url);
};
