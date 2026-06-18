const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");
const remainingText = document.getElementById("remaining");

// Put your real audio files inside the audio folder.
// Example: audio/english.m4a, audio/vietnamese.m4a, etc.
let languages = [
  { name: "Anh", audio: "audio/english.m4a" },
  { name: "Việt", audio: "audio/vietnamese.m4a" },
  { name: "Tàu", audio: "audio/chinese.m4a" },
  { name: "Pháp", audio: "audio/french.m4a" },
  { name: "Tây Ban Nha", audio: "audio/spanish.m4a" },
  { name: "Hàn", audio: "audio/korean.m4a" },
  { name: "Nhật", audio: "audio/japanese.m4a" },
  { name: "Ý", audio: "audio/italian.m4a" },
  { name: "Thái", audio: "audio/thai.m4a" }
];

let currentRotation = 0;
let isSpinning = false;

const colors = [
  "#ffd6e0", "#ffec99", "#c3fae8", "#d0ebff",
  "#e5dbff", "#ffc9c9", "#d8f5a2", "#ffe8cc"
];

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (languages.length === 0) {
    ctx.beginPath();
    ctx.arc(210, 210, 190, 0, Math.PI * 2);
    ctx.fillStyle = "#fff0f6";
    ctx.fill();

    ctx.fillStyle = "#d6336c";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.fillText(" Mẹ nghe hết rồi hihi!", 210, 210);
    remainingText.textContent = "Tải trang lại để bắt đầu lại nha mẹ.";
    return;
  }

  const sliceAngle = (Math.PI * 2) / languages.length;

  languages.forEach((lang, i) => {
    const start = currentRotation + i * sliceAngle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(210, 210);
    ctx.arc(210, 210, 190, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(210, 210);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#4a2431";
    ctx.font = "bold 17px Arial";
    ctx.fillText(lang.name, 170, 7);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(210, 210, 38, 0, Math.PI * 2);
  ctx.fillStyle = "#d6336c";
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Mẹ", 210, 216);

  remainingText.textContent = `Còn ${languages.length} thứ tiếng`;
}

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", () => {
  bgMusic.volume = 0.3;
  bgMusic.play();
  musicBtn.textContent = "🎵 Đang phát";
});

function playAudio(path) {
  bgMusic.volume = 0.05;

  const audio = new Audio(path);

  audio.onended = () => {
    bgMusic.volume = 0.3;
  };

  audio.play().catch(() => {
    result.textContent += " — audio bị lỗi.";
    bgMusic.volume = 0.3;
  });
}

function spinWheel() {
  if (isSpinning || languages.length === 0) return;

  isSpinning = true;
  spinBtn.disabled = true;
  result.textContent = "Đang quay...";

  const chosenIndex = Math.floor(Math.random() * languages.length);
  const sliceAngle = (Math.PI * 2) / languages.length;

  // Pointer is at the top, which is -90 degrees.
  const pointerAngle = -Math.PI / 2;

  // Rotate so the chosen slice center lands under the pointer.
  const chosenSliceCenter = chosenIndex * sliceAngle + sliceAngle / 2;
  const extraSpins = Math.PI * 2 * 5;
  const targetRotation = pointerAngle - chosenSliceCenter + extraSpins;

  const startRotation = currentRotation;
  const totalRotation = targetRotation - (currentRotation % (Math.PI * 2));
  const duration = 3500;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);

    currentRotation = startRotation + totalRotation * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const selected = languages[chosenIndex];
      result.textContent = `Xoay trúng: Tiếng ${selected.name} `;
      playAudio(selected.audio);

      languages.splice(chosenIndex, 1);

      setTimeout(() => {
        currentRotation = 0;
        drawWheel();
        isSpinning = false;
        spinBtn.disabled = false;

        if (languages.length === 0) {
          spinBtn.disabled = true;
          result.textContent = "Mẹ đã nghe tất cả lời nhắn của Nghé!";
        }
      }, 1200);
    }
  }

  requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", spinWheel);
drawWheel();
