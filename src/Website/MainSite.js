import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import Header from './Components/Header.js'
import Home from './Components/Home.js'
import Section1 from './Components/Section1.js'
import Section2 from './Components/Section2.js'
import Contact from './Components/Contact.js'
import Menu from './Components/Menu.js'

export default class MainSite extends React.Component {

    introStep

    constructor(props) {
        super(props)
        this.state = {
            //load
            showHeader: false,
            showBody: false,
            showMenu: false,

            // menu
            menuOpen: false,
            showMenuItems: false,
            animatingMenu: false,
        }

        this.introStep = 0
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll)
        this.startLoop()
    }

    handleTap = (e) => {
        if (!this.state.animatingMenu && this.state.menuOpen) {
            this.closeMenu()
        }
    }

    handleScroll = (e) => {
        let element = document.getElementById('header')
        if (element) {
            if (window.scrollY > element.clientHeight) {
                this.setState({
                    showMenu: true,
                })
            }
            else {
                this.setState({
                    showMenu: false,
                })
                this.closeMenu()
            }
        }
    }

    startLoop = () => {
        if (this.introStep === 1) {
            this.setState({
                showHeader: true,
            })
        }

        if (this.introStep === 3) {
            this.setState({
                showBody: true,
            })
        }

        if (this.introStep === 6) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            }
        }
        else {
            ++this.introStep
            setTimeout(this.startLoop, 250)
        }
    }

    handleMenuClick = name => {
        switch (name) {
            case 'Home':
                window.scrollTo(0, 0)
                this.closeMenu()
                break
            case 'Section 1':
                let s1 = document.getElementById('section1')
                s1.scrollIntoView(true)
                this.closeMenu()
                break
            case 'Section 2':
                let s2 = document.getElementById('section2')
                s2.scrollIntoView(true)
                this.closeMenu()
                break
            case 'Contact':
                let c = document.getElementById('contact')
                c.scrollIntoView(true)
                this.closeMenu()
                break
            case 'Résumé':
                window.open("./George Fayette Public Resume.pdf")
                break
            case 'Menu':
                this.menuCanvasClick()
                break
            default:
                break
        }
    }

    menuCanvasClick = () => {
        if (!this.state.animatingMenu) {
            if (this.state.showMenuItems) {
                this.closeMenu()
            }
            else {
                this.openMenu()
            }
        }
    }

    closeMenu = () => {
        this.setState({
            showMenuItems: false,
            animatingMenu: true,
        })

        setTimeout(() => {
            this.setState({
                menuOpen: false,
                animatingMenu: false,
            })
        }, 500)
    }

    openMenu = () => {
        this.setState({
            menuOpen: true,
            showMenuItems: true,
            animatingMenu: true,
        })

        setTimeout(() => {
            this.setState({
                animatingMenu: false,
            })
        }, 500)
    }

    render() {
        return (
            <div>
                <div onClick={this.handleTap}>
                    {this.state.showHeader && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.5 },
                            }}
                            exit={{ opacity: 0 }}
                        >
                            <Header width={this.props.width} clickHandler={this.handleMenuClick} />
                        </motion.div>)}
                    {this.state.showBody && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.5 },
                            }}
                            exit={{ opacity: 0 }}
                        >
                            <Home width={this.props.width} />
                            <Section1 width={this.props.width} />
                            <Section2 width={this.props.width} />
                            <Contact width={this.props.width} height={this.props.height} />
                        </motion.div>)}
                </div>
                <AnimatePresence>
                    {this.state.showMenu && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.5 },
                            }}
                            exit={{ opacity: 0 }}
                        >
                            <Menu clickHandler={this.handleMenuClick} width={this.props.width} height={this.props.height}
                                menuOpen={this.state.menuOpen} showMenuItems={this.state.showMenuItems} />
                        </motion.div>)}
                </AnimatePresence>
            </div>
        )
    }
}