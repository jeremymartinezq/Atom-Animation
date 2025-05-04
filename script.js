document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const atom = document.querySelector('.atom');
  const orbits = document.querySelectorAll('.orbit');
  const electrons = document.querySelectorAll('.electron');
  const speedControl = document.getElementById('speed');
  const angleControl = document.getElementById('angle');
  const pauseBtn = document.getElementById('pause-btn');
  const reverseBtn = document.getElementById('reverse-btn');

  // Animation state
  let isPaused = false;
  let isReversed = false;
  let animationSpeed = 5;
  let viewingAngle = 65;
  let orbitalTilt = 60;

  // Base animation durations
  const baseDurations = {
    orbit1: 8,
    orbit2: 12,
    orbit3: 15
  };

  // Base electron positions on orbits (for physics calculations)
  const electronPositions = [
    { x: 0, y: 0, z: 0, orbit: 150 },
    { x: 0, y: 0, z: 0, orbit: 130 },
    { x: 0, y: 0, z: 0, orbit: 110 }
  ];

  // Add space background particles
  createSpaceParticles();

  // Function to update orbit animations based on controls
  function updateOrbitAnimations() {
    // Calculate actual duration based on speed control
    const speedFactor = 11 - speedControl.value; // Invert so higher = faster
    
    orbits.forEach((orbit, index) => {
      const orbitClass = `orbit${index + 1}`;
      const baseDuration = baseDurations[orbitClass];
      const duration = baseDuration * (speedFactor / 5);
      const direction = isReversed ? 'reverse' : 'normal';
      const state = isPaused ? 'paused' : 'running';
      
      // Update orbit rotation animation
      orbit.style.animationDuration = `${duration}s`;
      orbit.style.animationDirection = direction;
      orbit.style.animationPlayState = state;
      
      // Update electron animations
      const electron = electrons[index];
      electron.style.animationDuration = `${duration}s`;
      electron.style.animationDirection = direction;
      electron.style.animationPlayState = state;
    });
  }

  // Function to update 3D perspective based on controls
  function update3DPerspective() {
    // Update the viewing angle for the entire atom structure
    atom.style.transform = `rotateX(${viewingAngle / 2}deg)`;
    
    // Update individual orbit tilts
    orbits.forEach((orbit, index) => {
      let yRotation = 0;
      let zRotation = 0;
      
      switch(index) {
        case 0: // First orbit
          yRotation = 15;
          zRotation = 0;
          break;
        case 1: // Second orbit
          yRotation = -20;
          zRotation = 60;
          break;
        case 2: // Third orbit
          yRotation = 10;
          zRotation = 120;
          break;
      }
      
      // Apply the 3D transformation
      orbit.style.transform = `translate(-50%, -50%) rotateX(${orbitalTilt}deg) rotateY(${yRotation}deg) rotateZ(${zRotation}deg)`;
      
      // Also update the electron for proper 3D rotation
      const electron = electrons[index];
      electron.style.transform = `translate(-50%, -50%) rotateX(${orbitalTilt/2}deg) rotateY(${yRotation/2}deg) rotateZ(${zRotation/2}deg)`;
    });
  }

  // Create space particles
  function createSpaceParticles() {
    const container = document.createElement('div');
    container.className = 'space-particles';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';
    document.body.prepend(container);

    // Create 150 stars
    for (let i = 0; i < 150; i++) {
      createStar(container);
    }
  }

  function createStar(container) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    
    star.style.position = 'absolute';
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.borderRadius = '50%';
    
    // Set random positions
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Set random colors for some stars
    const colors = ['#fff', '#fff', '#fff', '#ccf', '#ffc', '#fcf'];
    star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Add glow effect
    star.style.boxShadow = `0 0 ${size * 2}px ${star.style.backgroundColor}`;
    
    // Add twinkling animation
    const duration = Math.random() * 3 + 2;
    star.style.animation = `twinkle ${duration}s ease-in-out infinite`;
    
    // Add random delay
    star.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(star);
  }

  // Add twinkling animation
  const twinkleKeyframes = document.createElement('style');
  twinkleKeyframes.textContent = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(twinkleKeyframes);

  // Event listeners for controls
  speedControl.addEventListener('input', function() {
    animationSpeed = this.value;
    updateOrbitAnimations();
  });

  angleControl.addEventListener('input', function() {
    viewingAngle = this.value;
    orbitalTilt = Math.max(30, 90 - viewingAngle);
    update3DPerspective();
  });

  pauseBtn.addEventListener('click', function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? 'Play' : 'Pause';
    this.classList.toggle('active');
    updateOrbitAnimations();
  });

  reverseBtn.addEventListener('click', function() {
    isReversed = !isReversed;
    this.classList.toggle('active');
    updateOrbitAnimations();
  });

  // Interactive nucleus effect
  const nucleus = document.querySelector('.center');
  nucleus.addEventListener('mouseenter', function() {
    this.style.transform = 'translate(-50%, -50%) scale(1.2)';
    this.style.boxShadow = '0 0 80px #ffa500, 0 0 120px rgba(255, 165, 0, 0.8)';
    this.style.transition = 'all 0.3s ease';
  });
  
  nucleus.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(-50%, -50%) scale(1)';
    this.style.boxShadow = '0 0 60px #ffa500, 0 0 100px rgba(255, 165, 0, 0.5)';
    this.style.transition = 'all 0.3s ease';
  });

  // Add nucleus pulse effect
  setInterval(() => {
    if (isPaused) return;
    
    nucleus.classList.add('pulse');
    setTimeout(() => {
      nucleus.classList.remove('pulse');
    }, 1000);
  }, 5000);

  // Add pulse animation
  const pulseKeyframes = document.createElement('style');
  pulseKeyframes.textContent = `
    @keyframes nucleusPulse {
      0% { box-shadow: 0 0 60px #ffa500, 0 0 100px rgba(255, 165, 0, 0.5); }
      50% { box-shadow: 0 0 100px #ffa500, 0 0 150px rgba(255, 165, 0, 0.8); }
      100% { box-shadow: 0 0 60px #ffa500, 0 0 100px rgba(255, 165, 0, 0.5); }
    }
    .pulse {
      animation: nucleusPulse 1s ease-in-out;
    }
  `;
  document.head.appendChild(pulseKeyframes);

  // Add 3D rotation with mouse
  let isDragging = false;
  let startX, startY;
  let rotateX = 20;
  let rotateY = 0;
  
  atom.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    atom.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    rotateY += deltaX * 0.5;
    rotateX = Math.max(0, Math.min(60, rotateX + deltaY * 0.5));
    
    // Update the atom rotation
    atom.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Update angle control to match the current view
    angleControl.value = Math.min(90, Math.max(0, 90 - rotateX));
    orbitalTilt = Math.max(30, rotateX);
    
    // Update orbits to maintain their relative positions
    update3DPerspective();
    
    startX = e.clientX;
    startY = e.clientY;
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      atom.style.cursor = 'grab';
    }
  });

  // Make electrons interactive
  electrons.forEach((electron, index) => {
    electron.style.cursor = 'pointer';
    
    electron.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent triggering atom drag
      
      // Create pulse effect
      this.style.transform = `translate(-50%, -50%) rotateX(30deg) scale(1.5)`;
      
      // Determine the electron color
      const color = window.getComputedStyle(this).backgroundColor;
      const glowColor = color.replace('rgb', 'rgba').replace(')', ', 0.8)');
      
      this.style.boxShadow = `0 0 30px ${color}, 0 0 60px ${glowColor}`;
      this.style.transition = 'all 0.3s ease';
      
      // Create radiation animation
      const radiation = document.createElement('div');
      radiation.className = 'radiation';
      radiation.style.position = 'absolute';
      radiation.style.width = '5px';
      radiation.style.height = '5px';
      radiation.style.backgroundColor = color;
      radiation.style.borderRadius = '50%';
      radiation.style.top = '50%';
      radiation.style.left = '50%';
      radiation.style.transform = 'translate(-50%, -50%)';
      radiation.style.opacity = '0.8';
      radiation.style.zIndex = '5';
      radiation.style.animation = 'radiate 1s ease-out';
      
      atom.appendChild(radiation);
      
      // Add keyframes for radiation animation if not already added
      if (!document.querySelector('#radiation-keyframes')) {
        const style = document.createElement('style');
        style.id = 'radiation-keyframes';
        style.textContent = `
          @keyframes radiate {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(30);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Remove radiation div after animation
      setTimeout(() => {
        radiation.remove();
      }, 1000);
      
      // Reset electron after pulse
      setTimeout(() => {
        this.style.transform = `translate(-50%, -50%) rotateX(30deg)`;
        this.style.boxShadow = this.style.boxShadow.replace('30px', '15px').replace('60px', '40px');
      }, 300);
    });
  });

  // Add electron trail effect
  electrons.forEach((electron, index) => {
    // Different colors for each electron trail
    const trailColors = ['#00ffff', '#3333ff', '#ff00ff'];
    const trailColor = trailColors[index];
    
    setInterval(() => {
      if (isPaused) return;
      
      const trail = document.createElement('div');
      const rect = electron.getBoundingClientRect();
      const atomRect = atom.getBoundingClientRect();
      
      trail.className = 'electron-trail';
      trail.style.position = 'absolute';
      trail.style.width = '6px';
      trail.style.height = '6px';
      trail.style.backgroundColor = trailColor;
      trail.style.borderRadius = '50%';
      trail.style.opacity = '0.8';
      trail.style.left = (rect.left - atomRect.left + rect.width/2) + 'px';
      trail.style.top = (rect.top - atomRect.top + rect.height/2) + 'px';
      trail.style.transition = 'all 1.5s linear';
      trail.style.boxShadow = `0 0 10px ${trailColor}`;
      
      atom.appendChild(trail);
      
      // Fade and remove trail
      setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.5)';
      }, 10);
      
      setTimeout(() => {
        trail.remove();
      }, 1500);
    }, 120);
  });

  // Initialize animations and perspective
  updateOrbitAnimations();
  update3DPerspective();
}); 