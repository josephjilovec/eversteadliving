const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
  navLinks.dataset.open = String(open);
});
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  }),
);
const form = document.querySelector("[data-inquiry]");
function connectBrief(title, collect) {
  if (!form) return;
  form
    .querySelectorAll('[type="submit"]')
    .forEach((button) => (button.disabled = false));
  const result = document.getElementById("brief-result"),
    area = document.getElementById("brief-text"),
    email = document.getElementById("email-brief"),
    status = document.getElementById("copy-status");
  const update = () => {
    email.href =
      "mailto:josephjilovec@pm.me?subject=" +
      encodeURIComponent(title) +
      "&body=" +
      encodeURIComponent(area.value);
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    area.value =
      title +
      "\n\n" +
      collect(new FormData(form)) +
      "\n\nI understand this service is in development. Please let me know whether a suitable pilot is available and agree the scope before any engagement.";
    update();
    result.hidden = false;
    document.getElementById("brief-heading").focus();
    status.textContent =
      "Draft created in this browser. Nothing has been sent.";
  });
  area.addEventListener("input", update);
  document.getElementById("copy-brief").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      status.textContent =
        "Copied. Paste the draft into your preferred email app.";
    } catch {
      area.focus();
      area.select();
      status.textContent =
        "Select and copy the draft above using your device’s copy command.";
    }
  });
  form.addEventListener("input", (e) => {
    if (e.target.closest("#brief-result")) return;
    result.hidden = true;
    status.textContent = "";
  });
}
function observeChapters(selector, onChange) {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) onChange(active.target.dataset.chapter);
    },
    { rootMargin: "-18% 0px -36% 0px", threshold: [0, 0.25, 0.5] },
  );
  document.querySelectorAll(selector).forEach((e) => observer.observe(e));
}
const roomButtons = document.querySelectorAll("[data-room-select]");
function selectRoom(id) {
  document.querySelector(".home-map").dataset.active = id;
  roomButtons.forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.roomSelect === id)),
  );
}
selectRoom("entry");
roomButtons.forEach((b) =>
  b.addEventListener("click", () => {
    selectRoom(b.dataset.roomSelect);
    document
      .getElementById(b.dataset.roomSelect)
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  }),
);
observeChapters(".room-chapter", selectRoom);
function updateRoomList() {
  const selected = [...document.querySelectorAll("[name=rooms]:checked")].map(
    (e) => e.value,
  );
  document.getElementById("room-list").textContent = selected.length
    ? selected.join(" · ")
    : "Choose one room, or start with a general question.";
}
document
  .querySelectorAll("[name=rooms]")
  .forEach((e) => e.addEventListener("change", updateRoomList));
document.querySelectorAll("[data-add-room]").forEach((a) =>
  a.addEventListener("click", () => {
    document.querySelector(
      '[data-room-check="' + a.dataset.addRoom + '"]',
    ).checked = true;
    updateRoomList();
    document.getElementById("brief-result").hidden = true;
  }),
);
connectBrief(
  "Everstead Living — room planning interest",
  (data) =>
    "Rooms: " +
    (data.getAll("rooms").join(", ") || "General home-planning question") +
    "\nPerspective: " +
    data.get("perspective") +
    "\nCity or region: " +
    (data.get("region") || "To discuss") +
    "\nEveryday routine: " +
    (data.get("context") || "To discuss"),
);
