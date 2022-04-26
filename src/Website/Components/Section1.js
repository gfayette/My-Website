import React from 'react'
import Colors from '../Colors'
import Fonts from '../Fonts'
import Converter from '../Converter'

export default class Section1 extends React.Component {

    render() {
        let outercss = {
            background: Colors.background,
            maxWidth: Converter.maxWidth,
            display: 'block',
            marginRight: 'auto',
            marginLeft: 'auto',
        }

        let linecss = {
            height: Converter.scale(10, this.props.width),
            background: Colors.getGradient(Colors.textColor, Colors.background, Converter.scale(100, this.props.width)),
        }

        let maincss = {
            padding: Converter.scale(36, this.props.width),
        }

        let maintextcss = {
            color: Colors.textColor,
            fontSize: Converter.scale(42, this.props.width),
            fontFamily: Fonts.mainFont,
        }

        let textcss = {
            color: Colors.textColor,
            fontSize: Converter.scale(32, this.props.width),
            margin: Converter.scale(36, this.props.width),
            fontFamily: Fonts.mainFont,
        }

        return (
            <div id='section1' style={outercss}>
                <div style={linecss} />
                <div style={maincss}>
                    <div style={maintextcss}>
                        Section 1
                    </div>
                    <p style={textcss}>
                        (Placeholder text)
                    </p>
                    <p style={textcss}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div >
        )
    }
}