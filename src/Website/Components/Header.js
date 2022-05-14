import React from 'react'
import { motion } from "framer-motion"
import Colors from '../Colors'
import Fonts from '../Fonts'
import Converter from '../Converter'
import CubeCanvas from './CubeCanvas.js'

export default class Header extends React.Component {

    render() {
        let outercss = {
            background: Colors.background,
            maxWidth: Converter.maxWidth,
            display: 'block',
            marginRight: 'auto',
            marginLeft: 'auto',
        }

        let leftcss = {
            display: 'flex',
            paddingTop: Converter.scale(36, this.props.width),
            paddingLeft: Converter.scale(36, this.props.width),
        }

        let namecss = {
            color: Colors.textColor,
            fontSize: Converter.scale(67, this.props.width),
            fontFamily: Fonts.mainFont,
            marginLeft: Converter.scale(12, this.props.width),
            marginTop: Converter.scale(4, this.props.width),
        }

        let rightcss = {
            paddingBottom: Converter.scale(18, this.props.width),
            paddingRight: Converter.scale(36, this.props.width),
            color: Colors.textColor,
            fontSize: Converter.scale(42, this.props.width),
            fontFamily: Fonts.mainFont,
            display: 'flex',
            justifyContent: 'flex-end',
        }

        let linecss = {
            height: Converter.scale(10, this.props.width),
            background: Colors.getGradient(Colors.textColor, Colors.background, Converter.scale(100, this.props.width)),
        }

        return (
            <div id='header' style={outercss}>
                <div style={leftcss}>
                    {/* <CubeCanvas cubeWidth={Converter.scale(88, this.props.width)} />*/}
                    <div style={namecss}>
                        George Fayette
                    </div>
                </div>
                <div style={rightcss}>
                    <MenuButton name={'Home'} clickHandler={this.props.clickHandler} width={this.props.width} />
                    {/* <MenuButton name={'Section 1'} clickHandler={this.props.clickHandler} width={this.props.width} /> */}
                    {/*<MenuButton name={'Section 2'} clickHandler={this.props.clickHandler} width={this.props.width} /> */}
                    <MenuButton name={'Contact'} clickHandler={this.props.clickHandler} width={this.props.width} />
                    <MenuButton name={'Résumé'} clickHandler={this.props.clickHandler} width={this.props.width} />
                </div>
                <div style={linecss} />
            </div >
        )
    }
}

class MenuButton extends React.Component {
    state = {
        hovered: false,
    }

    handleClick = () => {
        this.props.clickHandler(this.props.name)
        this.setState({
            hovered: false
        })
    };

    handleEnter = () => {
        this.setState({
            hovered: true
        })
    };

    handleLeave = () => {
        this.setState({
            hovered: false
        })
    };

    render() {
        let css = {
            fontFamily: Fonts.mainFont,
            marginRight: Converter.scale(3, this.props.width),
            marginLeft: Converter.scale(3, this.props.width),
        }

        let textcss = {
            fontSize: Converter.scale(22, this.props.width),
            fontFamily: Fonts.mainFont,
            marginRight: Converter.scale(4, this.props.width),
            marginLeft: Converter.scale(4, this.props.width),
            color: Colors.textColor,
            backgroundColor: Colors.background,
            border: 'none',
        }

        let linecss = {
            height: 1,
            backgroundColor: Colors.textColor,
        }

        return (
            <div style={css}
                onClick={this.handleClick}
                onMouseEnter={this.handleEnter}
                onMouseLeave={this.handleLeave}>
                <button style={textcss}>
                    {this.props.name}
                </button>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: this.state.hovered ? 1 : 0,
                        transition: { duration: 0.5 },
                    }}
                >
                    <div style={linecss} />
                </motion.div>
            </div>
        )
    }
}