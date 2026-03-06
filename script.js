/**
 * GREENVELOPE "LUSH BLOSSOMS" — EXACT ANIMATION CLONE
 *
 * Flow:
 *  PHASE 1 — Envelope
 *    Step A  Envelope sits face-down (address side). "Click to turn over".
 *    Step B  User clicks → envelope flips 180° → front face with seal visible.
 *            Prompt changes to "Click the seal to open".
 *    Step C  User clicks seal →
 *              • Seal fades out
 *              • Top flap swings open (rotateX 180°) revealing floral liner
 *              • After flap is open, the whole envelope-scene fades/shrinks away
 *
 *  PHASE 2 — Card
 *    Step D  Card-scene fades in — the card slides up from below and occupies
 *            the centre of the viewport (full-screen focus, exactly like Greenvelope).
 *    Step E  Confetti fires.  Replay button appears.
 */

document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const flap = document.getElementById('flap');
    const seal = document.getElementById('seal');
    const prompt = document.getElementById('prompt');
    const envelopeScene = document.getElementById('envelope-scene');
    const card = document.getElementById('card');
    const replayBtn = document.getElementById('replay');
    const canvas = document.getElementById('confetti-canvas');

    let phase = 'A'; // A → B → C → D

    /* ---------- helpers ---------- */
    const wait = ms => new Promise(r => setTimeout(r, ms));

    const boom = () => {
        const cc = confetti.create(canvas, { resize: true, useWorker: true });
        const palette = ['#dfb2b5', '#c49959', '#f5eedc', '#ffffff', '#c89295'];
        cc({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: .5 }, colors: palette });
        cc({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: .5 }, colors: palette });
        setTimeout(() =>
            cc({ particleCount: 40, spread: 100, origin: { y: .4 }, colors: palette, scalar: .8 }), 200);
        setTimeout(() =>
            cc({
                particleCount: 25, spread: 150, origin: { y: .3 },
                colors: ['#fff', '#f5eedc', '#dfb2b5'], scalar: .6
            }), 400);
    };

    /* ---------- step A: show prompt ---------- */
    const initA = () => {
        prompt.textContent = 'Click to turn over';
        prompt.classList.add('show');
    };
    initA();

    /* ---------- click envelope (step A → B) ---------- */
    envelope.addEventListener('click', async () => {
        if (phase !== 'A') return;
        phase = 'B';

        prompt.classList.remove('show');
        envelope.classList.add('flipped');

        await wait(1500);
        prompt.textContent = 'Click the seal to open';
        prompt.classList.add('show');
    });

    /* ---------- click seal (step B → C → D) ---------- */
    seal.addEventListener('click', async e => {
        e.stopPropagation();
        if (phase !== 'B') return;
        phase = 'C';

        // Instantly hide prompt to avoid overlap
        prompt.classList.remove('show');
        prompt.style.pointerEvents = 'none';

        // 1. hide seal
        seal.classList.add('gone');

        // 2. open flap
        flap.classList.add('opened');

        // Show card in pocket (it starts its keyframe animation but holds in-pocket for 25% of the 3.5s)
        phase = 'D';
        card.classList.add('show');

        // wait for the pocket-hold and initial reveal
        await wait(2500);

        // 4. start fading the envelope
        envelopeScene.classList.add('hiding-envelope');

        await wait(2000);
        boom();

        await wait(800);
        replayBtn.classList.add('show');
    });

    /* ---------- replay ---------- */
    replayBtn.addEventListener('click', async () => {
        replayBtn.classList.remove('show');
        // reset envelope and card
        envelopeScene.classList.remove('hiding-envelope');
        envelopeScene.classList.remove('gone');
        card.classList.remove('show');
        seal.classList.remove('gone');
        flap.classList.remove('opened');

        await wait(400);
        envelope.classList.remove('flipped');

        await wait(800);
        phase = 'A';
        initA();
    });
});
