import { Texture } from "../Texture";

export default class Debris extends Texture {
    vx
    vy
    vr
    elapsedTime
    lifespan

    wasPushed

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.lifespan = 0
        this.elapsedTime = 0
    }

    tick(dt) {
        this.xPos += this.vx * dt
        this.yPos += this.vy * dt
        this.rotation += this.vr * dt
        this.elapsedTime += dt

        if (this.elapsedTime > this.lifespan) {
            this.markedForRemoval = true
        }

        if (this.yPos > 1.1 || this.yPos < -0.1 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
        }

        let ratio = this.elapsedTime / this.lifespan
        if (ratio > 0.5) {
            let a = 1 - (ratio - 0.5) * 2
            this.colorMask = [1, 1, 1, a]
        }
    }
}