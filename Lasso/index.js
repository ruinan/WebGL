function main () {
    console.log('main is here');
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');

    if(!gl) {
        console.error('Cannot get gl context');
        return;
    }
    bindCanvasMouseEvents(canvas);

    const VertexSource = `
        precision lowp float;
        attribute vec4 aPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
        }
    `;
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