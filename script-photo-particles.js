const PASSWORD = "260223";

const lockScreen = document.querySelector("#lockScreen");
const storyPage = document.querySelector("#storyPage");
const passwordInput = document.querySelector("#passwordInput");
const passwordHint = document.querySelector("#passwordHint");
const pigPet = document.querySelector("#pigPet");
const pigBubble = document.querySelector("#pigBubble");
const photoFlow = document.querySelector("#photoFlow");
const openClockButton = document.querySelector("#openClockButton");
const openMapButton = document.querySelector("#openMapButton");
const countdownPage = document.querySelector("#countdownPage");
const backHomeButton = document.querySelector("#backHomeButton");
const mapPage = document.querySelector("#mapPage");
const backHomeFromMapButton = document.querySelector("#backHomeFromMapButton");
const mapView = document.querySelector("#mapView");
const cityAlbumView = document.querySelector("#cityAlbumView");
const cityMarkerList = document.querySelector("#cityMarkerList");
const visitedCityList = document.querySelector("#visitedCityList");
const backMapButton = document.querySelector("#backMapButton");
const cityAlbumTitle = document.querySelector("#cityAlbumTitle");
const addCityAlbumButton = document.querySelector("#addCityAlbumButton");
const cityUploadPanel = document.querySelector("#cityUploadPanel");
const cityAlbumNameInput = document.querySelector("#cityAlbumNameInput");
const cityPhotoInput = document.querySelector("#cityPhotoInput");
const chooseCityPhotosButton = document.querySelector("#chooseCityPhotosButton");
const saveCityAlbumButton = document.querySelector("#saveCityAlbumButton");
const cancelCityAlbumButton = document.querySelector("#cancelCityAlbumButton");
const cityUploadHint = document.querySelector("#cityUploadHint");
const cityAlbumGroups = document.querySelector("#cityAlbumGroups");
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
const API_BASE_URL = window.CLYTZE_API_BASE_URL || "";
const SITE_DATA_PATH = "data/site-data.json";
const CITY_ALBUM_DB_NAME = "clytze-city-albums-v1";
const CITY_ALBUM_STORE = "albums";
const MAP_CITIES = [
  { id: "beijing", name: "\u5317\u4eac", x: 56, y: 30, visited: true, note: "\u5317\u90ae\u7684\u65e5\u5e38\u5750\u6807" },
  { id: "jinan", name: "\u6d4e\u5357", x: 57, y: 39, visited: true, note: "\u76ca\u53cb\u76f8\u8bc6\u7684\u5730\u65b9" },
  { id: "liaocheng", name: "\u804a\u57ce", x: 53, y: 39, visited: true, note: "\u4f60\u7684\u6545\u4e61" },
  { id: "jining", name: "\u6d4e\u5b81", x: 56, y: 43, visited: true, note: "\u5979\u7684\u6545\u4e61" },
  { id: "shenzhen", name: "\u6df1\u5733", x: 61, y: 76, visited: true, note: "2000km \u5954\u8d74" },
  { id: "xiamen", name: "\u53a6\u95e8", x: 66, y: 69, visited: true, note: "\u4e94\u4e00\u65c5\u884c" },
  { id: "shanghai", name: "\u4e0a\u6d77", x: 69, y: 52, visited: false },
  { id: "hangzhou", name: "\u676d\u5dde", x: 67, y: 57, visited: false },
  { id: "chengdu", name: "\u6210\u90fd", x: 39, y: 58, visited: false },
  { id: "xian", name: "\u897f\u5b89", x: 48, y: 49, visited: false },
  { id: "qingdao", name: "\u9752\u5c9b", x: 62, y: 38, visited: false },
  { id: "guangzhou", name: "\u5e7f\u5dde", x: 59, y: 74, visited: false }
];
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
let selectedCityId = null;
let selectedCityFiles = [];
let cityAlbumDbPromise = null;
let uploadSecret = "";
let customMeetingsCache = [];
let cityAlbumsCache = [];

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

function normalizeMeeting(meeting) {
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
}

