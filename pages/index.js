import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";
import Confetti from "react-confetti";

export default function Home() {
  const [isMinted, setIsMinted] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const web3ModalRef = useRef();

  const [imageUrl, setImageUrl] = useState(getImageUrl());

  function getImageUrl() {
    const randomNumber = Math.floor(Math.random() * 3);
    let imageUrl;
    switch (randomNumber) {
      case 0:
        imageUrl = "./CelestiaNft/1.svg";
        break;
      case 1:
        imageUrl = "./CelestiaNft/2.svg";
        break;
      case 2:
        imageUrl = "./CelestiaNft/3.svg";
        break;
      default:
        imageUrl = "./CelestiaNft/1.svg";
        break;
    }
    return imageUrl;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageUrl(getImageUrl());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const presaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await nftContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      setIsMinted(true);
      setTimeout(() => setIsMinted(false), 10000);
    } catch (err) {
      console.error(err);
    }
  };

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      setIsMinted(true);
      setTimeout(() => setIsMinted(false), 10000);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await nftContract.startPresale();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await checkIfPresaleStarted();
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _presaleStarted = await nftContract.presaleStarted();
      if (!_presaleStarted) {
        await getOwner();
      }
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _presaleEnded = await nftContract.presaleEnded();
      const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _owner = await nftContract.owner();
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _tokenIds = await nftContract.tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 9000) {
      window.alert("Change the network to Ethermint");
      throw new Error("Change network to Ethermint");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "ethermint",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();

      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }

      getTokenIdsMinted();

      const presaleEndedInterval = setInterval(async function () {
        const _presaleStarted = await checkIfPresaleStarted();
        if (_presaleStarted) {
          const _presaleEnded = await checkIfPresaleEnded();
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval);
          }
        }
      }, 5 * 1000);

      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <div class={styles.neon__button} onClick={connectWallet}>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Connect your wallet
          </a>
        </div>
      );
    }

    if (loading) {
      return (
        <div class={styles.neon__button} onClick={connectWallet}>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Loading...
          </a>
        </div>
      );
    }

    if (isOwner && !presaleStarted) {
      return (
        <div class={styles.neon__button} onClick={startPresale}>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Start Presale!
          </a>
        </div>
      );
    }

    if (!presaleStarted) {
      return (
        <div>
          <div className={styles.description}>Presale hasn&#39;t started!</div>
        </div>
      );
    }

    if (presaleStarted && !presaleEnded) {
      return (
        <div>
          <div className={styles.description}>
            Presale has started!!!Mint if you are whitelisted 🔥🔥🔥
          </div>

          <div class={styles.neon__button} onClick={presaleMint}>
            <a href="#">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Presale Mint 🔥🔥🔥
            </a>
          </div>
        </div>
      );
    }

    if (presaleStarted && presaleEnded) {
      return (
        <div class={styles.neon__button} onClick={publicMint}>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Public Mint 🔥🔥🔥
          </a>
        </div>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>CELESTIA NFT</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div className={styles.mobile}>
          <h1 className={styles.title}>
            CELESTIA NFT COLLECTION on ⧫ Ethermint
          </h1>
          <div className={styles.description}>
            As an Early Node Runner on Celestia Network, you can mint your NFT
            designed by duyvo102#3738.
          </div>
          <div className={styles.description}>
            30 items with 10 Build Modular, 10 Run Different Nodes and 10
            Power-up with Data Availability Layer.
          </div>
          <div className={styles.description}>
            Contract: 0x416D7565C34a273CbF356E73167c7Fde6c7aAa30.
          </div>
          <div className={styles.description}>
            You can add Contract address and tokenId to Metamask to see your
            NFT.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/30 have been minted.
          </div>
          {renderButton()}
          {isMinted && (
            <div>
              <div className={styles.description}>
                Congratulations! You have successfully minted your Celestia NFT.
              </div>
              <div className={styles.description}>
                Your tokenId : {tokenIdsMinted}
              </div>
            </div>
          )}
        </div>
        <div className={styles.image_change}>
          <img
            className={styles.image}
            src={imageUrl}
            alt="Random Celestia NFT"
          />
          {isMinted && (
            <>
              <Confetti width={window.innerWidth} height={window.innerHeight} />
            </>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <div>Made by duyvo102#3738 with &#10084;&#10084;&#10084;</div>
        <div>
          Node Identity: 12D3KooWMTMwWoXW1HLWNNnS2wzGMYJ21hXLCgjS7TRFy1sYBvgo
        </div>
      </footer>
    </div>
  );
}
