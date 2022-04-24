import { Texture } from '../Texture.js'

export default class TextString {

    game
    letters
    string
    lineWidths
    markedForRemoval

    h0
    x0
    y0

    lineNum

    constructor(g, h, x, y) {
        this.letters = []
        this.string = ''
        this.lineNum = 0
        this.lineWidths = [0]
        this.markedForRemoval = false
        this.game = g

        this.h0 = h
        this.x0 = x
        this.y0 = y
    }

    reset() {
        this.letters = []
        this.string = ''
        this.lineNum = 0
        this.lineWidths = []
    }

    getLetters() {
        return this.letters
    }

    changeColors(elapsedTime, time) {
        if (elapsedTime < time) {
            let letters = this.letters
            for (let i = 0; i < letters.length; ++i) {
                let letter = letters[letters.length - 1 - i]

                let c = letters.length * elapsedTime / time + 1
                let theta = Math.PI * c + Math.PI * 3 * i / (letters.length - 1)

                let cn = 0
                if (theta > Math.PI * 3 && theta < Math.PI * 5) {
                    cn = (Math.cos(theta) + 1) / 2 * 0.9
                }

                letter.texColor = [cn, cn, cn, 1.0]
            }
        }
    }

    fadeIn(elapsedTime, time) {
        if (elapsedTime < time) {
            let letters = this.letters
            let theta = elapsedTime / time * Math.PI + Math.PI
            let cn = (Math.cos(theta) + 1) / 2
            for (let i = 0; i < letters.length; ++i) {
                let letter = letters[i]
                letter.texColor = [0, 0, 0, cn]
            }
        }
        else {
            let letters = this.letters
            for (let i = 0; i < letters.length; ++i) {
                let letter = letters[i]
                letter.texColor = [0, 0, 0, 1]
            }
        }
    }

    fadeOut(elapsedTime, time) {
        if (elapsedTime < time) {
            let letters = this.letters
            let theta = elapsedTime / time * Math.PI
            let cn = (Math.cos(theta) + 1) / 2
            for (let i = 0; i < letters.length; ++i) {
                let letter = letters[i]
                letter.texColor = [0, 0, 0, cn]
            }
        }
        else {
            let letters = this.letters
            for (let i = 0; i < letters.length; ++i) {
                let letter = letters[i]
                letter.texColor = [0, 0, 0, 0]
            }
        }
    }

    setColor(texColor) {
        let letters = this.letters
        for (let i = 0; i < letters.length; ++i) {
            let letter = letters[i]
            letter.texColor = texColor
        }
    }

    addText(string) {
        this.string += string
        let stringWidth = this.lineWidths[this.lineNum] || 0
        let lmap = new LetterMappings()

        let h = this.h0
        if (this.game.aspect < 1) {
            h *= this.game.aspect
        }

        let x = this.x0
        let y = this.y0

        for (var i = 0; i < string.length; ++i) {
            if (string[i] === '\n') {
                this.lineWidths[this.lineNum] = stringWidth
                ++this.lineNum
                stringWidth = 0
                continue
            }

            let args = lmap.getLetterArgs(string[i])

            let w = h * args.aspect
            let x0 = x + stringWidth + w / 2
            let y0 = y + h * this.lineNum * 0.8

            let t = new Letter(w, h, x0, y0, 0, args.texId, this.game)

            t.xt1 = args.xOffset + args.yLen * args.aspect
            t.xt2 = args.xOffset
            t.yt1 = args.yOffset
            t.yt2 = args.yOffset + args.yLen

            this.letters[this.letters.length] = t
            stringWidth += w
        }
        this.lineWidths[this.lineNum] = stringWidth
    }

    resize() {
        let h = this.h0
        if (this.game.aspect < 1) {
            h *= this.game.aspect
        }

        let x = this.x0
        let y = this.y0

        let stringWidth = 0
        let lineNum = 0
        this.lineWidths = []
        for (var i = 0; i < this.string.length; ++i) {
            if (this.string[i] === '\n') {
                this.lineWidths[lineNum] = stringWidth
                ++lineNum
                stringWidth = 0
                continue
            }

            let l = this.letters[i - lineNum]
            let aspect = l.width / l.height
            l.width = h * aspect
            l.height = h
            l.yPos = y + h * lineNum * 0.8
            l.xPos = x + stringWidth + l.width / 2
            stringWidth += l.width
        }
        this.lineWidths[lineNum] = stringWidth
    }

    centerX() {
        let lineNum = 0
        let x = (this.game.width - this.lineWidths[lineNum]) / 2
        let stringWidth = 0

        for (var i = 0; i < this.string.length; ++i) {
            if (this.string[i] === '\n') {
                ++lineNum
                x = (this.game.width - this.lineWidths[lineNum]) / 2
                stringWidth = 0
                continue
            }

            let l = this.letters[i - lineNum]
            l.xPos = x + stringWidth + l.width / 2
            stringWidth += l.width
        }
    }

    alignX(x) {
        let lineNum = 0
        let stringWidth = 0

        for (var i = 0; i < this.string.length; ++i) {
            if (this.string[i] === '\n') {
                ++lineNum
                stringWidth = 0
                continue
            }

            let l = this.letters[i - lineNum]
            l.xPos = x + stringWidth + l.width / 2
            stringWidth += l.width
        }
    }
}

class Letter extends Texture {
    vx
    vy
    vr
    x0
    y0
    isVisible

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0
        this.texColor = [0.0, 0.0, 0.0, 1]

