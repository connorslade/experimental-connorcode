class Color {
  color: string;
  name: string;

  constructor(color: string, name: string) {
    this.color = color;
    this.name = name;
  }
}

export const colors = [
  new Color("#dc2626", "Red"),
  new Color("#ea580c", "Orange"),
  new Color("#facc15", "Yellow"),
  new Color("#16a34a", "Green"),
  new Color("#1d4ed8", "Blue"),
  new Color("#5b21b6", "Purple"),
];

function random_color() {
  let idx = Math.floor(Math.random() * colors.length);
  return colors[idx];
}

export function random() {
  let name = random_color().name;
  let color = random_color().color;
  return new Color(color, name);
}
