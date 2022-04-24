import { AggregateTexturesGL } from './Texture.js'
import PointEffect from './Effects/PointEffect.js'
import Intro from './Effects/IntroSequence.js'
import Image from './Models/Image.js'
import ScreenFragment from './Models/ScreenFragment'
import Explosion from './Effects/Explosion.js'

export default class GameModel {

    /*
    Game uses a grid with height 1, starting from 0 at the top.
    Width is aspect, starting from 0 at the left.

    All rendered game objects inherit from the Texture class. 
    This class has methods to convert the game object into data for webgl.
    Game object positions are centered on the texture.

    Vertex shaders use a grid with the origin centered on the canvas.

    Fragment shaders use fragment coordinates which are in buffer pixels starting from the edge of the texture.
    Buffer pixels are screen pixels multiplied by devicePixelRatio ( > 1 for high dpi screens)
    Texture mapping uses a grid with x and y in the range 0-1.
    */

    introCallback
    fullscreenCallback
    resetCallback

    width
    widthPx
    height
    heightPx
    aspect
    pxRatio

    images
    debris
    textureStrings
    screenFragments

    elapsedTime
    lastTimestamp
    delay

    pointEffect
    intro
    introStep

    // for view
    textureModels

    // w and h in pixeels
    constructor(w, h, updateIntro, fullscreen, resetGame) {
        this.introCallback = updateIntro
        this.fullscreenCallback = fullscreen
        this.resetCallback = resetGame

        this.widthPx = w
        this.heightPx = h
        this.aspect = w / h
        this.width = this.aspect
        this.height = 1
        this.pxRatio = h

        this.images = []
        this.debris = []
        this.textureStrings = []
        this.screenFragments = []
        this.elapsedTime = 0
        this.lastTimestamp = 0
        this.delay = 4

        this.screenFragments = [new ScreenFragment(this.width, this.height, this.width / 2, this.height / 2, 0, -1, this)]

        this.pointEffect = new PointEffect(this, 0, 0, 0, 0, 0)
        this.intro = new Intro(this)
        this.introStep = 0

        this.aggregateTextures()
    }

    // w and h in buffer pixels
    updateCanvasSize(w, h) {
        this.widthPx = w
        this.heightPx = h
        this.aspect = w / h
        this.width = this.aspect
        this.height = 1
        this.pxRatio = h

        if (this.screenFragments.length === 1) {
            this.screenFragments = [new ScreenFragment(this.width, this.height, this.width / 2, this.height / 2, 0, -1, this)]
        }

        let tex = this.textureStrings[0]
        tex.resize()
        tex.centerX()

        tex = this.textureStrings[1]
        tex.resize()
        if (tex.step1 > 1) {
            tex.centerX(this.width * 0.3)
        } else {
            tex.alignX(this.intro.getAlignX())
        }

        tex = this.textureStrings[2]
        tex.resize()
        tex.centerX(this.width * 0.44)

        tex = this.textureStrings[3]
        tex.resize()
        tex.centerX(this.width * 0.44)

        tex = this.textureStrings[4]
        tex.resize()
        tex.centerX(this.width * 0.44)

        this.aggregateTextures()
    }

    // w and h in game grid coords
    handleClick(x, y) {

        if (this.introStep === 0) {
            if (this.intro.step1 < 3) {
                let [x1, x2] = this.intro.getButtonX()
                if (x > x1 && x < x2) {
                    let ys = this.intro.getButtonY()
                    if (y > ys[0] && y < ys[1]) {
                        this.introStep = 1
                        setTimeout(this.enterSite(), 200)
                    }
                    else if (y > ys[1] && y < ys[2]) {
                        this.fullscreenCallback()
                    }
                }
            } else {
                let [x1, x2] = this.intro.getButtonX()
                let buttonClicked = false
                if (x > x1 && x < x2) {
                    let ys = this.intro.getButtonY()
                    if (y > ys[0] && y < ys[1]) {
                        this.introStep = 1
                        setTimeout(this.enterSite(), 200)
                        buttonClicked = true
                    }
                    else if (y > ys[1] && y < ys[2]) {
                        this.fullscreenCallback()
                        buttonClicked = true
                    }
                    else if (y > ys[2] && y < ys[3]) {
                        this.introStep = -1
                        setTimeout(this.resetCallback, 200)
                        buttonClicked = true
                    }
                }

                if (!buttonClicked) {
                    let r = this.aspect > 0.6 ? 0.27 : this.width / 2 * 0.9
                    let pm = r * 1.64
                    this.pointEffect = new PointEffect(this, x, y, r, 0.2, pm, 0.8)
                    this.pointEffect.start()
                }
            }
        }
    }

