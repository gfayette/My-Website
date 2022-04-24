import React from "react"
import WebGLUtils from '../../webgl-utils.js'
import { mat4 } from 'gl-matrix'

const verts = [
    // X, Y, Z, R, G, B
    // Top
    -1.0, 1.0, -1.0, 0.541176, 0.376471, 0.556963,
    -1.0, 1.0, 1.0, 0.541176, 0.376471, 0.556963,
    1.0, 1.0, 1.0, 0.541176, 0.376471, 0.556963,
    1.0, 1.0, -1.0, 0.541176, 0.376471, 0.556963,

    // Left
    -1.0, 1.0, 1.0, 0.364706, 0.317647, 0.47451,
    -1.0, -1.0, 1.0, 0.364706, 0.317647, 0.47451,
    -1.0, -1.0, -1.0, 0.364706, 0.317647, 0.47451,
    -1.0, 1.0, -1.0, 0.364706, 0.317647, 0.47451,

    // Right
    1.0, 1.0, 1.0, 0.309804, 0.458824, 0.603922,
    1.0, -1.0, 1.0, 0.309804, 0.458824, 0.603922,
    1.0, -1.0, -1.0, 0.309804, 0.458824, 0.603922,
    1.0, 1.0, -1.0, 0.309804, 0.458824, 0.603922,

    // Front
    1.0, 1.0, 1.0, 0.662745, 0.988235, 0.67451,
    1.0, -1.0, 1.0, 0.662745, 0.988235, 0.67451,
    -1.0, -1.0, 1.0, 0.662745, 0.988235, 0.67451,
    -1.0, 1.0, 1.0, 0.662745, 0.988235, 0.67451,

    // Back
    1.0, 1.0, -1.0, 0.568627, 0.792157, 0.694118,
    1.0, -1.0, -1.0, 0.568627, 0.792157, 0.694118,
    -1.0, -1.0, -1.0, 0.568627, 0.792157, 0.694118,
    -1.0, 1.0, -1.0, 0.568627, 0.792157, 0.694118,

    // Bottom
    -1.0, -1.0, -1.0, 0.92549, 0.996078, 0.666667,
    -1.0, -1.0, 1.0, 0.92549, 0.996078, 0.666667,
    1.0, -1.0, 1.0, 0.92549, 0.996078, 0.666667,
    1.0, -1.0, -1.0, 0.92549, 0.996078, 0.666667,
]

const indices = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
]

const vtext = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
`

const ftext = `
    precision mediump float;

    varying vec3 fragColor;
    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`

export default class CubeCanvas extends React.Component {

    webgl       
    matWorldUniformLocation
    worldMatrix
    identityMatrix
    xRotationMatrix
    yRotationMatrix

    componentDidMount() {
        if (this.setupGL()) {
            this.setupCanvas()
            requestAnimationFrame(this.drawLoop)
        }
    }

    componentDidUpdate() {
        this.setupCanvas()
    }

    setupCanvas() {
        let gl = this.webgl
        let w = this.props.cubeWidth
        let h = w

        // convert css pixels to canvas pixels for high dpi screens
        let devicePixelRatio = window.devicePixelRatio || 1
        let wb = w * devicePixelRatio
        let hb = h * devicePixelRatio

        gl.canvas.style.width = w + "px"
        gl.canvas.style.height = h + "px"
        gl.canvas.width = wb
        gl.canvas.height = hb

        // set viewport
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }

    drawLoop = () => {
        this.draw()
        requestAnimationFrame(this.drawLoop)
    }

    setupGL() {
        var canvas = document.getElementById('cube-canvas')
        let utils = new WebGLUtils()
        this.webgl = utils.setupWebGL(canvas)
        let gl = this.webgl
        if (!gl) {
            return false
        }

        // shaders
        let program = utils.initShaders(gl, vtext, ftext)
        gl.useProgram(program)

        gl.clearColor(0, 0, 0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST)
        gl.frontFace(gl.CCW)
        gl.cullFace(gl.BACK)

        // buffers
        var boxVertexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)

        var boxIndexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor')
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0)
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)
        gl.enableVertexAttribArray(positionAttribLocation)
        gl.enableVertexAttribArray(colorAttribLocation)

        // view and projection
        let viewMatrix = new Float32Array(16)
        let projMatrix = new Float32Array(16)

        mat4.lookAt(viewMatrix, [0, 0, -6], [0, 0, 0], [0, 1, 0])
        mat4.perspective(projMatrix, 0.7, 1, 0.1, 100)

        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mView'), gl.FALSE, viewMatrix)
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mProj'), gl.FALSE, projMatrix)

        this.matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
        this.worldMatrix = mat4.identity(new Float32Array(16))
        this.identityMatrix = mat4.identity(new Float32Array(16))

        this.xRotationMatrix = new Float32Array(16)
        this.yRotationMatrix = new Float32Array(16)

        return true
    }

    draw() {
        let gl = this.webgl
        let angle = performance.now() / 1600
        mat4.rotate(this.xRotationMatrix, this.identityMatrix, angle, [0, 1, 0])
        mat4.rotate(this.yRotationMatrix, this.identityMatrix, angle / 2, [1, 0, 0])
        mat4.mul(this.worldMatrix, this.xRotationMatrix, this.yRotationMatrix)
        gl.uniformMatrix4fv(this.matWorldUniformLocation, gl.FALSE, this.worldMatrix)

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    }

    render() {
        return (
            <canvas id="cube-canvas">
                Your browser doesn't support HTML5!
            </canvas>
        )
    }
}