
// import React, { useRef, useEffect } from "react";

// const Visual = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     let animationFrameId;

//     // Detect if mobile (screen width < 768px)
//     const isMobile = window.innerWidth < 768;

//     // Configuration - Adjusted for mobile performance
//     const waveCount = isMobile ? 3 : 5; // Fewer waves on mobile
//     const points = isMobile ? 100 : 200; // Lower resolution on mobile
//     const baseAmplitude = isMobile ? 40 : 80; 
//     const baseSpeed = 0.002;
//     const tedRed = "255, 32, 32"; 

//     const handleResize = () => {
//       const dpr = window.devicePixelRatio || 1;
//       canvas.width = window.innerWidth * dpr;
//       canvas.height = window.innerHeight * dpr;
//       ctx.scale(dpr, dpr);
//       canvas.style.width = `${window.innerWidth}px`;
//       canvas.style.height = `${window.innerHeight}px`;
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     let tick = 0;

//     const draw = () => {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
      
//       ctx.clearRect(0, 0, width, height);
      
//       const cy = height / 2;

//       for (let i = 0; i < waveCount; i++) {
//         ctx.beginPath();
        
//         const opacity = 1 - (i / waveCount); 
//         ctx.lineWidth = isMobile ? 1.5 : (2 - (i * 0.3));
//         ctx.strokeStyle = `rgba(${tedRed}, ${opacity * 1.0})`;

//         for (let x = 0; x <= width; x += width / points) {
//           const yOffset = 
//             Math.sin(x * 0.003 + tick + i) * baseAmplitude * Math.sin(tick * 0.5) +
//             Math.cos(x * 0.005 - tick) * (baseAmplitude * 0.5);
            
//           ctx.lineTo(x, cy + yOffset);
//         }
        
//         ctx.stroke();
//       }

//       tick += baseSpeed * 10;
//       animationFrameId = requestAnimationFrame(draw);
//     };

//     draw();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 z-0 pointer-events-none"
//       style={{ background: "#541f1fff" }} 
//     />
//   );
// };

// export default Visual;




// // 5. Magnetic Field Lines Visual
import React, { useRef, useEffect } from "react";

const Visual = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationId;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 45 : 130;
    const mouseRadius = 360;
    const tedRed = "235,0,40";

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Slower base motion = longer readable lines
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
      }

      update() {
        if (mouse.current.active) {
          const dx = this.x - mouse.current.x;
          const dy = this.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 1.6;
            const angle = Math.atan2(dy, dx) + Math.PI / 2;

            this.vx += Math.cos(angle) * force;
            this.vy += Math.sin(angle) * force;
          }
        }

        // Strong damping → smooth continuous curves
        this.vx *= 0.92;
        this.vy *= 0.92;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const tailX = this.x - this.vx * 22;
        const tailY = this.y - this.vy * 22;

        // 🔴 PASS 1: Sharp core line (clarity)
        ctx.strokeStyle = `rgba(${tedRed},0.95)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // 🔴 PASS 2: Soft glow (controlled, not blurry)
        ctx.strokeStyle = `rgba(${tedRed},0.45)`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Much less fade → lines stay visible
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle center emphasis (NOT haze)
      const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.55
      );
      g.addColorStop(0, "rgba(235,0,40,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const onMouseLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", init);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default Visual;