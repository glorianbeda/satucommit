# Cara Menggunakan satucommit di AI Agent

Panduan lengkap untuk integrasi satucommit dengan berbagai AI Agent seperti KiloCode, OpenCode, Gemini CLI, Cursor, dan lainnya.

## 📋 Prasyarat

1. Clone atau install satucommit di project Anda:
```bash
git clone https://github.com/glorianbeda/satucommit.git
cd satucommit
npm install
```

2. Pastikan satucommit ada di workspace project Anda

---

## 🤖 Cara Penggunaan di AI Agent

### Metode 1: CLI Commands (Paling Mudah)

AI Agent cukup menjalankan perintah terminal:

```bash
# 1. Agent membuat perubahan
# (AI agent menulis/mengedit file)

# 2. Agent stage perubahan
git add .

# 3. Agent generate dan commit otomatis
node /path/to/satucommit/cli.js quick
```

**Contoh untuk AI Agent:**
```
User: "Buat fitur login"
AI Agent: 
  1. Membuat file login.js
  2. Mengedit app.js
  3. Menjalankan: git add .
  4. Menjalankan: node /path/to/satucommit/cli.js quick
  5. Output: ✨ feat(auth): add user login functionality
```

---

### Metode 2: API Programatik (Lebih Fleksibel) ⭐

AI Agent bisa menggunakan JavaScript API langsung:

```javascript
// Import API satucommit
const { api } = require('./satucommit/src/api');

// 1. Cek apakah di repository git
if (!api.isGitRepo()) {
  console.log('Not a git repository');
  return;
}

// 2. Generate dan commit otomatis
const success = api.commitAuto({
  description: 'implement user authentication',
  type: 'feat',
  scope: 'auth'
});

if (success) {
  console.log('✅ Commit successful!');
}
```

---

## 📝 Contoh Integrasi dengan Berbagai AI Agent

### 1. KiloCode / OpenCode / Cursor

**Cara 1: CLI Commands**
```
User: "Tambahkan fitur login"
AI Agent:
  - Membuat file login.js
  - Menjalankan: git add .
  - Menjalankan: node /path/to/satucommit/cli.js quick
  - Commit otomatis dibuat dengan pesan semantic
```

**Cara 2: API Programatik**
```javascript
// AI Agent menjalankan kode ini setelah membuat perubahan
const { api } = require('./satucommit/src/api');
api.commitAuto();
```

### 2. Gemini CLI / Anthropic Claude CLI

**Cara 1: CLI Commands**
```bash
# AI Agent menjalankan perintah ini
git add .
node /path/to/satucommit/cli.js quick
```

**Cara 2: API Programatik**
```javascript
const { api } = require('./satucommit/src/api');
const suggestions = api.getSuggestions();
api.commitAuto(suggestions);
```

### 3. GitHub Copilot / VS Code AI

**Workflow:**
1. AI membuat perubahan
2. AI menjalankan perintah di integrated terminal:
```bash
git add .
node /path/to/satucommit/cli.js quick
```

### 4. Custom AI Agent

Jika Anda membuat AI agent sendiri:

```javascript
class MyAIAgent {
  async makeCommit() {
    // Import satucommit
    const { api } = require('./satucommit/src/api');
    
    // Cek repository
    if (!api.isGitRepo()) {
      return { success: false, error: 'Not a git repository' };
    }
    
    // Get suggestions
    const suggestions = api.getSuggestions();
    
    // Generate dan commit
    const success = api.commitAuto({
      description: suggestions.description,
      type: suggestions.type,
      scope: suggestions.scope
    });
    
    return { success, message: api.lastCommitMessage };
  }
}
```

---

## 🎯 Workflow Lengkap untuk AI Agent

### Step-by-Step:

1. **AI Agent membuat perubahan**
   - Menulis file baru
   - Mengedit file yang ada
   - Menghapus file

2. **AI Agent stage perubahan**
   ```bash
   git add .
   # atau
   git add <specific-files>
   ```

3. **AI Agent generate commit message**
   ```javascript
   const { api } = require('./satucommit/src/api');
   const message = api.generate();
   ```

