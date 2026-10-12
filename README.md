# DSH RTL & BiDi Plugin (`dsh-plugin-rtl`)

Official Persian & Arabic bidirectional text (BiDi) and typography plugin for DeepSeek Harness (DSH) Web GUI.

[فارسی](#راهنمای-فارسی) | [English](#english)

---

## English

### Overview

`dsh-plugin-rtl` brings first-class Right-to-Left (RTL) and Bidirectional (BiDi) text editing and rendering to the DeepSeek Harness Web interface. It is architected specifically for DSH's Cordis micro-kernel and works harmoniously across all theme plugins (including `dsh-claude-style`, official DeepSeek themes, dark/light modes, etc.).

### Key Features

- **Lexical Composer & Input Isolation**: Dynamic per-paragraph BiDi detection inside the Lexical prompt editor and standard inputs. Typing Persian with mixed English terms (e.g. `dsh`, `claude`), code snippets, or parentheses maintains strictly correct visual and semantic ordering.
- **Theme & Caret Synchronization**: Integrates smoothly with custom caret engines (such as Claude style's orange cursor) and mascot anchors without visual stutter or misalignment.
- **Refined Typography**: Automatically uses the clean **Vazirmatn** variable font for Persian/Arabic Unicode ranges (`U+0600-06FF`, etc.) while leaving Latin fonts (Inter, JetBrains Mono) intact for English text and code blocks.
- **Strict Monospace & Technical Protection**: Code blocks (`<pre>`, `<code>`), diffs, terminals, and markdown tables remain strictly Left-to-Right (LTR) and monospace.
- **Streaming & Async Chat Support**: High-performance `MutationObserver` and delegated event listeners seamlessly format incoming streamed assistant responses in real time.
- **Zero-Impurity Lifecycle**: Attached through native Cordis effects with clean teardown on disable or profile reload.

### Installation

#### Option 1: Via DSH Web GUI
1. Open DSH Web Settings (`⚙️`).
2. Navigate to **Plugins** / **Extensions**.
3. In the repository URL field, paste:
   ```text
   https://github.com/surtr85/dsh-plugin-rtl
   ```
4. Click **Install** / **Add Plugin**.

#### Option 2: Via CLI
```bash
dsh plugin install https://github.com/surtr85/dsh-plugin-rtl
```

---

## راهنمای فارسی

### معرفی

پلاگین رسمی پشتیبانی از زبان فارسی و چینش راست‌به‌چپ (RTL & BiDi) برای رابط کاربری وب DeepSeek Harness. این پلاگین با رعایت کامل معماری ماژولار Cordis طراحی شده و با انواع تم‌ها و استایل‌های DSH (مانند تم Claude Code و تم‌های رسمی) کاملاً هماهنگ است.

### ویژگی‌های کلیدی

- **پشتیبانی کامل از ادیتور Lexical و پرامپت چت**: تشخیص بلادرنگ و پاراگراف‌به‌پاراگراف جهت متن هنگام تایپ؛ کلمات انگلیسی، عبارات ترکیبی، پرانتزها و کاراکترهای خنثی بدون به هم ریختگی و در جهت درست نمایش داده می‌شوند.
- **سازگاری کامل با تم‌ها و کرسر سفارشی**: حل مشکل پرش مکان‌نما و هماهنگی دقیق با کرسر تم کلود (`dsh-claude-style`).
- **فونت بهینه‌شده وزیرمتن (Vazirmatn)**: استفاده خودکار از فونت وزیرمتن برای گلیف‌های فارسی از طریق `unicode-range` بدون تغییر دادن فونت متون انگلیسی یا کدهای تک‌فاصله (Monospace).
- **حفاظت کامل از بلوک‌های کد و ترمینال**: بلوک‌های کد، دستورات ترمینال، جداول مارک‌داون و دیف‌ها به صورت کاملاً دست‌نخورده و چپ‌به‌راست (LTR) باقی می‌مانند.
- **پاسخ‌های استریم‌شده**: فرمت‌دهی آنی و بی‌درنگ پاسخ‌های طولانی و استریم چت هوش مصنوعی.

### نحوه نصب

#### روش اول: از طریق پنل تنظیمات وب DSH
۱. به بخش **تنظیمات (Settings)** و سپس **Plugins** مراجعه کنید.  
۲. در فیلد آدرس ریپازیتوری، آدرس زیر را وارد کنید:  
   ```text
   https://github.com/surtr85/dsh-plugin-rtl
   ```  
۳. دکمه **Install** را بزنید.

#### روش دوم: از طریق ترمینال
```bash
dsh plugin install https://github.com/surtr85/dsh-plugin-rtl
```

---

### License

MIT License © 2026 Sajjad (surtr85)
