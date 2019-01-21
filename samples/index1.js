function main() {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl"); // 返回canvas 的上下文（context）
  if (!gl) {
    alert("Unable to initiate WebGL");
    return;
  }
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // gl.clear(gl.color);

  // vertex
  // 顶点着色器
  // 内容是GLSL 字符串
  // 每个着色器的入口点都是main函数，在这个函数中我们处理所有的输入变量，并将结果输出到输出变量中。

  // GSLS 的三种变量
  //  uniform 是外部程序传递给 着色器（shader） 的变量。
  // uniform 类似于C语言的const，不能被shader 更改， 只能使用。
  // uniform变量一般用来表示：变换矩阵，材质，光照参数和颜色等信息。

  // attribute 变量是只能在vertex shader 中使用的变量，不能再fragment shader 中声明，
  // 一般用attribute变量来表示一些顶点的数据，如：顶点坐标，法线，纹理坐标，顶点颜色等。

  // varying 变量是在vertex 和fragment shader 之间做数据传递用的。一般是vertex修改varying 变量的值，然后fragment shader 使用该varying变量的值。
  const vsSource = ` 
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;
  // 片段着色器
  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // 初始化着色器
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
    }
  };

  const buffers = initBuffers(gl);

  drawSence(gl, programInfo, buffers);
}

function initBuffers(gl) {
  var vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  const positionBuffer = gl.createBuffer(); // create buffero store data such as vertices or colors
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // bind buffer with the

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // initialize and creates the buffer objects data store

  var colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0 // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return {
    position: positionBuffer
  };
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type); // type === gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}



var horizAspect = 480.0 / 640.0;

function drawSence(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear buffer and preset values

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create(); // a new 4 * 4 matrix

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
  // gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  // gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  // setMatrixUniforms();
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initShaderProgram(gl, vsSource, fsSource) {
  // 三个变量， gl就是context， 然后顶点着色器，片段着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource); // createShader()
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram(); // 创建着色器对象
  gl.attachShader(shaderProgram, vertexShader); //
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }
  return shaderProgram;
}