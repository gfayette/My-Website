export default class PointEffect {
    game

    x
    y
    radius
    warpMagnitude
    pushMagnitude

    xPx
    yPx
    rPx

    currR
    currRPx
    currMagnitude

    elapsedTime
    duration

    constructor(g, x, y, radius, wm, pm, duration) {
        this.game = g
        this.x = x
        this.y = y
        this.radius = radius
        this.warpMagnitude = wm
        this.pushMagnitude = pm
        this.duration = duration

        this.xPx = x * g.pxRatio
        this.yPx = (1 - y) * g.pxRatio
        this.rPx = radius * g.pxRatio

        this.currRPx = 0
        this.currMagnitude = 0

        this.elapsedTime = -1
        this.wasPushed = false
    }

    start() {
        this.game.debris.forEach(d => {
            d.wasPushed = false
        })
        this.elapsedTime = 0
    }


    tick(dt) {
        if (this.elapsedTime === -1) {
            return
        }

        if (this.elapsedTime > this.duration) {
            this.elapsedTime = -1
            return
        }

        //set args for shader and check ship collisions

        //radius
        let r0 = Math.cos(this.elapsedTime / this.duration * 1.57079 - 1.57079)
        r0 = Math.sqrt(r0)
        this.currR = r0 * this.radius
        this.currRPx = r0 * this.rPx

        //magnitude
        this.currMagnitude = (Math.cos(this.elapsedTime / this.duration * 6.28318 - 2.0944) + 0.5) * this.warpMagnitude

        this.game.images.forEach(image => {
            let xDist = image.xPos - this.x
            let yDist = image.yPos - this.y
            let hy = Math.sqrt(xDist * xDist + yDist * yDist) - image.width / 2
            if (hy < this.currR && !image.markedForRemoval) {
                image.explode()
            }
        })

        //push debris
        this.game.debris.forEach(d => {
            if (!d.wasPushed) {
                let xDist = d.xPos - this.x
                let yDist = d.yPos - this.y
                let hy = Math.sqrt(xDist * xDist + yDist * yDist)

                if (hy < this.currR) {
                    let m = 1.4 - hy / this.radius
                    d.vx += xDist / hy * m * this.pushMagnitude
                    d.vy += yDist / hy * m * this.pushMagnitude
                    d.wasPushed = true
                }
            }
        })

        this.elapsedTime += dt
    }

    getEffectArgs() {
        if (this.elapsedTime === -1) {
            return [-1, 0, 0, 0]
        }
        else {
            return [this.xPx, this.yPx, this.currRPx, this.currMagnitude]
        }
    }
}