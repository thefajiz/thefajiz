import { useEffect } from "react";
import { motion } from "framer-motion";

export function RetroReveal() {
  useEffect(() => {
    let cleanup = (function () {
      let card_elem = document.getElementById("reveal-card");
      let canvas_elem = document.getElementById("reveal-canvas") as HTMLCanvasElement | null;
      if (!card_elem || !canvas_elem) return;

      let ctx = canvas_elem.getContext("2d");
      if (!ctx) return;

      let after_img = new Image();
      after_img.src = "/retro hover/after.png";

      let dot_elem = document.getElementById("reveal-dot");
      let global_cur = document.getElementById("global-cursor");

      let current_x = -999;
      let current_y = -999;
      let mouse_x = -999;
      let mouse_y = -999;
      let mask_radius = 0;
      let target_radius = 0;
      let ring_pulse = 0;
      let anim_frame_id = 0;
      let is_hovered = false;

      let on_mouse_enter = function (e: MouseEvent) {
        if (!card_elem) return;
        let rect = card_elem.getBoundingClientRect();
        mouse_x = e.clientX - rect.left;
        mouse_y = e.clientY - rect.top;
        if (target_radius === 0 || current_x < -500) {
          current_x = mouse_x;
          current_y = mouse_y;
        }
        target_radius = 180;
        is_hovered = true;
        if (dot_elem) dot_elem.style.opacity = "1";
        if (global_cur) global_cur.style.display = "none";
      };

      let on_mouse_move = function (e: MouseEvent) {
        if (!card_elem) return;
        let rect = card_elem.getBoundingClientRect();
        mouse_x = e.clientX - rect.left;
        mouse_y = e.clientY - rect.top;
        if (dot_elem) {
          dot_elem.style.left = mouse_x + "px";
          dot_elem.style.top = mouse_y + "px";
        }
      };

      let on_mouse_leave = function () {
        target_radius = 0;
        is_hovered = false;
        if (dot_elem) dot_elem.style.opacity = "0";
        if (global_cur) global_cur.style.display = "";
        mouse_x = -999;
        mouse_y = -999;
      };

      card_elem.addEventListener("mouseenter", on_mouse_enter as EventListener);
      card_elem.addEventListener("mousemove", on_mouse_move as EventListener);
      card_elem.addEventListener("mouseleave", on_mouse_leave as EventListener);

      let render_loop = function () {
        if (!card_elem || !canvas_elem || !ctx) return;

        let w = card_elem.offsetWidth;
        let h = card_elem.offsetHeight;
        if (canvas_elem.width !== w || canvas_elem.height !== h) {
          canvas_elem.width = w;
          canvas_elem.height = h;
        }

        ctx.clearRect(0, 0, w, h);

        mask_radius += (target_radius - mask_radius) * 0.07;
        if (is_hovered || mask_radius > 0.5) {
          if (mouse_x !== -999) {
            current_x += (mouse_x - current_x) * 0.10;
            current_y += (mouse_y - current_y) * 0.10;
          }
        }

        if (after_img.complete && after_img.naturalWidth > 0 && mask_radius > 0.5) {
          let img_w = after_img.naturalWidth;
          let img_h = after_img.naturalHeight;
          let ratio_img = img_w / img_h;
          let ratio_canvas = w / h;
          let draw_x = 0, draw_y = 0, draw_w = w, draw_h = h;

          if (ratio_canvas > ratio_img) {
            draw_w = w;
            draw_h = w / ratio_img;
            draw_y = (h - draw_h) / 2;
          } else {
            draw_h = h;
            draw_w = h * ratio_img;
            draw_x = (w - draw_w) / 2;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(current_x, current_y, mask_radius, 0, Math.PI * 2);
          ctx.clip();

          ctx.drawImage(after_img, draw_x, draw_y, draw_w, draw_h);

          // Vignette gradient
          let grad = ctx.createRadialGradient(
            current_x, current_y, mask_radius * 0.65,
            current_x, current_y, mask_radius
          );
          grad.addColorStop(0, "rgba(10,10,10,0)");
          grad.addColorStop(1, "rgba(10,10,10,0.35)");
          ctx.fillStyle = grad;
          ctx.fillRect(current_x - mask_radius, current_y - mask_radius, mask_radius * 2, mask_radius * 2);

          ctx.restore();

          let gold_r = 201, gold_g = 168, gold_b = 76;
          if (dot_elem) {
            let bg = getComputedStyle(dot_elem).backgroundColor;
            if (bg.includes("rgb")) {
              let m = bg.match(/\d+(\.\d+)?/g);
              if (m && m.length >= 3 && parseFloat(m[0]) > 10) {
                gold_r = parseFloat(m[0]);
                gold_g = parseFloat(m[1]);
                gold_b = parseFloat(m[2]);
              }
            }
          }

          ring_pulse += 0.04;

          // Primary ring
          ctx.beginPath();
          ctx.arc(current_x, current_y, mask_radius, 0, Math.PI * 2);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(" + gold_r + ", " + gold_g + ", " + gold_b + ", 0.7)";
          ctx.stroke();

          // Secondary ring
          ctx.beginPath();
          ctx.arc(current_x, current_y, mask_radius + 6, 0, Math.PI * 2);
          ctx.lineWidth = 1.0;
          let sec_opacity = 0.15 + Math.sin(ring_pulse) * 0.10;
          ctx.strokeStyle = "rgba(" + gold_r + ", " + gold_g + ", " + gold_b + ", " + sec_opacity + ")";
          ctx.stroke();
        }

        anim_frame_id = requestAnimationFrame(render_loop);
      };

      anim_frame_id = requestAnimationFrame(render_loop);

      return function () {
        cancelAnimationFrame(anim_frame_id);
        if (card_elem) {
          card_elem.removeEventListener("mouseenter", on_mouse_enter as EventListener);
          card_elem.removeEventListener("mousemove", on_mouse_move as EventListener);
          card_elem.removeEventListener("mouseleave", on_mouse_leave as EventListener);
        }
      };
    })();

    return cleanup;
  }, []);

  return (
    <section className="mask-reveal-section px-6 md:px-12 py-20 max-w-6xl mx-auto flex flex-col items-center">
      <div className="reveal-header text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="reveal-eyebrow block text-gold text-xs tracking-widest-x mb-4 lowercase font-sans"
        >
          — the same vision —
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="reveal-headline font-serif text-3xl md:text-5xl text-ivory leading-tight"
        >
          from static to story,<br />
          <em className="text-gold not-italic">same vision. different era.</em>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="reveal-card-wrap relative w-[min(560px,88vw)] h-[min(360px,56vw)] mb-8"
      >
        {/* Corner brackets */}
        <div className="corner-tl absolute -top-2.5 -left-2.5 w-6 h-6 border-t border-l border-gold pointer-events-none" />
        <div className="corner-tr absolute -top-2.5 -right-2.5 w-6 h-6 border-t border-r border-gold pointer-events-none" />
        <div className="corner-bl absolute -bottom-2.5 -left-2.5 w-6 h-6 border-b border-l border-gold pointer-events-none" />
        <div className="corner-br absolute -bottom-2.5 -right-2.5 w-6 h-6 border-b border-r border-gold pointer-events-none" />

        <div
          id="reveal-card"
          className="group relative w-full h-full overflow-hidden rounded-[4px] border border-gold/20 select-none cursor-none"
        >
          <img
            id="reveal-back"
            src="/retro hover/before.png"
            alt="retro desk setup"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ filter: "sepia(0.35) brightness(0.85)" }}
          />
          <canvas
            id="reveal-canvas"
            className="absolute inset-0 w-full h-full pointer-events-none select-none block"
          />
          <div
            id="reveal-dot"
            className="absolute w-2.5 h-2.5 rounded-full pointer-events-none z-30 opacity-0 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_#c9a84c,0_0_20px_#c9a84c]"
            style={{ backgroundColor: "#c9a84c" }}
          />

          <span className="era-badge era-retro absolute bottom-4 left-4 z-20 px-3 py-1 bg-ink/80 border border-gold/30 text-gold text-[10px] tracking-widest-x uppercase rounded transition-opacity duration-500 opacity-100 group-hover:opacity-0 pointer-events-none select-none backdrop-blur-sm">
            circa 1999
          </span>
          <span className="era-badge era-modern absolute bottom-4 right-4 z-20 px-3 py-1 bg-ink/80 border border-gold/30 text-gold text-[10px] tracking-widest-x uppercase rounded transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none select-none backdrop-blur-sm">
            present day
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.85, ease: "easeOut" }}
        className="reveal-caption text-center mt-2 flex flex-col items-center gap-3"
      >
        <p className="reveal-caption-main text-xs leading-relaxed text-ivory/80 tracking-widest-x">
          move your cursor to reveal what's possible.
        </p>
        <span className="reveal-caption-sub text-[10px] text-gold tracking-widest-x uppercase inline-block border border-gold/30 px-3 py-1 rounded bg-card-ink/60">
          hover to see
        </span>
      </motion.div>
    </section>
  );
}