        this.x0 = x
        this.y0 = y

        this.isVisible = true
    }

    tick() {
        this.xPos += this.vx
        this.yPos += this.vy
        this.rotation += this.vr
    }
}

class LetterMappings {

    getLetterArgs(char) {
        switch (char) {
            case '>':
                return this.arrow
            case '(':
                return this.p1
            case ')':
                return this.p2
            case ';':
                return this.semicolon
            case ':':
                return this.colon
            case '-':
                return this.minus
            case '\'':
                return this.singleQuote
            case 'a':
                return this.a
            case 'c':
                return this.c
            case 'd':
                return this.d
            case 'e':
                return this.e
            case 'f':
                return this.f
            case 'h':
                return this.h
            case 'i':
                return this.i
            case 'k':
                return this.k
            case 'l':
                return this.l
            case 'n':
                return this.n
            case 'o':
                return this.o
            case 'p':
                return this.p
            case 'q':
                return this.q
            case 'r':
                return this.r
            case 's':
                return this.s
            case 't':
                return this.t
            case 'u':
                return this.u
            case 'w':
                return this.w
            case 'y':
                return this.y
            default:
                return this.space
        }
    }

    space = {
        xOffset: 0.99,
        yOffset: 0.99,
        yLen: 0.01,
        aspect: 0.4,
        texId: 201,
    }

    p1 = {
        xOffset: 0.39,
        yOffset: 0.414,
        yLen: 0.2,
        aspect: 0.3,
        texId: 201,
    }

    p2 = {
        xOffset: 0.33,
        yOffset: 0.414,
        yLen: 0.2,
        aspect: 0.3,
        texId: 201,
    }

    semicolon = {
        xOffset: 0.84,
        yOffset: 0.414,
        yLen: 0.2,
        aspect: 0.22,
        texId: 201,
    }

    colon = {
        xOffset: 0.79,
        yOffset: 0.414,
        yLen: 0.2,
        aspect: 0.22,
        texId: 201,
    }

    minus = {
        xOffset: 0.94,
        yOffset: 0.414,
        yLen: 0.2,
        aspect: 0.26,
        texId: 201,
    }

    singleQuote = {
        xOffset: 0.052,
        yOffset: 0.6,
        yLen: 0.2,
        aspect: 0.2,
        texId: 201,
    }

    arrow = {
        xOffset: 0.35,
        yOffset: 0.014,
        yLen: 0.2,
        aspect: 0.5,
        texId: 201,
    }

    a = {
        xOffset: 0.626,
        yOffset: 0.014,
        yLen: 0.2,
        aspect: 0.38,
        texId: 201,
    }

    c = {
        xOffset: 0.425,
        yOffset: 0.21,
        yLen: 0.2,
        aspect: 0.33,
        texId: 201,
    }

    d = {
        xOffset: 0.102,
        yOffset: 0.6,
        yLen: 0.2,
        aspect: 0.41,
        texId: 200,
    }

    e = {
        xOffset: 0.192,
        yOffset: 0.797,
        yLen: 0.2,
        aspect: 0.4,
        texId: 200,
    }

    f = {
        xOffset: 0.52,
        yOffset: 0.405,
        yLen: 0.2,
        aspect: 0.34,
        texId: 201,
    }

    h = {
        xOffset: 0.588,
        yOffset: 0.60,
        yLen: 0.2,
        aspect: 0.4,
        texId: 200,
    }

    i = {
        xOffset: 0.375,
        yOffset: 0.6,
        yLen: 0.2,
        aspect: 0.18,
        texId: 201,
    }

    k = {
        xOffset: 0.802,
        yOffset: 0.014,
        yLen: 0.2,
        aspect: 0.38,
        texId: 201,
    }

    l = {
        xOffset: 0.149,
        yOffset: 0.6,
        yLen: 0.2,
        aspect: 0.18,
        texId: 201,
    }

    n = {
        xOffset: 0.49,
        yOffset: 0.6,
        yLen: 0.2,
        aspect: 0.41,
        texId: 200,
    }

    o = {
        xOffset: 0.41,
        yOffset: 0.407,
        yLen: 0.2,
        aspect: 0.41,
        texId: 200,
    }

    p = {
        xOffset: 0.308,
        yOffset: 0.407,
        yLen: 0.2,
        aspect: 0.43,
        texId: 200,
    }

    q = {
        xOffset: 0.214,
        yOffset: 0.407,
        yLen: 0.2,
        aspect: 0.43,
        texId: 200,
    }

    r = {
        xOffset: 0.814,
        yOffset: 0.209,
        yLen: 0.2,
        aspect: 0.34,
        texId: 201,
    }

    s = {
        xOffset: 0.744,
        yOffset: 0.21,
        yLen: 0.2,
        aspect: 0.33,
        texId: 201,
    }

    t = {
        xOffset: 0.88,
        yOffset: 0.21,
        yLen: 0.2,
        aspect: 0.32,
        texId: 201,
    }

    u = {
        xOffset: 0.78,
        yOffset: 0.60,
        yLen: 0.2,
        aspect: 0.4,
        texId: 200,
    }

    w = {
        xOffset: 0.604,
        yOffset: 0.014,
        yLen: 0.2,
        aspect: 0.64,
        texId: 200,
    }

    y = {
        xOffset: 0.17,
        yOffset: 0.21,
        yLen: 0.2,
        aspect: 0.38,
        texId: 201,
    }
}