document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const icons = document.querySelectorAll('.icon');
  const windows = document.querySelectorAll('.window');
  const narrow = matchMedia('(max-width: 700px)');
  const coarse = matchMedia('(pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let highestZIndex = 100;

  const apps = {
    identity: 'bio-window',
    bsides: 'projects-window',
    research: 'research-window',
    lorenz: 'lorenz-window',
    network: 'socials-window',
    terminal: 'terminal-window',
    trash: 'trash-window',
  };

  const defaults = {
    'bio-window': [60, 40],
    'projects-window': [140, 420],
    'socials-window': [440, 100],
  };

  function placeDefaults() {
    if (narrow.matches) return;
    Object.entries(defaults).forEach(([id, [top, left]]) => {
      const w = $(id);
      w.style.top = `${top}px`;
      w.style.left = `${left}px`;
    });
  }

  placeDefaults();
  ['bio-window', 'projects-window', 'socials-window'].forEach(id => bringToFront($(id)));

  // ---------- Boot screen ----------
  const boot = $('boot');
  const bootLog = $('boot-log');
  const bootLines = [
    'ZAPATA BIOS v1.1  (c) 1991-2026 Zapata Corp.',
    'CPU: 1x Human/Nerd, Lvl. 40 ........ OK',
    'Memory test: 640K should be enough ... OK',
    'Detecting drives: /dev/docs /dev/boardgames /dev/research',
    'Loading identity.exe ................ OK',
    'Loading b-sides.log ................. OK',
    'Mounting research.pdf (read-only) ... OK',
    'Integrating Lorenz system (rho=28) .. chaotic, as expected',
    'Starting ZapataOS ...',
  ];
  let bootTimer = null;

  function finishBoot() {
    clearTimeout(bootTimer);
    boot.hidden = true;
    sessionStorage.setItem('zos-booted', '1');
    document.removeEventListener('keydown', finishBoot);
    boot.removeEventListener('click', finishBoot);
  }

  function runBoot() {
    if (reduced.matches) return;
    bootLog.textContent = '';
    boot.hidden = false;
    let i = 0;
    const next = () => {
      if (i < bootLines.length) {
        bootLog.textContent += bootLines[i++] + '\n';
        bootTimer = setTimeout(next, 140 + Math.random() * 120);
      } else {
        bootLog.textContent += '\n[press any key]';
        bootTimer = setTimeout(finishBoot, 500);
      }
    };
    next();
    document.addEventListener('keydown', finishBoot);
    boot.addEventListener('click', finishBoot);
  }

  if (!sessionStorage.getItem('zos-booted')) runBoot();

  // ---------- Menus ----------
  const menuItems = document.querySelectorAll('.menubar-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      menuItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  document.addEventListener('click', () => menuItems.forEach(i => i.classList.remove('open')));

  // ---------- Modal ----------
  const modal = $('system-modal');
  const modalText = $('modal-text');
  const modalBtn = $('modal-ok');

  function showModal(text) {
    modalText.innerText = text;
    modal.style.display = 'flex';
    modalBtn.focus();
  }
  const hideModal = () => { modal.style.display = 'none'; };
  modalBtn.addEventListener('click', hideModal);

  $('about-os').addEventListener('click', () => {
    showModal('ZapataOS 1.1.0\n[Strange Attractor Edition]\n\nApps: identity, b-sides, research, lorenz, network, terminal\nUptime: since 1985\nStatus: STABLE (mostly)');
  });

  $('reboot-os').addEventListener('click', () => {
    sessionStorage.removeItem('zos-booted');
    windows.forEach(w => { w.classList.remove('shaded'); });
    placeDefaults();
    runBoot();
  });

  $('tidy-up').addEventListener('click', () => {
    windows.forEach(w => w.classList.remove('shaded'));
    placeDefaults();
    let offset = 0;
    windows.forEach(w => {
      if (w.style.display === 'none' || defaults[w.id] || narrow.matches) return;
      w.style.top = `${90 + offset}px`;
      w.style.left = `${520 + offset}px`;
      offset += 28;
    });
  });

  $('system-clock').addEventListener('click', () => {
    showModal(new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  });

  // ---------- Leaving ----------
  const exitAction = () => { window.location.href = '../index.html'; };
  $('exit-os').addEventListener('click', exitAction);
  const returnIcon = $('return-icon');
  returnIcon.addEventListener('dblclick', exitAction);
  returnIcon.addEventListener('click', () => { if (coarse.matches) exitAction(); });
  returnIcon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); exitAction(); }
  });

  // ---------- Opening apps ----------
  function openWindow(id) {
    const win = $(id);
    if (!win) return;
    win.style.display = 'flex';
    win.classList.remove('shaded');
    bringToFront(win);
    if (narrow.matches) win.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (id === 'terminal-window') terminalInput.focus();
    if (id === 'lorenz-window') lorenz.start();
  }

  document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', () => openWindow(apps[el.dataset.open]));
  });

  icons.forEach(icon => {
    icon.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    });
    const id = icon.dataset.window;
    if (!id) return;
    icon.addEventListener('dblclick', (e) => { e.stopPropagation(); openWindow(id); });
    icon.addEventListener('click', () => { if (coarse.matches) openWindow(id); });
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWindow(id); }
    });
  });

  $('desktop').addEventListener('mousedown', (e) => {
    if (e.target.id === 'desktop') icons.forEach(i => i.classList.remove('selected'));
  });

  // ---------- Windows ----------
  function closeWindow(win) {
    win.style.display = 'none';
    win.classList.remove('active');
    if (win.id === 'lorenz-window') lorenz.stop();
  }

  windows.forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));

    win.querySelector('.close-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(win);
    });

    // Yellow button or double-click on the title bar rolls the window up, like Mac OS window shades.
    const shade = () => win.classList.toggle('shaded');
    win.querySelector('.min-btn').addEventListener('click', (e) => { e.stopPropagation(); shade(); });

    const titleBar = win.querySelector('.title-bar');
    titleBar.addEventListener('dblclick', (e) => {
      if (!e.target.classList.contains('title-bar-btn')) shade();
    });

    // Drag by the title bar (mouse, pen or touch). Phones get stacked windows instead.
    let offsetX = 0;
    let offsetY = 0;
    titleBar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.classList.contains('title-bar-btn') || narrow.matches) return;
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      bringToFront(win);
      titleBar.setPointerCapture(e.pointerId);
    });
    titleBar.addEventListener('pointermove', (e) => {
      if (!titleBar.hasPointerCapture(e.pointerId)) return;
      const maxLeft = Math.max(0, window.innerWidth - win.offsetWidth);
      const maxTop = Math.max(24, window.innerHeight - 28);
      win.style.left = `${Math.min(Math.max(0, e.clientX - offsetX), maxLeft)}px`;
      win.style.top = `${Math.min(Math.max(24, e.clientY - offsetY), maxTop)}px`;
    });
  });

  function bringToFront(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    if (win.classList.contains('active')) return;
    windows.forEach(w => w.classList.remove('active'));
    win.classList.add('active');
  }

  // Esc closes the modal, otherwise the active window.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !boot.hidden) return;
    if (modal.style.display === 'flex') return hideModal();
    const active = document.querySelector('.window.active');
    if (active && active.style.display !== 'none') closeWindow(active);
  });

  // ---------- Dice ----------
  function roll(n = 2, sides = 6) {
    const dice = Array.from({ length: n }, () => Math.floor(Math.random() * sides) + 1);
    return { dice, total: dice.reduce((a, b) => a + b, 0) };
  }

  $('roll-dice').addEventListener('click', () => {
    showModal('');
    modalText.innerHTML = '<div class="dice-animation">🎲 🎲</div>';
    setTimeout(() => {
      const { dice, total } = roll();
      modalText.innerText = `You rolled a ${dice[0]} and a ${dice[1]}.\nTotal: ${total}${total === 7 ? '\nThe robber moves. Sorry.' : ''}`;
    }, reduced.matches ? 0 : 900);
  });

  // ---------- Desktop pattern (remembered) ----------
  function setPattern(name) {
    document.body.classList.forEach(c => { if (c.startsWith('pattern-')) document.body.classList.remove(c); });
    document.body.classList.add(`pattern-${name}`);
    localStorage.setItem('zos-pattern', name);
  }
  setPattern(localStorage.getItem('zos-pattern') || 'dither');
  document.querySelectorAll('.pattern-ctrl').forEach(ctrl => {
    ctrl.addEventListener('click', () => setPattern(ctrl.dataset.pattern));
  });

  // ---------- Trash ----------
  $('empty-trash').addEventListener('click', () => {
    const list = $('trash-list');
    if (!list.children.length) return showModal("Trash is empty. You're a very organized user.");
    list.replaceChildren();
    $('trash-icon').querySelector('i').className = 'far fa-trash-can';
    showModal('5 items deleted.\nThe glassmorphism era is officially over.');
  });

  // ---------- Clock ----------
  function updateClock() {
    $('system-clock').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ---------- Terminal ----------
  const terminalInput = $('terminal-input');
  const terminalOutput = $('terminal-output');
  const history = [];
  let historyIndex = 0;

  const files = {
    'readme.txt': 'Welcome to ZapataOS. Nothing here is real except the links.',
    'hidden-secrets.txt': "1. The best documentation is the one people actually read.\n2. Catan's robber is always on my wheat.\n3. Docs-as-code, always.",
    'research.pdf': 'Binary file. Try: open research',
  };

  const commands = {
    help: () => [
      'help              this list',
      'whoami            who is this',
      'ls / cat <file>   look around',
      'open <app>        ' + Object.keys(apps).join(', '),
      'projects          side projects',
      'papers            publications',
      'docs              Chrome docs author page',
      'contact           email',
      'roll [NdM]        roll dice, e.g. roll 3d6',
      'lorenz [rho]      open Lorenz.app, optionally with rho',
      'pattern <name>    dither, grid, slate, terminal',
      'date, clear, reboot, exit',
    ].join('\n'),
    whoami: () => 'José Luis Zapata | Technical writer at Google, Munich | Lvl. 40 Human/Nerd',
    ls: () => Object.keys(files).join('  ') + '  identity.exe  b-sides.log  network.sh',
    cat: (arg) => files[arg] ?? (arg ? `cat: ${arg}: No such file` : 'usage: cat <file>'),
    open: (arg) => {
      if (!apps[arg]) return `open: unknown app '${arg ?? ''}'. Try: ${Object.keys(apps).join(', ')}`;
      openWindow(apps[arg]);
      return `Opening ${arg}...`;
    },
    projects: () => 'el Meeple (elmeeple.com), MTTN AutoSubs, MTTN PaperCraft Studio, Shelf Shuffler, technicalwriting.link, BufferBuffer, La Matatena. Run: open bsides',
    papers: () => '2020  Synchronization in Time-Varying and Evolving Complex Networks. Mathematics 8(11).\n2013  Synchronization of Complex Networks with Negative Couplings. PHYSCON 2013.\nRun: open research',
    docs: () => 'developer.chrome.com/authors/zapata',
    contact: () => 'joseluis@zapata131.com',
    roll: (arg = '2d6') => {
      const m = /^(\d{1,2})d(\d{1,3})$/.exec(arg);
      if (!m) return 'usage: roll NdM, e.g. roll 2d6';
      const { dice, total } = roll(+m[1], +m[2]);
      return `[${dice.join(', ')}] = ${total}`;
    },
    lorenz: (arg) => {
      openWindow(apps.lorenz);
      if (arg !== undefined && !Number.isNaN(+arg)) lorenz.setRho(+arg);
      return `Lorenz.app running with rho = ${lorenz.rho}`;
    },
    pattern: (arg) => {
      if (!['dither', 'grid', 'slate', 'terminal'].includes(arg)) return 'usage: pattern dither|grid|slate|terminal';
      setPattern(arg);
      return `Desktop pattern: ${arg}`;
    },
    date: () => new Date().toString(),
    hack: () => 'Bypassing firewalls... Accessing mainframe... [ACCESS DENIED]\nNice try.',
    sudo: () => 'Zapata is not in the sudoers file. This incident will be reported.',
    matatena: () => 'Board game reviews in Spanish: la-matatena.com',
    reboot: () => { setTimeout(() => $('reboot-os').click(), 300); return 'Rebooting...'; },
    exit: () => { setTimeout(exitAction, 300); return 'Bye.'; },
  };

  function print(text, cls) {
    const p = document.createElement('p');
    p.innerText = text;
    if (cls) p.className = cls;
    terminalOutput.insertBefore(p, terminalInput.parentElement);
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(0, Math.min(history.length, historyIndex + (e.key === 'ArrowUp' ? -1 : 1)));
      terminalInput.value = history[historyIndex] ?? '';
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const [cmd, arg] = terminalInput.value.toLowerCase().split(/\s+/);
      const pool = arg !== undefined
        ? (cmd === 'open' ? Object.keys(apps) : cmd === 'cat' ? Object.keys(files) : [])
        : Object.keys(commands);
      const word = arg !== undefined ? arg : cmd;
      const hits = pool.filter(w => w.startsWith(word));
      if (hits.length === 1) terminalInput.value = arg !== undefined ? `${cmd} ${hits[0]}` : `${hits[0]} `;
      else if (hits.length > 1) print(hits.join('  '));
      return;
    }

    if (e.key !== 'Enter') return;
    const raw = terminalInput.value.trim();
    terminalInput.value = '';
    print(`z:\\> ${raw}`, 'echo');
    if (!raw) return;
    history.push(raw);
    historyIndex = history.length;

    const [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
    if (cmd === 'clear') {
      terminalOutput.querySelectorAll('p').forEach(p => p.remove());
      return;
    }
    const fn = commands[cmd];
    print(fn ? fn(rest[0]) : `'${cmd}' is not recognized as an internal command. Type 'help'.`);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });

  terminalOutput.addEventListener('click', () => {
    if (!window.getSelection().toString()) terminalInput.focus();
  });

  // ---------- Lorenz.app ----------
  const lorenz = (() => {
    const canvas = $('lorenz-canvas');
    const ctx = canvas.getContext('2d');
    const rhoInput = $('rho');
    const rhoOut = $('rho-out');
    const status = $('lorenz-status');
    let pts = [], yaw = -0.7, pitch = -0.3, head = 0, raf = 0, drag = null, size = 0, dpr = 1;
    const api = { rho: 28 };

    function integrate(rho) {
      pts = [];
      let x = 1, y = 1, z = 1;
      const h = 0.006, f = (x, y, z) => [10 * (y - x), x * (rho - z) - y, x * y - (8 / 3) * z];
      for (let i = 0; i < 12500; i++) {
        const k1 = f(x, y, z);
        const k2 = f(x + h / 2 * k1[0], y + h / 2 * k1[1], z + h / 2 * k1[2]);
        const k3 = f(x + h / 2 * k2[0], y + h / 2 * k2[1], z + h / 2 * k2[2]);
        const k4 = f(x + h * k3[0], y + h * k3[1], z + h * k3[2]);
        x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        z += h / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
        if (i % 3 === 0) pts.push([x, y, z - 25]);
      }
      head = 0;
    }

    function setRho(rho) {
      rho = Math.max(0, Math.min(60, rho));
      api.rho = rho;
      rhoInput.value = rho;
      rhoOut.textContent = rho.toFixed(1);
      status.textContent = rho < 1 ? 'Everything falls to the origin.'
        : rho < 13.93 ? 'Settles to one of two fixed points.'
          : rho < 24.74 ? 'Loops for a while, then settles. Transient chaos.'
            : 'Chaos. Two wings, never the same loop twice.';
      integrate(rho);
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    }

    function project(p, s, w, h) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const X = p[0] * cy - p[1] * sy;
      const D = p[0] * sy + p[1] * cy;
      const Y = p[2] * cp - D * sp;
      return [w / 2 + X * s, h / 2 - Y * s];
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!drag && !reduced.matches) yaw += 0.004;
      head = (head + 4) % pts.length;
      const w = canvas.clientWidth, h = canvas.clientHeight, s = Math.min(w, h) / 62;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#1e1f29';
      ctx.fillRect(0, 0, w, h);
      ctx.lineJoin = 'round';

      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#bd93f9';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      pts.forEach((p, i) => { const [u, v] = project(p, s, w, h); i ? ctx.lineTo(u, v) : ctx.moveTo(u, v); });
      ctx.stroke();

      ctx.strokeStyle = '#ff79c6';
      ctx.lineWidth = 1.4;
      const tail = 160;
      for (let i = tail; i > 0; i -= 10) {
        ctx.globalAlpha = 1 - i / tail;
        ctx.beginPath();
        for (let j = Math.max(0, i - 11); j <= i; j++) {
          const [u, v] = project(pts[(head - j + pts.length) % pts.length], s, w, h);
          j === Math.max(0, i - 11) ? ctx.moveTo(u, v) : ctx.lineTo(u, v);
        }
        ctx.stroke();
      }
      const [hu, hv] = project(pts[head], s, w, h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ff79c6';
      ctx.beginPath();
      ctx.arc(hu, hv, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    canvas.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, y: e.clientY, yaw, pitch };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag || !canvas.hasPointerCapture(e.pointerId)) return;
      yaw = drag.yaw + (e.clientX - drag.x) * 0.015;
      pitch = Math.max(-1.4, Math.min(1.4, drag.pitch + (e.clientY - drag.y) * 0.015));
    });
    canvas.addEventListener('lostpointercapture', () => { drag = null; });
    rhoInput.addEventListener('input', () => setRho(+rhoInput.value));
    addEventListener('resize', resize);

    setRho(28);
    api.setRho = setRho;
    api.start = () => { resize(); if (!raf) frame(); };
    api.stop = () => { cancelAnimationFrame(raf); raf = 0; };
    return api;
  })();
});
