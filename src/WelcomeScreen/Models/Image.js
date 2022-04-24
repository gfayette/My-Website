import { Texture } from "../Texture"
import Explosion from '../Effects/Explosion.js'

export default class Image extends Texture {
    vx
    vy
    vr
    tickNum
    explodeY

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0
        this.tickNum = 0
        this.explodeY = 0
    }

    tick(dt) {
        this.xPos += this.vx * dt
        this.yPos += this.vy * dt
        this.rotation += this.vr * dt

        if (this.yPos > this.explodeY) {
            this.explode()
        }

        if (this.yPos > 1.1 || this.yPos < -0.1 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
        }

        ++this.tickNum
    }

    explode() {
        this.markedForRemoval = true;
        Explosion.explodeTexture(this, 4, 4, 0.16, 1.8, this.game)
    }

    static addImage(game) {
        let r1 = Math.random()
        let w = 0.02 + r1 * 0.05
        let h = w
        let x = Math.random() * game.width
        let y = -0.05
        let texId = Math.floor(100 + Math.random() * 8.99)
        let image = new Image(w, h, x, y, 0, texId, game)
        image.explodeY = 0.5 + Math.random() * 0.3
        image.vy = 0.03 + 0.1 * r1
        game.images[game.images.length] = image
    }
}