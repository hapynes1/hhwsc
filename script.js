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

function selectPhotos(maxCount) {
  if (photos.length <= maxCount) {
    return photos;
  }

  const step = photos.length / maxCount;
  return Array.from({ length: maxCount }, (_, index) => photos[Math.floor(index * step)]);
}

function buildPhotoFlow() {
  if (!photoFlow || photos.length === 0 || photoFlow.children.length > 0) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const laneCount = isMobile ? 5 : 4;
  const selected = selectPhotos(isMobile ? 16 : 20);

  for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
    const lane = document.createElement("div");
    const track = document.createElement("div");
    const lanePhotos = selected.filter((_, index) => index % laneCount === laneIndex);
    const repeated = [...lanePhotos, ...lanePhotos, ...lanePhotos];

    lane.className = `flow-lane lane-${laneIndex + 1}`;
    lane.style.setProperty("--lane", laneIndex);
    track.className = "flow-track";

    repeated.forEach((photo, index) => {
      const tile = document.createElement("figure");
      const image = document.createElement("img");
      tile.className = "flow-tile";
      tile.style.setProperty("--zoom", String(1.06 + ((index + laneIndex) % 4) * 0.035));
      image.src = photo.src;
      image.alt = "";
      image.loading = laneIndex === 0 ? "eager" : "lazy";
      tile.appendChild(image);
      track.appendChild(tile);
    });

    lane.appendChild(track);
    photoFlow.appendChild(lane);
  }
}

function openPhotoPage(skipAnimation = false) {
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
  window.setTimeout(buildPhotoFlow, 80);
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

pigPet.addEventListener("click", () => {
  pigMessageIndex = (pigMessageIndex + 1) % pigMessages.length;
  pigBubble.textContent = pigMessages[pigMessageIndex];
  pigPet.classList.add("is-chatting");
  window.clearTimeout(pigPet.chatTimer);
  pigPet.chatTimer = window.setTimeout(() => {
    pigPet.classList.remove("is-chatting");
  }, 1800);
});
