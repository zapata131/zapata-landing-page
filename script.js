// Theme: follow the system; the footer button flips what you see right now.
// Stored only when it differs from the system, so "undo" goes back to following it.
const meta = document.querySelector('meta[name="color-scheme"]');
const toggle = document.querySelector('.theme-toggle');
const systemDark = matchMedia('(prefers-color-scheme: dark)');

function rendered() {
    return meta.content === 'light dark' ? (systemDark.matches ? 'dark' : 'light') : meta.content;
}

function apply(value) {
    meta.content = value ?? 'light dark';
}

if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
        const target = rendered() === 'dark' ? 'light' : 'dark';
        const system = systemDark.matches ? 'dark' : 'light';
        try {
            if (target === system) localStorage.removeItem('color-scheme');
            else localStorage.setItem('color-scheme', target);
        } catch (e) { /* storage blocked: still switch for this visit */ }
        apply(target === system ? null : target);
    });
}

addEventListener('storage', (e) => {
    if (e.key === 'color-scheme') apply(e.newValue);
});

// One random quote in the footer.
const quotes = [
    { text: "Everything is a game. It's just a matter of whether you're playing it or it's playing you.", author: "Unknown" },
    { text: "When playing a game, the goal is to win, but it is the goal that is important, not the winning.", author: "Reiner Knizia" },
    { text: "We do not stop playing because we grow old, we grow old because we stop playing!", author: "Benjamin Franklin" },
    { text: "Everything is theoretically impossible, until it is done.", author: "Robert A. Heinlein" },
    { text: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton" },
    { text: "In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual.", author: "Galileo Galilei" },
    { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The art challenges the technology, and the technology inspires the art.", author: "John Lasseter" },
    { text: "Science is what we understand well enough to explain to a computer. Art is everything else we do.", author: "Donald Knuth" },
    { text: "Move fast and break things. Unless you are playing Jenga.", author: "Unknown" },
    { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
    { text: "In the box, you'll find everything you need to build a world.", author: "Unknown" },
    { text: "Technology is anything that wasn't around when you were born.", author: "Alan Kay" },
    { text: "Life is like a game of chess. To win you have to make a move.", author: "Unknown" },
    { text: "The most exciting phrase to hear in science, the one that heralds new discoveries, is not 'Eureka!' but 'That's funny...'", author: "Isaac Asimov" },
    { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
    { text: "There are only three forms of high art: the symphony, the illustrated children's book and the board game.", author: "Brian K. Vaughan" },
    { text: "Life is more fun if you play games.", author: "Roald Dahl" },
    { text: "It may not be enough to play a game well—you must also be sure you are playing the right game.", author: "Avinash K. Dixit" },
    { text: "Tactics is what you do when there is something to do; strategy is what you do when there is nothing to do.", author: "Savielly Tartakower" },
    { text: "The winner of the game is the player who makes the next-to-last mistake.", author: "Savielly Tartakower" },
    { text: "Science knows no country, because knowledge belongs to humanity.", author: "Louis Pasteur" },
    { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
    { text: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan" },
    { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
    { text: "Science never solves a problem without creating ten more.", author: "George Bernard Shaw" },
    { text: "If we knew what it was we were doing, it would not be called research, would it?", author: "Albert Einstein" },
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
    { text: "Everything should be made as simple as possible, but not simpler.", author: "Albert Einstein" },
    { text: "The real problem is not whether machines think but whether men do.", author: "B.F. Skinner" },
    { text: "The science of today is the technology of tomorrow.", author: "Edward Teller" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Technology, like art, is a soaring exercise of the human imagination.", author: "Daniel Bell" },
    { text: "Play is the highest form of research.", author: "Albert Einstein" },
    { text: "Board games: because sometimes, 'I'm bored' just means 'I need more dice.'", author: "Unknown" }
];

const box = document.getElementById('quote');
if (box) {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    box.textContent = `// “${q.text}”` + (q.author === 'Unknown' ? '' : ` — ${q.author}`);
    box.hidden = false;
}

// Lorenz attractor in 3D: slow spin, a bright point retracing the orbit, drag to turn it.
// Without JS (or with reduced motion) the static SVG mask from the CSS stays.
(() => {
    const host = document.querySelector('.lorenz');
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Integrate once (RK4, sigma 10, rho 28, beta 8/3), keep ~4000 points.
    const pts = [];
    let x = 1, y = 1, z = 1;
    const h = 0.006, f = (x, y, z) => [10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z];
    for (let i = 0; i < 12500; i++) {
        const k1 = f(x, y, z);
        const k2 = f(x + h / 2 * k1[0], y + h / 2 * k1[1], z + h / 2 * k1[2]);
        const k3 = f(x + h / 2 * k2[0], y + h / 2 * k2[1], z + h / 2 * k2[2]);
        const k4 = f(x + h * k3[0], y + h * k3[1], z + h * k3[2]);
        x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        z += h / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
        if (i > 500 && i % 3 === 0) pts.push([x, y, z - 25]);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    host.append(canvas);
    host.classList.add('live');

    let size = 0, dpr = 1;
    function resize() {
        dpr = Math.min(devicePixelRatio || 1, 2);
        size = host.clientWidth;
        canvas.width = canvas.height = Math.round(size * dpr);
    }
    resize();
    addEventListener('resize', resize);

    let colors = {};
    function readColors() {
        // Read resolved colors from the host (the custom properties hold light-dark(), which canvas can't parse)
        const cs = getComputedStyle(host);
        colors = { line: cs.color, head: cs.borderTopColor };
    }
    readColors();
    new MutationObserver(readColors).observe(document.head, { subtree: true, attributes: true });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);

    let yaw = -0.7, pitch = -0.3, spin = 0.0035, head = 0, dragging = null;

    canvas.addEventListener('pointerdown', (e) => {
        dragging = { x: e.clientX, y: e.clientY, yaw, pitch };
        canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!dragging || !canvas.hasPointerCapture(e.pointerId)) return;
        yaw = dragging.yaw + (e.clientX - dragging.x) * 0.02;
        pitch = Math.max(-1.3, Math.min(1.3, dragging.pitch + (e.clientY - dragging.y) * 0.02));
    });
    canvas.addEventListener('lostpointercapture', () => { dragging = null; });

    function project(p, cy, sy, cp, sp, s) {
        const X = p[0] * cy - p[1] * sy;
        const D = p[0] * sy + p[1] * cy;
        const Y = p[2] * cp - D * sp;
        return [size / 2 + X * s, size / 2 - Y * s];
    }

    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(host);

    function frame() {
        requestAnimationFrame(frame);
        if (!visible) return;
        if (!dragging) yaw += spin;
        head = (head + 3) % pts.length;

        const s = size / 64, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);
        ctx.lineJoin = 'round';

        // Whole attractor, faint
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        pts.forEach((p, i) => {
            const [u, v] = project(p, cy, sy, cp, sp, s);
            i ? ctx.lineTo(u, v) : ctx.moveTo(u, v);
        });
        ctx.stroke();

        // Bright tail following the orbit
        const tail = 140;
        ctx.strokeStyle = colors.head;
        ctx.lineWidth = 1.2;
        for (let i = tail; i > 0; i -= 10) {
            ctx.globalAlpha = 1 - i / tail;
            ctx.beginPath();
            for (let j = Math.max(0, i - 11); j <= i; j++) {
                const p = pts[(head - j + pts.length) % pts.length];
                const [u, v] = project(p, cy, sy, cp, sp, s);
                j === Math.max(0, i - 11) ? ctx.moveTo(u, v) : ctx.lineTo(u, v);
            }
            ctx.stroke();
        }
        const [hu, hv] = project(pts[head], cy, sy, cp, sp, s);
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.head;
        ctx.beginPath();
        ctx.arc(hu, hv, 1.8, 0, Math.PI * 2);
        ctx.fill();
    }
    requestAnimationFrame(frame);
})();
