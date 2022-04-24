export default class Converter {
    static minWidth = 160
    static maxWidth = 1200
    static scaleWidth1 = 760
    static scaleWidth2 = 460

    //scale to 0 if below width1, else num1
    //returns floor
    static scale(num1, pageWidth) {
        if (pageWidth > this.scaleWidth1) {
            return num1
        }
        else if (pageWidth < this.minWidth) {
            let ratio = this.minWidth / this.scaleWidth1
            return Math.floor(num1 * ratio)
        }
        else {
            let ratio = pageWidth / this.scaleWidth1
            return Math.floor(num1 * ratio)
        }
    }

    //scale to 0 if below width2, num2 if below width1, else num1 
    //returns floor
    static scale2(num1, num2, pageWidth) {
        if (pageWidth > this.scaleWidth1) {
            return num1
        }
        else if (pageWidth > this.scaleWidth2) {
            return num2
        }
        else if (pageWidth < this.minWidth) {
            let ratio = this.minWidth / this.scaleWidth2
            return Math.floor(num2 * ratio)
        }
        else {
            let ratio = pageWidth / this.scaleWidth2
            return Math.floor(num2 * ratio)
        }
    }

    //scale to 'toSize' if below width2, num2 if below width1, else num1 
    //returns floor
    static scale2ToSize(num1, num2, toSize, pageWidth) {
        if (pageWidth > this.scaleWidth1) {
            return num1
        }
        else if (pageWidth > this.scaleWidth2) {
            return num2
        }
        else if (pageWidth < this.minWidth) {
            return toSize
        }
        else {
            let diff = toSize - num2
            let ratio = (this.scaleWidth2 - pageWidth) / (this.scaleWidth2 - this.minWidth)
            return Math.floor(num2 + diff * ratio)
        }
    }

    static getRightX() {
        let right = document.body.clientWidth
        if (right > this.maxWidth) {
            let diff = 0.5 * (right - this.maxWidth)
            right -= diff
        }
        return right
    }
}