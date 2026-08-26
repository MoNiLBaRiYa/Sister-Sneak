/**
 * Sister Sneak: Phone Locked - Advanced Input System
 * Supports Keyboard (WASD/Arrows/E/Space), Mouse click-to-move,
 * and Mobile Multi-Touch Virtual Joystick + Action Buttons for Android and iOS.
 */

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = { x: 0, y: 0, isDown: false, clicked: false };
    this.interactPressed = false;
    this.actionPressed = false;

    // Mobile Touch State
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.joystick = {
      active: false,
      touchId: null,
      baseX: 0,
      baseY: 0,
      currentX: 0,
      currentY: 0,
      vectorX: 0,
      vectorY: 0,
      radius: 45
    };

    this.initDOMControls();
    this.bindEvents();
  }

  initDOMControls() {
    this.touchLayer = document.getElementById('touch-controls');
    this.joystickZone = document.getElementById('virtual-joystick');
    this.joystickKnob = this.joystickZone ? this.joystickZone.querySelector('.joystick-knob') : null;
    this.touchActionBtn = document.getElementById('btn-touch-action');

    // Show touch controls automatically if mobile / touch device
    if (this.isTouchDevice && this.touchLayer) {
      this.touchLayer.classList.remove('hidden');
    }

    if (this.touchActionBtn) {
      const triggerInteract = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.interactPressed = true;
        this.touchActionBtn.classList.add('pressed');
        setTimeout(() => this.touchActionBtn.classList.remove('pressed'), 150);
      };
      this.touchActionBtn.addEventListener('touchstart', triggerInteract, { passive: false });
      this.touchActionBtn.addEventListener('click', triggerInteract);
    }
  }

  bindEvents() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyE' || e.code === 'Enter') {
        this.interactPressed = true;
      }
      if (e.code === 'Space') {
        this.actionPressed = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse Controls (Canvas)
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
      this.mouse.isDown = true;
      this.mouse.clicked = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    // Mobile Virtual Joystick Touch Handling
    if (this.joystickZone) {
      this.joystickZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const rect = this.joystickZone.getBoundingClientRect();
          this.joystick.touchId = touch.identifier;
          this.joystick.active = true;
          this.joystick.baseX = rect.left + rect.width / 2;
          this.joystick.baseY = rect.top + rect.height / 2;
          this.updateJoystick(touch.clientX, touch.clientY);
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (!this.joystick.active) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === this.joystick.touchId) {
            e.preventDefault();
            this.updateJoystick(touch.clientX, touch.clientY);
            break;
          }
        }
      }, { passive: false });

      const endJoystick = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.joystick.touchId) {
            this.joystick.active = false;
            this.joystick.touchId = null;
            this.joystick.vectorX = 0;
            this.joystick.vectorY = 0;
            if (this.joystickKnob) {
              this.joystickKnob.style.transform = `translate(0px, 0px)`;
            }
            break;
          }
        }
      };

      window.addEventListener('touchend', endJoystick, { passive: true });
      window.addEventListener('touchcancel', endJoystick, { passive: true });
    }

    // Canvas Tap-to-move for touchscreens
    this.canvas.addEventListener('touchstart', (e) => {
      // If user tapped directly on canvas outside joystick
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier !== this.joystick.touchId) {
          const rect = this.canvas.getBoundingClientRect();
          const scaleX = this.canvas.width / rect.width;
          const scaleY = this.canvas.height / rect.height;
          this.mouse.x = (t.clientX - rect.left) * scaleX;
          this.mouse.y = (t.clientY - rect.top) * scaleY;
          this.mouse.clicked = true;
        }
      }
    }, { passive: true });
  }

  updateJoystick(touchX, touchY) {
    const dx = touchX - this.joystick.baseX;
    const dy = touchY - this.joystick.baseY;
    const dist = Math.hypot(dx, dy);
    const maxR = this.joystick.radius;

    const clampedDist = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    if (this.joystickKnob) {
      this.joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
    }

    // Normalized vector (-1 to 1)
    this.joystick.vectorX = knobX / maxR;
    this.joystick.vectorY = knobY / maxR;
  }

  getMovementVector() {
    let dx = 0;
    let dy = 0;

    // 1. Keyboard Controls
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;

    // 2. Mobile Touch Joystick (Priority on Mobile)
    if (this.joystick.active) {
      dx = this.joystick.vectorX;
      dy = this.joystick.vectorY;
      const mag = Math.hypot(dx, dy);
      if (mag > 0.1) {
        return { x: dx, y: dy, active: true };
      }
    }

    // Normalize keyboard vector
    const mag = Math.hypot(dx, dy);
    if (mag > 0.001) {
      return { x: dx / mag, y: dy / mag, active: true };
    }
    return { x: 0, y: 0, active: false };
  }

  consumeInteract() {
    const p = this.interactPressed;
    this.interactPressed = false;
    return p;
  }

  consumeClick() {
    const c = this.mouse.clicked;
    this.mouse.clicked = false;
    return c ? { x: this.mouse.x, y: this.mouse.y } : null;
  }
}
