import React, { useEffect, useRef } from 'react';

const FloatingParticles = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const containerRect = useRef(null);

  // Create particles
  const initParticles = (canvas) => {
    const ctx = canvas.getContext('2d');
    particles.current = [];
   
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, 255, ${Math.random() * 0.5 + 0.2})`,
      });
    }
   
    animateParticles(ctx, canvas);
  };
 
  // Animation loop
  const animateParticles = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    particles.current.forEach((particle, index) => {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
     
      // Mouse interaction - subtle attraction to mouse
      if (mousePosition.current.x && mousePosition.current.y) {
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
       
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = 0.02;
          particle.speedX += Math.cos(angle) * force;
          particle.speedY += Math.sin(angle) * force;
        }
      }
     
      // Limit speed
      particle.speedX = Math.min(0.7, Math.max(-0.7, particle.speedX));
      particle.speedY = Math.min(0.7, Math.max(-0.7, particle.speedY));
     
      // Boundary check - contain particles within the canvas
      if (particle.x < 0) {
        particle.x = 0;
        particle.speedX *= -1;
      } else if (particle.x > canvas.width) {
        particle.x = canvas.width;
        particle.speedX *= -1;
      }
      
      if (particle.y < 0) {
        particle.y = 0;
        particle.speedY *= -1;
      } else if (particle.y > canvas.height) {
        particle.y = canvas.height;
        particle.speedY *= -1;
      }
     
      // Draw particles
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
     
      // Draw connections between particles
      particles.current.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
         
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }
      });
    });
   
    animationFrameId.current = requestAnimationFrame(() => animateParticles(ctx, canvas));
  };
  
  // Update canvas dimensions to match container
  const updateCanvasDimensions = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    containerRect.current = containerRef.current.getBoundingClientRect();
    canvas.width = containerRect.current.width;
    canvas.height = containerRect.current.height;
    
    // Re-initialize particles when dimensions change
    initParticles(canvas);
  };
  
  // Convert global mouse position to canvas-relative coordinates
  const getRelativeMousePosition = (e) => {
    if (!containerRect.current) return { x: 0, y: 0 };
    
    return {
      x: e.clientX - containerRect.current.left,
      y: e.clientY - containerRect.current.top
    };
  };
  
  // Check if mouse is inside container
  const isMouseInContainer = (e) => {
    if (!containerRect.current) return false;
    
    return (
      e.clientX >= containerRect.current.left &&
      e.clientX <= containerRect.current.right &&
      e.clientY >= containerRect.current.top &&
      e.clientY <= containerRect.current.bottom
    );
  };
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef || !containerRef.current) return;
   
    // Initial setup
    updateCanvasDimensions();
    
    // Handle window resize
    const handleResize = () => {
      updateCanvasDimensions();
    };
    
    window.addEventListener('resize', handleResize);
   
    // Track mouse movement
    const handleMouseMove = (e) => {
      if (isMouseInContainer(e)) {
        mousePosition.current = getRelativeMousePosition(e);
      } else {
        // Optional: clear mouse position when outside container
        // mousePosition.current = { x: null, y: null };
      }
    };
   
    window.addEventListener('mousemove', handleMouseMove);
   
    // Handle container size changes with ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasDimensions();
    });
    
    resizeObserver.observe(containerRef.current);
   
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [containerRef]);
 
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default FloatingParticles;