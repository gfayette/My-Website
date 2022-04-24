import TextString from '../Models/TextString.js'
import PointEffect from './PointEffect.js'

export default class Intro {

    game
    elapsedTime

    textString0
    textString1
    textString2
    textString3
    textString4

    string0
    string1
    string2
    string3
    string4

    start0
    start1
    start2
    start3
    start4

    step0
    step1
    step2
    step3
    step4

    charNum1

    buttonHeight
    y2
    y3
    y4

    constructor(g) {
        this.game = g
        this.elapsedTime = -1
        this.start0 = 5
        this.start1 = 2
        this.start2 = 0.5
        this.start3 = 0.5
        this.start4 = 6.5

        this.step0 = 0
        this.step1 = 0
        this.step2 = 0
        this.step3 = 0
        this.step4 = 0

        this.textString0 = new TextString(this.game, 0.18, 0, 0.24)
        let x = this.getAlignX()
        this.textString1 = new TextString(this.game, 0.05, x, 0.62)
        this.buttonHeight = 0.06
        this.y2 = 0.8
        this.y3 = 0.86
        this.y4 = 0.92
        this.textString2 = new TextString(this.game, this.buttonHeight, 0, this.y2)
        this.textString3 = new TextString(this.game, this.buttonHeight, 0, this.y3)
        this.textString4 = new TextString(this.game, this.buttonHeight, 0, this.y4)

        this.game.textureStrings[0] = this.textString0
        this.game.textureStrings[1] = this.textString1
        this.game.textureStrings[2] = this.textString2
        this.game.textureStrings[3] = this.textString3
        this.game.textureStrings[4] = this.textString4

        this.string0 = 'hello\nworld'
        this.string1 = '> start repl\n> '
        this.string2 = 'skip intro'

        this.string3 = document.fullscreenEnabled ? 'fullscreen' : ''
        this.string4 = 'replay'

        this.textString1.addText('> ')
        this.textString2.addText(this.string2)
        this.textString2.setColor([0, 0, 0, 0])
        this.textString2.centerX()
        this.textString3.addText(this.string3)
        this.textString3.setColor([0, 0, 0, 0])
        this.textString3.centerX()
        this.textString4.addText(this.string4)
        this.textString4.setColor([0, 0, 0, 0])
        this.textString4.centerX()
        this.charNum1 = 2
    }

    getAlignX() {
        return this.game.aspect > 1 ? this.game.width / 2 - 0.18 : this.game.width / 2 - 0.18 * this.game.aspect
    }

    getButtonX() {
        let x1 = this.game.aspect > 1 ? this.game.width / 2 - 0.14 : this.game.width / 2 - 0.14 * this.game.aspect
        let x2 = this.game.aspect > 1 ? this.game.width / 2 + 0.14 : this.game.width / 2 + 0.14 * this.game.aspect
        return [x1, x2]
    }

    getButtonY() {
        let y0 = this.y2 - this.buttonHeight / 2
        let y1 = y0 + this.buttonHeight
        let y2 = y1 + this.buttonHeight
        let y3 = y2 + this.buttonHeight
        return [y0, y1, y2, y3]
    }

    start() {
        this.elapsedTime = 0
    }

    tickString0() {
        if (this.step0 === 0 && this.elapsedTime > this.start0) {
            this.textString0.addText(this.string0)
            this.textString0.setColor([0, 0, 0, 0])
            this.textString0.centerX()
            this.game.textureStrings[0] = this.textString0

            let y = this.textString0.h0 / 3 + 0.24
            let r = y * 0.94

            if (this.game.aspect < 1.0) {
                y = this.textString0.h0 * this.game.aspect / 3 + 0.24
            }
            if (this.game.aspect < 0.6) {
                r = this.game.width / 2 * 0.9
            }

            let pm = r * 1.64
            this.game.pointEffect = new PointEffect(this.game, this.game.width / 2, y, r, 0.2, pm, 0.8)
            this.game.pointEffect.start()
            ++this.step0
        }
        else if (this.step0 === 1 && this.elapsedTime < this.start0 + 0.8) {
            this.textString0.fadeIn(this.elapsedTime - this.start0, 0.8)
        }
        else if (this.step0 === 1) {
            this.textString0.setColor([0, 0, 0, 1])
            ++this.step0
            this.start0 += 0.8
        }
        else if (this.step0 === 2 && this.elapsedTime < this.start0 + 2) {
            this.textString0.changeColors(this.elapsedTime - this.start0, 1.6)
        }
        else if (this.step0 === 2 && this.elapsedTime > this.start0 + 2) {
            this.textString0.setColor([0, 0, 0, 1])
        }
    }

