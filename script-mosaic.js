const PASSWORD = "260223";

const lockScreen = document.querySelector("#lockScreen");
const storyPage = document.querySelector("#storyPage");
const passwordInput = document.querySelector("#passwordInput");
const passwordHint = document.querySelector("#passwordHint");
const pigPet = document.querySelector("#pigPet");
const pigBubble = document.querySelector("#pigBubble");
const photoFlow = document.querySelector("#photoFlow");
const photos = Array.isArray(window.PHOTO_LIST) ? window.PHOTO_LIST : [];
const pigMessages = [
  "\u7b49\u7167\u7247\u6765\u5566",
  "\u4eca\u5929\u4e5f\u8981\u8d34\u8d34",
  "\u5c0f\u732a\u5de1\u903b\u4e2d",
  "260223\u8bb0\u4f4f\u4e86",
  "\u8981\u4e00\u76f4\u5f00\u5fc3"
];

let pigMessageIndex = 0;
let unlocked = false;
let mosaicTimer = null;
let mosaicStep = 0;

function getLayout() {
  if (window.innerWidth <= 700) {
    return { cols: 4, rows: 7, count: 28 };
  }

  if (window.innerWidth <= 1100) {
    return { cols: 6, rows: 5, count: 30 };
  }

  return { cols: 8, rows: 5, count: 40 };
}

function getPhoto(index) {
  if (photos.length === 0) {
    return null;
  }

  return photos[((index % photos.length) + photos.length) % photos.length];
}

function tilePosition(index, layout, step) {
  const total = layout.cols * layout.rows;
  const multiplier = layout.cols === 8 ? 17 : layout.cols === 6 ? 7 : 5;
  const stepSize = layout.cols === 8 ? 7 : layout.cols === 6 ? 11 : 9;
  const moved = (index * multiplier + step * stepSize + total * 20) % total;
  const row = Math.floor(moved / layout.cols);
  const col = moved % layout.cols;

  return {
    x: col,
    y: row,
    lift: ((col + row + step) % 3) - 1,
    scale: 1.02 + ((index + step) % 5) * 0.01
  };
}

function buildMosaic() {
  if (!photoFlow || photos.length === 0) {
    return;
  }

  const layout = getLayout();
  photoFlow.innerHTML = "";
  photoFlow.className = "photo-flow mosaic-flow";
  photoFlow.style.setProperty("--cols", layout.cols);
  photoFlow.style.setProperty("--rows", layout.rows);

  for (let index = 0; index < layout.count; index += 1) {
    const tile = document.createElement("div");
    const image = document.createElement("img");
    const photo = getPhoto(index * 5);

    tile.className = "mosaic-tile";
    tile.dataset.index = String(index);
    tile.style.setProperty("--delay", `${((index % layout.cols) * 52 + Math.floor(index / layout.cols) * 90)}ms`);
    tile.style.setProperty("--phase", String((index % 7) - 3));
    image.src = photo ? photo.src : "";
    image.alt = "";
    image.loading = index < 12 ? "eager" : "lazy";

    tile.appendChild(image);
    photoFlow.appendChild(tile);
  }

  moveMosaic(true);
}

function moveMosaic(initial = false) {
  if (!photoFlow || photos.length === 0) {
    return;
  }

  const layout = getLayout();
  const tiles = Array.from(photoFlow.children);
  photoFlow.style.setProperty("--cols", layout.cols);
  photoFlow.style.setProperty("--rows", layout.rows);

  if (!initial) {
    mosaicStep += 1;
  }

  tiles.forEach((tile) => {
    const index = Number(tile.dataset.index);
    const pos = tilePosition(index, layout, mosaicStep);
    const image = tile.querySelector("img");
    const nextPhoto = getPhoto(index * 7 + mosaicStep * 11);

    tile.style.setProperty("--x", pos.x);
    tile.style.setProperty("--y", pos.y);
    tile.style.setProperty("--lift", pos.lift);
    tile.style.setProperty("--scale", pos.scale);
    tile.classList.toggle("is-accent", (index + mosaicStep) % 9 === 0);

    if (!initial && image && nextPhoto && image.getAttribute("src") !== nextPhoto.src) {
      tile.classList.add("is-changing");
      window.setTimeout(() => {
        image.src = nextPhoto.src;
        tile.classList.remove("is-changing");
      }, 380 + ((index % layout.cols) * 38));
    }
  });
}

function startMosaic() {
  buildMosaic();
  window.clearInterval(mosaicTimer);
  mosaicTimer = window.setInterval(moveMosaic, 2600);
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
  window.setTimeout(startMosaic, 80);
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

window.addEventListener("resize", () => {
  if (document.body.classList.contains("story-open")) {
    window.clearInterval(mosaicTimer);
    startMosaic();
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
