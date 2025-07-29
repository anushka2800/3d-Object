// ✅ Final script.js with orientation + drag (mouse & touch) + bounce

const object = document.getElementById("floatingObject");

let currentX = 0;
let currentY = 0;
let tiltX = 0;
let tiltY = 0;
let bounceY = 0;
let bounceDirection = 1;

let startX = 0;
let startY = 0;
let isDragging = false;
let isMotionActive = false;

const maxOffset = 60;

// Clamp helper
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// 🎯 Animation: bounce + drag + tilt
function animate() {
  if (!isDragging && !isMotionActive) {
    bounceY += 0.3 * bounceDirection;
    if (bounceY > 10 || bounceY < -10) bounceDirection *= -1;
  }

  const finalX = currentX + tiltX;
  const finalY = currentY + tiltY + bounceY;
  object.style.transform = `translateX(${finalX}px) translateY(${finalY}px)`;
  requestAnimationFrame(animate);
}
animate();

// 📱 Orientation Handler
function handleOrientation(event) {
  if (!isMotionActive || isDragging) return;

  const gamma = event.gamma || 0;
  const beta = event.beta || 0;

  tiltX = clamp(gamma * 1.5, -maxOffset, maxOffset);
  tiltY = clamp(beta * 0.8, -maxOffset, maxOffset);
}

// 🛡️ Request permission (iOS)
function requestMotionPermission() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Motion permission denied ❌");
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

// 🧠 Touch drag
object.addEventListener("touchstart", (e) => {
  isDragging = true;
  isMotionActive = false;
  startX = e.touches[0].clientX - currentX;
  startY = e.touches[0].clientY - currentY;
});

object.addEventListener("touchmove", (e) => {
  const moveX = e.touches[0].clientX - startX;
  const moveY = e.touches[0].clientY - startY;
  currentX = clamp(moveX, -maxOffset, maxOffset);
  currentY = clamp(moveY, -maxOffset, maxOffset);
});

object.addEventListener("touchend", () => {
  isDragging = false;
});

// 🧠 Mouse drag
object.addEventListener("mousedown", (e) => {
  isDragging = true;
  isMotionActive = false;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
  const moveX = e.clientX - startX;
  const moveY = e.clientY - startY;
  currentX = clamp(moveX, -maxOffset, maxOffset);
  currentY = clamp(moveY, -maxOffset, maxOffset);
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

// 👆 Tap to activate motion
object.addEventListener("click", () => {
  if (!isDragging) {
    isMotionActive = true;
  }
});

// ✅ iOS permission on tap
window.addEventListener("click", requestMotionPermission);
