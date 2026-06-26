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
const openMessagesButton = document.querySelector("#openMessagesButton");
const countdownPage = document.querySelector("#countdownPage");
const backHomeButton = document.querySelector("#backHomeButton");
const mapPage = document.querySelector("#mapPage");
const backHomeFromMapButton = document.querySelector("#backHomeFromMapButton");
const messagePage = document.querySelector("#messagePage");
const backHomeFromMessagesButton = document.querySelector("#backHomeFromMessagesButton");
const messageList = document.querySelector("#messageList");
const messageTextInput = document.querySelector("#messageTextInput");
const messageHint = document.querySelector("#messageHint");
const sendMessageButton = document.querySelector("#sendMessageButton");
const messageAuthorButtons = Array.from(document.querySelectorAll("[data-message-author]"));
const messageCategoryButtons = Array.from(document.querySelectorAll("[data-message-category]"));
const mapView = document.querySelector("#mapView");
const cityAlbumView = document.querySelector("#cityAlbumView");
const chinaMapSvg = document.querySelector("#chinaMapSvg");
const cityRegionList = document.querySelector("#cityRegionList");
const cityMarkerList = document.querySelector("#cityMarkerList");
const citySelect = document.querySelector("#citySelect");
const addVisitedCityButton = document.querySelector("#addVisitedCityButton");
const cityAddHint = document.querySelector("#cityAddHint");
const cityCountLine = document.querySelector("#cityCountLine");
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
const CHINA_MAP_PATH = "data/china-map.geojson";
const CITY_BOUNDARIES_PATH = "data/city-boundaries.json";
const CITY_ALBUM_DB_NAME = "clytze-city-albums-v1";
const CITY_ALBUM_STORE = "albums";
const MAP_VIEWBOX = { width: 720, height: 520 };
const CHINA_BOUNDS = {
  minLng: 73.4,
  maxLng: 135.2,
  minLat: 17.6,
  maxLat: 53.7
};
const MAP_MIN_VISIBLE_LAT = 16.8;
const MESSAGE_CATEGORY_INFO = {
  good: {
    iconClass: "heart-icon",
    label: "爱心留言"
  },
  bad: {
    iconClass: "broken-heart-icon",
    label: "心碎留言"
  }
};
const MESSAGE_RECENT_DAYS = 30;
const MAP_CITIES = [
  { id: "beijing", name: "\u5317\u4eac", lng: 116.4074, lat: 39.9042, adcode: "110000" },
  { id: "tianjin", name: "\u5929\u6d25", lng: 117.2000, lat: 39.1333, adcode: "120000" },
  { id: "shijiazhuang", name: "\u77f3\u5bb6\u5e84", lng: 114.5149, lat: 38.0428, adcode: "130100" },
  { id: "taiyuan", name: "\u592a\u539f", lng: 112.5489, lat: 37.8706, adcode: "140100" },
  { id: "hohhot", name: "\u547c\u548c\u6d69\u7279", lng: 111.7519, lat: 40.8415, adcode: "150100" },
  { id: "jinan", name: "\u6d4e\u5357", lng: 117.1201, lat: 36.6512, adcode: "370100" },
  { id: "liaocheng", name: "\u804a\u57ce", lng: 115.9854, lat: 36.4567, adcode: "371500" },
  { id: "jining", name: "\u6d4e\u5b81", lng: 116.5872, lat: 35.4154, adcode: "370800" },
  { id: "qingdao", name: "\u9752\u5c9b", lng: 120.3826, lat: 36.0671, adcode: "370200" },
  { id: "yantai", name: "\u70df\u53f0", lng: 121.4479, lat: 37.4638, adcode: "370600" },
  { id: "zhengzhou", name: "\u90d1\u5dde", lng: 113.6254, lat: 34.7466, adcode: "410100" },
  { id: "luoyang", name: "\u6d1b\u9633", lng: 112.4536, lat: 34.6197, adcode: "410300" },
  { id: "kaifeng", name: "\u5f00\u5c01", lng: 114.3076, lat: 34.7973, adcode: "410200" },
  { id: "xian", name: "\u897f\u5b89", lng: 108.9398, lat: 34.3416, adcode: "610100" },
  { id: "lanzhou", name: "\u5170\u5dde", lng: 103.8343, lat: 36.0611, adcode: "620100" },
  { id: "xining", name: "\u897f\u5b81", lng: 101.7782, lat: 36.6171, adcode: "630100" },
  { id: "yinchuan", name: "\u94f6\u5ddd", lng: 106.2309, lat: 38.4872, adcode: "640100" },
  { id: "urumqi", name: "\u4e4c\u9c81\u6728\u9f50", lng: 87.6168, lat: 43.8256, adcode: "650100" },
  { id: "shanghai", name: "\u4e0a\u6d77", lng: 121.4737, lat: 31.2304, adcode: "310000" },
  { id: "nanjing", name: "\u5357\u4eac", lng: 118.7969, lat: 32.0603, adcode: "320100" },
  { id: "suzhou", name: "\u82cf\u5dde", lng: 120.5853, lat: 31.2989, adcode: "320500" },
  { id: "wuxi", name: "\u65e0\u9521", lng: 120.3119, lat: 31.4912, adcode: "320200" },
  { id: "hangzhou", name: "\u676d\u5dde", lng: 120.1551, lat: 30.2741, adcode: "330100" },
  { id: "ningbo", name: "\u5b81\u6ce2", lng: 121.5503, lat: 29.8746, adcode: "330200" },
  { id: "hefei", name: "\u5408\u80a5", lng: 117.2272, lat: 31.8206, adcode: "340100" },
  { id: "huangshan", name: "\u9ec4\u5c71", lng: 118.3375, lat: 29.7147, adcode: "341000" },
  { id: "fuzhou", name: "\u798f\u5dde", lng: 119.2965, lat: 26.0745, adcode: "350100" },
  { id: "xiamen", name: "\u53a6\u95e8", lng: 118.0894, lat: 24.4798, adcode: "350200" },
  { id: "nanchang", name: "\u5357\u660c", lng: 115.8582, lat: 28.6829, adcode: "360100" },
  { id: "jingdezhen", name: "\u666f\u5fb7\u9547", lng: 117.1849, lat: 29.2744, adcode: "360200" },
  { id: "wuhan", name: "\u6b66\u6c49", lng: 114.3054, lat: 30.5931, adcode: "420100" },
  { id: "changsha", name: "\u957f\u6c99", lng: 112.9388, lat: 28.2282, adcode: "430100" },
  { id: "zhangjiajie", name: "\u5f20\u5bb6\u754c", lng: 110.4792, lat: 29.1171, adcode: "430800" },
  { id: "guangzhou", name: "\u5e7f\u5dde", lng: 113.2644, lat: 23.1291, adcode: "440100" },
  { id: "shenzhen", name: "\u6df1\u5733", lng: 114.0579, lat: 22.5431, adcode: "440300" },
  { id: "zhuhai", name: "\u73e0\u6d77", lng: 113.5767, lat: 22.2707, adcode: "440400" },
  { id: "foshan", name: "\u4f5b\u5c71", lng: 113.1214, lat: 23.0215, adcode: "440600" },
  { id: "nanning", name: "\u5357\u5b81", lng: 108.3669, lat: 22.8170, adcode: "450100" },
  { id: "guilin", name: "\u6842\u6797", lng: 110.2900, lat: 25.2736, adcode: "450300" },
  { id: "haikou", name: "\u6d77\u53e3", lng: 110.1983, lat: 20.0440, adcode: "460100" },
  { id: "sanya", name: "\u4e09\u4e9a", lng: 109.5119, lat: 18.2528, adcode: "460200" },
  { id: "chongqing", name: "\u91cd\u5e86", lng: 106.5516, lat: 29.5630, adcode: "500000" },
  { id: "chengdu", name: "\u6210\u90fd", lng: 104.0665, lat: 30.5723, adcode: "510100" },
  { id: "guiyang", name: "\u8d35\u9633", lng: 106.6302, lat: 26.6477, adcode: "520100" },
  { id: "kunming", name: "\u6606\u660e", lng: 102.8329, lat: 24.8801, adcode: "530100" },
  { id: "dali", name: "\u5927\u7406", lng: 100.2676, lat: 25.6065, adcode: "532900" },
  { id: "lijiang", name: "\u4e3d\u6c5f", lng: 100.2330, lat: 26.8721, adcode: "530700" },
  { id: "lhasa", name: "\u62c9\u8428", lng: 91.1172, lat: 29.6469, adcode: "540100" },
  { id: "shenyang", name: "\u6c88\u9633", lng: 123.4315, lat: 41.8057, adcode: "210100" },
  { id: "dalian", name: "\u5927\u8fde", lng: 121.6147, lat: 38.9140, adcode: "210200" },
  { id: "changchun", name: "\u957f\u6625", lng: 125.3235, lat: 43.8171, adcode: "220100" },
  { id: "harbin", name: "\u54c8\u5c14\u6ee8", lng: 126.5349, lat: 45.8038, adcode: "230100" }
];
const MAP_LABEL_CITY_IDS = new Set([
  "beijing",
  "jinan",
  "qingdao",
  "xian",
  "shanghai",
  "nanjing",
  "suzhou",
  "hangzhou",
  "huangshan",
  "xiamen",
  "wuhan",
  "changsha",
  "zhangjiajie",
  "guangzhou",
  "shenzhen",
  "guilin",
  "sanya",
  "chongqing",
  "chengdu",
  "kunming",
  "dali",
  "lijiang",
  "lhasa",
  "dalian",
  "harbin"
]);
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
let appendTargetAlbumId = null;
let cityAlbumDbPromise = null;
let uploadSecret = "";
let customMeetingsCache = [];
let cityAlbumsCache = [];
let visitedCityIds = [];
let messagesCache = [];
let selectedMessageAuthor = "陈立都";
let selectedMessageCategory = "good";
let chinaMapReady = false;
let activeMapBounds = { ...CHINA_BOUNDS };
let cityRegionSvgLayer = null;
let cityLabelSvgLayer = null;
let cityMarkerSvgLayer = null;
let cityBoundaryData = window.CITY_BOUNDARY_GEOJSON || null;
let cityBoundaryPromise = null;
let localDataVersion = 0;

