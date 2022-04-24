class Texture {
    game
    width
    height
    xPos
    yPos
    zPos

    textureId
    rotation
    texColor
    colorMask

    xt1
    xt2
    yt1
    yt2

    markedForRemoval

    constructor(w, h, x, y, z, texId, g) {
        this.game = g
        this.width = w
        this.height = h
        this.xPos = x
        this.yPos = y
        this.zPos = z
        this.textureId = texId
        this.rotation = 0
        this.texColor = [-1, 0, 0, 0]
        this.colorMask = [-1, 0, 0, 0]

        this.xt1 = 1
        this.xt2 = 0
        this.yt1 = 0
        this.yt2 = 1

        this.markedForRemoval = false
    }

    getTextureGL(flip) {
        let tex = new TextureGL()

        let w = this.width
        let h = this.height 

        let x = this.xPos * 2 - this.game.aspect
        let y = this.yPos * -2 + 1
        let z = this.zPos

        let x2 = x + w
        let x1 = x - w
        let y2 = y + h
        let y1 = y - h

        if (flip) {
            y2 *= -1
            y1 *= -1
        }

        tex.vertices = [
            x2, y2, z, this.xt1, this.yt1,
            x1, y2, z, this.xt2, this.yt1,
            x1, y1, z, this.xt2, this.yt2,
            x2, y2, z, this.xt1, this.yt1,
            x1, y1, z, this.xt2, this.yt2,
            x2, y1, z, this.xt1, this.yt2,
        ]

        tex.textureId = this.textureId
        tex.rotation = [x, y, 0, this.rotation]

        tex.texColor = this.texColor
        tex.colorMask = this.colorMask
        return tex;
    }
}

class TextureGL {
    vertices
    textureId
    rotation
    texColor
    colorMask
}

class AggregateTexturesGL {
    vertices
    textureIds
    rotations
    texColors
    colorMasks
}

export { Texture, TextureGL, AggregateTexturesGL }