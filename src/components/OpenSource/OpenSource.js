import React from 'react'
import Container from '../Container'
import Slider from '../Slider'
import Approved from './Approved'

function OpenSource() {
  return (
    <Container>
      <div className="Section-space-top Section-space-bottom">
        <div className="Page-header-text text-center pb-3 text-gradient fw-normal">
          Open Source
        </div>
        <p className="Page-info-text text-center py-3 mb-5 text-grey">
          Use a wallet with a fully open code that meets stated specifications.
        </p>
        <Slider slidesToScroll={4} slidesToShow={4}>
          <Approved
            by="Bitcoin"
            title="Approved By Bitcoin.org"
            image="/images/opensource/bitcoin.svg"
            info={
              <>
                Termite has been listed by <a href="https://bitcoin.org/en/wallets/mobile/ios/termite/" target="_blank"
                                                  rel="noopener noreferrer" className="color-link">Bitcoin.org</a>, one of the leading informational
                resources for Bitcoin,
                and recommended for both new and experienced users alike.
              </>
            } />
          <Approved
            by="Certik"
            title="Audited By Certik"
            image="/images/opensource/certik.svg"
            info={
              <>
                Termite was audited by <a href="https://www.certik.org/projects/termite.money" target="_blank" rel="noopener noreferrer"
                                              className="color-link">Certik.org</a> where both iOS and Android versions of the app were checked for
                potential backdoors and vulnerabilities. No major or minor issues were found.
              </>
            } />
          <Approved
            by="Immunefi"
            title="Audited By Immunefi"
            image="/images/opensource/immunefi.svg"
            info={
              <>
                Termite was audited by <a href="https://immunefi.com/bounty/termitewallet/" target="_blank" rel="noopener noreferrer"
                                              className="color-link">Immunefi.com</a> where both iOS and Android versions of the app were checked for
                potential backdoors and vulnerabilities. No major or minor issues were found.
              </>
            } />
          <Approved
            by="WalletScrutiny"
            title="Approved By Wallet Scrutiny"
            image="/images/opensource/wallet-scrutiny.svg"
            info={
              <>
                The <a href="https://walletscrutiny.com/android/io.nexvax.bankwallet/" target="_blank" rel="noopener noreferrer"
                       className="color-link">WalletScrutiny.com</a> verifies that cryptocurrency wallets are indeed using the same publicly open
                code they claim to. Termite is verifiably open source wallet.
              </>
            } />
        </Slider>
      </div>
    </Container>
  )
}

export default OpenSource