function noise(seed) {
  const value = Math.sin(seed * 918.43) * 10000;
  return value - Math.floor(value);
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function normalizeVisitedCities(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const knownCityIds = new Set(MAP_CITIES.map((city) => city.id));

  return Array.from(new Set(value.map(String))).filter((cityId) => knownCityIds.has(cityId));
}

function normalizeMessage(message) {
  if (!message || !message.text) {
    return null;
  }

  const createdAt = Number(message.createdAt) || Date.now();
  const author = message.author === "王思澄" ? "王思澄" : "陈立都";
  const category = message.category === "bad" ? "bad" : "good";
  const text = String(message.text || "").trim().slice(0, 240);

  if (!text) {
    return null;
  }

  return {
    id: String(message.id || `message-${createdAt}`),
    author,
    category,
    text,
    createdAt
  };
}

function markLocalDataChanged() {
  localDataVersion += 1;
}

function applySiteData(data) {
  if (Array.isArray(data.meetings)) {
    saveCustomMeetings(data.meetings);
  }

  if (Array.isArray(data.cityAlbums)) {
    cityAlbumsCache = data.cityAlbums.map(normalizeCityAlbum).filter(Boolean);
  }

  visitedCityIds = normalizeVisitedCities(data.visitedCities);

  if (Array.isArray(data.messages)) {
    messagesCache = data.messages.map(normalizeMessage).filter(Boolean);
  }

  renderCountdowns();
  renderCityMarkers();
  renderMessages();

  if (selectedCityId) {
    renderCityAlbums(selectedCityId);
  }
}

async function loadSiteData() {
  const versionAtStart = localDataVersion;

  try {
    const response = await fetch(`${SITE_DATA_PATH}?v=${Date.now()}`, { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    if (versionAtStart !== localDataVersion) {
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

  markLocalDataChanged();
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
  markLocalDataChanged();
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

function getCityBoundary(cityId) {
  return cityBoundaryData && cityBoundaryData[cityId]
    ? cityBoundaryData[cityId]
    : null;
}

function expandBounds(bounds, lng, lat) {
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || lat < MAP_MIN_VISIBLE_LAT) {
    return bounds;
  }

  bounds.minLng = Math.min(bounds.minLng, lng);
  bounds.maxLng = Math.max(bounds.maxLng, lng);
  bounds.minLat = Math.min(bounds.minLat, lat);
  bounds.maxLat = Math.max(bounds.maxLat, lat);
  return bounds;
}

function walkCoordinates(coordinates, callback) {
  if (!Array.isArray(coordinates)) {
    return;
  }

  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    callback(coordinates[0], coordinates[1]);
    return;
  }

  coordinates.forEach((item) => walkCoordinates(item, callback));
}

function getFeatureCollectionBounds(data) {
  const bounds = {
    minLng: Infinity,
    maxLng: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity
  };
  const features = Array.isArray(data && data.features) ? data.features : [];

  features.forEach((feature) => {
    if (!feature || !feature.geometry) {
      return;
    }

    walkCoordinates(feature.geometry.coordinates, (lng, lat) => expandBounds(bounds, lng, lat));
  });

  if (!Number.isFinite(bounds.minLng) || !Number.isFinite(bounds.minLat)) {
    return { ...CHINA_BOUNDS };
  }

  return bounds;
}

function getCityBoundaryCenter(city) {
  const boundary = getCityBoundary(city.id);
  const feature = boundary && Array.isArray(boundary.features) ? boundary.features[0] : null;
  const properties = feature && feature.properties ? feature.properties : {};
  const point = Array.isArray(properties.centroid) ? properties.centroid : properties.center;

  if (Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1])) {
    return { lng: point[0], lat: point[1] };
  }

  const bounds = boundary ? getFeatureCollectionBounds(boundary) : null;

  if (bounds) {
    return {
      lng: (bounds.minLng + bounds.maxLng) / 2,
      lat: (bounds.minLat + bounds.maxLat) / 2
    };
  }

  return { lng: city.lng, lat: city.lat };
}

function projectMapPoint(lng, lat) {
  const usableWidth = MAP_VIEWBOX.width - 56;
  const usableHeight = MAP_VIEWBOX.height - 56;
  const x = 28 + ((lng - activeMapBounds.minLng) / (activeMapBounds.maxLng - activeMapBounds.minLng)) * usableWidth;
  const y = 28 + ((activeMapBounds.maxLat - lat) / (activeMapBounds.maxLat - activeMapBounds.minLat)) * usableHeight;

  return { x, y };
}

function getCityMapPoint(city) {
  if (Number.isFinite(city.lng) && Number.isFinite(city.lat)) {
    const center = getCityBoundaryCenter(city);

    return projectMapPoint(center.lng, center.lat);
  }

  return {
    x: ((city.x || 50) / 100) * MAP_VIEWBOX.width,
    y: ((city.y || 50) / 100) * MAP_VIEWBOX.height
  };
}

function ringToSvgPath(ring) {
  return ring
    .filter((point) => Array.isArray(point) && point.length >= 2 && point[1] >= 16.8)
    .map((point, index) => {
      const projected = projectMapPoint(point[0], point[1]);
      const command = index === 0 ? "M" : "L";

      return `${command}${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`;
    })
    .join(" ");
}

function geometryToSvgPath(geometry) {
  if (!geometry || !geometry.coordinates) {
    return "";
  }

  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates]
    : geometry.coordinates;

  return polygons
    .flatMap((polygon) => polygon.map((ring) => {
      const path = ringToSvgPath(ring);

      return path ? `${path} Z` : "";
    }))
    .filter(Boolean)
    .join(" ");
}

function setupChinaMapSvg() {
  if (!chinaMapSvg || chinaMapReady) {
    return;
  }

  chinaMapSvg.innerHTML = `
    <defs>
      <linearGradient id="chinaGeoGradient" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#3f8067" />
        <stop offset="58%" stop-color="#2e6f63" />
        <stop offset="100%" stop-color="#214f69" />
      </linearGradient>
    </defs>
    <g class="province-layer" id="chinaGeoLayer"></g>
    <g class="city-region-svg-layer" id="cityRegionSvgLayer"></g>
    <g class="city-label-svg-layer" id="cityLabelSvgLayer"></g>
    <g class="city-marker-svg-layer" id="cityMarkerSvgLayer"></g>
  `;
  cityRegionSvgLayer = chinaMapSvg.querySelector("#cityRegionSvgLayer");
  cityLabelSvgLayer = chinaMapSvg.querySelector("#cityLabelSvgLayer");
  cityMarkerSvgLayer = chinaMapSvg.querySelector("#cityMarkerSvgLayer");
}

function renderChinaGeoMap(data) {
  activeMapBounds = getFeatureCollectionBounds(data);
  setupChinaMapSvg();

  const geoLayer = chinaMapSvg && chinaMapSvg.querySelector("#chinaGeoLayer");
  const features = Array.isArray(data.features) ? data.features : [];

  if (!geoLayer) {
    return;
  }

  geoLayer.innerHTML = features.map((feature, index) => {
    const name = feature.properties && feature.properties.name ? feature.properties.name : "";
    const path = geometryToSvgPath(feature.geometry);

    if (!path) {
      return "";
    }

    return `<path class="china-province tone-${(index % 12) + 1}" data-province="${escapeHtml(name)}" d="${path}"></path>`;
  }).join("");
  chinaMapReady = true;
  renderCityMarkers();
}

async function loadChinaGeoMap() {
  if (!chinaMapSvg || chinaMapReady) {
    return;
  }

  if (window.CHINA_MAP_GEOJSON) {
    renderChinaGeoMap(window.CHINA_MAP_GEOJSON);
    return;
  }

  try {
    const response = await fetch(`${CHINA_MAP_PATH}?v=1`, { cache: "force-cache" });

    if (!response.ok) {
      throw new Error("map load failed");
    }

    renderChinaGeoMap(await response.json());
  } catch (error) {
    chinaMapSvg.classList.add("is-fallback-map");
  }
}

function loadCityBoundaries() {
  if (cityBoundaryData) {
    return Promise.resolve(cityBoundaryData);
  }

  if (cityBoundaryPromise) {
    return cityBoundaryPromise;
  }

  cityBoundaryPromise = fetch(`${CITY_BOUNDARIES_PATH}?v=1`, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("city boundaries load failed");
      }

      return response.json();
    })
    .then((data) => {
      cityBoundaryData = data;
      renderCityMarkers();
      return data;
    })
    .catch((error) => {
      cityBoundaryPromise = null;
      throw error;
    });

  return cityBoundaryPromise;
}

