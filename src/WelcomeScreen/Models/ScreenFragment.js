import { Texture } from "../Texture";

export default class ScreenFragment extends Texture {
    vx
    vy
    vr

    vmult

    elapsedTime
    lifespan

    constructor(w, h, x, y, z, texId, g) {
        super(w, h, x, y, z, texId, g)
        this.vx = 0
        this.vy = 0
        this.vr = 0

        this.vmult = 1

        this.lifespan = -1
        this.elapsedTime = 0
    }

    tick(dt) {
        this.xPos += this.vx * dt
        this.yPos += this.vy * dt
        this.vx *= this.vmult
        this.vy *= this.vmult
        this.rotation += this.vr * dt
        this.elapsedTime += dt

        if (this.yPos > 1.1 || this.yPos < -0.1 || this.xPos > this.game.width + 0.1 || this.xPos < -0.1) {
            this.markedForRemoval = true
            return
        }

        if (this.lifespan !== -1 && this.elapsedTime > this.lifespan) {
            this.markedForRemoval = true
            return
        }
        
        let ratio = this.elapsedTime / this.lifespan
        if (ratio > 0.5) {
            let a = 1 - (ratio - 0.5) * 2
            this.colorMask = [1, 1, 1, a]
        }
    }
}