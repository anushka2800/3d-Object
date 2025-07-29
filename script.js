// ✅ Fixed script.js with working orientation + drag

const object = document.getElementById("floatingObject");

let currentX = 0;
let currentY = 0;
let bounceY = 0;
let bounceDirection = 1;

let startX = 0;
let startY = 0;
let isDragging = false;

let tiltX = 0;
let tiltY = 0;

const maxOffset = 80;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// 🧠 Animate bounce + drag + tilt
function animate() {
  if (!isDragging) {
    bounceY += 0.3 * bounceDirection;
    if (bounceY > 10 || bounceY < -10) bounceDirection *= -1;
  }

  const finalX = currentX + tiltX;
  const finalY = currentY + tiltY;

  object.style.transform = `translateX(${finalX}px) translateY(${finalY + bounceY}px)`;

  requestAnimationFrame(animate);
}
animate();

// 🖐 Touch Events
object.addEventListener("touchstart", (e) => {
  isDragging = true;
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

// 🖱 Mouse Events
object.addEventListener("mousedown", (e) => {
  isDragging = true;
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

// 📱 Orientation Handler
function handleOrientation(event) {
  const gamma = event.gamma || 0;
  const beta = event.beta || 0;

  tiltX = clamp(gamma * 2.2, -maxOffset, maxOffset);
  tiltY = clamp(beta * 1.2, -maxOffset, maxOffset);

  // Live debug output
  const debug = document.getElementById("debug") || document.createElement("div");
  debug.id = "debug";
  debug.innerHTML = `gamma: ${gamma.toFixed(1)}<br>beta: ${beta.toFixed(1)}`;
  document.body.appendChild(debug);
}

// 📱 Ask for permission (iOS only)
function requestMotionPermission() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    console.log("Requesting permission...");
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        console.log("Permission response:", response);
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Permission denied ❌");
        }
      })
      .catch((err) => {
        console.error("Motion permission error:", err);
      });
  } else {
    console.log("Listening to deviceorientation directly ✅");
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

// 📲 Trigger permission request on first tap
window.addEventListener("click", requestMotionPermission);
