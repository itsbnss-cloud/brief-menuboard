/* ============================================================
   Jeune Designer Studio — Brief Menu Board v2
   js/particles.js — Particules animées en arrière-plan
   ============================================================ */

(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + 0.3;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = (Math.random() - 0.5) * 0.3;
    this.life = Math.random();
    this.max  = Math.random() * 0.6 + 0.2;
  };

  Particle.prototype.update = function () {
    this.x    += this.vx;
    this.y    += this.vy;
    this.life += 0.003;
    if (this.life > this.max) this.reset();
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  Particle.prototype.draw = function () {
    const alpha = Math.sin((this.life / this.max) * Math.PI) * 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 166, 35, ${alpha})`;
    ctx.fill();
  };

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    /* Lignes entre particules proches */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245,166,35,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', init);
})();
