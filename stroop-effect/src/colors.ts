class Color {
  color: string;
  name: string;

  constructor(color: string, name: string) {
    this.color = color;
    this.name = name;
  }
}

const colors = [
  new Color("red", "Red"),
  new Color("green", "Green"),
  new Color("blue", "Blue"),
];

export default colors;