function loadLocalMeetings() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEETING_STORAGE_KEY) || "[]");

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved.map(normalizeMeeting).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function loadCustomMeetings() {
  return customMeetingsCache;
}

function saveCustomMeetings(meetings) {
  customMeetingsCache = meetings.map(normalizeMeeting).filter(Boolean);

  try {
    localStorage.setItem(MEETING_STORAGE_KEY, JSON.stringify(customMeetingsCache));
    return true;
  } catch (error) {
    return false;
  }
}

function getBackendUrl() {
  const base = API_BASE_URL.replace(/\/$/, "");

  return `${base}/api/github-save`;
}

async function saveToGithub(action, payload) {
  if (!uploadSecret) {
    throw new Error("\u8fd8\u6ca1\u6709\u89e3\u9501\uff0c\u4e0d\u80fd\u4fdd\u5b58\u5230 GitHub\u3002");
  }

  const response = await fetch(getBackendUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      secret: uploadSecret,
      action,
      payload
    })
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.message || "\u4fdd\u5b58\u5230 GitHub \u5931\u8d25\u3002");
  }

  if (result.data) {
    applySiteData(result.data);
  }

  return result;
}

function normalizeCityAlbum(album) {
  if (!album || !album.cityId || !Array.isArray(album.photos)) {
    return null;
  }

  return {
    id: String(album.id || `album-${Date.now()}`),
    cityId: String(album.cityId),
    cityName: String(album.cityName || ""),
    title: String(album.title || "\u4e00\u7ec4\u7167\u7247").slice(0, 40),
    createdAt: Number(album.createdAt) || Date.now(),
    photos: album.photos
      .filter((photo) => photo && photo.src)
      .map((photo) => ({
        name: String(photo.name || ""),
        src: String(photo.src)
      }))
  };
}

function applySiteData(data) {
  if (Array.isArray(data.meetings)) {
    saveCustomMeetings(data.meetings);
  }

  if (Array.isArray(data.cityAlbums)) {
    cityAlbumsCache = data.cityAlbums.map(normalizeCityAlbum).filter(Boolean);
  }

  renderCountdowns();

  if (selectedCityId) {
    renderCityAlbums(selectedCityId);
  }
}

