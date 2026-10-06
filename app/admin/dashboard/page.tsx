// app/admin/dashboard/page.tsx (replaces existing file)
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  body: string;
  image: string | null;
  status: "draft" | "published";
  tags: string[];
  date: string;
};

const CATEGORIES = [
  "Transfer News",
  "Match Report",
  "First Team",
  "Injury Update",
  "Champions League",
  "Press Conference",
  "Analysis",
];

const ALL_TAGS = [
  "Transfer",
  "Premier League",
  "Champions League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Breaking",
  "Exclusive",
];

// CSS for contentEditable placeholder + editor content styling
const editorStyles = `
  [contenteditable][data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
  }
  [contenteditable] {
    outline: none;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  [contenteditable] h2 { font-family: 'Barlow Condensed', sans-serif; font-size: 24px; font-weight: 700; margin: 14px 0 6px; line-height: 1.15; }
  [contenteditable] h3 { font-family: 'Barlow Condensed', sans-serif; font-size: 19px; font-weight: 700; margin: 12px 0 4px; line-height: 1.2; }
  [contenteditable] blockquote { border-left: 3px solid #a78bfa; margin: 12px 0; padding: 4px 14px; color: #4b5563; font-style: italic; background: #f5f3ff; border-radius: 0 8px 8px 0; }
  [contenteditable] ul, [contenteditable] ol { padding-left: 22px; margin: 8px 0; }
  [contenteditable] a { color: #7c3aed; text-decoration: underline; }
  [contenteditable] img { max-width: 100%; height: auto; cursor: pointer; }
  .fg-scroll-x { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .fg-scroll-x::-webkit-scrollbar { display: none; }
  * { box-sizing: border-box; }
`;