function renderVisitedCityRegions(visitedCities) {
  if (!cityRegionSvgLayer) {
    return;
  }

  cityRegionSvgLayer.innerHTML = visitedCities.map((city) => {
    const boundary = getCityBoundary(city.id);
    const features = boundary && Array.isArray(boundary.features) ? boundary.features : [];
    const paths = features.map((feature) => geometryToSvgPath(feature.geometry)).filter(Boolean);

    if (paths.length > 0) {
      return paths.map((path) => `
        <path
          class="city-region-geo"
          data-city-id="${city.id}"
          d="${path}"
        ></path>
      `).join("");
    }

    const center = getCityBoundaryCenter(city);
    const point = projectMapPoint(center.lng, center.lat);
    const size = 9;
    const fallbackPath = [
      `M${(point.x - size).toFixed(2)} ${(point.y - 3).toFixed(2)}`,
      `L${(point.x - 2).toFixed(2)} ${(point.y - size).toFixed(2)}`,
      `L${(point.x + size).toFixed(2)} ${(point.y - 2).toFixed(2)}`,
      `L${(point.x + 4).toFixed(2)} ${(point.y + size).toFixed(2)}`,
      `L${(point.x - 7).toFixed(2)} ${(point.y + 6).toFixed(2)} Z`
    ].join(" ");

    return `<path class="city-region-geo city-region-fallback" data-city-id="${city.id}" d="${fallbackPath}"></path>`;
  }).join("");
}

