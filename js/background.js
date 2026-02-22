(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Set actual pixel dimensions scaled by DPR
    canvas.width = W * dpr;
    canvas.height = H * dpr;

    // Keep the canvas visually the same CSS size
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    // Scale all drawing operations to match
    ctx.scale(dpr, dpr);

    const vx = W / 2, vy = H / 2;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.9 / dpr;

    const NUM_RAYS = 36;
    for (let i = 0; i < NUM_RAYS; i++) {
      const angle = (i / NUM_RAYS) * Math.PI * 2;
      const len = Math.max(W, H) * 1.5;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx + Math.cos(angle) * len, vy + Math.sin(angle) * len);
      ctx.stroke();
    }

    const NUM_LINES = 12;
    for (let i = 1; i <= NUM_LINES; i++) {
      const t = Math.pow(i / NUM_LINES, 1.8);
      const dy = (H / 2) * t;
      const dx = (W / 2) * t;

      [vy - dy, vy + dy].forEach(y => {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      });
      [vx - dx, vx + dx].forEach(x => {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      });
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5 / dpr;
    const ts = Math.min(W, H) * 0.035;
    ctx.beginPath();
    ctx.moveTo(vx, vy - ts);
    ctx.lineTo(vx + ts, vy + ts * 0.6);
    ctx.lineTo(vx - ts, vy + ts * 0.6);
    ctx.closePath();
    ctx.stroke();
  }

  draw();
  window.addEventListener('resize', draw);
})();