// ---- tiny media-query hook (client only) ----
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function AdminDashboard() {
  const IMAGE_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const isMobile = useMediaQuery("(max-width: 767px)"); // sidebar becomes a drawer
  const isNarrow = useMediaQuery("(max-width: 1023px)"); // form columns stack
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [panel, setPanel] = useState<"create" | "articles">("create");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bodyImageRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [charCount, setCharCount] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const pad = isMobile ? 14 : 24;

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2800);
  }

  // close drawer when leaving mobile
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  function selectImageForEditing(img: HTMLImageElement) {
    setSelectedImage(img);
    const editorRect = bodyRef.current?.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    if (editorRect) {
      setToolbarPos({
        top: imgRect.top - editorRect.top - 44,
        left: Math.max(0, imgRect.left - editorRect.left),
      });
    }
  }

  function deselectImage() {
    setSelectedImage(null);
    setToolbarPos(null);
  }

  function handleBodyClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      selectImageForEditing(target as HTMLImageElement);
    } else {
      deselectImage();
    }
  }

  function alignSelectedImage(align: "left" | "center" | "right") {
    if (!selectedImage) return;

    if (align === "left") {
      selectedImage.style.float = "left";
      selectedImage.style.display = "block";
      selectedImage.style.margin = "4px 16px 8px 0";
    } else if (align === "right") {
      selectedImage.style.float = "right";
      selectedImage.style.display = "block";
      selectedImage.style.margin = "4px 0 8px 16px";
    } else {
      selectedImage.style.float = "none";
      selectedImage.style.display = "block";
      selectedImage.style.margin = "12px auto";
    }

    updateCharCount();
    // Reposition the toolbar since the image likely moved
    selectImageForEditing(selectedImage);
  }

  function resizeSelectedImage(percent: number) {
    if (!selectedImage) return;
    selectedImage.style.width = `${percent}%`;
    selectedImage.style.height = "auto";
    selectedImage.style.maxWidth = "100%";
    updateCharCount();
    selectImageForEditing(selectedImage);
  }

  // ---- LOAD ARTICLES ON MOUNT ----
  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoadingArticles(true);
    try {
      const res = await fetch("/api/admin/articles", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load articles");
      const data: Article[] = await res.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
      showToast("Couldn't load articles from the server", false);
    } finally {
      setLoadingArticles(false);
    }
  }

  function clearForm() {
    if (titleRef.current) titleRef.current.value = "";
    if (categoryRef.current) categoryRef.current.value = "";
    if (authorRef.current) authorRef.current.value = "";
    if (excerptRef.current) excerptRef.current.value = "";
    if (bodyRef.current) bodyRef.current.innerHTML = "";
    setCharCount(0);
    setImageData(null);
    setSelectedTags([]);
    setStatus("draft");
    setEditingId(null);
    deselectImage();
  }

  function getFormData(): Omit<Article, "id" | "date"> {
    return {
      title: titleRef.current?.value.trim() ?? "",
      category: categoryRef.current?.value ?? "",
      author: authorRef.current?.value.trim() || "Admin",
      excerpt: excerptRef.current?.value.trim() ?? "",
      body: bodyRef.current?.innerHTML.trim() ?? "",
      image: imageData,
      status,
      tags: selectedTags,
    };
  }

  // ---- SAVE (create or update) ----
  async function saveArticle(overrideStatus?: "draft" | "published") {
    const data = getFormData();
    if (!data.title) { showToast("Please enter a headline", false); return; }
    if (!data.body) { showToast("Please write some content", false); return; }

    const finalStatus = overrideStatus ?? status;
    const payload = { ...data, status: finalStatus };

    setSaving(true);
    try {
      const isEditing = editingId !== null;
      const res = await fetch(
        isEditing ? `/api/admin/articles/${editingId}` : "/api/admin/articles",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save article");
      }

      const saved: Article = await res.json();

      setArticles((prev) =>
        isEditing ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev]
      );

      showToast(
        isEditing
          ? "Article updated!"
          : finalStatus === "published" ? "Article published!" : "Draft saved!"
      );
      clearForm();
      if (finalStatus === "published") setPanel("articles");
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Failed to save article", false);
    } finally {
      setSaving(false);
    }
  }

  // ---- IMAGE UPLOAD (cover) ----
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setImageData(url);
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Image upload failed", false);
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Image upload failed");
    }

    const data: { url: string } = await res.json();
    return `${IMAGE_BASE}${data.url}`; // now absolute, e.g. http://localhost:4000/uploads/xyz.jpg
  }

  // ---- DELETE ----
  async function deleteArticle(id: number, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    const prev = articles;
    setArticles((cur) => cur.filter((a) => a.id !== id)); // optimistic

    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete article");
      if (editingId === id) clearForm();
      showToast("Article deleted");
    } catch (err) {
      console.error(err);
      setArticles(prev); // roll back
      showToast("Couldn't delete article", false);
    }
  }

  function editArticle(a: Article) {
    deselectImage();
    setPanel("create");
    setSidebarOpen(false);
    setTimeout(() => {
      contentRef.current?.scrollTo({ top: 0 });
      if (titleRef.current) titleRef.current.value = a.title;
      if (categoryRef.current) categoryRef.current.value = a.category;
      if (authorRef.current) authorRef.current.value = a.author;
      if (excerptRef.current) excerptRef.current.value = a.excerpt;
      if (bodyRef.current) {
        bodyRef.current.innerHTML = a.body;
        setCharCount(bodyRef.current.innerText.length);
      }
      setImageData(a.image);
      setStatus(a.status);
      setSelectedTags(a.tags);
      setEditingId(a.id);
      // No longer removing from local list here — the article still exists
      // on the server until you actually save your edits (PUT), so we leave
      // it in place. If you cancel out of editing, nothing is lost.
    }, 50);
  }

  // ---- WYSIWYG FORMATTER (uses execCommand) ----
  function focusBody() {
    bodyRef.current?.focus();
  }

  function applyFormat(command: string, value?: string) {
    focusBody();
    document.execCommand(command, false, value);
    updateCharCount();
  }

  function updateCharCount() {
    const text = bodyRef.current?.innerText ?? "";
    setCharCount(text.length);
  }

  function insertHeading(tag: "h2" | "h3") {
    focusBody();
    document.execCommand("formatBlock", false, tag);
    updateCharCount();
  }

  function insertLink() {
    const url = window.prompt("Enter URL:", "https://");
    if (!url) return;
    focusBody();
    document.execCommand("createLink", false, url);
    updateCharCount();
  }

  function insertImageAtCursor(url: string) {
    focusBody();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url}" style="max-width:100%;border-radius:8px;margin:12px 0;display:block;" />`
    );
    updateCharCount();
  }

  async function handleBodyImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      insertImageAtCursor(url);
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Image upload failed", false);
    } finally {
      e.target.value = "";
    }
  }

  const FORMAT_BUTTONS: { label: string; title: string; action: () => void }[] = [
    { label: "B", title: "Bold", action: () => applyFormat("bold") },
    { label: "I", title: "Italic", action: () => applyFormat("italic") },
    { label: "U", title: "Underline", action: () => applyFormat("underline") },
    { label: "H2", title: "Heading", action: () => insertHeading("h2") },
    { label: "H3", title: "Subheading", action: () => insertHeading("h3") },
    { label: "❝", title: "Quote", action: () => applyFormat("formatBlock", "blockquote") },
    { label: "•", title: "Bullet list", action: () => applyFormat("insertUnorderedList") },
    { label: "1.", title: "Numbered list", action: () => applyFormat("insertOrderedList") },
    { label: "🔗", title: "Insert link", action: () => insertLink() },
    { label: "🖼", title: "Insert image", action: () => bodyImageRef.current?.click() },
  ];

  const published = articles.filter(a => a.status === "published").length;
  const drafts = articles.filter(a => a.status === "draft").length;

  const fmtBtn: React.CSSProperties = {
    ...formatBtn,
    minWidth: isMobile ? 36 : 28,
    height: isMobile ? 36 : 28,
    fontSize: isMobile ? 13 : 12,
    flexShrink: 0,
  };

  const imgBtn: React.CSSProperties = {
    ...imgToolbarBtn,
    minWidth: isMobile ? 32 : 26,
    height: isMobile ? 32 : 26,
  };

  function goTo(p: "create" | "articles") {
    setPanel(p);
    setSidebarOpen(false);
  }

  return (
    <>
      <style>{editorStyles}</style>
      <div style={{ display: "flex", height: "100dvh", fontFamily: "'DM Sans', sans-serif", background: "#f5f3ff", overflow: "hidden" }}>

        {/* MOBILE OVERLAY */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(17,10,50,0.55)", zIndex: 40 }}
          />
        )}

        {/* SIDEBAR (drawer on mobile) */}
        <aside style={{
          width: isMobile ? 260 : isNarrow ? 190 : 220,
          background: "#2d1a6e", display: "flex",
          flexDirection: "column", flexShrink: 0,
          ...(isMobile
            ? {
                position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
                boxShadow: sidebarOpen ? "8px 0 30px rgba(0,0,0,0.35)" : "none",
              }
            : {}),
        }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* BRAND — click to go back to home */}
            <Link
              href="/"
              title="Go to home"
              onClick={() => setSidebarOpen(false)}
              style={{ textDecoration: "none", display: "block", cursor: "pointer" }}
            >
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.1 }}>
                Football<br />Gazette
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>
                Admin Panel
              </div>
            </Link>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 14 }}
              >
                ✕
              </button>
            )}
          </div>

          <nav style={{ padding: "12px 0", flex: 1 }}>
            {[
              { key: "create", label: "Create Article", icon: "+" },
              { key: "articles", label: "All Articles", icon: "≡" },
            ].map(item => (
              <div
                key={item.key}
                onClick={() => goTo(item.key as "create" | "articles")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: isMobile ? "14px 20px" : "10px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  color: panel === item.key ? "#fff" : "rgba(255,255,255,0.55)",
                  background: panel === item.key ? "rgba(255,255,255,0.1)" : "transparent",
                  borderLeft: panel === item.key ? "3px solid #a78bfa" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </nav>

          <div style={{ padding: "16px 20px", borderTop: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#a78bfa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#2d1a6e", flexShrink: 0 }}>AD</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: 0 }}>Admin</p>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Super Editor</span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", margin: "0 0 16px", padding: "4px 20px", textAlign: "left" }}
          >
            Sign out
          </button>
        </aside>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* TOPBAR */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            padding: isMobile ? "10px 14px" : "16px 24px", borderBottom: "0.5px solid #e5e7eb",
            background: "#fff", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                  style={{ width: 38, height: 38, borderRadius: 8, border: "0.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 18, flexShrink: 0 }}
                >
                  ☰
                </button>
              )}
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 17 : 20, fontWeight: 700,
                letterSpacing: "0.05em", textTransform: "uppercase",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {panel === "create" ? (editingId ? "Edit Article" : "Create Article") : "All Articles"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {!isMobile && <button onClick={() => setPanel("articles")} style={ghostBtn}>All Articles</button>}
              <button onClick={() => saveArticle("published")} disabled={saving} style={primaryBtn}>
                {saving ? "Publishing..." : "Publish Now"}
              </button>
            </div>
          </div>

          {/* CONTENT (this is the scroll container the sticky toolbar sticks inside) */}
          <div ref={contentRef} style={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch" }}>

            {/* CREATE PANEL */}
            {panel === "create" && (
              <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
                <div style={{
                  display: "flex", flexDirection: isNarrow ? "column" : "row",
                  gap: isMobile ? 16 : 20, padding: pad, flex: 1,
                }}>

                  {/* LEFT */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                    <Field label="Headline">
                      <textarea
                        ref={titleRef}
                        rows={2}
                        placeholder="Enter a compelling headline..."
                        style={{ ...inputBase, fontFamily: "'Barlow Condensed', sans-serif", fontSize: isMobile ? 18 : 20, fontWeight: 700, resize: "vertical" }}
                      />
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                      <Field label="Category">
                        <select ref={categoryRef} style={inputBase}>
                          <option value="">Select category</option>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Author">
                        <input ref={authorRef} type="text" placeholder="e.g. John Doe" style={inputBase} />
                      </Field>
                    </div>
                    <Field label="Excerpt / Summary">
                      <textarea ref={excerptRef} rows={2} placeholder="Short description shown in previews..." style={{ ...inputBase, resize: "vertical" }} />
                    </Field>

                    {/* WYSIWYG EDITOR */}
                    <Field label="Full Article Body">
                      {/* STICKY TOOLBAR — always stays on top while scrolling */}
                      <div
                        className="fg-scroll-x"
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 20,
                          display: "flex", gap: 4, padding: "6px 8px",
                          border: "0.5px solid #d1d5db", borderBottom: "0.5px solid #e5e7eb",
                          borderRadius: "8px 8px 0 0", background: "#f9fafb",
                          boxShadow: "0 3px 10px rgba(45,26,110,0.08)",
                          flexWrap: isMobile ? "nowrap" : "wrap",
                          overflowX: isMobile ? "auto" : "visible",
                        }}
                      >
                        {FORMAT_BUTTONS.map(btn => (
                          <button
                            key={btn.title}
                            type="button"
                            title={btn.title}
                            // keep the editor selection when clicking toolbar buttons
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={btn.action}
                            style={fmtBtn}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <input
                        ref={bodyImageRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleBodyImageUpload}
                      />
                      <div style={{ position: "relative" }}>
                        <div
                          ref={bodyRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={updateCharCount}
                          onClick={handleBodyClick}
                          data-placeholder="Write the full story here..."
                          style={{
                            ...inputBase,
                            borderRadius: "0 0 8px 8px",
                            minHeight: isMobile ? 280 : 320,
                            overflowY: "auto",
                            lineHeight: 1.6,
                            background: "#fff",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: isMobile ? 16 : 14,
                          }}
                        />

                        {selectedImage && toolbarPos && (
                          <div
                            style={{
                              position: "absolute",
                              top: Math.max(toolbarPos.top, 0),
                              left: toolbarPos.left,
                              maxWidth: "100%",
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: 4,
                              background: "#1f2937",
                              borderRadius: 8,
                              padding: "6px 8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                              zIndex: 10,
                            }}
                          >
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginRight: 2 }}>
                              Align
                            </span>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => alignSelectedImage("left")} style={imgBtn}>⬅</button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => alignSelectedImage("center")} style={imgBtn}>⬛</button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => alignSelectedImage("right")} style={imgBtn}>➡</button>

                            <span style={{ width: 1, height: 18, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />

                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginRight: 2 }}>
                              Size
                            </span>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => resizeSelectedImage(25)} style={imgBtn}>S</button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => resizeSelectedImage(50)} style={imgBtn}>M</button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => resizeSelectedImage(75)} style={imgBtn}>L</button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => resizeSelectedImage(100)} style={imgBtn}>XL</button>

                            <span style={{ width: 1, height: 18, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />

                            <button
                              type="button"
                              onClick={deselectImage}
                              style={{ ...imgBtn, color: "#f87171" }}
                              title="Deselect"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>

                  {/* RIGHT (stacks under the form on tablet/mobile) */}
                  <div style={{
                    width: isNarrow ? "100%" : 260, flexShrink: 0,
                    display: "flex", flexDirection: "column", gap: 16,
                  }}>
                    <Field label="Cover Image">
                      <div
                        onClick={() => fileRef.current?.click()}
                        style={{
                          border: "1.5px dashed #d1d5db", borderRadius: 12,
                          background: "#f9fafb", cursor: "pointer",
                          overflow: "hidden", position: "relative",
                          minHeight: imageData ? 0 : 140,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          gap: 6, padding: imageData ? 0 : 24, textAlign: "center",
                          transition: "border-color 0.15s",
                          opacity: uploadingCover ? 0.6 : 1,
                          pointerEvents: uploadingCover ? "none" : "auto",
                        }}
                      >
                        {uploadingCover ? (
                          <div style={{ fontSize: 13, color: "#6b7280" }}>Uploading...</div>
                        ) : imageData ? (
                          <img src={imageData} alt="Cover preview" style={{ width: "100%", height: isNarrow ? 200 : 160, objectFit: "cover", display: "block" }} />
                        ) : (
                          <>
                            <span style={{ fontSize: 28, color: "#9ca3af" }}>🖼</span>
                            <div style={{ fontSize: 13, color: "#6b7280" }}>Click to upload image</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>JPG, PNG, WEBP · Max 5MB</div>
                          </>
                        )}
                      </div>
                      {imageData && !uploadingCover && (
                        <button onClick={() => setImageData(null)} style={{ ...ghostBtn, fontSize: 12, marginTop: 6, width: "100%", justifyContent: "center" }}>
                          Remove image
                        </button>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                    </Field>

                    <MetaCard title="Status">
                      <div style={{ display: "flex", gap: 8 }}>
                        {(["draft", "published"] as const).map(s => (
                          <div
                            key={s}
                            onClick={() => setStatus(s)}
                            style={{
                              flex: 1, textAlign: "center", fontSize: 12, fontWeight: 500,
                              padding: isMobile ? "10px 4px" : "7px 4px", borderRadius: 8, cursor: "pointer",
                              border: "0.5px solid",
                              borderColor: status === s ? (s === "draft" ? "#fcd34d" : "#6ee7b7") : "#e5e7eb",
                              background: status === s ? (s === "draft" ? "#fef3c7" : "#d1fae5") : "#fff",
                              color: status === s ? (s === "draft" ? "#92400e" : "#065f46") : "#6b7280",
                              transition: "all 0.12s", textTransform: "capitalize",
                            }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </MetaCard>

                    <MetaCard title="Tags">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {ALL_TAGS.map(tag => (
                          <div
                            key={tag}
                            onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                            style={{
                              fontSize: 11, fontWeight: 500, padding: isMobile ? "6px 12px" : "3px 10px",
                              borderRadius: 99, cursor: "pointer",
                              border: "0.5px solid",
                              borderColor: selectedTags.includes(tag) ? "#c4b5fd" : "#e5e7eb",
                              background: selectedTags.includes(tag) ? "#ede9fe" : "#fff",
                              color: selectedTags.includes(tag) ? "#5b21b6" : "#6b7280",
                              transition: "all 0.12s",
                            }}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </MetaCard>
                  </div>
                </div>

                {/* FORM ACTIONS (sticks to the bottom of the scroll area) */}
                <div style={{
                  position: "sticky", bottom: 0, zIndex: 15,
                  padding: isMobile ? "10px 14px" : "14px 24px", borderTop: "0.5px solid #e5e7eb",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  flexWrap: "wrap",
                  background: "#fff",
                }}>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{charCount} characters</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: isMobile ? 1 : "none", justifyContent: "flex-end" }}>
                    <button onClick={clearForm} style={ghostBtn}>{editingId !== null ? "Cancel Edit" : "Clear"}</button>
                    <button onClick={() => saveArticle("draft")} disabled={saving} style={ghostBtn}>
                      {saving ? "Saving..." : "Save Draft"}
                    </button>
                    <button onClick={() => saveArticle("published")} disabled={saving} style={primaryBtn}>
                      {saving ? "Publishing..." : "Publish Now"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLES PANEL */}
            {panel === "articles" && (
              <div>
                {/* Stats */}
                <div style={{ display: "flex", borderBottom: "0.5px solid #e5e7eb", background: "#f9fafb" }}>
                  {[
                    { label: "Total", value: articles.length },
                    { label: "Published", value: published },
                    { label: "Drafts", value: drafts },
                  ].map(s => (
                    <div key={s.label} style={{
                      padding: isMobile ? "12px 14px" : "12px 24px", borderRight: "0.5px solid #e5e7eb",
                      flex: isMobile ? 1 : "none",
                    }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {loadingArticles ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80, color: "#9ca3af" }}>
                    Loading articles...
                  </div>
                ) : articles.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 80, color: "#9ca3af", textAlign: "center" }}>
                    <span style={{ fontSize: 40 }}>📰</span>
                    <p style={{ fontSize: 14 }}>No articles yet. Create your first one!</p>
                    <button onClick={() => setPanel("create")} style={primaryBtn}>+ Create Article</button>
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(150px, 1fr))" : "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: isMobile ? 12 : 16, padding: pad,
                  }}>
                    {articles.map(a => (
                      <div key={a.id} style={{ border: "0.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff", transition: "border-color 0.15s", minWidth: 0 }}>
                        {a.image
                          ? <img src={a.image} alt={a.title} style={{ width: "100%", height: isMobile ? 100 : 130, objectFit: "cover", display: "block" }} />
                          : <div style={{ width: "100%", height: isMobile ? 100 : 130, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#d1d5db" }}>🖼</div>
                        }
                        <div style={{ padding: 12 }}>
                          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 4 }}>{a.category || "Uncategorised"}</div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
                            {a.title.substring(0, 70)}{a.title.length > 70 ? "…" : ""}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 99,
                              background: a.status === "published" ? "#d1fae5" : "#fef3c7",
                              color: a.status === "published" ? "#065f46" : "#92400e",
                              textTransform: "uppercase", letterSpacing: "0.06em",
                            }}>{a.status}</span>
                            <span style={{ fontSize: 11, color: "#9ca3af" }}>{a.date}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, padding: "8px 12px 10px", borderTop: "0.5px solid #e5e7eb" }}>
                          <button onClick={() => editArticle(a)} style={{ ...cardBtn, padding: isMobile ? "9px 5px" : "5px" }}>✎ Edit</button>
                          <button onClick={() => deleteArticle(a.id, a.title)} style={{ ...cardBtn, color: "#b91c1c", padding: isMobile ? "9px 5px" : "5px" }}>🗑 Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div style={{
            position: "fixed", bottom: isMobile ? 76 : 20, right: isMobile ? 14 : 20, left: isMobile ? 14 : "auto",
            background: toast.ok ? "#059669" : "#dc2626",
            color: "#fff", padding: "10px 18px", borderRadius: 8,
            fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
            zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            {toast.ok ? "✓" : "✕"} {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

function MetaCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
      {children}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14, padding: "9px 12px",
  border: "0.5px solid #d1d5db", borderRadius: 8,
  background: "#fff", color: "#111827",
  outline: "none", width: "100%",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "8px 16px", fontSize: 13, fontWeight: 500,
  borderRadius: 8, cursor: "pointer", border: "none",
  background: "#7c3aed", color: "#fff", whiteSpace: "nowrap",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "8px 14px", fontSize: 13, fontWeight: 500,
  borderRadius: 8, cursor: "pointer",
  background: "transparent", border: "0.5px solid #d1d5db", color: "#6b7280",
  whiteSpace: "nowrap",
};

const cardBtn: React.CSSProperties = {
  flex: 1, fontSize: 11, fontWeight: 500, padding: "5px",
  borderRadius: 8, cursor: "pointer",
  background: "transparent", border: "0.5px solid #e5e7eb", color: "#6b7280",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
};

const formatBtn: React.CSSProperties = {
  minWidth: 28, height: 28, fontSize: 12, fontWeight: 700,
  borderRadius: 6, cursor: "pointer",
  background: "#fff", border: "0.5px solid #e5e7eb", color: "#374151",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

const imgToolbarBtn: React.CSSProperties = {
  minWidth: 26,
  height: 26,
  fontSize: 11,
  fontWeight: 700,
  borderRadius: 6,
  cursor: "pointer",
  background: "rgba(255,255,255,0.1)",
  border: "none",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};