function renderSvgCityLabels(labelCities, visitedIds) {
  if (!cityLabelSvgLayer) {
    return;
  }

  cityLabelSvgLayer.innerHTML = labelCities.map((city) => {
    const point = getCityMapPoint(city);
    const isVisited = visitedIds.includes(city.id);
    const labelY = point.y - (isVisited ? 16 : 0);

    return `
      <text
        class="city-map-label${isVisited ? " is-visited-label" : ""}"
        x="${point.x.toFixed(2)}"
        y="${labelY.toFixed(2)}"
      >${escapeHtml(city.name)}</text>
    `;
  }).join("");
}

function renderSvgCityMarkers(visitedCities) {
  if (!cityMarkerSvgLayer) {
    return;
  }

  cityMarkerSvgLayer.innerHTML = "";
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
        const maxSize = 960;
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
          src: canvas.toDataURL("image/jpeg", 0.72)
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
  if (!citySelect || !cityCountLine) {
    return;
  }

  const visitedCities = MAP_CITIES.filter((city) => visitedCityIds.includes(city.id));
  const unvisitedCities = MAP_CITIES.filter((city) => !visitedCityIds.includes(city.id));
  const labelCities = MAP_CITIES.filter((city) => MAP_LABEL_CITY_IDS.has(city.id) || visitedCityIds.includes(city.id));

  if (cityRegionList) {
    cityRegionList.innerHTML = "";
  }

  renderVisitedCityRegions(visitedCities);
  renderSvgCityLabels(labelCities, visitedCityIds);
  renderSvgCityMarkers(visitedCities);

  if (cityMarkerList) {
    cityMarkerList.innerHTML = "";
  }

  citySelect.innerHTML = unvisitedCities.length > 0
    ? unvisitedCities.map((city) => `<option value="${city.id}">${city.name}</option>`).join("")
    : `<option value="">\u5df2\u7ecf\u6dfb\u52a0\u4e86\u5168\u90e8\u57ce\u5e02</option>`;
  citySelect.disabled = unvisitedCities.length === 0;
  addVisitedCityButton.disabled = unvisitedCities.length === 0;
  cityCountLine.textContent = `\u5df2\u7ecf\u643a\u624b\u8d70\u8fc7 ${visitedCities.length} \u4e2a\u57ce\u5e02`;

  if (visitedCities.length === 0 && cityMarkerList) {
    cityMarkerList.innerHTML = `<div class="map-empty-note">\u8fd8\u6ca1\u6709\u70b9\u4eae\u4efb\u4f55\u57ce\u5e02\uff0c\u5148\u4ece\u4e0b\u65b9\u6dfb\u52a0\u4e00\u5ea7\u5427\u3002</div>`;
  }
}

