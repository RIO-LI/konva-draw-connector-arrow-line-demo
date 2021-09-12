import Konva from "konva";

export default class {
  constructor(config) {
    this.config = {
      ...config
    };
    this.activeConnector = null;
    this.isHoverConnector = false;
    this.arrow = new Konva.Arrow({
      pointerLength: 20,
      pointerWidth: 20,
      fill: "black",
      stroke: "black",
      strokeWidth: 2,
      visible: false
    });
    this.stage = null;
    this.layer = null;
    this.group = new Konva.Group({
      draggable: true
    });
    this.connectors = [];
    this.node = new Konva.Rect(this.config);
    this.group.add(this.node, this.arrow);
    this.updateConnectors(this.config);
    this.node.on("mouseover", () => {
      this.node.getStage().container().style.cursor = "move";
      this.connectors.forEach((connector) => {
        connector.setAttrs({
          visible: true
        });
      });
    });
    this.group.on("mouseout", () => {
      console.log("node mouseout");
      setTimeout(() => {
        !this.activeConnector &&
          !this.isHoverConnector &&
          this.connectors.forEach((connector) => {
            connector.setAttrs({
              visible: false
            });
          });
      }, 500);
    });
  }

  updateConnectors(config) {
    this.connectors.forEach((connector) => connector.destroy());
    this.connectors = [];
    this.connectors = this.updateConnectorsPosition(config).map(
      (connectorsPosition) => {
        const circle = new Konva.Circle({
          x: connectorsPosition.x,
          y: connectorsPosition.y,
          radius: 6,
          fill: "rgba(255,255,255,1)",
          stroke: "rgba(12,125,240,1)",
          strokeWidth: 1,
          visible: false
        });
        circle.on("mouseover", (e) => {
          this.isHoverConnector = true;
          this.group.setAttrs({
            draggable: false
          });
          circle.getStage().container().style.cursor = "crosshair";
        });
        circle.on("mouseout", () => {
          this.isHoverConnector = false;
          this.group.setAttrs({
            draggable: true
          });
          circle.getStage().container().style.cursor = "default";
        });
        circle.on("mousedown", (event) => {
          this.activeConnector = event.target;
          const stage = circle.getStage();
          stage.on("mousemove", () => {
            console.log("mousemove.draw-arrow");
            const { x: x1, y: y1 } = this.activeConnector.getPosition();
            const {
              x: offsetX,
              y: offsetY
            } = this.activeConnector.getRelativePointerPosition();
            const length = Math.sqrt(offsetX ** 2 + offsetY ** 2);
            console.log(
              `x1: ${x1} , y1: ${y1} offsetX: ${offsetX}, offsetY: ${offsetY}`
            );
            length > 8 &&
              this.arrow.setAttrs({
                x: x1,
                y: y1,
                points: [0, 0, offsetX, offsetY],
                visible: true
              });
          });
          stage.on("mouseup", () => {
            console.log("off event: mousemove.draw-arrow mouseup.draw-arrow");
            circle.getStage().off("mousemove mouseup");
            this.arrow.setAttrs({
              visible: false
            });
            this.isHoverConnector = false;
            this.activeConnector = null;
          });
        });
        return circle;
      }
    );
    this.group.add(...this.connectors);
  }

  updateConnectorsPosition(config) {
    const connectorsPosition = [];
    const { x, y, width, height } = config;
    // top
    connectorsPosition.push({
      x: x + width / 2,
      y
    });
    // right
    connectorsPosition.push({
      x: x + width,
      y: y + height / 2
    });
    // bottom
    connectorsPosition.push({
      x: x + width / 2,
      y: y + height
    });
    // left
    connectorsPosition.push({
      x: x,
      y: y + height / 2
    });
    return connectorsPosition;
  }

  addTo(layer) {
    this.layer = layer;
    this.layer.add(this.group);
  }
}
