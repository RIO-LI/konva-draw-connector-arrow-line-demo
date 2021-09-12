import "./styles.css";
import Konva from "konva";
import Rect from "./rect";

var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: "container",
  width: width,
  height: height
});
var layer = new Konva.Layer();
const r1 = new Rect({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  stroke: "skyblue"
});

r1.addTo(layer);
stage.add(layer);
