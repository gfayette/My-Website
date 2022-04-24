export default class Colors {
    static background0 = '#181c1f'
    static background = '#181c1f'
    static textColor = '#efefef'

    static getGradient = (color1, color2, len) => {
        return 'linear-gradient(' + color1 + ', ' + color2 + ' ' + len + '%)'
    }
}