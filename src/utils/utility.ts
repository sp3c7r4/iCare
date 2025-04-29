import fs from 'fs';
import path from 'path';

export function getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();
    return `${day}${month}${year}`;
}

export function createDirectory(dirName: string) {
    const targetDir = path.join(process.cwd(), `src/${dirName}`);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
}

