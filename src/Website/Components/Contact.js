import React from 'react'
import Colors from '../Colors'
import Fonts from '../Fonts'
import Converter from '../Converter'

export default class Contact extends React.Component {

    render() {
        let outercss = {
            background: Colors.background,
            maxWidth: Converter.maxWidth,
            display: 'block',
            marginRight: 'auto',
            marginLeft: 'auto',
            height: this.props.height,
        }

        let linecss = {
            height: Converter.scale(10, this.props.width),
            background: Colors.getGradient(Colors.textColor, Colors.background, Converter.scale(100, this.props.width)),
        }

        let maincss = {
            padding: Converter.scale(36, this.props.width),
            maxWidth: Converter.maxWidth,
            display: 'block',
            marginRight: 'auto',
            marginLeft: 'auto',
        }

        let maintextcss = {
            color: Colors.textColor,
            fontSize: Converter.scale(42, this.props.width),
            fontFamily: Fonts.mainFont,
            textAlign: 'center',
            marginTop: this.props.height * 0.4
        }

        return (
            <div id='contact' style={outercss}>
                <div style={linecss} />
                <div style={maincss}>
                    <div style={maintextcss}>
                        geofayette@gmail.com
                    </div>
                </div>
            </div >
        )
    }
}