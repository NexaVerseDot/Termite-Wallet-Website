import React from 'react'
import Container from '../Container'
import './Join.scss'

function Join() {
  return (
    <Container clipped={false}>
      <div className="Section-head Section-join Page-rtl">
        <div className="Page-content">
          <div className="Page-end">
            <div className="Section-text Join-section-text text-gradient">
              Join Termites
            </div>
            <div className="Section-info Join-section-info">
              Stay on top of Termite happenings. Be the first to know about new features, user reported issues and things we work on!
            </div>
          </div>
          <div className="Page-start">
            <div className="Join-icons">
              <div className="Join-icon">
                <a href="https://twitter.com/termitebynv" target="_blank" rel="noopener noreferrer">
                  <img className="Join-image" src="/images/join/twitter@3x.png" alt="Twitter" />
                </a>
              </div>
              <div className="Join-icon">
                <a href="https://github.com/NexaVerseDot/" target="_blank" rel="noopener noreferrer">
                  <img className="Join-image" src="/images/join/github@3x.png" alt="github" />
                </a>
              </div>
              <div className="Join-icon">
                <a href="https://t.me/termite_announcements" target="_blank" rel="noopener noreferrer">
                  <img className="Join-image" src="/images/join/telegram@3x.png" alt="telegram" />
                </a>
              </div>
            </div>
            <div className="Join-icons">
              <div className="Join-icon">
                <a href="https://www.reddit.com/r/TERMITEWallet/" target="_blank" rel="noopener noreferrer">
                  <img className="Join-image" src="/images/join/reddit@3x.png" alt="reddit" />
                </a>
              </div>
              <div className="Join-icon">
                <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer">
                  <img className="Join-image" src="/images/join/discord@3x.png" alt="discord" />
                </a>
              </div>
              <div className="Join-icon">
                <a href="https://termitewallet.medium.com/" target="_blank" rel="noopener noreferrer">
                  <img className="Join-image" src="/images/join/medium@3x.png" alt="medium" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Join

