import React from "react"
import WebGLUtils from '../../webgl-utils.js'
import { mat4 } from 'gl-matrix'

const verts = [
    1, 1, 0, 1, 0,
    -1, 1, 0, 0, 0,
    -1, -1, 0, 0, 1,
    1, 1, 0, 1, 0,
    -1, -1, 0, 0, 1,
    1, -1, 0, 1, 1, 0
]

const vtext = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 uv;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        uv = aTextureCoord;
    }
`

const ftext = `
    precision highp float;
    varying vec2 uv;
    uniform vec4 colors[3];
    uniform vec2 particles[3];
    uniform vec4 lines[3];

    void main () {
        vec4 sum = vec4(0.0);
        for (int i=0; i<3; i++) {
            vec4 c = colors[i];
            vec2 p = particles[i];
            float d = c.a * smoothstep(0.6, 0.2, distance(p, uv));
            sum += d * vec4(c.a * c.rgb, c.a);
        }
        if (sum.a > 1.0) {
            sum.rgb /= sum.a;
            sum.a = 1.0;
        }
        gl_FragColor = vec4(sum.a * sum.rgb, 1.0);
        gl_FragColor += vec4(0.36);
        gl_FragColor.r *= 0.75;
        gl_FragColor.g *= 0.75;
        gl_FragColor.b *= 0.75;

        for (int i=0; i<3; ++i){
            float dx = lines[i].z - lines[i].x;
            float dy = lines[i].w - lines[i].y;
            float dxc = uv.x - lines[i].x;

            if(dxc > 0.0 && dxc < dx){
                float yDist = uv.y - (lines[i].y + dy/dx * dxc);
                if(yDist < 0.046 && yDist > -0.046){
                    gl_FragColor += vec4(0.92);
                }
            }
        }
    }
`

export default class MenuCanvas extends React.Component {

    webgl
    program
    programInfo

    wasOpen
    yDistance
    startTime

    constructor(props) {
        super(props)
        this.wasOpen = this.props.showMenuItems
        this.yDistance = 0.3
    }

    componentDidMount() {
        if (this.setupGL()) {
            this.setupProjection()
            this.setRotation(0, 0)
            this.startTime = performance.now()
            requestAnimationFrame(this.drawLoop)
        }
    }

    componentWillUnmount(){
        this.webgl.getExtension('WEBGL_lose_context').loseContext()
    }

    componentDidUpdate() {
        this.setupProjection()
        if (this.props.showMenuItems !== this.wasOpen) {
            this.wasOpen = this.props.showMenuItems
            if (this.props.showMenuItems === true) {
                this.openMenu(0, 20)
            }
            else if (this.props.showMenuItems === false) {
                this.closeMenu(0, 20)
            }
        }
    }

    openMenu = (currStep, numSteps) => {
        if (currStep <= numSteps) {
            this.yDistance = 0.3 * (Math.cos(currStep / numSteps * Math.PI) + 1.0) / 2.0
            setTimeout(this.openMenu, 16, ++currStep, numSteps)
        }
    }

    closeMenu = (currStep, numSteps) => {
        if (currStep <= numSteps) {
            this.yDistance = 0.3 * (Math.cos(currStep / numSteps * Math.PI + Math.PI) + 1.0) / 2.0
            setTimeout(this.closeMenu, 16, ++currStep, numSteps)
        }
    }

    drawLoop = () => {
        this.draw()
        requestAnimationFrame(this.drawLoop)
    }

    setupGL() {
        var canvas = document.getElementById('menu-canvas')
        let utils = new WebGLUtils()
        this.webgl = utils.setupWebGL(canvas)
        let gl = this.webgl
        if (!gl) {
            return false
        }

        // shaders
        this.program = utils.initShaders(gl, vtext, ftext)
        gl.useProgram(this.program)

        // attributes and uniforms
        this.programInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
                textureCoord: gl.getAttribLocation(this.program, 'aTextureCoord'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(this.program, 'uModelViewMatrix'),
                colors: gl.getUniformLocation(this.program, 'colors'),
                particles: gl.getUniformLocation(this.program, 'particles'),
                lines: gl.getUniformLocation(this.program, 'lines'),
            },
        }

        // assign particles
        let particles = [
            0.3, 0.3,
            0.7, 0.5,
            0.4, 0.9
        ]
        gl.uniform2fv(this.programInfo.uniformLocations.particles, particles)

        // fullscreen quad
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 20, 0)
        gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition)
        gl.vertexAttribPointer(this.programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 20, 12)
        gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord)

        return true
    }

    setRotation(xr, zr) {
        let gl = this.webgl
        let proinfo = this.programInfo
        const modelViewMatrix = mat4.create()
        mat4.translate(modelViewMatrix,   // destination matrix
            modelViewMatrix,              // matrix to translate
            [0.0, 0.0, -2.4])             // amount to translate
        mat4.rotate(modelViewMatrix,      // destination matrix
            modelViewMatrix,              // matrix to rotate
            zr,                           // amount to rotate in radians
            [0, 0, 1])                    // axis to rotate around (Z)
        mat4.rotate(modelViewMatrix,      // destination matrix
            modelViewMatrix,              // matrix to rotate
            xr,                           // amount to rotate in radians
            [0, 1, 0])                    // axis to rotate around (X)
        gl.uniformMatrix4fv(proinfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
    }

    setupProjection() {
        let gl = this.webgl
        let proinfo = this.programInfo
        let w = this.props.canvasWidth
        let h = w

        // convert css pixels to canvas pixels for high dpi screens
        let devicePixelRatio = window.devicePixelRatio || 1
        let wb = w * devicePixelRatio
        let hb = h * devicePixelRatio

        gl.canvas.style.width = w + "px"
        gl.canvas.style.height = h + "px"
        gl.canvas.width = wb
        gl.canvas.height = hb

        // field of view
        const fieldOfView = 45 * Math.PI / 180
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const zNear = 0.1
        const zFar = 100.0
        const projectionMatrix = mat4.create()
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
        gl.uniformMatrix4fv(proinfo.uniformLocations.projectionMatrix, false, projectionMatrix)

        // set viewport
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }

    draw() {
        let time = (performance.now() - this.startTime) / 4 + 1400
        let dy = this.yDistance
        let x1 = 0.25 - dy * 0.5
        let x2 = 0.75 + dy * 0.5

        let colors = [
            Math.cos(0.002 * time), Math.sin(0.002 * time), 0.2, 1,
            Math.sin(0.002 * time), -Math.cos(0.002 * time), 0.1, 1,
            0.3, Math.sin(3 + 0.002 * time), Math.cos(1 + 0.003 * time), 1
        ]

        let lines = [
            x1, 0.5 - dy, x2, 0.5 - dy,
            x1, 0.5, x2, 0.5,
            x1, 0.5 + dy, x2, 0.5 + dy
        ]

        let gl = this.webgl

        gl.uniform4fv(this.programInfo.uniformLocations.colors, colors)
        gl.uniform4fv(this.programInfo.uniformLocations.lines, lines)

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.clearColor(1.0, 0.0, 0.5, 1.0)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    render() {
        let boxcss = {
            marginTop: this.props.canvasMargin,
            marginBottom: this.props.canvasMargin,
            marginLeft: this.props.borderWidth - this.props.canvasWidth - this.props.canvasMargin,
        }

        return (
            <canvas style={boxcss} id="menu-canvas" onClick={this.props.handleTap}>
                Your browser doesn't support HTML5!
            </canvas>
        )
    }
}