#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// ========== CONFIGURAÇÕES ==========
const BASE_DIR = '/mnt/armazenamento/biblioteca-vimmemore';
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--yes');
const PENDING_DIR = path.join(BASE_DIR, '_pending_review');

// Extensões válidas (as que queremos manter)
const VALID_EXT = ['.pdf', '.epub', '.mobi', '.azw3', '.djvu'];
// Extensões temporárias/lixo a remover
const TRASH_EXT = ['.tmp', '.bak', '.part', '.crdownload', '.download', '~', '.swp', '.swo'];

/**
 * Remove arquivos com extensões lixo
 */
function cleanTrashFiles(folderPath, folderName) {
  let removed = 0;
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) continue;
    const ext = path.extname(file).toLowerCase();
    if (TRASH_EXT.includes(ext) || file.endsWith('~')) {
      console.log(`   🗑️  [TRASH] ${file}`);
      if (!DRY_RUN && FORCE) {
        fs.unlinkSync(fullPath);
      }
      removed++;
    }
  }
  return removed;
}

/**
 * Remove pastas vazias recursivamente
 */
function removeEmptyDirs(folderPath) {
  let removed = 0;
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      removeEmptyDirs(fullPath);
      // Após recursão, verifica se a pasta ficou vazia
      const remaining = fs.readdirSync(fullPath);
      if (remaining.length === 0) {
        console.log(`   🗑️  [EMPTY DIR] ${fullPath}`);
        if (!DRY_RUN && FORCE) {
          fs.rmdirSync(fullPath);
        }
        removed++;
      }
    }
  }
  return removed;
}

/**
 * Corrige extensões para minúsculas (ex: .PDF -> .pdf)
 */
function fixExtensions(folderPath) {
  let fixed = 0;
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) continue;
    const ext = path.extname(file);
    const lowerExt = ext.toLowerCase();
    if (ext !== lowerExt && VALID_EXT.includes(lowerExt)) {
      const newName = file.slice(0, -ext.length) + lowerExt;
      const newPath = path.join(folderPath, newName);
      console.log(`   🔧 [EXT] ${file} -> ${newName}`);
      if (!DRY_RUN && FORCE) {
        fs.renameSync(fullPath, newPath);
      }
      fixed++;
    }
  }
  return fixed;
}

/**
 * Remove caracteres proibidos de nomes de arquivo (substitui por espaço)
 */
function sanitizeNames(folderPath) {
  let renamed = 0;
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) continue;
    let newName = file;
    // Remove caracteres que podem causar problemas (ex: : ? * " < > |)
    newName = newName.replace(/[:?*"<>|]/g, ' ');
    // Remove múltiplos espaços
    newName = newName.replace(/\s+/g, ' ');
    if (newName !== file) {
      const newPath = path.join(folderPath, newName);
      console.log(`   🔧 [SANITIZE] ${file} -> ${newName}`);
      if (!DRY_RUN && FORCE) {
        fs.renameSync(fullPath, newPath);
      }
      renamed++;
    }
  }
  return renamed;
}

/**
 * Verifica se o nome do arquivo segue o padrão "pasta - ... - Desconhecido.ext"
 * Se não, move para pending_review (opcional)
 */
function checkNamingPattern(folderPath, folderName) {
  const pendingPath = path.join(PENDING_DIR, folderName);
  let moved = 0;
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) continue;
    const ext = path.extname(file);
    if (!VALID_EXT.includes(ext.toLowerCase())) continue;
    // Padrão esperado: começa com "folderName - " e termina com " - Desconhecido.ext"
    const baseName = file.slice(0, -ext.length);
    const pattern = new RegExp(`^${folderName}\\s*-\\s*.*\\s*-\\s*Desconhecido$`, 'i');
    if (!pattern.test(baseName)) {
      console.log(`   ⚠️ [BAD NAME] ${file}`);
      if (!DRY_RUN && FORCE) {
        if (!fs.existsSync(pendingPath)) fs.mkdirSync(pendingPath, { recursive: true });
        const dest = path.join(pendingPath, file);
        fs.renameSync(fullPath, dest);
        console.log(`      -> movido para ${dest}`);
        moved++;
      }
    }
  }
  return moved;
}

// ========== MAIN ==========
console.log(DRY_RUN ? '🔎 SIMULAÇÃO (cleanup-memore)' : '🧹 LIMPEZA REAL');
if (!FORCE && !DRY_RUN) {
  console.log('⚠️  Modo real requer a flag --yes. Use --dry-run para simular.');
  process.exit(1);
}

let totalTrash = 0, totalEmpty = 0, totalExt = 0, totalSanitize = 0, totalMoved = 0;

const folders = fs.readdirSync(BASE_DIR).filter(entry => {
  const fullPath = path.join(BASE_DIR, entry);
  return fs.statSync(fullPath).isDirectory() && entry !== 'geral' && entry !== '_pending_review';
});

for (const folder of folders) {
  const folderPath = path.join(BASE_DIR, folder);
  console.log(`\n📁 Processando: ${folder}`);
  
  const trash = cleanTrashFiles(folderPath, folder);
  totalTrash += trash;
  
  const extFixed = fixExtensions(folderPath);
  totalExt += extFixed;
  
  const sanitized = sanitizeNames(folderPath);
  totalSanitize += sanitized;
  
  const moved = checkNamingPattern(folderPath, folder);
  totalMoved += moved;
}

// Remove pastas vazias em toda a árvore (incluindo subpastas)
console.log(`\n📁 Removendo pastas vazias...`);
totalEmpty = removeEmptyDirs(BASE_DIR);

console.log(`\n📊 RESUMO:`);
console.log(`   Arquivos lixo removidos: ${totalTrash}`);
console.log(`   Pastas vazias removidas: ${totalEmpty}`);
console.log(`   Extensões corrigidas: ${totalExt}`);
console.log(`   Nomes sanitizados: ${totalSanitize}`);
console.log(`   Arquivos com padrão incorreto movidos: ${totalMoved}`);

if (DRY_RUN) {
  console.log('\n🔎 Execute com --yes para efetivar as mudanças (cuidado!).');
} else {
  console.log('\n✅ Limpeza concluída.');
}
