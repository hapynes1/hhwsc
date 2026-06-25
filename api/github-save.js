const DATA_PATH = "data/site-data.json";
const MEETINGS_PATH = "data/meetings/meetings.json";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(body));
}

function getEnv() {
  return {
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || "main",
    token: process.env.GITHUB_TOKEN,
    secret: process.env.UPLOAD_SECRET
  };
}

async function readBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function githubFetch(env, path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${env.owner}/${env.repo}${path}`, {
    ...options,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${env.token}`,
      "Content-Type": "application/json",
      "User-Agent": "clytze-memory-site",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub ${response.status}: ${text}`);
  }

  return response.json();
}

async function getSiteData(env) {
  try {
    const file = await githubFetch(env, `/contents/${DATA_PATH}?ref=${encodeURIComponent(env.branch)}`);
    const json = Buffer.from(file.content || "", "base64").toString("utf8");
    const data = JSON.parse(json);

    return {
      meetings: Array.isArray(data.meetings) ? data.meetings : [],
      cityAlbums: Array.isArray(data.cityAlbums) ? data.cityAlbums : [],
      visitedCities: Array.isArray(data.visitedCities) ? data.visitedCities : [],
      messages: Array.isArray(data.messages) ? data.messages : []
    };
  } catch (error) {
    return { meetings: [], cityAlbums: [], visitedCities: [], messages: [] };
  }
}

async function createBlob(env, content, encoding) {
  return githubFetch(env, "/git/blobs", {
    method: "POST",
    body: JSON.stringify({ content, encoding })
  });
}

async function commitFiles(env, message, files) {
  const ref = await githubFetch(env, `/git/ref/heads/${env.branch}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await githubFetch(env, `/git/commits/${baseCommitSha}`);
  const treeItems = [];

  for (const file of files) {
    const blob = await createBlob(env, file.content, file.encoding);

    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha
    });
  }

  const tree = await githubFetch(env, "/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseCommit.tree.sha,
      tree: treeItems
    })
  });
  const commit = await githubFetch(env, "/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [baseCommitSha]
    })
  });

  await githubFetch(env, `/git/refs/heads/${env.branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha })
  });

  return commit.sha;
}

function cleanText(value, fallback, maxLength = 40) {
  const text = String(value || fallback).trim().replace(/[\\/:*?"<>|]/g, "-");
  return (text || fallback).slice(0, maxLength);
}

function getPhotoExtension(src) {
  const match = /^data:image\/([a-zA-Z0-9.+-]+);base64,/.exec(src || "");
  const type = match ? match[1].toLowerCase() : "jpeg";

  if (type.includes("png")) {
    return "png";
  }

  if (type.includes("webp")) {
    return "webp";
  }

  return "jpg";
}

function getPhotoBase64(src) {
  return String(src || "").replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
}

async function saveMeetings(env, payload) {
  const data = await getSiteData(env);
  const meetings = Array.isArray(payload.meetings) ? payload.meetings : [];

  data.meetings = meetings;

  const dataJson = JSON.stringify(data, null, 2);
  const meetingsJson = JSON.stringify(meetings, null, 2);
  const sha = await commitFiles(env, "更新纪念日倒计时", [
    { path: DATA_PATH, content: dataJson, encoding: "utf-8" },
    { path: MEETINGS_PATH, content: meetingsJson, encoding: "utf-8" }
  ]);

  return { ok: true, sha, data };
}

async function saveVisitedCities(env, payload) {
  const data = await getSiteData(env);
  const visitedCities = Array.isArray(payload.visitedCities)
    ? Array.from(new Set(payload.visitedCities.map(String)))
    : [];

  data.visitedCities = visitedCities;

  const sha = await commitFiles(env, "更新城市记忆地图", [
    { path: DATA_PATH, content: JSON.stringify(data, null, 2), encoding: "utf-8" }
  ]);

  return { ok: true, sha, data };
}

function normalizeMessage(message) {
  const text = cleanText(message && message.text, "", 240);

  if (!text) {
    return null;
  }

  const createdAt = Number(message.createdAt) || Date.now();
  const author = message.author === "王思澄" ? "王思澄" : "陈立都";
  const category = message.category === "bad" ? "bad" : "good";

  return {
    id: cleanText(message.id, `message-${createdAt}`, 80),
    author,
    category,
    text,
    createdAt
  };
}

async function saveMessages(env, payload) {
  const data = await getSiteData(env);
  const messages = Array.isArray(payload.messages)
    ? payload.messages.map(normalizeMessage).filter(Boolean).slice(-1000)
    : [];

  data.messages = messages;

  const sha = await commitFiles(env, "更新留言墙", [
    { path: DATA_PATH, content: JSON.stringify(data, null, 2), encoding: "utf-8" }
  ]);

  return { ok: true, sha, data };
}

async function addCityAlbum(env, payload) {
  const data = await getSiteData(env);
  const cityName = cleanText(payload.cityName, "城市", 24);
  const cityId = cleanText(payload.cityId, "city", 40);
  const title = cleanText(payload.title, `${cityName}的照片`, 40);
  const photos = Array.isArray(payload.photos) ? payload.photos : [];
  const albumId = `album-${Date.now()}`;
  const albumFolder = `data/cities/${cityName}/${albumId}`;
  const photoRecords = [];
  const files = [];

  photos.forEach((photo, index) => {
    const extension = getPhotoExtension(photo.src);
    const filename = `photo-${String(index + 1).padStart(3, "0")}.${extension}`;
    const path = `${albumFolder}/${filename}`;

    files.push({
      path,
      content: getPhotoBase64(photo.src),
      encoding: "base64"
    });
    photoRecords.push({
      name: cleanText(photo.name, filename, 80),
      src: path
    });
  });

  const album = {
    id: albumId,
    cityId,
    cityName,
    title,
    createdAt: Date.now(),
    photos: photoRecords
  };

  data.cityAlbums = [album].concat(Array.isArray(data.cityAlbums) ? data.cityAlbums : []);
  files.push({
    path: DATA_PATH,
    content: JSON.stringify(data, null, 2),
    encoding: "utf-8"
  });

  const sha = await commitFiles(env, `添加${cityName}相册：${title}`, files);

  return { ok: true, sha, album, data };
}

async function deleteCityAlbum(env, payload) {
  const data = await getSiteData(env);
  const albumId = String(payload.albumId || "");
  const album = (data.cityAlbums || []).find((item) => item.id === albumId);

  data.cityAlbums = (data.cityAlbums || []).filter((item) => item.id !== albumId);

  const files = [{
    path: DATA_PATH,
    content: JSON.stringify(data, null, 2),
    encoding: "utf-8"
  }];

  if (album && Array.isArray(album.photos)) {
    album.photos.forEach((photo) => {
      if (photo && photo.src) {
        files.push({
          path: photo.src,
          content: "",
          encoding: "delete"
        });
      }
    });
  }

  const sha = await commitFilesWithDeletes(env, "删除城市相册", files);

  return { ok: true, sha, data };
}

async function commitFilesWithDeletes(env, message, files) {
  const ref = await githubFetch(env, `/git/ref/heads/${env.branch}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await githubFetch(env, `/git/commits/${baseCommitSha}`);
  const treeItems = [];

  for (const file of files) {
    if (file.encoding === "delete") {
      treeItems.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: null
      });
      continue;
    }

    const blob = await createBlob(env, file.content, file.encoding);

    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha
    });
  }

  const tree = await githubFetch(env, "/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseCommit.tree.sha,
      tree: treeItems
    })
  });
  const commit = await githubFetch(env, "/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [baseCommitSha]
    })
  });

  await githubFetch(env, `/git/refs/heads/${env.branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha })
  });

  return commit.sha;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  const env = getEnv();

  if (!env.owner || !env.repo || !env.token || !env.secret) {
    sendJson(res, 500, { ok: false, message: "后端环境变量还没有配置完整。" });
    return;
  }

  try {
    const body = await readBody(req);

    if (body.secret !== env.secret) {
      sendJson(res, 401, { ok: false, message: "密码不正确。" });
      return;
    }

    if (body.action === "save-meetings") {
      sendJson(res, 200, await saveMeetings(env, body.payload || {}));
      return;
    }

    if (body.action === "save-visited-cities") {
      sendJson(res, 200, await saveVisitedCities(env, body.payload || {}));
      return;
    }

    if (body.action === "save-messages") {
      sendJson(res, 200, await saveMessages(env, body.payload || {}));
      return;
    }

    if (body.action === "add-city-album") {
      sendJson(res, 200, await addCityAlbum(env, body.payload || {}));
      return;
    }

    if (body.action === "delete-city-album") {
      sendJson(res, 200, await deleteCityAlbum(env, body.payload || {}));
      return;
    }

    sendJson(res, 400, { ok: false, message: "未知操作。" });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || "保存失败。" });
  }
};
