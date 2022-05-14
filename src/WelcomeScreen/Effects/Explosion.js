import Debris from '../Models/Debris'
import ScreenFragment from '../Models/ScreenFragment'

export default class Explosion {

    static explodeTexture(texture, xnum, ynum, velocity, lifespan, game) {
        let w = texture.width / xnum
        let h = texture.height / ynum

        for (let i = 0; i < xnum; ++i) {
            for (let j = 0; j < ynum; ++j) {
                let xinc = w / 2
                let x = xinc + 2 * i * xinc + texture.xPos - texture.width / 2
                let yinc = h / 2
                let y = yinc + 2 * j * yinc + texture.yPos - texture.height / 2

                let xratio = i / (xnum - 1) - 0.5
                let yratio = j / (ynum - 1) - 0.5

                let m = 1.16 - Math.abs(xratio) - Math.abs(yratio)
                let vx = xratio * velocity * m
                let vy = yratio * velocity * m

                if (texture.rotation !== 0) {
                    let s = Math.sin(texture.rotation)
                    let c = Math.cos(texture.rotation)

                    let x0 = c * (x - texture.xPos) - s * (y - texture.yPos) + texture.xPos;
                    let y0 = s * (x - texture.xPos) + c * (y - texture.yPos) + texture.yPos;

                    x = x0
                    y = y0

                    let vx1 = c * vx - s * vy
                    let vy1 = s * vx + c * vy

                    vx = vx1
                    vy = vy1
                }

                let d = new Debris(w, h, x, y, 0, texture.textureId, game)

                let mr = 0.028
                let r = (Math.random() - 0.5) * mr
                d.vx = vx + texture.vx + r
                r = (Math.random() - 0.5) * mr
                d.vy = vy + texture.vy + r
                r = (Math.random() - 0.5) * 5.6
                d.vr = r + texture.vr

                let tx = 1 / xnum
                let ty = 1 / ynum

                d.xt1 = i * tx + tx
                d.xt2 = i * tx
                d.yt1 = j * ty
                d.yt2 = j * ty + ty

                d.lifespan = lifespan
                d.rotation = texture.rotation
                game.debris[game.debris.length] = d
            }
        }
    }

    static explodeScreen(texture, xnum, ynum, lifespan, game) {
        let w = texture.width / xnum
        let h = texture.height / ynum
        let sf = []

        for (let i = 0; i < xnum; ++i) {
            for (let j = 0; j < ynum; ++j) {
                let xinc = w / 2
                let x = xinc + 2 * i * xinc + texture.xPos - texture.width / 2
                let yinc = h / 2
                let y = yinc + 2 * j * yinc + texture.yPos - texture.height / 2

                let xratio = i / (xnum - 1) - 0.5
                let yratio = j / (ynum - 1) - 0.5

                let m = (2 + Math.abs(xratio) + Math.abs(yratio)) * 0.01
                let vx = xratio * m
                let vy = yratio * m

                let frag = new ScreenFragment(w, h, x, y, 0, -1, game)

                frag.vx = vx
                frag.vy = vy
                frag.vmult = 1.02

                let tx = 1 / xnum
                let ty = 1 / ynum

                frag.xt1 = i * tx + tx
                frag.xt2 = i * tx
                frag.yt1 = j * ty
                frag.yt2 = j * ty + ty

                frag.lifespan = lifespan
                frag.rotation = texture.rotation
                sf[sf.length] = frag
            }
        }
        game.screenFragments = sf
    }
}