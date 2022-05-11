import React from 'react'
import Colors from '../Colors'
import Fonts from '../Fonts'
import Converter from '../Converter'

export default class Home extends React.Component {

    render() {
        let outercss = {
            background: Colors.background,
            maxWidth: Converter.maxWidth,
            display: 'block',
            marginRight: 'auto',
            marginLeft: 'auto',
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
            <div id='home' style={outercss}>
                <div style={maincss}>
                    <div style={maintextcss}>
                        Hello There!
                    </div>
                    <p style={textcss}>
                        Welcome to my website! Allow me to introduce myself... 
                    </p>
                    <p style={textcss}>
                        My name is George. I'm a software engineer with experience building applications ranging from small websites for local businesses, 
                        to enterprise systems for large corporations.

                    </p>
                    <p style={textcss}>
                        If you'd like additional information about my skillset and professional experience, feel free to view my résumé.
                    </p>
                </div>
            </div >
        )
    }
}