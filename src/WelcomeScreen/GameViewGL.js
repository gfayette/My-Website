import React from 'react';
import WebGLUtils from '../webgl-utils.js'
import Shaders from './Shaders.js'
import { mat4 } from 'gl-matrix'
import GameModel from './GameModel.js'

class GameViewGL extends React.Component {
  webgl // context
  program // shaders
  programInfo // uniform and attribute locations

  buffers // gpu buffers
  textures // image textures

  game
  numLoadedTextures
  isSetup
  updating

  constructor(props) {
    super(props)
    this.isSetup = false
    this.updating = false
    this.numLoadedTextures = 0
  }

  handleTap = (e) => {
    if (!this.props.block && this.isSetup) {
      let x = (e.pageX - this.props.marginLeft) / this.props.height
      let y = (e.pageY - this.props.marginTop) / this.props.height
      this.game.handleClick(x, y)
    }
  }

  componentDidMount() {
    if (this.setupGL()) {
      this.setupProjection(this.props.width, this.props.height)
      this.setRotation(0, 0)
      this.setupGameModel()
      this.checkGameStart()
    }
  }

  componentDidUpdate() {
    if (this.isSetup) {
      this.updating = true
      if (!this.props.block) {
        let devicePixelRatio = window.devicePixelRatio || 1
        let wb = this.props.width * devicePixelRatio
        let hb = this.props.height * devicePixelRatio
        this.game.updateCanvasSize(wb, hb)
        this.setupProjection(this.props.width, this.props.height)
        this.updating = false
      }
    }
  }

  resetGame = () => {
    this.updating = true
    let devicePixelRatio = window.devicePixelRatio || 1
    let wb = this.props.width * devicePixelRatio
    let hb = this.props.height * devicePixelRatio
    this.game = new GameModel(wb, hb, this.props.updateIntro, this.props.fullscreen, this.resetGame)
    this.game.startGame()
    this.updating = false
  }

  setupGameModel() {
    let devicePixelRatio = window.devicePixelRatio || 1
    let wb = this.props.width * devicePixelRatio
    let hb = this.props.height * devicePixelRatio
    this.game = new GameModel(wb, hb, this.props.updateIntro, this.props.fullscreen, this.resetGame)
    requestAnimationFrame(this.drawLoop)
  }

  checkGameStart = () => {
    if (this.numLoadedTextures >= 11 && this.props.pageLoaded) {
      this.game.startGame()
      this.isSetup = true
    } else {
      setTimeout(this.checkGameStart, 100)
    }
  }

  drawLoop = () => {
    if (!this.props.block && !this.updating && this.isSetup) {
      this.drawScene()
    }
    else {
      this.clearCanvas()
    }
    requestAnimationFrame(this.drawLoop)
  }

  setupGL() {
    var canvas = document.getElementById('gl-canvas')

    let utils = new WebGLUtils()
    this.webgl = utils.setupWebGL(canvas)
    let gl = this.webgl
    if (!gl) {
      alert('WebGL unavailable, skipping intro')
      this.props.updateIntro(2)
      return false
    }

    // gl Parameters
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.disable(gl.CULL_FACE)

    // shaders
    this.program = utils.initShaders(gl, Shaders.vtext, Shaders.ftext)
    gl.useProgram(this.program)

    // attributes and uniforms
    this.programInfo = {
      program: this.program,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(this.program, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(this.program, 'uModelViewMatrix'),
        uSampler: gl.getUniformLocation(this.program, 'uSampler'),
        rotation: gl.getUniformLocation(this.program, 'rotation'), // texture rotation [x, y, z, rotation (radians)]
        colorMask: gl.getUniformLocation(this.program, 'colorMask'), // multiply color by this value
        texColor: gl.getUniformLocation(this.program, 'texColor'), // replace magenta with this color
        shaderArgs: gl.getUniformLocation(this.program, 'shaderArgs'), // tell the shaders which methods to use
        screen: gl.getUniformLocation(this.program, 'screen'), // screen dimensions
        effectArgs: gl.getUniformLocation(this.program, 'effectArgs'), // post effect
      },
    }

    // textures and buffers
    this.loadTextures()
    this.buffers = {
      vbuffer: gl.createBuffer(),
      texbuffer: gl.createFramebuffer(),
    }

    return true
  }

  clearCanvas() {
    let gl = this.webgl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
  }

  drawScene() {
    let gl = this.webgl
    let proinfo = this.programInfo
    let [textures, numFrags] = this.game.getTextureModels()
    let effectArgs = this.game.getEffectArgs()

    // frame buffer texture
    gl.uniform4fv(proinfo.uniformLocations.shaderArgs, [-1, 0, 0, 0])
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffers.texbuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[1000], 0)

    // clear screen
    this.clearCanvas()