    enterSite() {
        this.introCallback(this.introStep)
        let yNum = 12
        let xNum = Math.floor(yNum * this.aspect)
        if (xNum % 2 === 1) {
            xNum += 1
        }
        Explosion.explodeScreen(this.screenFragments[0], xNum, yNum, 6, this)
    }

    getTextureModels() {
        return this.textureModels
    }

    getEffectArgs() {
        return this.pointEffect.getEffectArgs()
    }

    startGame() {
        this.lastTimestamp = performance.now()
        this.intro.start()
        this.gameLoop(this)
    }

    gameLoop = () => {
        if (this.screenFragments.length === 0) {
            this.introCallback(++this.introStep)
        }
        else {
            let newTime = performance.now()
            let dt = (newTime - this.lastTimestamp) / 1000
            this.lastTimestamp = newTime
            this.gameTick(dt)
            setTimeout(this.gameLoop, this.delay)
        }
    }

    gameTick(dt) {
        this.elapsedTime += dt
        this.tickAll(dt)
        this.checkRemoval()
        this.aggregateTextures()

        if (this.images.length < Math.ceil(64 * this.aspect) && Math.floor((this.elapsedTime * 1000) % Math.ceil(20 / this.aspect)) === 0) {
            Image.addImage(this)
        }
    }

    tickAll(dt) {
        let numImages = this.images.length
        let numDebris = this.debris.length
        let numFrags = this.screenFragments.length

        for (let i = 0; i < numFrags; ++i) {
            this.screenFragments[i].tick(dt)
        }

        for (let i = 0; i < numImages; ++i) {
            this.images[i].tick(dt)
        }

        for (let i = 0; i < numDebris; ++i) {
            this.debris[i].tick(dt)
        }

        this.pointEffect.tick(dt)
        this.intro.tick(dt)
    }

    checkRemoval() {
        let temp = []
        this.screenFragments.forEach(frag => {
            if (!frag.markedForRemoval) {
                temp[temp.length] = frag
            }
        })
        this.screenFragments = temp

        temp = []
        this.images.forEach(image => {
            if (!image.markedForRemoval) {
                temp[temp.length] = image
            }
        })
        this.images = temp

        temp = []
        this.debris.forEach(d => {
            if (!d.markedForRemoval) {
                temp[temp.length] = d
            }
        })
        this.debris = temp

        temp = []
        this.textureStrings.forEach(t => {
            if (!t.markedForRemoval) {
                temp[temp.length] = t
            }
        })
        this.textStrings = temp
    }

    aggregateTextures() {
        let [textureList, numFragments] = this.getTextureList()
        let textures = new AggregateTexturesGL()
        let buffLen = 30
        textures.vertices = []
        textures.textureIds = []
        textures.rotations = []
        textures.texColors = []
        textures.colorMasks = []

        for (let i = 0; i < textureList.length; ++i) {
            let texture = textureList[i]
            for (let j = 0; j < buffLen; ++j) {
                textures.vertices[i * buffLen + j] = texture.vertices[j]
            }
            textures.textureIds[i] = texture.textureId
            textures.rotations[i] = texture.rotation
            textures.texColors[i] = texture.texColor
            textures.colorMasks[i] = texture.colorMask
        }

        this.textureModels = [textures, numFragments]
    }

    getTextureList() {
        let numFragments = this.screenFragments.length
        let numImages = this.images.length
        let numDebris = this.debris.length
        let numText = this.textureStrings.length

        let textureList = []
        for (let i = 0; i < numFragments; ++i) {
            textureList[i] = this.screenFragments[i].getTextureGL(true)
        }

        let index = numFragments
        for (let i = 0; i < numImages; ++i) {
            textureList[index + i] = this.images[i].getTextureGL(false)
        }
        index += numImages

        for (let i = 0; i < numDebris; ++i) {
            textureList[index + i] = this.debris[i].getTextureGL(false)
        }
        index += numDebris

        let letterNum = 0
        for (let i = 0; i < numText; ++i) {
            let letters = this.textureStrings[i].getLetters()
            for (let j = 0; j < letters.length; ++j) {
                let letter = letters[j]
                if (letter.isVisible) {
                    textureList[index + letterNum] = letters[j].getTextureGL()
                    ++letterNum
                }
            }
        }
        index += letterNum

        return [textureList, numFragments]
    }
}