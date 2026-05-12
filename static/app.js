document.querySelectorAll(".control").forEach((item) => {
  item.classList.add("w-full", "rounded-md", "border", "border-slate-700", "bg-slate-950", "px-3", "py-2", "text-slate-100", "outline-none", "focus:border-blue-500");
});
document.querySelectorAll(".field").forEach((item) => {
  item.classList.add("block", "text-sm", "font-medium", "text-slate-300");
});
document.querySelectorAll(".hint").forEach((item) => {
  item.classList.add("mt-1", "block", "text-xs", "font-normal", "leading-5", "text-slate-400");
});
document.querySelectorAll(".btn").forEach((item) => {
  item.classList.add("rounded-md", "bg-blue-600", "px-4", "py-2", "text-sm", "font-medium", "text-white", "hover:bg-blue-500");
});
document.querySelectorAll(".check-card").forEach((item) => {
  item.classList.add("inline-flex", "items-center", "gap-2", "rounded-md", "border", "border-slate-700", "bg-slate-950", "px-3", "py-2", "text-sm", "text-slate-200");
});

function splitValues(value, separator = "default") {
  const normalized = value
    .replaceAll("\\r\\n", "\n")
    .replaceAll("\\n", "\n")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n");
  const pattern = separator === "newline" ? /\n+/ : /[\n,]+/;
  return normalized.split(pattern).map((item) => item.trim()).filter(Boolean);
}

function setupChipField(field) {
  const textarea = field.querySelector(".chip-values");
  const list = field.querySelector(".chip-list");
  const input = field.querySelector(".chip-input");
  const add = field.querySelector(".chip-add");

  function values() {
    return splitValues(textarea.value, chipSeparator(field));
  }

  function save(items) {
    textarea.value = [...new Set(items)].join("\n");
  }

  function render() {
    list.innerHTML = "";
    values().forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-100";
      chip.textContent = displayChipValue(field, item);
      chip.title = item;
      chip.dataset.value = item;
      if (isFcmTokenField(field)) {
        chip.tabIndex = 0;
        chip.addEventListener("click", () => selectFcmTokenChip(field, chip));
        chip.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectFcmTokenChip(field, chip);
          }
        });
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "x";
      remove.className = "text-slate-400 hover:text-white";
      remove.addEventListener("click", () => {
        save(values().filter((value) => value !== item));
        render();
      });
      chip.appendChild(remove);
      list.appendChild(chip);
    });
  }

  function addValue() {
    const item = input.value.trim();
    if (!item) return;
    save([...values(), item]);
    input.value = "";
    render();
  }

  add.addEventListener("click", addValue);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addValue();
    }
  });
  render();
}

function chipSeparator(field) {
  return isFcmTokenField(field) ? "newline" : "default";
}

function displayChipValue(field, item) {
  if (isFcmTokenField(field) && item.length > 5) {
    return `${item.slice(0, 5)}...`;
  }
  return item;
}

function isFcmTokenField(field) {
  return field.querySelector('[name="notifications.tokens"]') !== null;
}

function selectFcmTokenChip(field, chip) {
  field.querySelectorAll(".chip").forEach((item) => {
    item.classList.remove("border-blue-400", "bg-blue-950", "ring-2", "ring-blue-500");
  });
  chip.classList.add("border-blue-400", "bg-blue-950", "ring-2", "ring-blue-500");
  field.dataset.selectedToken = chip.dataset.value;
}

function setupSeverityChecks() {
  const textarea = document.querySelector(".severity-values");
  const checks = [...document.querySelectorAll(".severity-check")];
  if (!textarea) return;
  function sync() {
    textarea.value = checks.filter((item) => item.checked).map((item) => item.value).join("\n");
  }
  checks.forEach((item) => item.addEventListener("change", sync));
  sync();
}

function setupTabs() {
  const buttons = [...document.querySelectorAll(".tab-button")];
  const panels = [...document.querySelectorAll(".tab-panel")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("bg-blue-600", "text-white"));
      buttons.forEach((item) => item.classList.add("text-slate-300"));
      button.classList.add("bg-blue-600", "text-white");
      button.classList.remove("text-slate-300");
      panels.forEach((panel) => panel.classList.add("hidden"));
      document.getElementById(`${button.dataset.tab}-tab`)?.classList.remove("hidden");
    });
  });
}

