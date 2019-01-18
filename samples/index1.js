function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext();
    if (gl === null) {
      alert("Unable to initiate WebGL");
      return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.color);
  }
