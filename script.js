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
    // Games and play
    { text: "Everything is a game. It's just a matter of whether you're playing it or it's playing you.", author: "Unknown" },
    { text: "When playing a game, the goal is to win, but it is the goal that is important, not the winning.", author: "Reiner Knizia" },
    { text: "Life is a kind of chess, in which we have often points to gain, and competitors or adversaries to contend with.", author: "Benjamin Franklin" },
    { text: "Move fast and break things. Unless you are playing Jenga.", author: "Unknown" },
    { text: "In the box, you'll find everything you need to build a world.", author: "Unknown" },
    { text: "Life is like a game of chess. To win you have to make a move.", author: "Unknown" },
    { text: "There are only three forms of high art: the symphony, the illustrated children's book and the board game.", author: "Brian K. Vaughan" },
    { text: "Life is more fun if you play games.", author: "Roald Dahl" },
    { text: "It may not be enough to play a game well—you must also be sure you are playing the right game.", author: "Avinash Dixit and Barry Nalebuff" },
    { text: "Tactics is what you do when there is something to do; strategy is what you do when there is nothing to do.", author: "Savielly Tartakower" },
    { text: "The winner of the game is the player who makes the next-to-last mistake.", author: "Savielly Tartakower" },
    { text: "Combinatory play seems to be the essential feature in productive thought.", author: "Albert Einstein" },
    { text: "Board games: because sometimes, 'I'm bored' just means 'I need more dice.'", author: "Unknown" },
    { text: "Playing a game is the voluntary attempt to overcome unnecessary obstacles.", author: "Bernard Suits" },
    { text: "A game is a series of interesting decisions.", author: "Sid Meier" },
    { text: "Play is older than culture.", author: "Johan Huizinga" },
    { text: "Fun is just another word for learning.", author: "Raph Koster" },
    { text: "The opposite of play is not work. It's depression.", author: "Brian Sutton-Smith" },
    { text: "While all artists are not chess players, all chess players are artists.", author: "Marcel Duchamp" },
    { text: "God moves the player, and he in turn the piece. But what god beyond God begins the round of dust and time and sleep and agonies?", author: "Jorge Luis Borges" },
    { text: "Now, here, you see, it takes all the running you can do, to keep in the same place.", author: "Lewis Carroll" },
    { text: "Lose your first 50 games as quickly as possible.", author: "Go proverb" },

    // Sci-fi
    { text: "Everything is theoretically impossible, until it's done.", author: "Robert A. Heinlein" },
    { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
    { text: "I suggest a new strategy, R2: let the Wookiee win.", author: "C-3PO, Star Wars" },
    { text: "Never tell me the odds!", author: "Han Solo, The Empire Strikes Back" },
    { text: "A strange game. The only winning move is not to play. How about a nice game of chess?", author: "Joshua, WarGames" },
    { text: "This is the story of a man who went far away for a long time, just to play a game.", author: "Iain M. Banks" },
    { text: "Civilization Number 184 was destroyed by the stacked gravitational attractions of a tri-solar syzygy.", author: "Liu Cixin, The Three-Body Problem" },
    { text: "INSUFFICIENT DATA FOR MEANINGFUL ANSWER.", author: "Isaac Asimov, The Last Question" },
    { text: "The only thing that makes life possible is permanent, intolerable uncertainty: not knowing what comes next.", author: "Ursula K. Le Guin" },
    { text: "Step on a mouse and you crush the Pyramids.", author: "Ray Bradbury" },
    { text: "Your scientists were so preoccupied with whether or not they could that they didn't stop to think if they should.", author: "Ian Malcolm, Jurassic Park" },
    { text: "A process cannot be understood by stopping it. Understanding must move with the flow of the process, must join it and flow with it.", author: "Frank Herbert" },
    { text: "The term 'holistic' refers to my conviction that what we are concerned with here is the fundamental interconnectedness of all things.", author: "Douglas Adams" },
    { text: "The ships hung in the sky in much the same way that bricks don't.", author: "Douglas Adams" },
    { text: "Science is magic that works.", author: "Kurt Vonnegut" },
    { text: "Reality is that which, when you stop believing in it, doesn't go away.", author: "Philip K. Dick" },
    { text: "From the beginning I knew my destination, and I chose my route accordingly.", author: "Ted Chiang" },
    { text: "The world was to me a secret which I desired to divine.", author: "Mary Shelley" },
    { text: "Science, my lad, has been built upon many errors; but they are errors which it was good to fall into, for they led to the truth.", author: "Jules Verne" },

    // Science and chaos
    { text: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton" },
    { text: "Philosophy is written in this grand book, the universe, which stands continually open to our gaze. … It is written in the language of mathematics.", author: "Galileo Galilei" },
    { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
    { text: "Science knows no country, because knowledge belongs to humanity.", author: "Louis Pasteur" },
    { text: "Somewhere, something incredible is waiting to be known.", author: "Sharon Begley" },
    { text: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan" },
    { text: "If you wish to make an apple pie from scratch, you must first invent the universe.", author: "Carl Sagan" },
    { text: "A scientist in his laboratory is not only a technician: he is also a child placed before natural phenomena which impress him like a fairy tale.", author: "Marie Curie" },
    { text: "Science never solves a problem without creating ten more.", author: "George Bernard Shaw" },
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
    { text: "The science of today is the technology of tomorrow.", author: "Edward Teller" },
    { text: "Science is what we understand well enough to explain to a computer. Art is everything else we do.", author: "Donald Knuth" },
    { text: "Chaos: when the present determines the future, but the approximate present does not approximately determine the future.", author: "Edward Lorenz" },
    { text: "It may happen that small differences in the initial conditions produce very great ones in the final phenomena.", author: "Henri Poincaré" },
    { text: "Where chaos begins, classical science stops.", author: "James Gleick" },
    { text: "Using a term like nonlinear science is like referring to the bulk of zoology as the study of non-elephant animals.", author: "Stanislaw Ulam" },
    { text: "At the heart of the universe is a steady, insistent beat—the sound of cycles in sync.", author: "Steven Strogatz" },
    { text: "An odd kind of sympathy.", author: "Royal Society minutes on Huygens's pendulum clocks, 1665" },
    { text: "It's the best possible time to be alive, when almost everything you thought you knew is wrong.", author: "Tom Stoppard" },
    { text: "Chaos is found in greatest abundance wherever order is being sought. It always defeats order, because it is better organized.", author: "Terry Pratchett" },
    { text: "Clouds are not spheres, mountains are not cones, coastlines are not circles, and bark is not smooth, nor does lightning travel in a straight line.", author: "Benoit Mandelbrot" },
    { text: "Time forks perpetually toward innumerable futures.", author: "Jorge Luis Borges" },
    { text: "I, at any rate, am convinced that He does not throw dice.", author: "Albert Einstein" },
    { text: "Consideration of black holes suggests, not only that God does play dice, but that he sometimes confuses us by throwing them where they can't be seen.", author: "Stephen Hawking" },
    { text: "All models are wrong, but some are useful.", author: "George Box" },
    { text: "The first principle is that you must not fool yourself—and you are the easiest person to fool.", author: "Richard Feynman" },
    { text: "What I cannot create, I do not understand.", author: "Richard Feynman" },
    { text: "If Aristotle had cooked, he would have written much more.", author: "Sor Juana Inés de la Cruz" },

    // Technology
    { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
    { text: "Technology is anything that wasn't around when you were born.", author: "Alan Kay" },
    { text: "The real question is not whether machines think but whether men do.", author: "B.F. Skinner" },
    { text: "Technology, like art, is a soaring exercise of the human imagination.", author: "Daniel Bell" }
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

        const s = size / 60, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
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
