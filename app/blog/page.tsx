'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Sam in Amsterdam — Blog (enhanced)
 * - No backend yet; persists to localStorage.
 * - Swappable later for Supabase/MDX without changing the UI much.
 */

type Post = {
  id: string;
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  coverUrl?: string;
  tags: string[];
  body: string; // markdown-ish
};

type Comment = { id: string; name: string; text: string; when: string };

const LS_POSTS = 'saminams_blog_posts_v1';
const LS_COMMENTS = 'saminams_blog_comments_v1'; // map: postId -> Comment[]

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(LS_POSTS);
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
}
function savePosts(posts: Post[]) {
  localStorage.setItem(LS_POSTS, JSON.stringify(posts));
}

function loadComments(): Record<string, Comment[]> {
  try {
    const raw = localStorage.getItem(LS_COMMENTS);
    return raw ? (JSON.parse(raw) as Record<string, Comment[]>) : {};
  } catch {
    return {};
  }
}
function saveComments(map: Record<string, Comment[]>) {
  localStorage.setItem(LS_COMMENTS, JSON.stringify(map));
}

// Tiny "markdown" -> HTML (supports **bold**, *italic*, line breaks). Safe-ish & simple.
function mdToHtml(md: string) {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let html = escape(md);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-black/5">$1</code>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}

function Section({
  title,
  desc,
  actions,
  children,
}: {
  title: string;
  desc?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-black/5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-xl font-semibold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6F61] to-[#00B3FF]">
              {title}
            </span>
          </h2>
          {desc && <p className="text-sm text-neutral-600 mt-1">{desc}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props;
  return (
    <button
      {...rest}
      className={
        'px-4 py-2 rounded-xl text-white font-medium shadow ' +
        'bg-gradient-to-r from-[#FF6F61] to-[#00B3FF] hover:opacity-95 transition ' +
        className
      }
    />
  );
}
function OutlineButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props;
  return (
    <button
      {...rest}
      className={
        'px-3 py-2 rounded-xl font-medium border shadow-sm transition ' +
        'border-[#00B3FF]/40 text-[#00B3FF] hover:bg-[#00B3FF]/5 ' +
        className
      }
    />
  );
}

export default function BlogPage() {
  // Data
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});

  // Editor state
  const [editing, setEditing] = useState<Post | null>(null);
  const blank: Post = {
    id: '',
    title: '',
    slug: '',
    date: today(),
    coverUrl: '',
    tags: [],
    body: '',
  };
  const [draft, setDraft] = useState<Post>(blank);

  // UI state
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<'all' | string>('all');
  const [sort, setSort] = useState<'new' | 'old'>('new');

  // load/save localStorage
  useEffect(() => {
    setPosts(loadPosts());
    setCommentsMap(loadComments());
  }, []);
  useEffect(() => {
    savePosts(posts);
  }, [posts]);
  useEffect(() => {
    saveComments(commentsMap);
  }, [commentsMap]);

  const allTags = useMemo(() => {
    const t = new Set<string>();
    posts.forEach((p) => p.tags.forEach((x) => t.add(x)));
    return Array.from(t).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let arr = [...posts];
    if (q.trim()) {
      const qq = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title.toLowerCase().includes(qq) ||
          p.body.toLowerCase().includes(qq) ||
          p.tags.some((t) => t.toLowerCase().includes(qq))
      );
    }
    if (tag !== 'all') arr = arr.filter((p) => p.tags.includes(tag));
    arr.sort((a, b) =>
      sort === 'new' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    return arr;
  }, [posts, q, tag, sort]);

  // editor helpers
  const startNew = () => {
    setEditing(null);
    setDraft({ ...blank, id: crypto.randomUUID() });
  };
  const startEdit = (p: Post) => {
    setEditing(p);
    setDraft(p);
  };
  const cancelEdit = () => {
    setEditing(null);
    setDraft(blank);
  };
  const saveDraft = () => {
    const cleanTitle = draft.title.trim();
    if (!cleanTitle) return alert('Title required');
    const post: Post = {
      ...draft,
      slug: draft.slug || slugify(cleanTitle),
      tags: draft.tags
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.toLowerCase()),
    };
    if (editing) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      setEditing(null);
    } else {
      setPosts((prev) => [post, ...prev]);
    }
    setDraft(blank);
  };
  const removePost = (id: string) => {
    if (!confirm('Delete this post?')) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setCommentsMap((m) => {
      const n = { ...m };
      delete n[id];
      return n;
    });
    if (editing?.id === id) cancelEdit();
  };

  const addComment = (postId: string, name: string, text: string) => {
    if (!text.trim()) return;
    const c: Comment = {
      id: crypto.randomUUID(),
      name: name.trim() || 'Guest',
      text: text.trim(),
      when: new Date().toISOString(),
    };
    setCommentsMap((m) => ({ ...m, [postId]: [c, ...(m[postId] || [])] }));
  };

  const seedSample = () => {
    if (posts.length) return;
    const sample: Post = {
      id: crypto.randomUUID(),
      title: 'Hello, Amsterdam',
      slug: 'hello-amsterdam',
      date: today(),
      coverUrl:
        'https://images.unsplash.com/photo-1473959383410-b635452efc06?q=80&w=1200&auto=format&fit=crop',
      tags: ['arrival', 'first-week'],
      body:
        `*I made it.* Bikes everywhere, clouds playing nice.\n\n` +
        `First stop: **Winkel 43** for the apple pie. Then a sunset loop along the Jordaan.\n\n` +
        `Plans: museums, markets, and mapping my favorite stoops.`,
    };
    setPosts([sample]);
  };

  // form pieces
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentNames, setCommentNames] = useState<Record<string, string>>({});

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
      {/* Editor */}
      <Section
        title={editing ? 'Edit post' : 'Write a post'}
        desc="Markdown-ish: *italic*, **bold**, `code`. Cover is optional."
        actions={
          <>
            <OutlineButton onClick={seedSample} disabled={!!posts.length}>
              Add sample post
            </OutlineButton>
            <OutlineButton onClick={startNew}>New</OutlineButton>
          </>
        }
      >
        <div className="grid gap-2">
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Post title"
            className="px-3 py-2 rounded-xl border border-black/10"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={draft.date}
              onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              placeholder="YYYY-MM-DD"
              className="px-3 py-2 rounded-xl border border-black/10"
              type="date"
            />
            <input
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              placeholder="slug (optional — auto if blank)"
              className="px-3 py-2 rounded-xl border border-black/10"
            />
          </div>
          <input
            value={draft.coverUrl || ''}
            onChange={(e) => setDraft((d) => ({ ...d, coverUrl: e.target.value }))}
            placeholder="Cover image URL (optional)"
            className="px-3 py-2 rounded-xl border border-black/10"
          />
          <input
            value={draft.tags.join(', ')}
            onChange={(e) =>
              setDraft((d) => ({ ...d, tags: e.target.value.split(',').map((s) => s.trim()) }))
            }
            placeholder="tags, comma, separated"
            className="px-3 py-2 rounded-xl border border-black/10"
          />
          <textarea
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
            placeholder="Write your story…"
            className="px-3 py-2 rounded-xl border border-black/10 min-h-[160px]"
          />
          <div className="flex gap-2">
            <Button onClick={saveDraft}>{editing ? 'Save changes' : 'Publish'}</Button>
            {editing && <OutlineButton onClick={cancelEdit}>Cancel</OutlineButton>}
          </div>

          {/* Live preview */}
          {(draft.body || draft.coverUrl) && (
            <div className="mt-3 rounded-2xl border border-black/10 overflow-hidden">
              {draft.coverUrl ? (
                <img src={draft.coverUrl} alt="" className="w-full h-48 object-cover" />
              ) : null}
              <div className="p-4">
                <div className="text-sm text-neutral-500">{draft.date}</div>
                <h3 className="font-semibold text-lg mt-1">{draft.title || 'Untitled'}</h3>
                <div
                  className="prose prose-sm max-w-none text-neutral-800 mt-2"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(draft.body) }}
                />
                {draft.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {draft.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full border border-black/10 bg-white"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Posts list */}
      <Section
        title="Posts"
        actions={
          <div className="flex flex-wrap gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, body, tag…"
              className="px-3 py-2 rounded-xl border border-black/10"
            />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="px-3 py-2 rounded-xl border border-black/10"
            >
              <option value="all">All tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  #{t}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'new' | 'old')}
              className="px-3 py-2 rounded-xl border border-black/10"
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>
          </div>
        }
      >
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-sm text-neutral-500">No posts yet. Write your first one!</div>
          )}
          {filtered.map((p) => {
            const comments = commentsMap[p.id] || [];
            const preview = p.body.slice(0, 240);
            const [expanded, setExpanded] = useState(false); // per-item state via inline component

            // inline item component to keep per-row state
            function Item() {
              const [open, setOpen] = useState(expanded);
              const [name, setName] = useState(commentNames[p.id] || '');
              const [text, setText] = useState(commentDrafts[p.id] || '');

              const submit = () => {
                addComment(p.id, name, text);
                setText('');
                setCommentDrafts((d) => ({ ...d, [p.id]: '' }));
                setCommentNames((n) => ({ ...n, [p.id]: name }));
              };

              return (
                <article className="rounded-2xl border border-black/10 bg-white overflow-hidden">
                  {p.coverUrl && (
                    <img src={p.coverUrl} alt="" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <div className="text-xs text-neutral-500">{p.date}</div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-full border border-black/10 bg-white"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {!open ? (
                      <>
                        <p className="text-sm text-neutral-700 mt-2">
                          {preview}
                          {p.body.length > preview.length ? '…' : ''}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <OutlineButton onClick={() => setOpen(true)}>Read</OutlineButton>
                          <OutlineButton onClick={() => startEdit(p)}>Edit</OutlineButton>
                          <OutlineButton onClick={() => removePost(p.id)}>Delete</OutlineButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="prose prose-sm max-w-none text-neutral-800 mt-2"
                          dangerouslySetInnerHTML={{ __html: mdToHtml(p.body) }}
                        />
                        <div className="mt-3 flex gap-2">
                          <OutlineButton onClick={() => setOpen(false)}>Close</OutlineButton>
                          <OutlineButton onClick={() => startEdit(p)}>Edit</OutlineButton>
                          <OutlineButton onClick={() => removePost(p.id)}>Delete</OutlineButton>
                          <a
                            className="px-3 py-2 rounded-xl text-sm border border-black/10"
                            href={`/blog/${p.slug}`}
                            onClick={(e) => e.preventDefault()}
                            title="In production, this will link to the full post page."
                          >
                            Permalink
                          </a>
                        </div>

                        {/* Comments */}
                        <div className="mt-4 border-t border-black/10 pt-3">
                          <div className="text-xs text-neutral-500 mb-1">
                            {comments.length} comment{comments.length === 1 ? '' : 's'}
                          </div>
                          <div className="space-y-2">
                            {comments.map((c) => (
                              <div key={c.id} className="text-sm">
                                <span className="font-medium">{c.name}</span>{' '}
                                <span className="text-neutral-500 text-xs">
                                  {new Date(c.when).toLocaleString()}
                                </span>
                                <div>{c.text}</div>
                              </div>
                            ))}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="px-3 py-2 rounded-xl border border-black/10"
                              />
                              <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Write a comment…"
                                className="flex-1 px-3 py-2 rounded-xl border border-black/10"
                              />
                              <OutlineButton onClick={submit}>Post</OutlineButton>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            }

            // render the inline component
            return <Item key={p.id} />;
          })}
        </div>
      </Section>
    </div>
  );
}