function openMapPage() {
  if (!mapPage || mapPage.classList.contains("is-active")) {
    return;
  }

  loadChinaGeoMap();
  loadCityBoundaries().catch(() => {});
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

  mapPage.classList.remove("is-album-open");
  cityAlbumView.classList.add("is-hidden");
  mapView.classList.remove("is-hidden");
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
  appendTargetAlbumId = null;
  cityAlbumNameInput.value = "";
  cityAlbumNameInput.disabled = false;
  cityPhotoInput.value = "";
  cityUploadHint.textContent = "\u5148\u9009\u62e9\u7167\u7247\uff0c\u518d\u7ed9\u8fd9\u4e00\u7ec4\u8d77\u540d\u5b57\u3002";
  cityUploadHint.classList.remove("is-error");
  saveCityAlbumButton.textContent = "\u4fdd\u5b58\u8fd9\u4e00\u7ec4";
  cityUploadPanel.classList.add("is-hidden");
}

function openCityUploadPanel(albumId = null) {
  selectedCityFiles = [];
  cityPhotoInput.value = "";
  cityUploadHint.classList.remove("is-error");
  appendTargetAlbumId = albumId;

  if (albumId) {
    const album = cityAlbumsCache.find((item) => item.id === albumId);

    cityAlbumNameInput.value = album ? album.title : "";
    cityAlbumNameInput.disabled = true;
    cityUploadHint.textContent = album
      ? `继续往「${album.title}」里添加照片。`
      : "\u7ee7\u7eed\u5f80\u8fd9\u4e00\u7ec4\u91cc\u6dfb\u52a0\u7167\u7247\u3002";
    saveCityAlbumButton.textContent = "\u8ffd\u52a0\u5230\u8fd9\u4e00\u7ec4";
  } else {
    cityAlbumNameInput.value = "";
    cityAlbumNameInput.disabled = false;
    cityUploadHint.textContent = "\u5148\u9009\u62e9\u7167\u7247\uff0c\u518d\u7ed9\u8fd9\u4e00\u7ec4\u8d77\u540d\u5b57\u3002";
    saveCityAlbumButton.textContent = "\u4fdd\u5b58\u8fd9\u4e00\u7ec4";
  }

  cityUploadPanel.classList.remove("is-hidden");
}

