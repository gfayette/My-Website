import './App.css'
import React from 'react'
import GameViewGL from './WelcomeScreen/GameViewGL.js'
import MainSite from './Website/MainSite.js'
import Colors from './Website/Colors.js'
import Converter from './Website/Converter'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      block: true,
      introStep: 0,
      pageLoaded: false,
    }
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad)
  }

  handleLoad = () => {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.setState({
      pageLoaded: true,
    })
  }

  resizeTimer
  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,

    })

    if (!this.state.block) {
      this.setState({
        block: true,
      })
    }

    // short delay before updating canvas
    clearInterval(this.resizeTimer)
    this.resizeTimer = setInterval(() => {
      clearInterval(this.resizeTimer)
      this.setState({
        block: false,
      })
    }, 80)
  }

  updateIntro = (step) => {
    this.setState({
      introStep: step,
    })
  }

  fullscreen = () => {
    if (document.fullscreenEnabled) {
      let root = document.getElementById('root')
      if (!document.fullscreenElement) {
        root.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  render() {
    let marginTop = 2
    let marginLeft = 2
    let w = this.state.width - 4
    let h = this.state.height - 4

    let backgroundcss = {
      background: Colors.background0,
      minHeight: this.state.height,
      minWidth: Converter.minWidth
    }

    return (
      <div>
        {this.state.introStep < 2 &&
          <GameViewGL width={w} height={h} marginTop={marginTop} marginLeft={marginLeft}
            block={this.state.block} pageLoaded={this.state.pageLoaded} updateIntro={this.updateIntro} fullscreen={this.fullscreen} />}
        {this.state.introStep > 0 &&
          <div style={backgroundcss}>
            {this.state.introStep > 1 &&
              <MainSite width={this.state.width} height={this.state.height} />}
          </div>}
      </div>
    )
  }
}

export default App
