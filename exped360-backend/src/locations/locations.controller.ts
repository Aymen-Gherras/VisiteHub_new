import { Controller, Get, Param } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

// Load JSON files using absolute path (works reliably in production)
const dataDir = path.join(__dirname, 'data');
const asciiDataPath = path.join(dataDir, 'wilaya-dairas.ascii.json');
const fullDataPath = path.join(dataDir, 'wilaya-dairas.full.json');

let asciiData: any = [];
let fullData: any = [];

try {
  asciiData = JSON.parse(fs.readFileSync(asciiDataPath, 'utf-8'));
} catch (err) {
  console.warn('Could not load ascii data:', err);
}

try {
  fullData = JSON.parse(fs.readFileSync(fullDataPath, 'utf-8'));
} catch (err) {
  console.warn('Could not load full data:', err);
}

interface WilayaDairasItem {
  wilaya: string;
  dairas: string[];
}

function getDataset(): WilayaDairasItem[] {
  // If full dataset exists and is non-empty, prefer it
  try {
    const data = (fullData as WilayaDairasItem[]) || [];
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (_) {
    // ignore
  }
  return (asciiData as WilayaDairasItem[]);
}

@Controller('locations')
export class LocationsController {
  @Get('wilayas')
  listWilayas(): string[] {
    const data = getDataset();
    return data
      .map((w) => w.wilaya);
      // Preserve the order from JSON file (official 01-69 numbering)
  }

  @Get('wilayas/:wilaya/dairas')
  listDairas(@Param('wilaya') wilaya: string): string[] {
    const hay = getDataset();
    const key = decodeURIComponent(wilaya).toLowerCase();
    const found = hay.find((w) => (w.wilaya || '').toLowerCase() === key);
    return found ? [...found.dairas] : []; // Preserve JSON file order
  }

  @Get('wilaya-dairas')
  listWilayaDairas(): Record<string, string[]> {
    const map: Record<string, string[]> = {};
    getDataset().forEach((w) => {
      map[w.wilaya] = [...w.dairas]; // Preserve JSON file order
    });
    return map; // Preserve JSON file order
  }
}
