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

// 🧠 Animation loop: bounce + drag + tilt
function animate() {
  if (!isDragging) {
    bounceY += 0.3 * bounceDirection;
    if (bounceY > 10 || bounceY < -10) bounceDirection *= -1;
  }

  const finalX = currentX + tiltX;
  const finalY = currentY + tiltY;

  object.style.transform = `
    translateX(${finalX}px)
    translateY(${finalY + bounceY}px)
  `;

  requestAnimationFrame(animate);
}
animate();

// 📐 Clamp helper
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// 🖐 TOUCH EVENTS
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

// 🖱 MOUSE EVENTS
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

// 📱 DEVICE ORIENTATION
function handleOrientation(event) {
  const gamma = event.gamma || 0; // left-right
  const beta = event.beta || 0;   // front-back

  console.log("gamma:", gamma, "beta:", beta); // ✅ Debug

  const scale = 2.0;

  tiltX = clamp(gamma * scale, -maxOffset, maxOffset);
  tiltY = clamp(beta * scale * 0.7, -maxOffset, maxOffset);
}

// 📱 REQUEST PERMISSION ON iOS
function requestMotionPermission() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          console.log("Motion permission granted ✅");
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Permission denied ❌");
        }
      })
      .catch((err) => {
        console.error("Permission error:", err);
      });
  } else {
    console.log("Listening to deviceorientation directly (Android) ✅");
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

window.addEventListener("click", requestMotionPermission);
