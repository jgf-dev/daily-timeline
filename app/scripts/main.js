const canvas = document.getElementById("timelineCanvas");
const ctx = canvas.getContext("2d");
const reviewList = document.getElementById("reviewList");

function drawTimeline() {
  const now = new Date();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(30, 80, canvas.width - 60, 6);

  for (let i = 0; i < 8; i += 1) {
    const x = 40 + i * 110;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(x, 83, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#374151";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${String((now.getHours() + i) % 24).padStart(2, "0")}:00`, x - 18, 110);
  }
}

async function loadInsights() {
  const sessions = await fetch("/api/sessions").then((r) => r.json());
  if (!sessions[0]) {
    reviewList.textContent = "No sessions yet. Create one via API POST /api/sessions.";
    return;
  }

  const insights = await fetch(`/api/insights/${sessions[0].id}`).then((r) => r.json());
  reviewList.innerHTML = insights.length
    ? `<ul>${insights.map((i) => `<li><strong>${i.kind}</strong>: ${i.content}</li>`).join("")}</ul>`
    : "No insights yet.";
}

document.getElementById("insightForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const sessionId = document.getElementById("sessionIdInput").value;
  const content = document.getElementById("insightInput").value;
  await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, content, kind: "summary" })
  });
  await loadInsights();
});

async function loadSettings() {
  document.getElementById("transcriptionModel").textContent = "whisper-1";
  document.getElementById("voiceModel").textContent = "gpt-realtime";
  document.getElementById("screenshotModel").textContent = "gpt-4.1-mini";
  document.getElementById("imageModel").textContent = "gpt-image-1";
}

drawTimeline();
loadInsights();
loadSettings();
