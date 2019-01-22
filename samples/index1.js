function main() {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.error("cannot get the context for webgl");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 创建顶点着色器
  const vertexSource = `
    attribute vec4 a_attribute;

    void main () {
      gl_Position = a_attribute; 
    }
  `;

  // 创建片段着色器
  const fragmentSource = `
    precision mediump float;

    void main () {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1);
    }
  `;

  const program = initiateShaderProgram(gl, vertexSource, fragmentSource); // 创建program

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // gl.ARRAY_BUFFER: 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。

  const position = [0, 0, 0, 0.5, 0.7, 0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW); // 创建和初始化缓存 // WebGL1: void gl.bufferData(target, ArrayBufferView srcData, usage);

  // 渲染部分开始
  //调整canvas 尺寸
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 清空画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  const positionAttributeLocation = gl.getAttribLocation(program, "a_attribute"); // 在program 中获得position 的位置
  // 使用之前建立的program
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation); // 启用对应的属性。



  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  var size = 2; // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  var offset = 0; // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // 画出图形
  // var primitiveType = gl.TRIANGLES;
  // var offset = 0;
  // var count = 3;
  // gl.drawArrays(primitiveType, offset, count);
}

function createShader(gl, type, source) {
  // 上下文，类型，数据源. 每一个shader 都要create， 无论是
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  } else {
    return shader;
  }
}

function initiateShaderProgram(gl, vertexSource, fragmentSource) {
  // 创建顶点和片段着色器
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  // 创建 program
  const program = gl.createProgram(); // 只是创建
  // 把着色器绑定到program 上
  gl.attachShader(program, vertexShader); // 先attach 才能再link
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  } else {
    return program;
  }
}

function initBuffer(gl, l) {}