    tickString1() {
        let tdiff = Math.floor((this.elapsedTime - this.start1) * 20) - this.charNum1

        if (tdiff > 0 && this.charNum1 < this.string1.length) {
            let start = this.charNum1
            for (let i = 0; i < tdiff; ++i) {
                if (this.charNum1 >= this.string1.length) {
                    break
                }
                else {
                    this.textString1.addText(this.string1[start + i])
                    if (this.step1 === 4) {
                        this.textString1.centerX()
                    }
                    else {
                        this.textString1.alignX(this.getAlignX())
                    }
                    ++this.charNum1
                }
            }
        }
        else if (this.step1 === 0 && this.elapsedTime > this.start1 + 1) {
            this.string1 += 'print(\'hello world\')\n>'
            this.start1 += 1
            ++this.step1
        }
        else if (this.step1 === 1 && this.elapsedTime > this.start1 + 2 && this.elapsedTime < this.start1 + 3) {
            this.textString1.fadeOut(this.elapsedTime - this.start1 - 2, 1)
        }
        else if (this.step1 === 1 && this.elapsedTime > this.start1 + 3) {
            this.start1 += 3
            this.string1 = ''
            this.charNum1 = 0
            this.textString1.reset()
            ++this.step1
        }
        else if (this.step1 === 2 && this.elapsedTime > this.start1 + 1) {
            ++this.step1
            this.start1 += 1
        }
        else if (this.step1 === 3) {
            this.string1 = 'tap the screen :)'
            ++this.step1
        }
    }

    tickString2() {
        if (this.step2 === 0 && this.elapsedTime > this.start2) {
            ++this.step2
        }
        else if (this.step2 === 1 && this.elapsedTime < this.start2 + 1) {
            this.textString2.fadeIn(this.elapsedTime - this.start2, 1)
        }
        else if (this.step2 === 1 && this.elapsedTime > this.start2 + 5) {
            this.textString2.setColor([0, 0, 0, 1])
            ++this.step2
            this.start2 += 5
        }
        else if (this.step2 === 2 && this.elapsedTime < this.start2 + 1) {
            this.textString2.fadeOut(this.elapsedTime - this.start2, 1)
        }
        else if (this.step2 === 2) {
            this.textString2.reset()
            this.textString2.addText('enter site')
            this.textString2.centerX()
            this.textString2.setColor([0, 0, 0, 0])
            ++this.step2
            this.start2 += 1
        }
        else if (this.step2 === 3 && this.elapsedTime < this.start2 + 2) {
            this.textString2.fadeIn(this.elapsedTime - this.start2, 1)
        }
        else if (this.step2 === 3) {
            this.textString2.setColor([0, 0, 0, 1])
            ++this.step2
        }
    }

    tickString3() {
        if (this.step3 === 0 && this.elapsedTime > this.start3) {
            ++this.step3
        }
        else if (this.step3 === 1 && this.elapsedTime < this.start3 + 1) {
            this.textString3.fadeIn(this.elapsedTime - this.start3, 1)
        }
        else if (this.step3 === 1) {
            this.textString3.setColor([0, 0, 0, 1])
            ++this.step3
        }
    }

    tickString4() {
        if (this.step4 === 0 && this.elapsedTime > this.start4) {
            ++this.step4
        }
        else if (this.step4 === 1 && this.elapsedTime < this.start4 + 1) {
            this.textString4.fadeIn(this.elapsedTime - this.start4, 1)
        }
        else if (this.step4 === 1) {
            this.textString4.setColor([0, 0, 0, 1])
            ++this.step4
        }
    }

    tick(dt) {
        if (this.elapsedTime === -1) {
            return
        }

        if (this.elapsedTime > 8) {
            return
        }

        this.elapsedTime += dt

        // this could be optimized
        this.tickString0()
        this.tickString1()
        this.tickString2()
        this.tickString3()
        this.tickString4()
    }
}