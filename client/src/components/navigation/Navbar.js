 import React, { useState } from 'react';
import LogoWithText from '../logo/LogoWithText';
import Logo from '../logo/LogoIcon';
import Container from '../layout/Container';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Hider from '../layout/Hider';
import Button from '../buttons/Button';
import ChipsAmount from '../user/ChipsAmount';
import HamburgerButton from '../buttons/HamburgerButton';
import Spacer from '../layout/Spacer';
import Text from '../typography/Text';
import Markdown from 'react-remarkable';

const StyledNav = styled.nav`
  padding: 1rem 0;
  position: absolute;
  z-index: 99;
  width: 100%;
  background-color: ${(props) => props.theme.colors.lightestBg};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
`;

const WalletButton = styled.button`
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: ${(props) => (props.primary ? '#5A67D8' : '#ECC94B')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;


const WalletModal = ({ onClose, connectPhantom, connectMetamask, disconnectWallet, walletAddress }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{walletAddress ? 'Wallet Connected' : 'Select Wallet'}</h2>
        {!walletAddress ? (
          <>
            <WalletButton primary onClick={connectPhantom}>Connect Phantom</WalletButton>
            <WalletButton onClick={connectMetamask}>Connect MetaMask</WalletButton>
          </>
        ) : (
          <WalletButton style={{ background: '#E53E3E' }} onClick={disconnectWallet}>Disconnect Wallet</WalletButton>
        )}
        <WalletButton style={{ background: '#A0AEC0' }} onClick={onClose}>Close</WalletButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const Navbar = ({
  loggedIn,
  chipsAmount,
  location,
  openModal,
  openNavMenu,
  className,
}) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectPhantom = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString());
        setIsModalOpen(false);
      } catch (err) {
        console.error('Phantom connection failed', err);
      }
    } else {
      alert('Phantom wallet not found!');
    }
  };

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsModalOpen(false);
      } catch (err) {
        console.error('MetaMask connection failed', err);
      }
    } else {
      alert('MetaMask not found!');
    }
  };

  const handleConnectWallet = () => {
    setIsModalOpen(true);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsModalOpen(false);
  };

  const openShopModal = () =>
    openModal(
      () => (
        <Markdown>
          <Text textAlign="center">
            We're currently working hard to get the shop up and running! Soon you'll be able to buy chip packages for competitive prices to enhance your gaming experience.
          </Text>
        </Markdown>
      ),
      "Shop",
      "Close"
    );

  return (
    <StyledNav className={className}>
      <Container contentCenteredMobile={!loggedIn}>
        <Link to="/">
          {loggedIn ? (
            <>
              <Hider hideOnMobile>
                <LogoWithText />
              </Hider>
              <Hider hideOnDesktop>
                <Logo />
              </Hider>
            </>
          ) : (
            <LogoWithText />
          )}
        </Link>

        <Spacer>
          {loggedIn ? (
            <>
              <ChipsAmount chipsAmount={chipsAmount} clickHandler={openShopModal} />
              <Hider hideOnMobile>
                <Button to="/" primary small onClick={openShopModal}>
                  Buy Chips
                </Button>
              </Hider>
            </>
          ) : (
            <Hider hideOnMobile>
              {location.pathname !== '/register' && (
                <Button as={Link} to="/register" primary small>
                  Register
                </Button>
              )}
              {location.pathname !== '/login' && (
                <Button as={Link} to="/login" secondary small>
                  Login
                </Button>
              )}
            </Hider>
          )}

         
          {!walletAddress ? (
            <Button onClick={handleConnectWallet} primary small>
              Connect Wallet
            </Button>
          ) : (
            <>
              <Text small style={{ marginRight: '0.5rem' }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Text>
              <Button onClick={disconnectWallet} secondary small>
                Disconnect
              </Button>
            </>
          )}

          {/* Hamburger for logged in */}
          {loggedIn && <HamburgerButton clickHandler={openNavMenu} />}
        </Spacer>
      </Container>

      {isModalOpen && (
        <WalletModal
          onClose={() => setIsModalOpen(false)}
          connectPhantom={connectPhantom}
          connectMetamask={connectMetamask}
          disconnectWallet={disconnectWallet}
          walletAddress={walletAddress}
        />
      )}
    </StyledNav>
  );
};

export default Navbar;
