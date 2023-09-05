const CDN_ADDRESS = "https://connorcode.com/files/Audio/AyeshaErotica";
const SPECIAL_ALBUMS = [
  "Instrumentals",
  "Demos",
  "Misc/ Unreleased",
  "Snippets",
  "Alt Mix",
  "Covers",
  "Acapella",
];
const NAV_MAP = [
  ["Albums", null, "albums"],
  ["Singles", "Singles", "singles"],
  ["Instrumentals", "Instrumentals", "instrumentals"],
  ["Demos", "Demos", "demos"],
  ["Unreleased", "Misc/ Unreleased", "unreleased"],
  ["Snippets", "Snippets", "snippets"],
  ["Alt Mix", "Alt Mix", null],
  ["Covers", "Covers", "covers"],
  ["Acapella", "Acapella", "acapella"],
];

function album_filter(name, page, count) {
  let is_single = name.includes("Single") || count == 1;
  if (page == "Singles") return is_single;
  else if (name == "Prada Demos") return page == "Demos";
  else if (page == null) return !(SPECIAL_ALBUMS.includes(name) || is_single);
  else return name == page;
}

function length(seconds_raw) {
  seconds_raw = Math.round(seconds_raw);
  let minutes = Math.floor(seconds_raw / 60);
  let seconds = Math.floor(seconds_raw % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function stop_audio(element) {
  document.querySelectorAll("audio").forEach((audio) => {
    if (audio !== element) audio.pause();
  });
}

function filter_from_id() {
  let id = document.URL.split("#");
  if (id.length <= 1) return null;
  id = id[1].split(".")[0];

  let map = NAV_MAP.find((x) => x[2] == id);
  if (map == undefined) return null;
  else return map[1];
}

function mobile_view() {
  return window.innerWidth <= 800;
}
