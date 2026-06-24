const PASSWORD = "260223";

const lockScreen = document.querySelector("#lockScreen");
const storyPage = document.querySelector("#storyPage");
const passwordInput = document.querySelector("#passwordInput");
const passwordHint = document.querySelector("#passwordHint");
const pigPet = document.querySelector("#pigPet");
const pigBubble = document.querySelector("#pigBubble");
const photoFlow = document.querySelector("#photoFlow");
const openClockButton = document.querySelector("#openClockButton");
const countdownPage = document.querySelector("#countdownPage");
const backHomeButton = document.querySelector("#backHomeButton");
const loveDaysNumber = document.querySelector("#loveDaysNumber");
const loveDaysDetail = document.querySelector("#loveDaysDetail");
const nextMeetingTitle = document.querySelector("#nextMeetingTitle");
const nextMeetingCountdown = document.querySelector("#nextMeetingCountdown");
const nextMeetingNote = document.querySelector("#nextMeetingNote");
const upcomingList = document.querySelector("#upcomingList");
const meetingList = document.querySelector("#meetingList");
const meetingCount = document.querySelector("#meetingCount");
const meetingNameInput = document.querySelector("#meetingNameInput");
const meetingDateInput = document.querySelector("#meetingDateInput");
const meetingTimeInput = document.querySelector("#meetingTimeInput");
const addMeetingButton = document.querySelector("#addMeetingButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const addMeetingHint = document.querySelector("#addMeetingHint");
const photos = Array.isArray(window.PHOTO_LIST) ? window.PHOTO_LIST : [];
const pigMessages = [
  "\u7b49\u7167\u7247\u6765\u5566",
  "\u4eca\u5929\u4e5f\u8981\u8d34\u8d34",
  "\u5c0f\u732a\u5de1\u903b\u4e2d",
  "260223\u8bb0\u4f4f\u4e86",
  "\u8981\u4e00\u76f4\u5f00\u5fc3"
];
const DAY_MS = 24 * 60 * 60 * 1000;
const LOVE_START = new Date(2026, 1, 23, 0, 0, 0);
const MEETING_STORAGE_KEY = "clytze-meetings-v1";
const DEFAULT_MEETINGS = [
  {
    id: "default-shenzhen-2026-03-10",
    name: "\u6df1\u5733\u89c1\u9762",
    timestamp: new Date(2026, 2, 10, 12, 0, 0).getTime(),
    fixed: true
  },
  {
    id: "default-xiamen-2026-05-01",
    name: "\u53a6\u95e8\u4e4b\u884c",
    timestamp: new Date(2026, 4, 1, 12, 0, 0).getTime(),
    fixed: true
  }
];

let unlocked = false;
let pigMessageIndex = 0;
let editingMeetingId = null;

function noise(seed) {
  const value = Math.sin(seed * 918.43) * 10000;
  return value - Math.floor(value);
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };

    return entities[char];
  });
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hour = padNumber(date.getHours());
  const minute = padNumber(date.getMinutes());

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function formatDateInput(timestamp) {
  const date = new Date(timestamp);

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function formatTimeInput(timestamp) {
  const date = new Date(timestamp);

  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

function getDistanceParts(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / (DAY_MS / 1000));
  const hours = Math.floor((totalSeconds % (DAY_MS / 1000)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function isDefaultMeeting(id) {
  return DEFAULT_MEETINGS.some((meeting) => meeting.id === id);
}

function loadCustomMeetings() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEETING_STORAGE_KEY) || "[]");

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved
      .map((meeting) => {
        const timestamp = Number(meeting.timestamp);

        if (!Number.isFinite(timestamp)) {
          return null;
        }

        return {
          id: typeof meeting.id === "string" ? meeting.id : `meeting-${timestamp}`,
          name: String(meeting.name || "\u4e00\u6b21\u89c1\u9762").trim().slice(0, 18),
          timestamp,
          fixed: isDefaultMeeting(meeting.id)
        };
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveCustomMeetings(meetings) {
  try {
    localStorage.setItem(MEETING_STORAGE_KEY, JSON.stringify(meetings));
    return true;
  } catch (error) {
    return false;
  }
}

function getAllMeetings() {
  const meetingMap = new Map(DEFAULT_MEETINGS.map((meeting) => [meeting.id, { ...meeting }]));

  loadCustomMeetings().forEach((meeting) => {
    meetingMap.set(meeting.id, {
      ...meeting,
      fixed: isDefaultMeeting(meeting.id)
    });
  });

  return Array.from(meetingMap.values());
}

function getPastMeetingLabel(index) {
  if (index === 0) {
    return "\u4e0a\u4e00\u6b21\u89c1\u9762";
  }

  if (index === 1) {
    return "\u4e0a\u4e0a\u6b21\u89c1\u9762";
  }

  return "\u66f4\u65e9\u7684\u89c1\u9762";
}

function renderCountdownDigits(parts) {
  return `
    <span>${parts.days}</span><small>\u5929</small>
    <span>${padNumber(parts.hours)}</span><small>\u65f6</small>
    <span>${padNumber(parts.minutes)}</span><small>\u5206</small>
    <span>${padNumber(parts.seconds)}</span><small>\u79d2</small>
  `;
}

function renderMeetingItem(meeting, index) {
  const editButton = `<button class="edit-meeting" type="button" data-edit-meeting="${escapeHtml(meeting.id)}">\u66f4\u6539</button>`;
  const deleteButton = meeting.fixed
    ? ""
    : `<button class="delete-meeting" type="button" data-delete-meeting="${escapeHtml(meeting.id)}">\u5220\u9664</button>`;

  return `
    <article class="meeting-item">
      <div>
        <p>${getPastMeetingLabel(index)}</p>
        <h3>${escapeHtml(meeting.name)}</h3>
        <span>${formatDateTime(meeting.timestamp)}</span>
      </div>
      <div class="meeting-actions">${editButton}${deleteButton}</div>
    </article>
  `;
}

function renderUpcomingItem(meeting, now) {
  const parts = getDistanceParts(meeting.timestamp - now);
  const editButton = `<button class="edit-meeting" type="button" data-edit-meeting="${escapeHtml(meeting.id)}">\u66f4\u6539</button>`;
  const deleteButton = meeting.fixed
    ? ""
    : `<button class="delete-meeting" type="button" data-delete-meeting="${escapeHtml(meeting.id)}">\u5220\u9664</button>`;

  return `
    <article class="upcoming-item">
      <div>
        <h3>${escapeHtml(meeting.name)}</h3>
        <span>${formatDateTime(meeting.timestamp)}</span>
      </div>
      <strong>${parts.days}\u5929 ${padNumber(parts.hours)}:${padNumber(parts.minutes)}:${padNumber(parts.seconds)}</strong>
      <div class="meeting-actions">${editButton}${deleteButton}</div>
    </article>
  `;
}

function renderCountdowns() {
  if (!loveDaysNumber || !nextMeetingTitle || !meetingList) {
    return;
  }

  const now = Date.now();
  const loveParts = getDistanceParts(now - LOVE_START.getTime());
  const meetings = getAllMeetings();
  const pastMeetings = meetings
    .filter((meeting) => meeting.timestamp <= now)
    .sort((a, b) => b.timestamp - a.timestamp);
  const upcomingMeetings = meetings
    .filter((meeting) => meeting.timestamp > now)
    .sort((a, b) => a.timestamp - b.timestamp);

  loveDaysNumber.textContent = loveParts.days;
  loveDaysDetail.textContent = `\u5df2\u7ecf\u4e00\u8d77 ${loveParts.days} \u5929 ${loveParts.hours} \u5c0f\u65f6 ${loveParts.minutes} \u5206 ${loveParts.seconds} \u79d2`;
  meetingCount.textContent = `${pastMeetings.length} \u6b21`;

  if (upcomingMeetings.length > 0) {
    const nextMeeting = upcomingMeetings[0];
    const nextParts = getDistanceParts(nextMeeting.timestamp - now);

    nextMeetingTitle.textContent = nextMeeting.name;
    nextMeetingCountdown.innerHTML = renderCountdownDigits(nextParts);
    nextMeetingNote.textContent = `${formatDateTime(nextMeeting.timestamp)} \u89c1`;
    upcomingList.innerHTML = `
      <p class="upcoming-title">\u672a\u6765\u89c1\u9762</p>
      ${upcomingMeetings.map((meeting) => renderUpcomingItem(meeting, now)).join("")}
    `;
  } else {
    nextMeetingTitle.textContent = "\u8fd8\u6ca1\u6709\u6dfb\u52a0";
    nextMeetingCountdown.innerHTML = renderCountdownDigits({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    nextMeetingNote.textContent = "\u6dfb\u52a0\u4e00\u4e2a\u672a\u6765\u7684\u89c1\u9762\u65f6\u95f4\uff0c\u5b83\u4f1a\u5728\u5230\u8fbe\u540e\u81ea\u52a8\u8fdb\u5165\u89c1\u9762\u8bb0\u5f55\u3002";
    upcomingList.innerHTML = "";
  }

  meetingList.innerHTML = pastMeetings.length > 0
    ? pastMeetings.map((meeting, index) => renderMeetingItem(meeting, index)).join("")
    : `<div class="empty-meeting">\u8fd8\u6ca1\u6709\u89c1\u9762\u8bb0\u5f55</div>`;
}

function parseMeetingTimestamp(dateValue, timeValue) {
  const dateParts = dateValue.split("-").map(Number);
  const timeParts = (timeValue || "12:00").split(":").map(Number);

  if (dateParts.length !== 3 || dateParts.some((part) => !Number.isFinite(part))) {
    return NaN;
  }

  const [year, month, day] = dateParts;
  const [hour = 12, minute = 0] = timeParts;

  return new Date(year, month - 1, day, hour, minute, 0).getTime();
}

function showAddHint(message, isError = false) {
  if (!addMeetingHint) {
    return;
  }

  addMeetingHint.textContent = message;
  addMeetingHint.classList.toggle("is-error", isError);
}

function resetMeetingEditor(clearInputs = false) {
  editingMeetingId = null;
  addMeetingButton.textContent = "\u6dfb\u52a0";
  cancelEditButton.classList.add("is-hidden");

  if (clearInputs) {
    meetingNameInput.value = "";
    meetingDateInput.value = "";
    meetingTimeInput.value = "12:00";
  }
}

function startEditingMeeting(id) {
  const meeting = getAllMeetings().find((item) => item.id === id);

  if (!meeting) {
    showAddHint("\u6ca1\u627e\u5230\u8fd9\u6761\u89c1\u9762\u8bb0\u5f55\u3002", true);
    return;
  }

  editingMeetingId = meeting.id;
  meetingNameInput.value = meeting.name;
  meetingDateInput.value = formatDateInput(meeting.timestamp);
  meetingTimeInput.value = formatTimeInput(meeting.timestamp);
  addMeetingButton.textContent = "\u4fdd\u5b58\u66f4\u6539";
  cancelEditButton.classList.remove("is-hidden");
  showAddHint("\u6b63\u5728\u66f4\u6539\u8fd9\u6761\u89c1\u9762\uff0c\u6539\u5b8c\u540e\u70b9\u201c\u4fdd\u5b58\u66f4\u6539\u201d\u3002");
  meetingNameInput.focus({ preventScroll: true });
}

function addMeeting() {
  if (!meetingDateInput || !addMeetingButton) {
    return;
  }

  const timestamp = parseMeetingTimestamp(meetingDateInput.value, meetingTimeInput.value);

  if (!Number.isFinite(timestamp)) {
    showAddHint("\u5148\u9009\u4e00\u4e2a\u89c1\u9762\u65e5\u671f\u5427\u3002", true);
    return;
  }

  const name = (meetingNameInput.value || "").trim() || "\u4e0b\u4e00\u6b21\u89c1\u9762";
  const customMeetings = loadCustomMeetings();
  const nextMeeting = {
    id: editingMeetingId || `meeting-${Date.now()}`,
    name: name.slice(0, 18),
    timestamp
  };
  const existingIndex = customMeetings.findIndex((meeting) => meeting.id === nextMeeting.id);
  const nextMeetings = existingIndex >= 0
    ? customMeetings.map((meeting, index) => (index === existingIndex ? nextMeeting : meeting))
    : customMeetings.concat(nextMeeting);

  if (!saveCustomMeetings(nextMeetings)) {
    showAddHint("\u8fd9\u4e2a\u6d4f\u89c8\u5668\u6682\u65f6\u4fdd\u5b58\u4e0d\u4e86\uff0c\u4f46\u9875\u9762\u5176\u4ed6\u529f\u80fd\u8fd8\u80fd\u7528\u3002", true);
    return;
  }

  const wasEditing = Boolean(editingMeetingId);
  resetMeetingEditor(true);
  showAddHint(wasEditing
    ? "\u5df2\u7ecf\u4fdd\u5b58\u8fd9\u6761\u89c1\u9762\u7684\u66f4\u6539\u3002"
    : (timestamp > Date.now()
      ? "\u5df2\u7ecf\u52a0\u5165\u4e0b\u6b21\u89c1\u9762\u5012\u8ba1\u65f6\u3002"
      : "\u5df2\u7ecf\u52a0\u5165\u89c1\u9762\u8bb0\u5f55\u3002"));
  renderCountdowns();
}

function deleteMeeting(id) {
  const nextMeetings = loadCustomMeetings().filter((meeting) => meeting.id !== id);

  saveCustomMeetings(nextMeetings);
  if (editingMeetingId === id) {
    resetMeetingEditor(true);
  }
  showAddHint("\u5df2\u5220\u9664\u8fd9\u6761\u81ea\u5df1\u6dfb\u52a0\u7684\u89c1\u9762\u3002");
  renderCountdowns();
}

function openCountdownPage() {
  if (!countdownPage || countdownPage.classList.contains("is-active")) {
    return;
  }

  renderCountdowns();
  countdownPage.classList.remove("is-hidden");
  storyPage.classList.add("is-shifted");
  document.body.classList.add("clock-open");
  window.requestAnimationFrame(() => {
    countdownPage.classList.add("is-active");
  });
}

function closeCountdownPage() {
  if (!countdownPage || !countdownPage.classList.contains("is-active")) {
    return;
  }

  countdownPage.classList.remove("is-active");
  storyPage.classList.remove("is-shifted");
  document.body.classList.remove("clock-open");
  window.setTimeout(() => {
    if (!countdownPage.classList.contains("is-active")) {
      countdownPage.classList.add("is-hidden");
    }
  }, 560);
}

function getParticleTargetCount() {
  const screenArea = window.innerWidth * window.innerHeight;

  if (window.matchMedia("(max-width: 700px)").matches) {
    return Math.min(96, Math.max(72, Math.round(screenArea / 4200)));
  }

  if (window.matchMedia("(max-width: 1100px)").matches) {
    return Math.min(132, Math.max(108, Math.round(screenArea / 6500)));
  }

  return Math.min(190, Math.max(148, Math.round(screenArea / 8500)));
}

function pickParticlePhotos(targetCount) {
  if (photos.length === 0) {
    return [];
  }

  return Array.from({ length: targetCount }, (_, index) => {
    const photoIndex = (index * 7 + Math.floor(index / photos.length) * 11) % photos.length;
    return photos[photoIndex];
  });
}

function buildPhotoParticles() {
  if (!photoFlow || photos.length === 0 || photoFlow.children.length > 0) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const selected = pickParticlePhotos(getParticleTargetCount());
  const layer = document.createElement("div");

  photoFlow.className = "photo-flow photo-particle-flow";
  layer.className = "photo-particle-layer";
  photoFlow.appendChild(layer);

  selected.forEach((photo, index) => {
    const item = document.createElement("button");
    const image = document.createElement("img");
    const size = isMobile ? 30 + noise(index + 1) * 42 : 34 + noise(index + 1) * 58;
    const startX = -2 + noise(index + 5) * 104;
    const startY = -2 + noise(index + 9) * 104;
    const dx1 = -12 + noise(index + 13) * 24;
    const dy1 = -9 + noise(index + 17) * 18;
    const dx2 = -15 + noise(index + 21) * 30;
    const dy2 = -12 + noise(index + 25) * 24;
    const rotate = -18 + noise(index + 29) * 36;
    const scale = 0.78 + noise(index + 33) * 0.58;
    const duration = 18 + noise(index + 37) * 22;

    item.className = `photo-dot depth-${index % 6}`;
    item.type = "button";
    item.style.width = `${Math.round(size)}px`;
    item.style.setProperty("--x", `${startX.toFixed(2)}vw`);
    item.style.setProperty("--y", `${startY.toFixed(2)}vh`);
    item.style.setProperty("--dx1", `${dx1.toFixed(2)}vw`);
    item.style.setProperty("--dy1", `${dy1.toFixed(2)}vh`);
    item.style.setProperty("--dx2", `${dx2.toFixed(2)}vw`);
    item.style.setProperty("--dy2", `${dy2.toFixed(2)}vh`);
    item.style.setProperty("--r", `${rotate.toFixed(2)}deg`);
    item.style.setProperty("--s", scale.toFixed(3));
    item.style.setProperty("--dur", `${duration.toFixed(2)}s`);
    item.style.setProperty("--delay", `${(-duration * noise(index + 41)).toFixed(2)}s`);

    image.src = photo.src;
    image.alt = "";
    image.loading = "eager";
    image.decoding = "async";
    item.appendChild(image);
    layer.appendChild(item);
  });

  window.setTimeout(() => {
    photoFlow.classList.add("is-ready");
  }, 80);
}

function openPhotoPage() {
  if (unlocked) {
    return;
  }

  unlocked = true;
  passwordInput.blur();
  passwordInput.disabled = true;
  passwordHint.textContent = "";
  storyPage.classList.remove("is-hidden");
  lockScreen.classList.add("is-hidden");
  document.body.classList.add("story-open");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.setTimeout(buildPhotoParticles, 80);
}

function focusPasswordInput() {
  if (!unlocked && !lockScreen.classList.contains("is-hidden")) {
    passwordInput.focus({ preventScroll: true });
  }
}

function checkPassword() {
  if (unlocked || passwordInput.value.length < 6) {
    return;
  }

  if (passwordInput.value === PASSWORD) {
    openPhotoPage();
    return;
  }

  passwordHint.textContent = "\u518d\u8bd5\u4e00\u6b21";
  passwordHint.classList.add("error");
  passwordInput.value = "";
  focusPasswordInput();
}

window.setTimeout(focusPasswordInput, 150);

lockScreen.addEventListener("pointerdown", () => {
  window.setTimeout(focusPasswordInput, 0);
});

document.addEventListener("keydown", (event) => {
  if (unlocked || lockScreen.classList.contains("is-hidden") || event.target === passwordInput) {
    return;
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    passwordInput.value = (passwordInput.value + event.key).slice(0, 6);
    checkPassword();
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    passwordInput.value = passwordInput.value.slice(0, -1);
  }
});

passwordInput.addEventListener("input", () => {
  passwordInput.value = passwordInput.value.replace(/\D/g, "").slice(0, 6);
  checkPassword();
});

renderCountdowns();
window.setInterval(renderCountdowns, 1000);

openClockButton.addEventListener("click", openCountdownPage);
backHomeButton.addEventListener("click", closeCountdownPage);
addMeetingButton.addEventListener("click", addMeeting);
cancelEditButton.addEventListener("click", () => {
  resetMeetingEditor(true);
  showAddHint("\u5df2\u53d6\u6d88\u66f4\u6539\uff0c\u53ef\u4ee5\u7ee7\u7eed\u6dfb\u52a0\u65b0\u7684\u89c1\u9762\u3002");
});

[meetingNameInput, meetingDateInput, meetingTimeInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addMeeting();
    }
  });
});

countdownPage.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-meeting]");
  const deleteButton = event.target.closest("[data-delete-meeting]");

  if (editButton) {
    startEditingMeeting(editButton.dataset.editMeeting);
    return;
  }

  if (deleteButton) {
    deleteMeeting(deleteButton.dataset.deleteMeeting);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("clock-open")) {
    closeCountdownPage();
  }
});

pigPet.addEventListener("click", () => {
  pigMessageIndex = (pigMessageIndex + 1) % pigMessages.length;
  pigBubble.textContent = pigMessages[pigMessageIndex];
  pigPet.classList.add("is-chatting");
  window.clearTimeout(pigPet.chatTimer);
  pigPet.chatTimer = window.setTimeout(() => {
    pigPet.classList.remove("is-chatting");
  }, 1800);
});
