(function () {
  'use strict';

  const SKILLS = window.SKILLS;
  const ROLES = window.ROLES;
  const app = document.getElementById('app');
  const panel = document.getElementById('panel');
  const backdrop = document.getElementById('backdrop');

  // ---------- utilities ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rich = (s) => esc(s).replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  let progress = store.get('air:progress', {});
  const saveProgress = () => store.set('air:progress', progress);
  const skillState = (id) => {
    if (!progress[id]) progress[id] = { checks: [], verified: false };
    return progress[id];
  };
  const isVerified = (id) => !!(progress[id] && progress[id].verified);

  const RISK = {
    high:   { label: 'High AI-trap risk',   short: 'High',   dot: 'bg-rose-500',   chip: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30', bar: 3 },
    medium: { label: 'Medium AI-trap risk', short: 'Medium', dot: 'bg-amber-500',  chip: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30', bar: 2 },
    low:    { label: 'Low AI-trap risk',    short: 'Low',    dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30', bar: 1 }
  };

  // ---------- theme ----------
  document.getElementById('themeToggle').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    // Stored as a raw string because the boot script in <head> reads it directly
    try { localStorage.setItem('air:theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  // ---------- search ----------
  function searchRoles(q) {
    const query = q.trim().toLowerCase();
    if (!query) return { matches: ROLES.slice(), exact: true, all: true };
    const tokens = query.split(/[\s,/]+/).filter((t) => t.length > 1);
    const scored = ROLES.map((r) => {
      const title = r.title.toLowerCase();
      let s = title.includes(query) ? 10 : 0;
      tokens.forEach((t) => {
        if (title.includes(t)) s += 3;
        if (r.keywords.some((k) => k === t)) s += 2;
        else if (r.keywords.some((k) => k.includes(t) || t.includes(k))) s += 1;
        // skill-level match, e.g. "pandas" or "airflow"
        r.stages.forEach((st) => st.skills.forEach((id) => {
          if (SKILLS[id].title.toLowerCase().includes(t)) s += 0.5;
        }));
      });
      return { r, s };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
    if (!scored.length) return { matches: ROLES.slice(), exact: false, all: true };
    return { matches: scored.map((x) => x.r), exact: true, all: false };
  }

  // ---------- router ----------
  let genTimer = null;
  function route() {
    clearTimeout(genTimer);
    closePanel(true);
    const hash = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = hash.split('?');
    const params = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    window.scrollTo(0, 0);

    if (parts[0] === 'roles') return renderSelect(params.get('q') || '');
    if (parts[0] === 'generating' && findRole(parts[1])) return renderGenerating(findRole(parts[1]));
    if (parts[0] === 'roadmap' && findRole(parts[1])) return renderRoadmap(findRole(parts[1]));
    return renderSearch();
  }
  const findRole = (id) => ROLES.find((r) => r.id === id);
  window.addEventListener('hashchange', route);

  // ---------- Page 1: search ----------
  function renderSearch() {
    document.title = 'AI-Resistant Roadmaps';
    const popular = ['Junior Data Analyst', 'Python Developer', 'ML Engineer', 'Data Engineer'];
    app.innerHTML = `
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"></div>
        <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20"></div>
        <div class="relative mx-auto max-w-3xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center fade-in">
          <span class="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-white/70 dark:bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> For CS &amp; Data Science students
          </span>
          <h1 class="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Learn the skills.<br/><span class="text-indigo-600 dark:text-indigo-400">Prove them without AI.</span>
          </h1>
          <p class="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Search a role to see what employers actually ask for, where students usually lean on ChatGPT or Copilot instead of learning, and the off-AI challenges that prove you've got it.
          </p>
          <form id="searchForm" class="mt-10 relative max-w-2xl mx-auto" role="search">
            <label for="q" class="sr-only">Search roles</label>
            <div class="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/5 dark:shadow-black/30 p-2 focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition">
              <svg class="w-5 h-5 ml-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input id="q" name="q" autocomplete="off" autofocus
                class="flex-1 min-w-0 bg-transparent py-3 text-base outline-none placeholder:text-slate-400"
                placeholder="Search your role... (e.g., Junior Data Analyst, Python Developer, ML Engineer)" />
              <button type="submit" class="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold px-4 sm:px-6 py-3 transition">
                <span class="hidden sm:inline">Search</span>
                <svg class="w-5 h-5 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            </div>
          </form>
          <div class="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            <span class="text-slate-500 py-1">Popular:</span>
            ${popular.map((p) => `<a href="#/roles?q=${encodeURIComponent(p)}" class="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition">${esc(p)}</a>`).join('')}
          </div>
        </div>
      </section>
      <section class="mx-auto max-w-5xl px-4 pb-20 grid sm:grid-cols-3 gap-4">
        ${[
          ['1', 'Real requirements', 'Skills extracted from job descriptions, with how often each one shows up.'],
          ['2', '⚠️ The AI Trap', 'Where students typically fake a skill with ChatGPT or Copilot — and the warning signs.'],
          ['3', '🛡️ Verification', 'A concrete off-AI drill with pass criteria. Check them off as you prove mastery.']
        ].map(([n, t, d]) => `
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div class="text-xs font-mono text-indigo-600 dark:text-indigo-400">0${n}</div>
            <div class="mt-1 font-semibold">${t}</div>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">${d}</p>
          </div>`).join('')}
      </section>`;
    document.getElementById('searchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      location.hash = '#/roles?q=' + encodeURIComponent(document.getElementById('q').value.trim());
    });
  }

  // ---------- Page 2: role selection ----------
  function renderSelect(q) {
    document.title = 'Select your role · AI-Resistant Roadmaps';
    const { matches, exact, all } = searchRoles(q);
    const note = !q.trim()
      ? `Showing all ${matches.length} roles.`
      : exact
        ? `${matches.length} match${matches.length === 1 ? '' : 'es'} for <span class="font-medium text-slate-900 dark:text-white">“${esc(q)}”</span>.`
        : `No exact match for <span class="font-medium text-slate-900 dark:text-white">“${esc(q)}”</span> — here are all roles.`;
    app.innerHTML = `
      <section class="mx-auto max-w-6xl px-4 py-10 sm:py-14 fade-in">
        <form id="refine" class="flex items-center gap-2 max-w-xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 focus-within:ring-4 focus-within:ring-indigo-500/20">
          <svg class="w-4 h-4 ml-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="q2" value="${esc(q)}" class="flex-1 min-w-0 bg-transparent py-2 text-sm outline-none placeholder:text-slate-400" placeholder="Search your role..." />
          <button class="rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium px-3 py-2 hover:bg-slate-700 dark:hover:bg-slate-600">Search</button>
        </form>
        <h1 class="mt-8 text-3xl sm:text-4xl font-bold tracking-tight">Select your role:</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-400">${note}</p>
        <div id="roleGrid" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${matches.map((r, i) => roleCard(r, i, !all && i === 0)).join('')}
        </div>
      </section>`;
    document.getElementById('refine').addEventListener('submit', (e) => {
      e.preventDefault();
      location.hash = '#/roles?q=' + encodeURIComponent(document.getElementById('q2').value.trim());
    });
    app.querySelectorAll('[data-role]').forEach((btn) => btn.addEventListener('click', () => {
      app.querySelectorAll('[data-role]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      setTimeout(() => { location.hash = '#/generating/' + btn.dataset.role; }, 280);
    }));
  }

  function roleCard(r, i, best) {
    const ids = [...new Set(r.stages.flatMap((s) => s.skills))];
    const high = ids.filter((id) => SKILLS[id].risk === 'high').length;
    const done = ids.filter(isVerified).length;
    return `
      <button type="button" data-role="${r.id}" aria-pressed="false"
        class="group relative text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition
               hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-500/50
               aria-pressed:border-indigo-500 aria-pressed:ring-4 aria-pressed:ring-indigo-500/25 aria-pressed:bg-indigo-50 dark:aria-pressed:bg-indigo-500/10
               focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-500">Role ${i + 1}</span>
          ${best ? '<span class="text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Best match</span>' : ''}
        </div>
        <div class="mt-2 text-lg font-semibold leading-snug">${esc(r.title)}</div>
        <div class="text-xs text-slate-500 mt-0.5">${esc(r.level)}</div>
        <p class="mt-3 text-sm text-slate-600 dark:text-slate-400">${esc(r.summary)}</p>
        <div class="mt-4 flex flex-wrap gap-1.5">
          ${ids.slice(0, 3).map((id) => `<span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${esc(SKILLS[id].title)}</span>`).join('')}
          <span class="text-[11px] px-2 py-0.5 text-slate-500">+${ids.length - 3} more</span>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>${ids.length} skills · <span class="text-rose-600 dark:text-rose-400">${high} high-risk</span></span>
          ${done ? `<span class="text-emerald-600 dark:text-emerald-400">${done} verified</span>` : `<span class="opacity-0 group-hover:opacity-100 transition text-indigo-600 dark:text-indigo-400 font-medium">Generate →</span>`}
        </div>
        <span class="absolute top-4 right-4 hidden group-aria-pressed:grid w-6 h-6 place-items-center rounded-full bg-indigo-600 text-white">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>
        </span>
      </button>`;
  }

  // ---------- Page 3: generating ----------
  function renderGenerating(role) {
    document.title = 'Generating… · AI-Resistant Roadmaps';
    const steps = [
      `Parsing ${role.postings.toLocaleString()} job descriptions`,
      'Extracting core technical competencies',
      'Flagging common AI over-reliance patterns'
    ];
    app.innerHTML = `
      <section class="mx-auto max-w-md px-4 py-28 sm:py-36 text-center fade-in" aria-live="polite">
        <div class="mx-auto w-14 h-14 rounded-full border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 spin"></div>
        <h1 class="mt-8 text-lg sm:text-xl font-semibold">Generating your AI-Resistant roadmap based on current job descriptions...</h1>
        <p class="mt-2 text-sm text-slate-500">${esc(role.title)}</p>
        <ul class="mt-8 space-y-2 text-sm text-left inline-block">
          ${steps.map((s, i) => `
            <li data-step="${i}" class="flex items-center gap-2 text-slate-400 dark:text-slate-600 transition-colors duration-300">
              <span class="w-4 h-4 grid place-items-center rounded-full border border-current"><span class="w-1.5 h-1.5 rounded-full bg-current"></span></span>${esc(s)}
            </li>`).join('')}
        </ul>
      </section>`;
    steps.forEach((_, i) => setTimeout(() => {
      const el = app.querySelector(`[data-step="${i}"]`);
      if (el) el.className = 'flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-colors duration-300';
    }, 150 + i * 450));
    genTimer = setTimeout(() => location.replace('#/roadmap/' + role.id), 1500);
  }

  // ---------- Page 4: roadmap ----------
  let current = null; // { role, order: [skillIds], filter }

  function renderRoadmap(role) {
    document.title = role.title + ' roadmap · AI-Resistant Roadmaps';
    const order = role.stages.flatMap((s) => s.skills);
    current = { role, order, filter: current && current.role.id === role.id ? current.filter : 'all' };

    app.innerHTML = `
      <section class="mx-auto max-w-7xl px-4 py-8 sm:py-10 fade-in">
        <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <a href="#/" class="hover:text-indigo-600">Search</a><span>/</span>
          <a href="#/roles?q=" class="hover:text-indigo-600">Roles</a><span>/</span>
          <span class="text-slate-900 dark:text-slate-200">${esc(role.title)}</span>
        </div>
        <div class="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">${esc(role.title)}</h1>
            <p class="mt-2 text-slate-600 dark:text-slate-400">${esc(role.summary)} Click any node to see the requirements, the AI trap and your verification challenge.</p>
          </div>
          <div id="stats" class="grid grid-cols-3 gap-3 w-full lg:w-auto"></div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex rounded-xl bg-slate-200/60 dark:bg-slate-800/80 p-1 text-sm" role="tablist" aria-label="Filter nodes">
            ${[['all', 'All skills'], ['high', 'High AI-risk'], ['todo', 'Not verified']].map(([k, l]) =>
              `<button data-filter="${k}" role="tab" class="px-3 py-1.5 rounded-lg font-medium transition">${l}</button>`).join('')}
          </div>
          <div class="flex items-center gap-4 text-xs text-slate-500">
            ${['high', 'medium', 'low'].map((k) => `<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ${RISK[k].dot}"></span>${RISK[k].short}<span class="hidden sm:inline">&nbsp;AI-trap risk</span></span>`).join('')}
          </div>
        </div>

        <div id="map" class="relative mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 grid-bg px-4 sm:px-8 py-10 overflow-hidden">
          <svg id="wires" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></svg>
          <div class="relative flex flex-col items-center">
            <div data-anchor="start" class="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-5 py-2 shadow">Start here</div>
            ${role.stages.map((st, si) => stageBlock(st, si)).join('')}
            <div data-anchor="end" class="mt-14 rounded-full border-2 border-dashed border-emerald-500/60 text-emerald-700 dark:text-emerald-300 text-sm font-semibold px-5 py-2 bg-white dark:bg-slate-900">🎯 Interview-ready: ${esc(role.title)}</div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3 justify-between text-sm">
          <a href="#/roles?q=" class="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">← Choose a different role</a>
          <button id="resetProgress" class="text-slate-500 hover:text-rose-600">Reset my progress for this role</button>
        </div>
      </section>`;

    app.querySelectorAll('[data-skill]').forEach((b) => b.addEventListener('click', () => openPanel(b.dataset.skill)));
    app.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => { current.filter = b.dataset.filter; applyFilter(); }));
    document.getElementById('resetProgress').addEventListener('click', () => {
      if (!confirm('Reset verification progress for every skill in this roadmap?')) return;
      order.forEach((id) => delete progress[id]);
      saveProgress();
      refreshRoadmap();
    });
    refreshRoadmap();
  }

  function stageBlock(st, si) {
    const half = Math.ceil(st.skills.length / 2);
    const left = st.skills.slice(0, half), right = st.skills.slice(half);
    return `
      <div class="w-full mt-14" data-stage="${si}">
        <div class="flex justify-start md:justify-center">
          <div data-anchor="stage-${si}" class="relative z-10 rounded-xl bg-indigo-600 text-white px-4 py-2.5 shadow-lg shadow-indigo-600/20">
            <div class="text-[10px] font-mono uppercase tracking-widest text-indigo-200">Stage ${si + 1}</div>
            <div class="font-semibold">${esc(st.name)}</div>
          </div>
        </div>
        <div class="mt-6 md:mt-[-3.25rem] grid gap-3 pl-10 md:pl-0 md:grid-cols-[1fr_220px_1fr] md:gap-x-10">
          <div class="flex flex-col gap-3 md:items-end">${left.map(nodeCard).join('')}</div>
          <div class="hidden md:block"></div>
          <div class="flex flex-col gap-3 md:items-start">${right.map(nodeCard).join('')}</div>
        </div>
      </div>`;
  }

  function nodeCard(id) {
    const s = SKILLS[id];
    const r = RISK[s.risk];
    return `
      <button type="button" data-skill="${id}" data-risk="${s.risk}"
        class="node group relative w-full md:w-64 text-left rounded-xl border bg-white dark:bg-slate-900 px-4 py-3 transition
               border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-md
               focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30">
        <div class="flex items-start justify-between gap-2">
          <div class="font-semibold text-sm leading-snug">${esc(s.title)}</div>
          <span class="verified-badge hidden shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white grid place-items-center" title="Verified">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>
          </span>
        </div>
        <div class="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
          <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full ${r.dot}"></span>${r.short} risk</span>
          <span>·</span><span>${s.freq}% of postings</span>
        </div>
      </button>`;
  }

  function refreshRoadmap() {
    if (!current) return;
    const ids = current.order;
    const done = ids.filter(isVerified).length;
    const high = ids.filter((id) => SKILLS[id].risk === 'high').length;
    const pct = Math.round((done / ids.length) * 100);
    const stats = document.getElementById('stats');
    if (stats) stats.innerHTML = [
      ['Postings analyzed', current.role.postings.toLocaleString(), ''],
      ['High AI-risk skills', `${high}<span class="text-sm text-slate-400">/${ids.length}</span>`, 'text-rose-600 dark:text-rose-400'],
      ['Verified', `${pct}%`, 'text-emerald-600 dark:text-emerald-400']
    ].map(([l, v, c], i) => `
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 min-w-0">
        <div class="text-[11px] text-slate-500 truncate">${l}</div>
        <div class="text-xl font-bold ${c}">${v}</div>
        ${i === 2 ? `<div class="mt-1.5 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div class="h-full bg-emerald-500 transition-all" style="width:${pct}%"></div></div>` : ''}
      </div>`).join('');
    app.querySelectorAll('[data-skill]').forEach((b) => {
      const v = isVerified(b.dataset.skill);
      b.querySelector('.verified-badge').classList.toggle('hidden', !v);
      b.querySelector('.verified-badge').classList.toggle('grid', v);
      b.classList.toggle('!border-emerald-400', v);
      b.classList.toggle('dark:!border-emerald-500/60', v);
    });
    applyFilter();
  }

  function applyFilter() {
    const f = current.filter;
    app.querySelectorAll('[data-filter]').forEach((b) => {
      const on = b.dataset.filter === f;
      b.setAttribute('aria-selected', on);
      b.className = 'px-3 py-1.5 rounded-lg font-medium transition ' + (on
        ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white');
    });
    app.querySelectorAll('[data-skill]').forEach((b) => {
      const id = b.dataset.skill;
      const match = f === 'all' || (f === 'high' && SKILLS[id].risk === 'high') || (f === 'todo' && !isVerified(id));
      b.classList.toggle('opacity-30', !match);
      b.classList.toggle('saturate-0', !match);
    });
    drawWires();
  }

  // Connector lines between start → stages → skills → end.
  function drawWires() {
    const map = document.getElementById('map');
    const svg = document.getElementById('wires');
    if (!map || !svg) return;
    const box = map.getBoundingClientRect();
    const rel = (el) => {
      const r = el.getBoundingClientRect();
      return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, cx: r.left - box.left + r.width / 2, cy: r.top - box.top + r.height / 2 };
    };
    const desktop = window.innerWidth >= 768;
    const spine = [map.querySelector('[data-anchor="start"]'), ...map.querySelectorAll('[data-anchor^="stage-"]'), map.querySelector('[data-anchor="end"]')].map(rel);
    let d = '';
    const spineX = desktop ? null : spine[1].l + 18;
    for (let i = 0; i < spine.length - 1; i++) {
      const a = spine[i], b = spine[i + 1];
      if (desktop) d += `M${a.cx},${a.b} C${a.cx},${(a.b + b.t) / 2} ${b.cx},${(a.b + b.t) / 2} ${b.cx},${b.t} `;
      else d += `M${spineX},${a.b} L${spineX},${b.t} `;
    }
    let branches = '';
    map.querySelectorAll('[data-stage]').forEach((stEl) => {
      const st = rel(stEl.querySelector('[data-anchor]'));
      stEl.querySelectorAll('[data-skill]').forEach((n) => {
        const p = rel(n);
        const dim = n.classList.contains('opacity-30');
        let path;
        if (desktop) {
          const right = p.cx > st.cx;
          const x1 = right ? st.r : st.l, x2 = right ? p.l : p.r, mx = (x1 + x2) / 2;
          path = `M${x1},${st.cy} C${mx},${st.cy} ${mx},${p.cy} ${x2},${p.cy}`;
        } else {
          path = `M${spineX},${st.b} L${spineX},${p.cy - 10} Q${spineX},${p.cy} ${spineX + 10},${p.cy} L${p.l},${p.cy}`;
        }
        branches += `<path d="${path}" fill="none" stroke-width="1.75" class="${dim ? 'stroke-slate-300/50 dark:stroke-slate-700/50' : 'stroke-indigo-400/70 dark:stroke-indigo-400/50'}"/>`;
      });
    });
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.innerHTML = `<path d="${d}" fill="none" stroke-width="2.5" class="stroke-indigo-500/80 dark:stroke-indigo-400/70 line-draw"/>${branches}`;
  }
  let rz;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(drawWires); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWires);

  // ---------- Skill panel ----------
  let openId = null, timer = null, timerEnd = 0, lastFocus = null;

  function openPanel(id) {
    const s = SKILLS[id];
    if (!s) return;
    if (openId !== id) stopTimer();
    if (!openId) lastFocus = document.activeElement;
    openId = id;
    const st = skillState(id);
    const r = RISK[s.risk];
    const idx = current.order.indexOf(id);
    const prev = current.order[idx - 1], next = current.order[idx + 1];
    const stage = current.role.stages.find((x) => x.skills.includes(id));

    panel.innerHTML = `
      <div class="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div class="min-w-0">
          <div class="md:hidden mx-auto -mt-2 mb-3 w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div class="text-xs text-slate-500">${esc(stage.name)} · ${esc(s.category)}</div>
          <h2 id="panelTitle" class="mt-0.5 text-xl font-bold tracking-tight">${esc(s.title)}</h2>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${r.chip}"><span class="w-1.5 h-1.5 rounded-full ${r.dot}"></span>${r.label}</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">In ${s.freq}% of postings</span>
          </div>
        </div>
        <button data-close class="shrink-0 w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close panel">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto panel-scroll px-5 sm:px-6 py-5 space-y-6">
        <section>
          <h3 class="text-sm font-semibold flex items-center gap-2">📋 Key Technical Requirements</h3>
          <ul class="mt-3 space-y-2">
            ${s.reqs.map((q) => `<li class="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300"><svg class="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg><span>${rich(q)}</span></li>`).join('')}
          </ul>
          <figure class="mt-3 rounded-lg border-l-4 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm">
            <blockquote class="italic text-slate-600 dark:text-slate-400">“${esc(s.jd)}”</blockquote>
            <figcaption class="mt-1 text-[11px] text-slate-500">Typical wording in ${esc(current.role.title)} postings</figcaption>
          </figure>
        </section>

        <section class="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4">
          <h3 class="text-sm font-semibold text-amber-900 dark:text-amber-200">⚠️ The AI Trap</h3>
          <p class="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90 leading-relaxed">${rich(s.trap)}</p>
          <div class="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-800/80 dark:text-amber-300/80">You might be in the trap if…</div>
          <ul class="mt-1.5 space-y-1.5">
            ${s.flags.map((f) => `<li class="flex gap-2 text-sm text-amber-900/90 dark:text-amber-100/90"><span aria-hidden="true">🚩</span><span>${rich(f)}</span></li>`).join('')}
          </ul>
        </section>

        <section class="rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/60 dark:bg-indigo-500/10 p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-indigo-900 dark:text-indigo-200">🛡️ The Independent Verification Challenge</h3>
              <div class="mt-0.5 font-semibold">${esc(s.challenge.title)}</div>
            </div>
            <div class="text-right shrink-0">
              <div id="timerDisplay" class="font-mono text-lg tabular-nums">${s.challenge.time}:00</div>
              <button id="timerBtn" class="text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:underline">Start timer</button>
            </div>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">${rich(s.challenge.prompt)}</p>
          <div class="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">🚫 No ChatGPT / Copilot / autocomplete</span>
            <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">⏱ ${s.challenge.time} min timebox</span>
            <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">📖 Official docs allowed only where stated</span>
          </div>
          <div class="mt-4 text-xs font-semibold uppercase tracking-wide text-indigo-900/70 dark:text-indigo-300/80">Pass criteria — be honest</div>
          <div class="mt-2 space-y-2">
            ${s.challenge.criteria.map((c, i) => `
              <label class="flex gap-3 items-start rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2.5 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-500/10">
                <input type="checkbox" data-crit="${i}" ${st.checks[i] ? 'checked' : ''} class="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0" />
                <span class="text-sm">${rich(c)}</span>
              </label>`).join('')}
          </div>
          <button id="verifyBtn" class="mt-4 w-full rounded-xl font-semibold py-2.5 transition"></button>
        </section>
      </div>

      <div class="flex items-center justify-between gap-2 px-5 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 text-sm">
        <button data-nav="${prev || ''}" ${prev ? '' : 'disabled'} class="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none truncate max-w-[45%]">← ${prev ? esc(SKILLS[prev].title) : ''}</button>
        <span class="text-xs text-slate-500 shrink-0">${idx + 1} / ${current.order.length}</span>
        <button data-nav="${next || ''}" ${next ? '' : 'disabled'} class="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none truncate max-w-[45%]">${next ? esc(SKILLS[next].title) : ''} →</button>
      </div>`;

    panel.querySelector('[data-close]').addEventListener('click', () => closePanel());
    panel.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => b.dataset.nav && openPanel(b.dataset.nav)));
    panel.querySelectorAll('[data-crit]').forEach((cb) => cb.addEventListener('change', () => {
      st.checks[+cb.dataset.crit] = cb.checked;
      if (!cb.checked) st.verified = false;
      saveProgress(); updateVerifyBtn(); refreshRoadmap();
    }));
    document.getElementById('verifyBtn').addEventListener('click', () => {
      const all = s.challenge.criteria.every((_, i) => st.checks[i]);
      if (!all) return;
      st.verified = !st.verified;
      saveProgress(); updateVerifyBtn(); refreshRoadmap();
    });
    document.getElementById('timerBtn').addEventListener('click', toggleTimer);
    updateVerifyBtn();
    if (timer) tick();

    app.querySelectorAll('[data-skill]').forEach((b) => {
      const on = b.dataset.skill === id;
      b.classList.toggle('ring-4', on);
      b.classList.toggle('ring-indigo-500/30', on);
      b.classList.toggle('!border-indigo-500', on);
    });

    panel.classList.remove('translate-y-full', 'md:translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    panel.querySelector('.panel-scroll').scrollTop = 0;
    panel.querySelector('[data-close]').focus({ preventScroll: true });
  }

  function updateVerifyBtn() {
    const s = SKILLS[openId], st = skillState(openId);
    const n = s.challenge.criteria.filter((_, i) => st.checks[i]).length;
    const total = s.challenge.criteria.length;
    const btn = document.getElementById('verifyBtn');
    if (!btn) return;
    if (st.verified) {
      btn.textContent = '✓ Verified — click to undo';
      btn.className = 'mt-4 w-full rounded-xl font-semibold py-2.5 transition bg-emerald-600 hover:bg-emerald-500 text-white';
    } else if (n === total) {
      btn.textContent = 'Mark skill as verified';
      btn.className = 'mt-4 w-full rounded-xl font-semibold py-2.5 transition bg-indigo-600 hover:bg-indigo-500 text-white';
    } else {
      btn.textContent = `Meet all criteria to verify (${n}/${total})`;
      btn.className = 'mt-4 w-full rounded-xl font-semibold py-2.5 transition bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed';
    }
  }

  function closePanel(silent) {
    if (!openId) return;
    openId = null;
    stopTimer();
    panel.classList.add('translate-y-full', 'md:translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    app.querySelectorAll('[data-skill]').forEach((b) => b.classList.remove('ring-4', 'ring-indigo-500/30', '!border-indigo-500'));
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  backdrop.addEventListener('click', () => closePanel());
  document.addEventListener('keydown', (e) => {
    if (!openId) return;
    if (e.key === 'Escape') closePanel();
    if (e.target.tagName === 'INPUT') return;
    const idx = current.order.indexOf(openId);
    if (e.key === 'ArrowRight' && current.order[idx + 1]) openPanel(current.order[idx + 1]);
    if (e.key === 'ArrowLeft' && current.order[idx - 1]) openPanel(current.order[idx - 1]);
  });

  // ---------- challenge timer ----------
  function toggleTimer() {
    if (timer) return stopTimer(true);
    timerEnd = Date.now() + SKILLS[openId].challenge.time * 60000;
    timer = setInterval(tick, 250);
    tick();
  }
  function stopTimer(keepDisplay) {
    clearInterval(timer); timer = null;
    const btn = document.getElementById('timerBtn');
    if (btn) btn.textContent = 'Start timer';
    if (!keepDisplay && openId) {
      const d = document.getElementById('timerDisplay');
      if (d) { d.textContent = SKILLS[openId].challenge.time + ':00'; d.classList.remove('text-rose-600'); }
    }
  }
  function tick() {
    const d = document.getElementById('timerDisplay'), btn = document.getElementById('timerBtn');
    if (!d) return;
    const left = Math.max(0, timerEnd - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    d.textContent = `${m}:${String(s).padStart(2, '0')}`;
    btn.textContent = 'Stop timer';
    if (left === 0) { clearInterval(timer); timer = null; d.classList.add('text-rose-600'); btn.textContent = "Time's up — restart"; }
  }

  route();
})();