function renderCityAlbums(cityId) {
  const city = getCityById(cityId);

  if (!city) {
    return;
  }

  cityAlbumTitle.textContent = `${city.name}\u57ce\u5e02\u8bb0\u5fc6`;
  cityAlbumGroups.innerHTML = `<div class="city-album-empty">\u6b63\u5728\u8bfb\u53d6\u7167\u7247...</div>`;

  getCityAlbums(cityId)
    .then((albums) => {
      if (albums.length === 0) {
        cityAlbumGroups.innerHTML = `<div class="city-album-empty">\u8fd9\u5ea7\u57ce\u5e02\u8fd8\u6ca1\u6709\u8bb0\u5fc6\u7167\u7247\uff0c\u70b9\u53f3\u4e0a\u89d2 + \u6dfb\u52a0\u5427\u3002</div>`;
        return;
      }

      cityAlbumGroups.innerHTML = albums.map((album) => `
        <article class="city-album-group">
          <div class="city-album-group-head">
            <div>
              <p class="card-label">${new Date(album.createdAt).toLocaleDateString("zh-CN")}</p>
              <h3>${escapeHtml(album.title)}</h3>
            </div>
            <div class="city-album-actions">
              <button class="city-album-append" type="button" data-append-album="${album.id}">\u8ffd\u52a0\u7167\u7247</button>
              <button class="city-album-delete" type="button" data-delete-album="${album.id}">\u5220\u9664</button>
            </div>
          </div>
          <div class="city-photo-grid">
            ${album.photos.map((photo) => `<img src="${photo.src}" alt="${escapeHtml(photo.name || album.title)}" loading="lazy" decoding="async" fetchpriority="low" />`).join("")}
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

  if (!city || !visitedCityIds.includes(city.id)) {
    return;
  }

  selectedCityId = city.id;
  resetCityUpload();
  mapPage.classList.add("is-album-open");
  mapView.classList.add("is-hidden");
  cityAlbumView.classList.remove("is-hidden");
  renderCityAlbums(city.id);
}

function backToMapView() {
  selectedCityId = null;
  resetCityUpload();
  mapPage.classList.remove("is-album-open");
  cityAlbumView.classList.add("is-hidden");
  mapView.classList.remove("is-hidden");
}

async function addVisitedCity() {
  const cityId = citySelect.value;
  const city = getCityById(cityId);

  if (!city || visitedCityIds.includes(cityId)) {
    return;
  }

  const previousVisitedCityIds = visitedCityIds.slice();

  markLocalDataChanged();
  visitedCityIds = visitedCityIds.concat(cityId);
  renderCityMarkers();
  cityAddHint.textContent = `\u6b63\u5728\u70b9\u4eae${city.name}\uff0c\u5e76\u4fdd\u5b58\u5230 GitHub...`;
  cityAddHint.classList.remove("is-error");
  addVisitedCityButton.disabled = true;

  try {
    await saveToGithub("save-visited-cities", { visitedCities: visitedCityIds });
    cityAddHint.textContent = `${city.name}\u5df2\u70b9\u4eae\uff0c\u73b0\u5728\u53ef\u4ee5\u70b9\u5b83\u8fdb\u5165\u57ce\u5e02\u8bb0\u5fc6\u3002`;
  } catch (error) {
    visitedCityIds = previousVisitedCityIds;
    renderCityMarkers();
    cityAddHint.textContent = error.message || "\u57ce\u5e02\u6dfb\u52a0\u5931\u8d25\uff0cGitHub \u6ca1\u6709\u66f4\u65b0\u3002";
    cityAddHint.classList.add("is-error");
  } finally {
    addVisitedCityButton.disabled = citySelect.disabled;
  }
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
  const targetAlbum = appendTargetAlbumId
    ? cityAlbumsCache.find((album) => album.id === appendTargetAlbumId)
    : null;
  const title = targetAlbum
    ? targetAlbum.title
    : ((cityAlbumNameInput.value || "").trim() || `${city.name}\u7684\u4e00\u7ec4\u7167\u7247`);

  saveCityAlbumButton.disabled = true;
  markLocalDataChanged();
  cityUploadHint.textContent = "\u6b63\u5728\u538b\u7f29\u7167\u7247\u5e76\u4fdd\u5b58\u5230 GitHub...";
  cityUploadHint.classList.remove("is-error");

  try {
    const photosForAlbum = await Promise.all(selectedCityFiles.map((file) => resizePhotoFile(file)));

    if (appendTargetAlbumId) {
      await saveToGithub("append-city-album-photos", {
        albumId: appendTargetAlbumId,
        photos: photosForAlbum
      });
    } else {
      await saveToGithub("add-city-album", {
        cityId: selectedCityId,
        cityName: city.name,
        title: title.slice(0, 22),
        photos: photosForAlbum
      });
    }

    resetCityUpload();
    renderCityAlbums(selectedCityId);
  } catch (error) {
    cityUploadHint.textContent = error.message || "\u4fdd\u5b58\u5230 GitHub \u5931\u8d25\u4e86\uff0c\u53ef\u80fd\u662f\u7167\u7247\u592a\u591a\u6216\u540e\u7aef\u8fd8\u6ca1\u914d\u597d\u3002";
    cityUploadHint.classList.add("is-error");
  } finally {
    saveCityAlbumButton.disabled = false;
  }
}

function getMessageCategoryInfo(category) {
  return MESSAGE_CATEGORY_INFO[category] || MESSAGE_CATEGORY_INFO.good;
}

function renderMessageCategoryIcon(category) {
  const categoryInfo = getMessageCategoryInfo(category);

  return `
    <span class="message-category-icon ${categoryInfo.iconClass}" aria-hidden="true"></span>
    <span class="sr-only">${categoryInfo.label}</span>
  `;
}

function renderMessageCards(messages) {
  return messages.map((message) => {
    const isHer = message.author === "王思澄";

    return `
      <article class="message-item ${isHer ? "from-her" : "from-him"}">
        <div class="message-bubble">
          <div class="message-meta">
            <span>${escapeHtml(message.author)}</span>
            <span class="message-category-pill">${renderMessageCategoryIcon(message.category)}</span>
            <time>${formatDateTime(message.createdAt)}</time>
          </div>
          <p>${escapeHtml(message.text)}</p>
          <button class="message-delete-button" type="button" data-delete-message="${message.id}">删除</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderMessageCategoryColumn(messages, category, emptyText) {
  const filteredMessages = messages.filter((message) => message.category === category);

  return `
    <div class="message-category-column ${category === "bad" ? "is-bad" : "is-good"}">
      <div class="message-category-heading">
        <span class="message-category-heading-icon">${renderMessageCategoryIcon(category)}</span>
        <strong>${filteredMessages.length}</strong>
      </div>
      ${filteredMessages.length > 0
        ? renderMessageCards(filteredMessages)
        : `<p class="message-column-empty">${emptyText}</p>`}
    </div>
  `;
}

function renderMessageSection(title, subtitle, messages, emptyText) {
  return `
    <section class="message-section">
      <header class="message-section-header">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        <strong>${messages.length}</strong>
      </header>
      <div class="message-category-grid">
        ${renderMessageCategoryColumn(messages, "good", emptyText)}
        ${renderMessageCategoryColumn(messages, "bad", emptyText)}
      </div>
    </section>
  `;
}

function renderMessageSummary(messages) {
  const goodCount = messages.filter((message) => message.category === "good").length;
  const badCount = messages.filter((message) => message.category === "bad").length;

  return `
    <section class="message-summary">
      <div>
        <span>全部留言</span>
        <strong>${messages.length}</strong>
      </div>
      <div>
        <span>${renderMessageCategoryIcon("good")}</span>
        <strong>${goodCount}</strong>
      </div>
      <div>
        <span>${renderMessageCategoryIcon("bad")}</span>
        <strong>${badCount}</strong>
      </div>
    </section>
  `;
}

function renderMessages() {
  if (!messageList) {
    return;
  }

  const sortedMessages = messagesCache
    .map(normalizeMessage)
    .filter(Boolean)
    .sort((a, b) => b.createdAt - a.createdAt);

  messagesCache = sortedMessages;

  if (sortedMessages.length === 0) {
    messageList.innerHTML = `
      <div class="message-empty">
        这里还没有留言。第一句，就留给今天吧。
      </div>
    `;
    return;
  }

  const recentThreshold = Date.now() - MESSAGE_RECENT_DAYS * DAY_MS;
  const recentMessages = sortedMessages.filter((message) => message.createdAt >= recentThreshold);

  messageList.innerHTML = `
    ${renderMessageSection(
      "最近一个月",
      "先看刚刚发生的心情，不让新的话被旧日子盖住。",
      recentMessages,
      "这个月这里还没有。"
    )}
    ${renderMessageSummary(sortedMessages)}
    ${renderMessageSection(
      "留言汇总",
      "所有留下来的话，都按两种心情分开放好。",
      sortedMessages,
      "这一类还空着。"
    )}
  `;

  messageList.scrollTop = 0;
}

function showMessageHint(text, isError = false) {
  if (!messageHint) {
    return;
  }

  messageHint.textContent = text;
  messageHint.classList.toggle("is-error", isError);
}

function openMessagesPage() {
  if (!messagePage || messagePage.classList.contains("is-active")) {
    return;
  }

  renderMessages();
  messagePage.classList.remove("is-hidden");
  storyPage.classList.add("is-shifted");
  document.body.classList.add("message-open");
  void messagePage.offsetWidth;
  messagePage.classList.add("is-active");
}

function closeMessagesPage() {
  if (!messagePage || !messagePage.classList.contains("is-active")) {
    return;
  }

  messagePage.classList.remove("is-active");
  storyPage.classList.remove("is-shifted");
  document.body.classList.remove("message-open");
  window.setTimeout(() => {
    if (!messagePage.classList.contains("is-active")) {
      messagePage.classList.add("is-hidden");
    }
  }, 560);
}

function setMessageAuthor(author) {
  selectedMessageAuthor = author === "王思澄" ? "王思澄" : "陈立都";
  messageAuthorButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.messageAuthor === selectedMessageAuthor);
  });
}

function setMessageCategory(category) {
  selectedMessageCategory = category === "bad" ? "bad" : "good";
  messageCategoryButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.messageCategory === selectedMessageCategory);
  });
}

