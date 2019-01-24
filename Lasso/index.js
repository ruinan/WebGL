function main() {
    console.log('main is here');
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('Cannot get gl context');
        return;
    }
    bindCanvasMouseEvents(canvas); // To get the mouse event

    // 初始化一些矩阵，将来用来赋值
    var modelViewMatrix = glMatrix.mat4.create();
    var projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.ortho(projectionMatrix, 0, 1, 0, 1, -100, 100); 

    // 初始化线条的顶点着色器
    const LineVertexSource = `
        precision lowp float;
        attribute vec4 aPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
        }
    `;
    // 初始化线条的片段着色器
    const LineFragmentSource = `
        precision lowp float;
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

   
    // 初始化 线条program
    const lineProgram = initiateProgram(
        gl,
        LineVertexSource,
        LineFragmentSource
    ); // create the line program
    gl.useProgram(lineProgram);

    let uProjectionMatrix = gl.getUniformLocation(
        lineProgram,
        'uProjectionMatrix'
    );
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    let uModelVeiwMatrix = gl.getUniformLocation(
        lineProgram,
        'uModelViewMatrix'
    );
    gl.uniformMatrix4fv(uModelVeiwMatrix, false, modelViewMatrix);

    
    // 初始化
    const TextureVertexSource = `
        attribute vec4 aPosition;
        attribute vec2 aVertexUV;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying vec2 uv;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
            uv = aVertexUV;
        }
    `;

    const TextureFragmentSource = `
        precision lowp float;
        uniform float brightness;
        uniform sampler2D texture;
        
        varying vec2 uv;
        
        void main() {
            vec3 color = texture2D(texture, uv).rgb;
            gl_FragColor = vec4(color + vec3(brightness, brightness, brightness), 1.0);
        }
    `;

    const textureProgram = initiateProgram(
        gl,
        TextureVertexSource,
        TextureFragmentSource
    ); // create the line program
    gl.useProgram(textureProgram);

    uProjectionMatrix = gl.getUniformLocation(textureProgram, "uProjectionMatrix"); // get the location
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);// pass the value

    uModelViewMatrix = gl.getUniformLocation(textureProgram, "uModelViewMatrix");
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    uBrightness = gl.getUniformLocation(textureProgram, "brightness");

    gl.disable(gl.DEPTH_TEST);

    initTexture(gl, textureProgram);

}

function initTexture(gl, textureProgram) {
    const sampler = gl.getUniformLocation(textureProgram, "texture");
    const texture = gl.createTexture();

    const image = new Image();
    const url = 'https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg';
    requestCORSIfNotSameOrigin(image, url);
    image.src = url;

    image.onload = function() {
        gl.useProgram(textureProgram);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 反转y轴，因为图片坐标轴和webgl的不一样。
        gl.activeTexture(gl.TEXTURE0); // 激活一个texture
        gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定图片到纹理上，
    }
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
        img.crossOrigin = "";
    }
}

function initiateProgram(gl, vertexSource, fragmentSource) {
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

function bindCanvasMouseEvents(canvas) {
    canvas.onmousedown = onMouseDown;
    canvas.onmousemove = onMouseMove;
    canvas.onmouseup = onMouseUp;
}

function onMouseDown(e) {
    console.log('mouse down');
}

function onMouseUp(e) {
    console.log('mouse up');
}

function onMouseMove(e) {
    console.log('mouse move');
}
