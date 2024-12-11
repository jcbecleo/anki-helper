import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import path from 'path';
import * as fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import AdmZip from 'adm-zip';
import sharp from 'sharp';
import { readFileSync } from 'fs';

async function imageToBase64(filePath: string): Promise<string> {
  try {
    const imageBuffer = readFileSync(filePath);
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.warn('Failed to convert image to base64:', error);
    return '';
  }
}

function processMediaPaths(content: string, mediaEntries: [string, string][], tmpDir: string): string {
  return mediaEntries.reduce((text, [index, filename]) => {
    try {
      const mediaPath = path.join(tmpDir, index);
      if (fs.existsSync(mediaPath)) {
        // Convert image to base64
        const base64Image = imageToBase64(mediaPath);
        return text
          .replace(new RegExp(`src="${index}"`, 'g'), `src="${base64Image}"`)
          .replace(new RegExp(`\\[sound:${index}\\]`, 'g'), '')
          .replace(/<img[^>]*src="([^"]*)"[^>]*>/g, (match, src) => {
            return `\n<img src="${src}">\n`;
          });
      }
    } catch (error) {
      console.warn(`Failed to process media file ${filename}:`, error);
    }
    return text;
  }, content);
}

export async function POST(request: Request): Promise<NextResponse> {
  const mediaFiles: string[] = [];
  let uniqueSubDir: string = '';
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create temporary directory for processing
    const tmpDir = path.join(process.cwd(), 'tmp');
    await mkdir(tmpDir, { recursive: true });
    
    // Save uploaded file
    const ankiPath = path.join(tmpDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(ankiPath, buffer);

    // Extract the .apkg file (it's actually a zip file)
    const zip = new AdmZip(ankiPath);
    zip.extractAllTo(tmpDir, true);

    // Open the SQLite database
    const db = await open({
      filename: path.join(tmpDir, 'collection.anki2'),
      driver: sqlite3.Database
    });

    // Get notes and media
    const notes = await db.all<AnkiNote>(`
      SELECT 
        n.id,
        n.flds,
        n.tags,
        n.mid
      FROM notes n
    `);

    // Read media file
    let media: MediaMap = {};
    try {
      const mediaJson = await readFile(path.join(tmpDir, 'media'), 'utf-8');
      media = JSON.parse(mediaJson) as MediaMap;
    } catch {
      console.warn('No media file found');
    }

    // Improved media handling
    const mediaDir = path.join(process.cwd(), 'public', 'media');
    uniqueSubDir = `deck_${Date.now()}`;
    const deckMediaDir = path.join(mediaDir, uniqueSubDir);
    await mkdir(deckMediaDir, { recursive: true });

    // Process and copy media files with better error handling
    const mediaEntries = Object.entries(media);
    for (const [index, filename] of mediaEntries) {
      try {
        const mediaPath = path.join(tmpDir, index);
        if (fs.existsSync(mediaPath)) {
          const safeFilename = sanitizeFilename(filename);
          const outputPath = path.join(deckMediaDir, safeFilename);
          await optimizeAndSaveImage(mediaPath, outputPath);
          mediaFiles.push(`/media/${uniqueSubDir}/${safeFilename}`);
        }
      } catch (err) {
        console.warn(`Failed to process media file ${filename}:`, err instanceof Error ? err.message : 'Unknown error');
      }
    }

    // Improved CSV content generation with media handling
    const csvHeader = 'Front,Back,Tags\n';
    const csvRows = notes.map(note => {
      const fields = note.flds.split('\x1f');
      const front = processMediaPaths(fields[0] || '', mediaEntries, tmpDir);
      const back = processMediaPaths(fields[1] || '', mediaEntries, tmpDir);
      
      const frontFormatted = front
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<(?!img)[^>]+>/g, '')
        .trim();
      
      const backFormatted = back
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<(?!img)[^>]+>/g, '')
        .trim();
      
      return `${frontFormatted}\t${backFormatted}`;
    });

    const csvContent = csvHeader + csvRows.join('\n') + '\n';

    // Close database
    await db.close();

    // Clean up temp files
    fs.rmSync(tmpDir, { recursive: true, force: true });

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${path.basename(file.name, '.apkg')}.csv"`
      }
    });
  } catch (error) {
    // Clean up media directory on error
    try {
      const mediaDir = path.join(process.cwd(), 'public', 'media');
      const deckMediaDir = path.join(mediaDir, uniqueSubDir);
      if (fs.existsSync(deckMediaDir)) {
        fs.rmSync(deckMediaDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error('Failed to clean up media directory:', cleanupError);
    }
    throw error;
  }
}

// Helper functions
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
}

async function optimizeAndSaveImage(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(outputPath);
}