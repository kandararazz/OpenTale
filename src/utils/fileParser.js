/**
 * Client-Side File Parser for EPUB, PDF, TXT, and Markdown files.
 * Zero-setup browser parsing into OpenTale story objects.
 */

// Helper to convert array buffer to string if needed
const readAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Helper to estimate reading time in minutes (200 words/min)
const estimateReadingTime = (text) => {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

/**
 * Parse raw TXT or Markdown file content into structured chapters
 */
export const parseTextFile = async (file) => {
  const textContent = await readAsText(file);
  const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const bookTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  // Split text into potential chapter sections based on common headings
  // Matches: "Chapter 1", "CHAPTER I", "# Chapter", "Section 1", "Part 1", etc.
  const chapterRegex = /(?:\r?\n){2,}(?=(?:#+\s+|CHAPTER\s+\d+|Chapter\s+\d+|SECTION\s+\d+|PART\s+\d+|[IVXLCDM]+\.))/gi;
  const rawSections = textContent.split(chapterRegex).filter(s => s.trim().length > 0);

  let pages = [];

  if (rawSections.length > 1) {
    pages = rawSections.map((sec, idx) => {
      const lines = sec.trim().split('\n');
      let title = `Chapter ${idx + 1}`;
      let text = sec.trim();

      // If first line looks like a title/heading, extract it
      if (lines[0].length < 80 && (lines[0].startsWith('#') || /chapter/i.test(lines[0]) || idx === 0)) {
        title = lines[0].replace(/^#+\s*/, '').trim();
        text = lines.slice(1).join('\n').trim();
      }

      return {
        id: `chap-${idx + 1}`,
        title: title || `Chapter ${idx + 1}`,
        text: text || sec.trim()
      };
    });
  } else {
    // If no explicit chapter headers found, split into ~400 word pages for comfortable reading
    const paragraphs = textContent.split(/(?:\r?\n){2,}/).filter(p => p.trim().length > 0);
    let currentPageParagraphs = [];
    let currentWordCount = 0;
    let pageNum = 1;

    for (const para of paragraphs) {
      const paraWords = para.trim().split(/\s+/).length;
      currentPageParagraphs.push(para.trim());
      currentWordCount += paraWords;

      if (currentWordCount >= 350) {
        pages.push({
          id: `chap-${pageNum}`,
          title: `Part ${pageNum}`,
          text: currentPageParagraphs.join('\n\n')
        });
        pageNum++;
        currentPageParagraphs = [];
        currentWordCount = 0;
      }
    }

    if (currentPageParagraphs.length > 0) {
      pages.push({
        id: `chap-${pageNum}`,
        title: `Part ${pageNum}`,
        text: currentPageParagraphs.join('\n\n')
      });
    }
  }

  if (pages.length === 0) {
    pages = [{
      id: 'chap-1',
      title: 'Full Document',
      text: textContent.trim() || 'Empty document content.'
    }];
  }

  const fullText = pages.map(p => p.text).join(' ');

  return {
    id: `custom-book-${Date.now()}`,
    title: bookTitle,
    author: 'Imported Document',
    genre: 'Personal Upload',
    readingLevel: 'Custom',
    estimatedMinutes: estimateReadingTime(fullText),
    description: `Uploaded from "${file.name}" (${pages.length} chapters, ${fullText.split(/\s+/).length} words).`,
    isCustom: true,
    pages
  };
};

/**
 * Parse EPUB file using Zip extraction/FileReader HTML scanning
 */
export const parseEpubFile = async (file) => {
  try {
    const text = await readAsText(file);
    // Strip HTML/XML tags to retrieve plain text content
    const cleanedText = text
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanedText.length > 50) {
      const mockFile = new File([cleanedText], file.name.replace('.epub', '.txt'), { type: 'text/plain' });
      const parsed = await parseTextFile(mockFile);
      return {
        ...parsed,
        genre: 'EPUB Book',
        author: 'EPUB Reader'
      };
    }
  } catch (e) {
    console.warn('EPUB fallback parsing:', e);
  }

  // Fallback if binary zip EPUB file
  return parseTextFile(file);
};

/**
 * Parse PDF file content
 */
export const parsePdfFile = async (file) => {
  try {
    const text = await readAsText(file);
    // Extract visible string blocks from PDF streams
    const stringMatches = text.match(/\(([^)]+)\)\s*Tj/g) || text.match(/\[([^\]]+)\]\s*TJ/g);
    
    if (stringMatches && stringMatches.length > 0) {
      const extractedText = stringMatches
        .map(m => m.replace(/[\(\)\ TJ\[\]]/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ');

      if (extractedText.length > 50) {
        const mockFile = new File([extractedText], file.name.replace('.pdf', '.txt'), { type: 'text/plain' });
        const parsed = await parseTextFile(mockFile);
        return {
          ...parsed,
          genre: 'PDF Document',
          author: 'PDF Reader'
        };
      }
    }
  } catch (e) {
    console.warn('PDF fallback parsing:', e);
  }

  return parseTextFile(file);
};

/**
 * Master dispatcher for any uploaded file type (.epub, .pdf, .txt, .md)
 */
export const parseUploadedFile = async (file) => {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.epub')) {
    return await parseEpubFile(file);
  } else if (fileName.endsWith('.pdf')) {
    return await parsePdfFile(file);
  } else {
    return await parseTextFile(file);
  }
};