4. **AI Agent commit**
   ```javascript
   api.commit(message);
   ```

### Contoh Lengkap:

```javascript
const { api } = require('./satucommit/src/api');

// 1. Buat perubahan
fs.writeFileSync('new-feature.js', 'console.log("Hello");');

// 2. Stage perubahan
execSync('git add new-feature.js');

// 3. Get suggestions
const suggestions = api.getSuggestions();
console.log('Suggested type:', suggestions.type);
console.log('Suggested scope:', suggestions.scope);

// 4. Generate dan commit
const success = api.commitAuto(suggestions);

if (success) {
  console.log('✅ Commit successful!');
  console.log('Message:', api.lastCommitMessage);
}
```

---

## 🔧 Opsi API Lengkap

```javascript
const { api } = require('./satucommit/src/api');

// Opsi lengkap untuk commitAuto
api.commitAuto({
  description: 'custom description',  // Deskripsi custom
  type: 'feat',                    // Tipe commit (feat, fix, docs, dll)
  scope: 'auth',                   // Scope commit
  breaking: false,                  // Mark sebagai breaking change
  group: false                      // Group perubahan menjadi multiple commits
});

// Contoh dengan breaking change
api.commitAuto({
  description: 'update API to v2',
  type: 'feat',
  scope: 'api',
  breaking: true
});
// Output: ✨ feat(api)!: update API to v2

// Contoh dengan grouped commits
const commits = api.generate({ group: true });
commits.forEach(commit => {
  api.commit(commit.message);
});
```

---

## 📊 Contoh Output

### Output CLI:
```
✓ Generated commit message:

✨ feat(auth): add user login functionality

──────────────────────────────────────────────────

✅ Commit successful!
```

### Output API:
```javascript
{
  success: true,
  message: "✨ feat(auth): add user login functionality"
}
```

---

## 🎓 Tips untuk AI Agent

1. **Selalu stage perubahan sebelum commit**
   ```bash
   git add .
   ```

2. **Gunakan suggestions untuk hasil terbaik**
   ```javascript
   const suggestions = api.getSuggestions();
   api.commitAuto(suggestions);
   ```

3. **Group perubahan untuk commit yang lebih baik**
   ```javascript
   const commits = api.generate({ group: true });
   ```

4. **Gunakan dry-run untuk preview**
   ```bash
   node /path/to/satucommit/cli.js quick --dry-run
   ```

---

## 🐛 Troubleshooting

### "Not a git repository"
```bash
# Initialize git dulu
git init
```

### "No staged changes found"
```bash
# Stage perubahan dulu
git add .
```

### "Module not found"
```bash
# Install dependencies
cd /path/to/satucommit
npm install
```

---

## 📖 Referensi

- [README.md](README.md) - Dokumentasi lengkap
- [examples/ai-agent-integration.js](examples/ai-agent-integration.js) - Contoh kode
- [src/api.js](src/api.js) - API documentation

---

## 💡 Contoh Penggunaan Nyata

### Scenario 1: AI Agent membuat fitur baru
```javascript
const { api } = require('./satucommit/src/api');

// Agent membuat file auth.js
// Agent mengedit app.js
// Agent membuat test/auth.test.js

// Agent stage perubahan
execSync('git add .');

// Agent commit
api.commitAuto();
// Output: ✨ feat(auth): implement user authentication
```

### Scenario 2: AI Agent memperbaiki bug
```javascript
const { api } = require('./satucommit/src/api');

// Agent memperbaiki bug di login.js

// Agent stage perubahan
execSync('git add login.js');

// Agent commit dengan custom message
api.commitAuto({
  description: 'fix login validation error',
  type: 'fix'
});
// Output: 🐛 fix: fix login validation error
```

### Scenario 3: AI Agent membuat dokumentasi
```javascript
const { api } = require('./satucommit/src/api');

// Agent membuat README.md
// Agent membuat docs/api.md

// Agent stage perubahan
execSync('git add docs/');

// Agent commit
api.commitAuto();
// Output: 📝 docs: add API documentation
```

---

Made with ❤️ for AI Agents