    // setup vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vbuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures.vertices), gl.STATIC_DRAW)

    gl.vertexAttribPointer(proinfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 20, 0)
    gl.enableVertexAttribArray(proinfo.attribLocations.vertexPosition)
    gl.vertexAttribPointer(proinfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 20, 12)
    gl.enableVertexAttribArray(proinfo.attribLocations.textureCoord)

    // draw textures to frame buffer texture
    for (let i = numFrags; i < textures.textureIds.length; ++i) {
      gl.uniform4fv(proinfo.uniformLocations.rotation, textures.rotations[i])
      gl.uniform4fv(proinfo.uniformLocations.texColor, textures.texColors[i])
      gl.uniform4fv(proinfo.uniformLocations.colorMask, textures.colorMasks[i])
      gl.bindTexture(gl.TEXTURE_2D, this.textures[textures.textureIds[i]])
      gl.drawArrays(gl.TRIANGLES, i * 6, 6)
    }

    // draw frame buffer to screen
    gl.uniform4fv(proinfo.uniformLocations.effectArgs, effectArgs)
    gl.uniform4fv(proinfo.uniformLocations.shaderArgs, [1, 0, 0, 0])
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, this.textures[1000])
    for (let i = 0; i < numFrags; ++i) {
      gl.uniform4fv(proinfo.uniformLocations.rotation, textures.rotations[i])
      gl.uniform4fv(proinfo.uniformLocations.texColor, textures.texColors[i])
      gl.uniform4fv(proinfo.uniformLocations.colorMask, textures.colorMasks[i])
      gl.drawArrays(gl.TRIANGLES, i * 6, 6)
    }
  }

  setRotation(xr, zr) {
    let gl = this.webgl
    let proinfo = this.programInfo
    const modelViewMatrix = mat4.create()
    mat4.translate(modelViewMatrix, // destination matrix
      modelViewMatrix,              // matrix to translate
      [0.0, 0.0, -2.4])             // amount to translate
    mat4.rotate(modelViewMatrix,    // destination matrix
      modelViewMatrix,              // matrix to rotate
      zr,                           // amount to rotate in radians
      [0, 0, 1])                    // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,    // destination matrix
      modelViewMatrix,              // matrix to rotate
      xr,                           // amount to rotate in radians
      [0, 1, 0])                    // axis to rotate around (X)
    gl.uniformMatrix4fv(proinfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
  }

  setupProjection(wpx, hpx) {
    let gl = this.webgl
    let proinfo = this.programInfo

    // convert css pixels to canvas pixels for high dpi screens
    let devicePixelRatio = window.devicePixelRatio || 1
    let wb = wpx * devicePixelRatio
    let hb = hpx * devicePixelRatio

    gl.canvas.style.width = wpx + "px"
    gl.canvas.style.height = hpx + "px"
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

    // update screen uniform
    gl.uniform4fv(proinfo.uniformLocations.screen, [wb, hb, 0, 0])
    // update frame buffer texture
    this.createFramebufferTexture(wb, hb)
    // set viewport
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }

  loadTextures() {
    let texts = []

    texts[100] = this.getTexture('/images/languages/c.png')
    texts[101] = this.getTexture('/images/languages/cpp.png')
    texts[102] = this.getTexture('/images/languages/csharp.png')
    texts[103] = this.getTexture('/images/languages/css3.png')
    texts[104] = this.getTexture('/images/languages/html5.png')
    texts[105] = this.getTexture('/images/languages/js.png')
    texts[106] = this.getTexture('/images/languages/android.png')
    texts[107] = this.getTexture('/images/languages/py.png')
    texts[108] = this.getTexture('/images/languages/ts.png')

    texts[200] = this.getTexture('/images/text/candara_0.png')
    texts[201] = this.getTexture('/images/text/candara_1.png')

    this.textures = texts
  }

  createFramebufferTexture(wb, hb) {
    let gl = this.webgl
    let frameTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, frameTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, wb, hb, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    this.textures[1000] = frameTexture
  }

  getTexture(imageSource) {
    let gl = this.webgl
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]))

    const image = new Image()
    image.src = imageSource
    image.addEventListener('load', function () {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      if ((image.width & (image.width - 1)) === 0 && (image.height & (image.height - 1) === 0)) {
        gl.generateMipmap(gl.TEXTURE_2D)
      }
      else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      }
    })
    ++this.numLoadedTextures
    return texture
  }

  render() {
    let css = {
      position: 'fixed',
      marginTop: this.props.marginTop,
      marginLeft: this.props.marginLeft,
    }

    return (
      <canvas id="gl-canvas" style={css} onClick={this.handleTap}>
        Your browser doesn't support HTML5!
      </canvas>
    )
  }
}

export default GameViewGL;