async function saveMessagesToGithub() {
  await saveToGithub("save-messages", { messages: messagesCache });
}

async function sendMessage() {
  const text = (messageTextInput.value || "").trim();

  if (!text) {
    showMessageHint("先写一点想说的话。", true);
    return;
  }

  const previousMessages = messagesCache.slice();
  const message = {
    id: `message-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    author: selectedMessageAuthor,
    category: selectedMessageCategory,
    text: text.slice(0, 240),
    createdAt: Date.now()
  };

  markLocalDataChanged();
  messagesCache = messagesCache.concat(message);
  messageTextInput.value = "";
  renderMessages();
  showMessageHint("正在保存到 GitHub...");
  sendMessageButton.disabled = true;

  try {
    await saveMessagesToGithub();
    showMessageHint("保存好了。");
  } catch (error) {
    messagesCache = previousMessages;
    renderMessages();
    messageTextInput.value = text;
    showMessageHint(error.message || "留言保存失败。请确认是在 Vercel 网站里操作。", true);
  } finally {
    sendMessageButton.disabled = false;
  }
}

async function deleteMessage(messageId) {
  const previousMessages = messagesCache.slice();

  markLocalDataChanged();
  messagesCache = messagesCache.filter((message) => message.id !== messageId);
  renderMessages();
  showMessageHint("正在删除留言...");

  try {
    await saveMessagesToGithub();
    showMessageHint("已删除。");
  } catch (error) {
    messagesCache = previousMessages;
    renderMessages();
    showMessageHint(error.message || "删除失败，GitHub 没有更新。", true);
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

function buildPhotoBackdrop(selected) {
  const backdropPhotos = selected.filter(Boolean).slice(0, 9);
  const layer = document.createElement("div");

  layer.className = "photo-backdrop-layer";

  backdropPhotos.forEach((photo, index) => {
    const image = document.createElement("img");
    const width = 34 + noise(index + 61) * 26;
    const x = 8 + noise(index + 67) * 84;
    const y = 8 + noise(index + 71) * 84;
    const rotate = -16 + noise(index + 73) * 32;
    const duration = 22 + noise(index + 79) * 18;

    image.className = "photo-backdrop-image";
    image.src = photo.src;
    image.alt = "";
    image.decoding = "async";
    image.style.setProperty("--bg-w", `${width.toFixed(2)}vw`);
    image.style.setProperty("--bg-x", `${x.toFixed(2)}%`);
    image.style.setProperty("--bg-y", `${y.toFixed(2)}%`);
    image.style.setProperty("--bg-r", `${rotate.toFixed(2)}deg`);
    image.style.setProperty("--bg-dur", `${duration.toFixed(2)}s`);
    image.style.setProperty("--bg-delay", `${(-duration * noise(index + 83)).toFixed(2)}s`);
    layer.appendChild(image);
  });

  photoFlow.appendChild(layer);
}

function buildPhotoParticles() {
  if (!photoFlow || photos.length === 0 || photoFlow.children.length > 0) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const selected = pickParticlePhotos(getParticleTargetCount());
  const layer = document.createElement("div");

  photoFlow.className = "photo-flow photo-particle-flow";
  buildPhotoBackdrop(selected);
  layer.className = "photo-particle-layer";
  photoFlow.appendChild(layer);

  selected.forEach((photo, index) => {
    const item = document.createElement("button");
    const image = document.createElement("img");
    const routeBiased = index % 4 !== 0;
    const routeProgress = noise(index + 3);
    const routeX = 18 + routeProgress * 66;
    const routeY = 29 + routeProgress * 46;
    const spreadX = routeBiased ? -16 + noise(index + 5) * 32 : -8 + noise(index + 7) * 116;
    const spreadY = routeBiased ? -18 + noise(index + 9) * 36 : -8 + noise(index + 11) * 116;
    const startX = routeBiased ? clampNumber(routeX + spreadX, -4, 104) : clampNumber(spreadX, -4, 104);
    const startY = routeBiased ? clampNumber(routeY + spreadY, -4, 104) : clampNumber(spreadY, -4, 104);
    const size = isMobile ? 24 + noise(index + 1) * 34 : 26 + noise(index + 1) * 52;
    const dx1 = routeBiased ? 3 + noise(index + 13) * 10 : -16 + noise(index + 13) * 32;
    const dy1 = routeBiased ? 2 + noise(index + 17) * 9 : -12 + noise(index + 17) * 24;
    const dx2 = routeBiased ? 8 + noise(index + 21) * 16 : -22 + noise(index + 21) * 44;
    const dy2 = routeBiased ? 5 + noise(index + 25) * 13 : -16 + noise(index + 25) * 32;
    const rotate = -14 + noise(index + 29) * 28;
    const scale = 0.72 + noise(index + 33) * 0.54;
    const duration = 24 + noise(index + 37) * 26;

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
renderMessages();
loadSiteData();
window.setInterval(renderCountdowns, 1000);

openClockButton.addEventListener("click", openCountdownPage);
backHomeButton.addEventListener("click", closeCountdownPage);
openMapButton.addEventListener("click", openMapPage);
backHomeFromMapButton.addEventListener("click", closeMapPage);
openMessagesButton.addEventListener("click", openMessagesPage);
backHomeFromMessagesButton.addEventListener("click", closeMessagesPage);
addMeetingButton.addEventListener("click", addMeeting);
cancelEditButton.addEventListener("click", () => {
  resetMeetingEditor(true);
  showAddHint("\u5df2\u53d6\u6d88\u66f4\u6539\uff0c\u53ef\u4ee5\u7ee7\u7eed\u6dfb\u52a0\u65b0\u7684\u89c1\u9762\u3002");
});

messageAuthorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMessageAuthor(button.dataset.messageAuthor);
  });
});

messageCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMessageCategory(button.dataset.messageCategory);
  });
});

sendMessageButton.addEventListener("click", sendMessage);
messageTextInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    sendMessage();
  }
});
messageList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-message]");

  if (deleteButton) {
    deleteMessage(deleteButton.dataset.deleteMessage);
  }
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

function handleCityMarkerOpen(event) {
  const cityButton = event.target.closest("[data-city-id]");

  if (cityButton && !cityButton.disabled) {
    openCityAlbum(cityButton.dataset.cityId);
  }
}

if (cityMarkerList) {
  cityMarkerList.addEventListener("click", handleCityMarkerOpen);
}

if (chinaMapSvg) {
  chinaMapSvg.addEventListener("click", handleCityMarkerOpen);
  chinaMapSvg.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const cityButton = event.target.closest("[data-city-id]");

    if (cityButton && !cityButton.disabled) {
      event.preventDefault();
      openCityAlbum(cityButton.dataset.cityId);
    }
  });
}

addVisitedCityButton.addEventListener("click", addVisitedCity);
backMapButton.addEventListener("click", backToMapView);
addCityAlbumButton.addEventListener("click", () => {
  openCityUploadPanel();
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
  const appendButton = event.target.closest("[data-append-album]");
  const deleteButton = event.target.closest("[data-delete-album]");

  if (!selectedCityId) {
    return;
  }

  if (appendButton) {
    openCityUploadPanel(appendButton.dataset.appendAlbum);
    chooseCityPhotosButton.focus({ preventScroll: true });
    return;
  }

  if (!deleteButton) {
    return;
  }

  markLocalDataChanged();
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
    return;
  }

  if (event.key === "Escape" && document.body.classList.contains("message-open")) {
    closeMessagesPage();
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