function renderLogs(logs) {
  const target = document.getElementById("log-list");
  if (!target) return;
  const selected = new Set([...document.querySelectorAll(".log-select:checked")].map((item) => item.closest(".log-entry")?.dataset.logId).filter(Boolean));
  if (!logs.length) {
    target.innerHTML = '<p class="p-4 text-sm text-slate-400">No logs yet.</p>';
    return;
  }
  target.innerHTML = logs.map((log, index) => {
    const id = logId(log, index);
    const text = logText(log);
    return `
    <article class="log-entry p-4" data-log-id="${escapeHtml(id)}" data-log-text="${escapeHtml(text)}">
      <div class="flex gap-3">
        <input type="checkbox" class="log-select mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950" ${selected.has(id) ? "checked" : ""}>
        <div class="min-w-0 flex-1">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p class="font-medium text-slate-100">${escapeHtml(log.message)}</p>
            <p class="text-xs text-slate-500">${escapeHtml(log.time)} | ${escapeHtml(log.level)}</p>
          </div>
          <pre class="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-300">${escapeHtml(JSON.stringify(log.fields || {}, null, 2))}</pre>
        </div>
      </div>
    </article>
  `;
  }).join("");
}

function logId(log, index) {
  return `${log.time}|${log.level}|${log.message}|${index}`;
}

function logText(log) {
  return `${log.time} | ${log.level} | ${log.message}\n${JSON.stringify(log.fields || {}, null, 2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refreshLogs() {
  const response = await fetch("/api/logs");
  if (!response.ok) return;
  const data = await response.json();
  renderLogs(data.logs || []);
  const status = data.status || {};
  const line = document.getElementById("status-line");
  if (line) {
    line.textContent = `MQTT: ${Boolean(status.connected)} | Sent: ${status.sent || 0} | Error: ${status.last_error || "none"}`;
  }
}

async function sendFcmTest(mode) {
  const field = document.querySelector('[data-chip-kind="fcm-token"]');
  const status = document.getElementById("fcm-test-status");
  const tokens = field ? splitValues(field.querySelector(".chip-values").value, "newline") : [];
  const selectedToken = field?.dataset.selectedToken;
  const body = mode === "all" ? { all: true, tokens } : { token: selectedToken };

  if ((mode === "all" && tokens.length === 0) || (mode !== "all" && !selectedToken)) {
    showFcmTestStatus("Select a token first, or use Test all tokens");
    return;
  }

  showFcmTestStatus("Sending test notification...");
  try {
    const response = await fetch("/api/test-fcm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Test failed");
    }
    showFcmTestStatus(`Sent ${result.sent} test notification${result.sent === 1 ? "" : "s"}`);
    refreshLogs();
  } catch (error) {
    showFcmTestStatus(error.message || "Test failed");
  }
}

function showFcmTestStatus(message) {
  const status = document.getElementById("fcm-test-status");
  if (!status) return;
  status.textContent = message;
  status.classList.remove("hidden");
}

let logRefreshMs = 3000;
let logRefreshPaused = false;
let logRefreshTimer = null;

function scheduleLogRefresh() {
  window.clearInterval(logRefreshTimer);
  if (!logRefreshPaused) {
    logRefreshTimer = window.setInterval(refreshLogs, logRefreshMs);
  }
}

async function copyText(text, statusMessage) {
  if (!text.trim()) {
    showCopyStatus("No logs selected");
    return;
  }
  await navigator.clipboard.writeText(text);
  showCopyStatus(statusMessage);
}

function showCopyStatus(message) {
  const status = document.getElementById("copy-log-status");
  if (!status) return;
  status.textContent = message;
  status.classList.remove("hidden");
  window.setTimeout(() => status.classList.add("hidden"), 2000);
}

function selectedLogText() {
  return [...document.querySelectorAll(".log-select:checked")]
    .map((item) => item.closest(".log-entry")?.dataset.logText || "")
    .filter(Boolean)
    .join("\n\n");
}

function visibleLogText() {
  return [...document.querySelectorAll(".log-entry")]
    .map((item) => item.dataset.logText || "")
    .filter(Boolean)
    .join("\n\n");
}

document.querySelectorAll(".chip-field").forEach(setupChipField);
setupSeverityChecks();
setupTabs();
document.getElementById("refresh-logs")?.addEventListener("click", refreshLogs);
document.getElementById("test-selected-fcm-token")?.addEventListener("click", () => sendFcmTest("selected"));
document.getElementById("test-all-fcm-tokens")?.addEventListener("click", () => sendFcmTest("all"));
document.getElementById("copy-selected-logs")?.addEventListener("click", () => copyText(selectedLogText(), "Selected logs copied"));
document.getElementById("copy-visible-logs")?.addEventListener("click", () => copyText(visibleLogText(), "Visible logs copied"));
document.getElementById("log-refresh-interval")?.addEventListener("change", (event) => {
  logRefreshMs = Number(event.target.value) || 3000;
  scheduleLogRefresh();
});
document.getElementById("toggle-log-refresh")?.addEventListener("click", (event) => {
  logRefreshPaused = !logRefreshPaused;
  event.target.textContent = logRefreshPaused ? "Resume" : "Pause";
  scheduleLogRefresh();
});
scheduleLogRefresh();
