
/* ========================================
   1. MENGAMBIL ELEMEN HTML
======================================== */

const pages = document.querySelectorAll(".page");
const pageDots = document.querySelectorAll(".page-dot");

const progressBar = document.getElementById("progressBar");
const pageCounter = document.getElementById("pageCount");

const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");

const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");

const momo = document.getElementById("momo");
const momoBubble = document.getElementById("momoBubble");

const envelope = document.getElementById("envelope");
const letterCard = document.getElementById("letterCard");

const randomMessage = document.getElementById("randomMessage");
const newMessageButton = document.getElementById("newMessage");

const secretButton = document.getElementById("secretButton");
const secretNote = document.getElementById("secretNote");

const restartButton = document.getElementById("restartButton");


/* ========================================
   2. NAVIGASI HALAMAN
======================================== */

let currentPage = 0;

function showPage(index) {
  if (index < 0 || index >= pages.length) return;

  currentPage = index;

  pages.forEach((page, i) => {
    const active = i === currentPage;
    page.hidden = !active;
    page.classList.toggle("active", active);
  });

  pageDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentPage);
  });

  if (progressBar) {
    progressBar.style.width =
      `${((currentPage + 1) / pages.length) * 100}%`;
  }

  if (pageCounter) {
    pageCounter.textContent =
      `${String(currentPage + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  }

  if (backButton) {
    backButton.disabled = currentPage === 0;
  }

  if (nextButton) {
    nextButton.hidden = currentPage === pages.length - 1;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(currentPage + 1);
  });
});

if (nextButton) {
  nextButton.addEventListener("click", () => {
    showPage(currentPage + 1);
  });
}

if (backButton) {
  backButton.addEventListener("click", () => {
    showPage(currentPage - 1);
  });
}

if (restartButton) {
  restartButton.addEventListener("click", () => {
    showPage(0);
  });
}


/* ========================================
   3. INTERAKSI MOMO
======================================== */

const momoMessages = [
  "Meow! Akhirnya kamu datang juga!",
  "Ada seseorang yang senang bisa mengenalmu, lho.",
  "Jangan lupa, kamu juga pantas diapresiasi!",
  "Kamu tidak harus sempurna untuk jadi berharga.",
  "Semoga hari ini ada hal kecil yang bikin kamu ketawa.",
  "Momo bangga sama kamu. Meow~",
  "Kalau capek, istirahat dulu, ya.",
  "Psst... ada seseorang yang mengagumi cara kamu berpikir.",
  "Jangan kebanyakan mikir sendirian, ya. Kamu boleh cerita.",
  "Meow~ Semoga kamu selalu punya alasan untuk tersenyum."
];

let momoTapCount = 0;
let momoTapTimer;
let momoHappyTimer;
let momoMessageIndex = 0;


/* Efek love yang terbang ke luar area kucing */

function showLoveEffect() {
  if (!momo) return;

  const rect = momo.getBoundingClientRect();
  const hearts = ["♡", "♥", "❤"];
  const count = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");

    heart.className = "love-particle";
    heart.textContent =
      hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left =
      `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 75}px`;

    heart.style.top =
      `${rect.top + rect.height * 0.3 + (Math.random() - 0.5) * 30}px`;

    heart.style.setProperty(
      "--love-size",
      `${12 + Math.random() * 10}px`
    );

    heart.style.setProperty(
      "--love-drift",
      `${(Math.random() - 0.5) * 70}px`
    );

    heart.style.animationDelay = `${i * 0.06}s`;

    document.body.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    }, { once: true });
  }
}


/* Animasi Momo tersenyum dan melambaikan tangan */

function makeMomoHappy() {
  if (!momo) return;

  clearTimeout(momoHappyTimer);

  momo.classList.remove("settling");
  momo.classList.add("happy");

  if (momoBubble) {
    momoBubble.textContent = "Meow~! Momo senang sekali! ♡";
  }

  showLoveEffect();

  momoHappyTimer = setTimeout(() => {
    momo.classList.remove("happy");
    momo.classList.add("settling");

    if (momoBubble) {
      momoBubble.textContent = "Hai! Aku Momo. Klik aku!";
    }

    setTimeout(() => {
      momo.classList.remove("settling");
    }, 800);

  }, 2500);
}


/* Penghitung ketukan */

function handleMomoTap() {
  showLoveEffect();

  momoTapCount++;
  clearTimeout(momoTapTimer);

  if (momoTapCount >= 3) {
    momoTapCount = 0;
    makeMomoHappy();
  } else if (momoBubble) {
    momoBubble.textContent =
      momoMessages[momoMessageIndex];

    momoMessageIndex =
      (momoMessageIndex + 1) % momoMessages.length;
  }

  momoTapTimer = setTimeout(() => {
    momoTapCount = 0;
  }, 1200);
}


/* Klik kucing */

if (momo) {
  momo.addEventListener("click", handleMomoTap);

  momo.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMomoTap();
    }
  });
}


/* ========================================
   4. BUKA DAN TUTUP SURAT
======================================== */

let letterState = "closed";
let letterTimer;
let letterScrollTimer;


/* Gulir layar mengikuti surat */

function scrollToLetter() {
  if (!letterCard || letterCard.hidden) return;

  const rect = letterCard.getBoundingClientRect();

  // Berikan ruang kecil di atas surat.
  const targetY = Math.max(
    0,
    window.scrollY + rect.top - 35
  );

  window.scrollTo({
    top: targetY,
    behavior: "smooth"
  });
}


function toggleLetter() {
  if (!envelope || !letterCard) return;

  if (
    letterState === "opening" ||
    letterState === "closing"
  ) {
    return;
  }

  clearTimeout(letterTimer);
  clearTimeout(letterScrollTimer);

  if (letterState === "closed") {

    // Buka surat
    letterState = "opening";

    envelope.hidden = true;
    letterCard.hidden = false;

    letterCard.classList.remove("letter-close");
    letterCard.classList.add("letter-open");

    // Gulir setelah surat mulai terlihat.
    // Posisi dihitung ulang agar sesuai dengan layar HP.
    letterScrollTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToLetter();
      });
    }, 220);

    letterTimer = setTimeout(() => {
      letterCard.classList.remove("letter-open");
      letterState = "open";
    }, 850);

  } else if (letterState === "open") {

    // Tutup surat
    letterState = "closing";

    letterCard.classList.remove("letter-open");
    letterCard.classList.add("letter-close");

    letterTimer = setTimeout(() => {
      letterCard.hidden = true;
      letterCard.classList.remove("letter-close");

      envelope.hidden = false;
      letterState = "closed";
    }, 650);
  }
}


if (envelope) {
  envelope.addEventListener("click", toggleLetter);
}

if (letterCard) {
  letterCard.addEventListener("click", toggleLetter);
}


/* ========================================
   5. PESAN ACAK
======================================== */

const messages = [
  "Semoga hari-harimu dipenuhi hal-hal kecil yang membuatmu bahagia.",
  "Jangan lupa, kamu juga pantas mendapatkan waktu untuk beristirahat.",
  "Semoga selalu ada alasan sederhana untuk tersenyum hari ini.",
  "Tidak semua hari harus sempurna agar tetap menjadi hari yang berharga.",
  "Semoga hal baik datang kepadamu, satu per satu.",
  "Terima kasih sudah menjadi bagian dari cerita yang menyenangkan."
];

let lastMessageIndex = -1;

function showRandomMessage() {
  if (!randomMessage) return;

  let index;

  do {
    index = Math.floor(Math.random() * messages.length);
  } while (
    messages.length > 1 &&
    index === lastMessageIndex
  );

  lastMessageIndex = index;
  randomMessage.textContent = messages[index];
}

if (newMessageButton) {
  newMessageButton.addEventListener(
    "click",
    showRandomMessage
  );
}


/* ========================================
   6. PESAN RAHASIA
======================================== */

if (secretButton && secretNote) {
  secretButton.addEventListener("click", () => {
    const isHidden = secretNote.hidden;

    secretNote.hidden = !isHidden;

    secretButton.textContent = isHidden
      ? "Tutup pesan rahasia"
      : "Ada satu hal lagi...";
  });
}




/* ========================================
   7. MUSIK LATAR
======================================== */

if (musicToggle && backgroundMusic) {
  backgroundMusic.volume = 0.3;

  function updateMusicButton() {
    musicToggle.textContent = backgroundMusic.paused
      ? "♫ Musik: OFF"
      : "♫ Musik: ON";
  }

  async function playBackgroundMusic() {
    if (document.hidden || !backgroundMusic.paused) return;

    try {
      await backgroundMusic.play();
    } catch (error) {
      // Browser mungkin masih memblokir autoplay.
    }

    updateMusicButton();
  }

  // Tombol musik manual tetap berfungsi.
  musicToggle.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
      } catch (error) {
        // Gagal memutar: tunggu interaksi berikutnya.
      }
    } else {
      backgroundMusic.pause();
    }

    updateMusicButton();
  });

  // Coba putar 2 detik setelah halaman selesai dimuat.
  function scheduleMusic() {
    setTimeout(playBackgroundMusic, 2000);
  }

  if (document.readyState === "complete") {
    scheduleMusic();
  } else {
    window.addEventListener("load", scheduleMusic, { once: true });
  }

  // Coba lagi ketika pengguna pertama kali berinteraksi.
  function firstInteraction() {
    playBackgroundMusic();

    document.removeEventListener("pointerdown", firstInteraction);
    document.removeEventListener("touchstart", firstInteraction);
    document.removeEventListener("keydown", firstInteraction);
  }

  document.addEventListener("pointerdown", firstInteraction);
  document.addEventListener("touchstart", firstInteraction);
  document.addEventListener("keydown", firstInteraction);

  backgroundMusic.addEventListener("play", updateMusicButton);
  backgroundMusic.addEventListener("pause", updateMusicButton);
}




/* ========================================
   8. MEMULAI WEBSITE
======================================== */

showPage(0);
showRandomMessage();


/* ==================================
   SCRAPBOOK PHOTO REVEAL + SHAKE
================================== */

(() => {
  const scrapbook = document.getElementById("scrapbookPage");
  const enableButton = document.getElementById("enableShakeButton");
  const statusText = document.getElementById("shakeStatus");

  if (!scrapbook || !enableButton || !statusText) return;

  const covers = Array.from(
    scrapbook.querySelectorAll(".reveal-photo")
  );

  // Membuka satu foto tertentu.
  
function revealPhoto(photo) {
  if (!photo || photo.classList.contains("is-revealed")) return;

  photo.classList.add("is-revealed");

  const cover = photo.querySelector(".photo-cover");
  if (cover) {
    cover.setAttribute("aria-label", "Foto sudah dibuka");

    window.setTimeout(() => {
      // Jangan sembunyikan cover jika foto sudah ditutup ulang.
      if (photo.classList.contains("is-revealed")) {
        cover.hidden = true;
      }
    }, 900);
  }

  updateStatus();
}

// Memasang kembali penutup foto.
function resetPhoto(photo) {
  if (!photo) return;

  photo.classList.remove("is-revealed");

  const cover = photo.querySelector(".photo-cover");
  if (cover) {
    cover.hidden = false;
    cover.setAttribute("aria-label", "Buka foto");
  }

  updateStatus();
}

// Buat tombol tutup ulang untuk setiap foto.
covers.forEach((photo) => {
  if (photo.querySelector(".photo-reset")) return;

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "photo-reset";
  resetButton.textContent = "♡ Tutup kembali foto";

  resetButton.addEventListener("click", () => {
    resetPhoto(photo);
  });

  photo.appendChild(resetButton);
});

  // Ketukan pada setiap lapisan foto.
  covers.forEach((photo) => {
    const cover = photo.querySelector(".photo-cover");
    if (!cover) return;

    cover.addEventListener("click", () => {
      revealPhoto(photo);
    });
  });

  function findNextCoveredPhoto() {
    return covers.find(
      (photo) => !photo.classList.contains("is-revealed")
    );
  }

  function updateStatus() {
    const remaining = covers.filter(
      (photo) => !photo.classList.contains("is-revealed")
    ).length;

    if (remaining === 0) {
      statusText.textContent =
        "Semua fotoo sudaa terbuka.Semoga kamu sadar kalo kamu cantikk!";
    } else {
      statusText.textContent =
        `${remaining} Ketuk atau goyangkan HP untuk membukanya.`;
    }
  }

  // Sensor gerak: aktif hanya saat halaman scrapbook terlihat.
  let shakeEnabled = false;
  let previousMotion = null;
  let lastShakeTime = 0;

  const SHAKE_THRESHOLD = 13;
  const SHAKE_COOLDOWN = 1200;

  function handleMotion(event) {
    if (!shakeEnabled) return;

    // Jangan membuka foto saat pengguna sedang di halaman lain.
    if (
      scrapbook.hidden ||
      scrapbook.getClientRects().length === 0
    ) {
      previousMotion = null;
      return;
    }

    const acceleration = event.accelerationIncludingGravity;
    if (
      !acceleration ||
      acceleration.x == null ||
      acceleration.y == null ||
      acceleration.z == null
    ) {
      return;
    }

    const current = {
      x: acceleration.x,
      y: acceleration.y,
      z: acceleration.z
    };

    if (previousMotion) {
      const change = Math.sqrt(
        Math.pow(current.x - previousMotion.x, 2) +
        Math.pow(current.y - previousMotion.y, 2) +
        Math.pow(current.z - previousMotion.z, 2)
      );

      const now = Date.now();

      if (
        change > SHAKE_THRESHOLD &&
        now - lastShakeTime > SHAKE_COOLDOWN
      ) {
        lastShakeTime = now;
        revealPhoto(findNextCoveredPhoto());
      }
    }

    previousMotion = current;
  }

  async function enableShake() {
    if (!("DeviceMotionEvent" in window)) {
      statusText.textContent =
        "Sensor gerak tidak didukung browser ini. Kamu tetap bisa membuka foto dengan mengetuknya.";
      return;
    }

    try {
      // Browser tertentu, terutama iOS, meminta izin eksplisit.
      if (
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        const permission =
          await DeviceMotionEvent.requestPermission();

        if (permission !== "granted") {
          statusText.textContent =
            "Izin sensor belum diberikan. Ketuk foto untuk membukanya.";
          return;
        }
      }

      if (!window.isSecureContext) {
        statusText.textContent =
          "Sensor memerlukan HTTPS atau localhost. Ketuk foto tetap bisa digunakan.";
        return;
      }

      if (!shakeEnabled) {
        window.addEventListener("devicemotion", handleMotion);
        shakeEnabled = true;
      }

      enableButton.textContent = "Sensor goyang aktif";
      enableButton.disabled = true;

      statusText.textContent =
        "Goyangkan HP dengan lembut untuk membuka satu foto. Kamu juga bisa mengetuk foto secara langsung.";
    } catch (error) {
      statusText.textContent =
        "Sensor tidak bisa diaktifkan. Periksa izin browser atau ketuk foto secara langsung.";
    }
  }

  enableButton.addEventListener("click", enableShake);

  updateStatus();
})();


/* ==================================
   ALWAYS-ON SOUND EFFECT SYSTEM
================================== */

(() => {
  let audioContext = null;
  let activeNodes = [];
  let noiseBuffer = null;

  function getAudioContext() {
    if (!audioContext) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return null;

      audioContext = new AudioContextClass();
    }

    return audioContext;
  }

  function stopActiveSound() {
    activeNodes.forEach((node) => {
      try { node.stop(); } catch (_) {}
      try { node.disconnect(); } catch (_) {}
    });

    activeNodes = [];
  }

  function registerNode(node) {
    activeNodes.push(node);
    return node;
  }

  function makeNoiseBuffer(ctx) {
    if (noiseBuffer) return noiseBuffer;

    const length = Math.floor(ctx.sampleRate * 0.25);
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);

    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return noiseBuffer;
  }

  function playPop(ctx) {
    const now = ctx.currentTime;
    const oscillator = registerNode(ctx.createOscillator());
    const gain = registerNode(ctx.createGain());

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(320, now + 0.09);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.13);
  }

  function playPaper(ctx) {
    const now = ctx.currentTime;
    const source = registerNode(ctx.createBufferSource());
    const filter = registerNode(ctx.createBiquadFilter());
    const gain = registerNode(ctx.createGain());

    source.buffer = makeNoiseBuffer(ctx);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1300, now);
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + 0.18);
  }

  function playPeel(ctx) {
    const now = ctx.currentTime;
    const source = registerNode(ctx.createBufferSource());
    const filter = registerNode(ctx.createBiquadFilter());
    const gain = registerNode(ctx.createGain());

    source.buffer = makeNoiseBuffer(ctx);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(650, now + 0.22);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.10, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + 0.25);
  }

  async function playSound(type = "pop") {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === "suspended") await ctx.resume();

      stopActiveSound();

      if (type === "paper") playPaper(ctx);
      else if (type === "peel") playPeel(ctx);
      else playPop(ctx);
    } catch (_) {
      // Kegagalan audio tidak boleh mengganggu fitur website.
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("input, textarea, select")) return;

    let type = "pop";

    if (target.closest("#envelope, #letterCard")) {
      type = "paper";
    } else if (
      target.closest(".photo-cover, .photo-reset")
    ) {
      type = "peel";
    }

    playSound(type);
  }, true);
})();

/* ========================================
   OTOMATIS BERHENTI SAAT HALAMAN DITINGGALKAN
======================================== */

(() => {
  const music = document.getElementById("backgroundMusic");

  if (!music) return;

  function stopBackgroundMusic() {
    music.pause();
    music.currentTime = 0;
  }

  // Berhenti saat tab ditutup atau halaman ditinggalkan.
  window.addEventListener("pagehide", stopBackgroundMusic);

  // Berhenti saat berpindah tab atau aplikasi.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopBackgroundMusic();
    }
  });
})();