async function loadSiteData() {
  try {
    const response = await fetch(`${SITE_DATA_PATH}?v=${Date.now()}`, { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    applySiteData(await response.json());
  } catch (error) {
    customMeetingsCache = loadLocalMeetings();
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

async function addMeeting() {
  if (!meetingDateInput || !addMeetingButton) {
    return;
  }

  const timestamp = parseMeetingTimestamp(meetingDateInput.value, meetingTimeInput.value);

  if (!Number.isFinite(timestamp)) {
    showAddHint("\u5148\u9009\u4e00\u4e2a\u89c1\u9762\u65e5\u671f\u5427\u3002", true);
    return;
  }

  const name = (meetingNameInput.value || "").trim() || "\u4e0b\u4e00\u6b21\u89c1\u9762";
  const previousMeetings = loadCustomMeetings().map((meeting) => ({ ...meeting }));
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
  addMeetingButton.disabled = true;
  showAddHint("\u6b63\u5728\u4fdd\u5b58\u5230 GitHub...");

  try {
    await saveToGithub("save-meetings", { meetings: loadCustomMeetings() });
    resetMeetingEditor(true);
    showAddHint(wasEditing
      ? "\u5df2\u4fdd\u5b58\u5230 GitHub\uff0c\u8fd9\u6761\u89c1\u9762\u5df2\u66f4\u65b0\u3002"
      : (timestamp > Date.now()
        ? "\u5df2\u4fdd\u5b58\u5230 GitHub\uff0c\u5e76\u52a0\u5165\u4e0b\u6b21\u89c1\u9762\u5012\u8ba1\u65f6\u3002"
        : "\u5df2\u4fdd\u5b58\u5230 GitHub\uff0c\u5e76\u52a0\u5165\u89c1\u9762\u8bb0\u5f55\u3002"));
  } catch (error) {
    saveCustomMeetings(previousMeetings);
    showAddHint(error.message || "\u4fdd\u5b58\u5230 GitHub \u5931\u8d25\u3002", true);
  } finally {
    addMeetingButton.disabled = false;
    renderCountdowns();
  }
}

async function deleteMeeting(id) {
  const previousMeetings = loadCustomMeetings().map((meeting) => ({ ...meeting }));
  const nextMeetings = loadCustomMeetings().filter((meeting) => meeting.id !== id);

  saveCustomMeetings(nextMeetings);
  if (editingMeetingId === id) {
    resetMeetingEditor(true);
  }
  showAddHint("\u6b63\u5728\u4ece GitHub \u66f4\u65b0\u8fd9\u6761\u8bb0\u5f55...");

  try {
    await saveToGithub("save-meetings", { meetings: loadCustomMeetings() });
    showAddHint("\u5df2\u4ece GitHub \u66f4\u65b0\u8fd9\u6761\u8bb0\u5f55\u3002");
  } catch (error) {
    saveCustomMeetings(previousMeetings);
    showAddHint(error.message || "\u5220\u9664\u5931\u8d25\uff0cGitHub \u6ca1\u6709\u66f4\u65b0\u3002", true);
  } finally {
    renderCountdowns();
  }
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

function getCityById(id) {
  return MAP_CITIES.find((city) => city.id === id);
}

function openCityAlbumDb() {
  if (cityAlbumDbPromise) {
    return cityAlbumDbPromise;
  }

  cityAlbumDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(CITY_ALBUM_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(CITY_ALBUM_STORE)) {
        db.createObjectStore(CITY_ALBUM_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return cityAlbumDbPromise;
}

function getCityAlbums(cityId) {
  return Promise.resolve(cityAlbumsCache
    .filter((album) => album.cityId === cityId)
    .sort((a, b) => b.createdAt - a.createdAt));
}

function saveCityAlbum(album) {
  return openCityAlbumDb().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(CITY_ALBUM_STORE, "readwrite");
    const store = transaction.objectStore(CITY_ALBUM_STORE);
    const request = store.put(album);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  }));
}

function deleteCityAlbum(albumId) {
  return saveToGithub("delete-city-album", { albumId });
}

function resizePhotoFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve({
          name: file.name,
          src: canvas.toDataURL("image/jpeg", 0.84)
        });
      };

      image.onerror = () => resolve({
        name: file.name,
        src: reader.result
      });
      image.src = reader.result;
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function renderCityMarkers() {
  if (!cityMarkerList || !visitedCityList) {
    return;
  }

  cityMarkerList.innerHTML = MAP_CITIES.map((city) => `
    <button
      class="city-marker${city.visited ? " is-visited" : ""}"
      type="button"
      style="left: ${city.x}%; top: ${city.y}%;"
      data-city-id="${city.id}"
      ${city.visited ? "" : "disabled"}
      aria-label="${city.name}${city.visited ? "" : "\u8fd8\u6ca1\u6709\u8bb0\u5f55"}"
    >
      <span></span>
      <em>${city.name}</em>
    </button>
  `).join("");

  visitedCityList.innerHTML = MAP_CITIES
    .filter((city) => city.visited)
    .map((city) => `
      <button class="visited-city-card" type="button" data-city-id="${city.id}">
        <strong>${city.name}</strong>
        <span>${city.note}</span>
      </button>
    `)
    .join("");
}

function openMapPage() {
  if (!mapPage || mapPage.classList.contains("is-active")) {
    return;
  }

  renderCityMarkers();
  mapPage.classList.remove("is-hidden");
  mapView.classList.remove("is-hidden");
  cityAlbumView.classList.add("is-hidden");
  storyPage.classList.add("is-shifted");
  document.body.classList.add("map-open");
  window.requestAnimationFrame(() => {
    mapPage.classList.add("is-active");
  });
}

function closeMapPage() {
  if (!mapPage || !mapPage.classList.contains("is-active")) {
    return;
  }

  mapPage.classList.remove("is-active");
  storyPage.classList.remove("is-shifted");
  document.body.classList.remove("map-open");
  window.setTimeout(() => {
    if (!mapPage.classList.contains("is-active")) {
      mapPage.classList.add("is-hidden");
    }
  }, 560);
}

function resetCityUpload() {
  selectedCityFiles = [];
  cityAlbumNameInput.value = "";
  cityPhotoInput.value = "";
  cityUploadHint.textContent = "\u5148\u9009\u62e9\u7167\u7247\uff0c\u518d\u7ed9\u8fd9\u4e00\u7ec4\u8d77\u540d\u5b57\u3002";
  cityUploadHint.classList.remove("is-error");
  cityUploadPanel.classList.add("is-hidden");
}

function renderCityAlbums(cityId) {
  const city = getCityById(cityId);

  if (!city) {
    return;
  }

  cityAlbumTitle.textContent = `${city.name}\u76f8\u518c`;
  cityAlbumGroups.innerHTML = `<div class="city-album-empty">\u6b63\u5728\u8bfb\u53d6\u7167\u7247...</div>`;

  getCityAlbums(cityId)
    .then((albums) => {
      if (albums.length === 0) {
        cityAlbumGroups.innerHTML = `<div class="city-album-empty">\u8fd9\u5ea7\u57ce\u5e02\u8fd8\u6ca1\u6709\u7167\u7247\u7ec4\uff0c\u70b9\u53f3\u4e0a\u89d2 + \u6dfb\u52a0\u5427\u3002</div>`;
        return;
      }

      cityAlbumGroups.innerHTML = albums.map((album) => `
        <article class="city-album-group">
          <div class="city-album-group-head">
            <div>
              <p class="card-label">${new Date(album.createdAt).toLocaleDateString("zh-CN")}</p>
              <h3>${escapeHtml(album.title)}</h3>
            </div>
            <button class="city-album-delete" type="button" data-delete-album="${album.id}">\u5220\u9664</button>
          </div>
          <div class="city-photo-grid">
            ${album.photos.map((photo) => `<img src="${photo.src}" alt="${escapeHtml(photo.name || album.title)}" loading="lazy" />`).join("")}
          </div>
        </article>
      `).join("");
    })
    .catch(() => {
      cityAlbumGroups.innerHTML = `<div class="city-album-empty">\u8fd9\u4e2a\u6d4f\u89c8\u5668\u6682\u65f6\u8bfb\u4e0d\u5230\u672c\u5730\u76f8\u518c\u3002</div>`;
    });
}

function openCityAlbum(cityId) {
  const city = getCityById(cityId);

  if (!city || !city.visited) {
    return;
  }

  selectedCityId = city.id;
  resetCityUpload();
  mapView.classList.add("is-hidden");
  cityAlbumView.classList.remove("is-hidden");
  renderCityAlbums(city.id);
}

function backToMapView() {
  selectedCityId = null;
  resetCityUpload();
  cityAlbumView.classList.add("is-hidden");
  mapView.classList.remove("is-hidden");
}

function handleCityPhotoSelection() {
  selectedCityFiles = Array.from(cityPhotoInput.files || []).filter((file) => file.type.startsWith("image/"));

  if (selectedCityFiles.length === 0) {
    cityUploadHint.textContent = "\u6ca1\u6709\u9009\u5230\u56fe\u7247\uff0c\u8bf7\u91cd\u65b0\u9009\u4e00\u6b21\u3002";
    cityUploadHint.classList.add("is-error");
    return;
  }

  cityUploadHint.textContent = `\u5df2\u9009\u62e9 ${selectedCityFiles.length} \u5f20\u7167\u7247\uff0c\u7ed9\u5b83\u4eec\u8d77\u4e2a\u540d\u5b57\u540e\u4fdd\u5b58\u3002`;
  cityUploadHint.classList.remove("is-error");
}

async function saveSelectedCityAlbum() {
  if (!selectedCityId) {
    return;
  }

  if (selectedCityFiles.length === 0) {
    cityUploadHint.textContent = "\u5148\u9009\u62e9\u8981\u653e\u8fdb\u8fd9\u5ea7\u57ce\u5e02\u7684\u7167\u7247\u3002";
    cityUploadHint.classList.add("is-error");
    return;
  }

  const city = getCityById(selectedCityId);
  const title = (cityAlbumNameInput.value || "").trim() || `${city.name}\u7684\u4e00\u7ec4\u7167\u7247`;

  saveCityAlbumButton.disabled = true;
  cityUploadHint.textContent = "\u6b63\u5728\u538b\u7f29\u7167\u7247\u5e76\u4fdd\u5b58\u5230 GitHub...";
  cityUploadHint.classList.remove("is-error");

  try {
    const photosForAlbum = [];

    for (const file of selectedCityFiles) {
      photosForAlbum.push(await resizePhotoFile(file));
    }

    await saveToGithub("add-city-album", {
      cityId: selectedCityId,
      cityName: city.name,
      title: title.slice(0, 22),
      photos: photosForAlbum
    });

    resetCityUpload();
    renderCityAlbums(selectedCityId);
  } catch (error) {
    cityUploadHint.textContent = error.message || "\u4fdd\u5b58\u5230 GitHub \u5931\u8d25\u4e86\uff0c\u53ef\u80fd\u662f\u7167\u7247\u592a\u591a\u6216\u540e\u7aef\u8fd8\u6ca1\u914d\u597d\u3002";
    cityUploadHint.classList.add("is-error");
  } finally {
    saveCityAlbumButton.disabled = false;
  }
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
    uploadSecret = passwordInput.value;
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

customMeetingsCache = loadLocalMeetings();
renderCountdowns();
renderCityMarkers();
loadSiteData();
window.setInterval(renderCountdowns, 1000);

openClockButton.addEventListener("click", openCountdownPage);
backHomeButton.addEventListener("click", closeCountdownPage);
openMapButton.addEventListener("click", openMapPage);
backHomeFromMapButton.addEventListener("click", closeMapPage);
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

cityMarkerList.addEventListener("click", (event) => {
  const cityButton = event.target.closest("[data-city-id]");

  if (cityButton && !cityButton.disabled) {
    openCityAlbum(cityButton.dataset.cityId);
  }
});

visitedCityList.addEventListener("click", (event) => {
  const cityButton = event.target.closest("[data-city-id]");

  if (cityButton) {
    openCityAlbum(cityButton.dataset.cityId);
  }
});

backMapButton.addEventListener("click", backToMapView);
addCityAlbumButton.addEventListener("click", () => {
  cityUploadPanel.classList.remove("is-hidden");
  cityAlbumNameInput.focus({ preventScroll: true });
});
chooseCityPhotosButton.addEventListener("click", () => {
  cityPhotoInput.click();
});
cityPhotoInput.addEventListener("change", handleCityPhotoSelection);
saveCityAlbumButton.addEventListener("click", saveSelectedCityAlbum);
cancelCityAlbumButton.addEventListener("click", resetCityUpload);
cityAlbumNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    saveSelectedCityAlbum();
  }
});
cityAlbumGroups.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-album]");

  if (!deleteButton || !selectedCityId) {
    return;
  }

  deleteCityAlbum(deleteButton.dataset.deleteAlbum)
    .then(() => renderCityAlbums(selectedCityId))
    .catch((error) => {
      cityAlbumGroups.insertAdjacentHTML("afterbegin", `<div class="city-album-empty">${escapeHtml(error.message || "\u5220\u9664\u5931\u8d25\uff0cGitHub \u6ca1\u6709\u66f4\u65b0\u3002")}</div>`);
    });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("clock-open")) {
    closeCountdownPage();
    return;
  }

  if (event.key === "Escape" && document.body.classList.contains("map-open")) {
    if (!cityAlbumView.classList.contains("is-hidden")) {
      backToMapView();
      return;
    }

    closeMapPage();
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
