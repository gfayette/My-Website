import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import MenuCanvas from './MenuCanvas.js'
import Colors from '../Colors'
import Fonts from '../Fonts'
import Converter from '../Converter'

export default class Menu extends React.Component {

    handleTap = () => {
        this.props.clickHandler('Menu')
    }

    render() {
        let borderWidth = this.props.menuOpen ? Converter.scale(200, this.props.width) : Converter.scale(70, this.props.width)
        let borderMargin = Converter.scale(12, this.props.width)
        let borderLeft = Converter.getRightX() - borderWidth - borderMargin - 4
        let canvasWidth = Converter.scale(60, this.props.width)
        let canvasMargin = Converter.scale(5, this.props.width)

        let bordercss = {
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            width: borderWidth,
            left: borderLeft,
            top: borderMargin,
            paddingBottom: this.props.menuOpen ? Converter.scale(20, this.props.width) : 0,

            backgroundColor: Colors.background,
            borderStyle: 'solid',
            borderColor: Colors.textColor,
            borderWidth: 1.8,
            borderRadius: Converter.scale(5, this.props.width),
            color: Colors.textColor,
        }

        let linecss = {
            height: 1.8,
            backgroundColor: Colors.textColor,
            marginTop: Converter.scale(2, this.props.width),
            marginLeft: Converter.scale(10, this.props.width),
            marginRight: Converter.scale(10, this.props.width),
        }

        return (
            <div style={bordercss} >
                <MenuCanvas canvasWidth={canvasWidth} canvasMargin={canvasMargin} borderWidth={borderWidth} showMenuItems={this.props.showMenuItems} handleTap={this.handleTap} />
                <AnimatePresence>
                    {this.props.showMenuItems && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.5 },
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.5 },
                            }}
                        >
                            <div style={linecss} />
                            <MenuButton name={'Home'} clickHandler={this.props.clickHandler} width={this.props.width} height={this.props.width} />
                            {/* <MenuButton name={'Section 1'} clickHandler={this.props.clickHandler} width={this.props.width} height={this.props.width} /> */}
                            {/* <MenuButton name={'Section 2'} clickHandler={this.props.clickHandler} width={this.props.width} height={this.props.width} /> */}
                            <MenuButton name={'Contact'} clickHandler={this.props.clickHandler} width={this.props.width} height={this.props.width} />
                            <MenuButton name={'Résumé'} clickHandler={this.props.clickHandler} width={this.props.width} height={this.props.width} />
                        </motion.div>)}
                </AnimatePresence>
            </div>
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
    }

    handleEnter = () => {
        this.setState({
            hovered: true
        })
    }

    handleLeave = () => {
        this.setState({
            hovered: false
        })
    }

    render() {
        let css = {
            fontFamily: Fonts.mainFont,
            marginRight: Converter.scale(15, this.props.width),
            marginLeft: Converter.scale(15, this.props.width),
        }

        let textcss = {
            fontSize: Converter.scale(30, this.props.width),
            fontFamily: Fonts.mainFont,
            marginRight: Converter.scale(5, this.props.width),
            marginLeft: Converter.scale(5, this.props.width),
            marginTop: Converter.scale(15, this.props.width),
            color: Colors.textColor,
            backgroundColor: Colors.background,
            border: 'none',
            textAlign: 'left',
        }

        let linecss = {
            height: 1.8,
            backgroundColor: Colors.textColor,
        }

        return (
            <div style={css}
                onClick={this.handleClick}
                onMouseEnter={this.handleEnter}
                onMouseLeave={this.handleLeave}>
                <div style={textcss}>
                    {this.props.name}
                </div>
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