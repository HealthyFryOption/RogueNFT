"use client";
import { useState } from "react";
import RogueCards from "./components/rogueCards";
import { NFTDetails } from "./lib/typeInterface";
import LineBreaker from "./components/line";
import RogueAdventures from "./components/rogueAdventures";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [singedIn, setSingedIn] = useState(false);
  const [nftData, setNftData]= useState<NFTDetails[]>([]);

  const [selectedCards, setSelectedCards]= useState<NFTDetails[]>([]);
  const [wantToMerge, setWantToMerge] = useState(false);

  const [cardStories, setCardStories]= useState<String[]>([]);

  const [merging, setMerging] = useState(false);
  const [minting, setMinting] = useState(false);
  const [adventuring, setAdventuring] = useState(false);
  
  const handleSignIn = async () => {
    if (!walletAddress || !privateKey) {
      alert("Please enter both wallet address and private key.");
      return;
    }

    const response = await fetch(`/api/wallet?walletAddress=${walletAddress}`);

    if(response.ok){
      const data= await response.json();

      setNftData(data?.message?.nfts)
      setSingedIn(true);
    }else{
      setSingedIn(false);
    }    
  };

  const refreshData = async () => {
    const response = await fetch(`/api/wallet?walletAddress=${walletAddress}`);

    if(response.ok){
      const data= await response.json();

      setNftData(data?.message?.nfts)
    }
  }

  const handleSelectMergeCards = (nft: NFTDetails) => {
    if(wantToMerge){
      const isAlreadySelected = selectedCards.some((card) => card.tokenId === nft.tokenId);

      if (isAlreadySelected) {
          // Deselect if already selected
          setSelectedCards(selectedCards.filter((card) => card.tokenId !== nft.tokenId));
      } else if (selectedCards.length < 2) {
          // Select only if less than 2 are selected
          setSelectedCards([...selectedCards, nft]);
      }
    }
  };

  const mintNewToken = async () => {
    setMinting(true);

    const mintReponse = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({ walletDetails:{walletAddress, privateKey} }),
      cache: "no-store",
    });

    if(mintReponse.ok){
      const response = await fetch(`/api/wallet?walletAddress=${walletAddress}`);
      if(response.ok){
        const data = await response.json();
        setNftData(data?.message?.nfts)
      }
    }

    setMinting(false);
  };

  const mergeHeroes = async () => {
    setMerging(true)
    setWantToMerge(false)

    const mergeResponse = await fetch("/api/merge", {
      method: "POST",
      body: JSON.stringify({ walletDetails:{walletAddress, privateKey}, tokenDetails: selectedCards}),
      cache: "no-store",
    });

    // once response finish, then empty
    setSelectedCards([])

    if(mergeResponse.ok){
      const response = await fetch(`/api/wallet?walletAddress=${walletAddress}`);
      if(response.ok){
        const data = await response.json();
        setNftData(data?.message?.nfts)
      }
    }
    
    setMerging(false)
  };

  const startAdventure = async (nft: NFTDetails) => {
    setAdventuring(true)   
    const response = await fetch(`/api/adventure?tokenId=${nft.tokenId}`);

    if(response.ok){
      const data = await response.json()

      const mergeResponse = await fetch("/api/adventure", {
        method: "POST",
        body: JSON.stringify({ walletDetails:{walletAddress, privateKey}, tokenDetails: nft, stories: data.message.stories}),
        cache: "no-store",
      });
  
  
      if(mergeResponse.ok){
          const response = await fetch(`/api/wallet?walletAddress=${walletAddress}`);
          if(response.ok){
            const data = await response.json();
            setNftData(data?.message?.nfts)
        }
      }
    }
    setAdventuring(false)   
  }

  const handleGetAdventure = async (nft: NFTDetails) => {
    const response = await fetch(`/api/adventure?tokenId=${nft.tokenId}`);

    if(response.ok){
      const data = await response.json()
      setCardStories(data.message.stories)
    }
  }

  return (
    <>
      <div className="py-10 useFlexCenter">
        {
          !singedIn ? (
            <>
            <div className="useFlexRowCenter w-full mt-20">
              <h1 className="font-minecraft text-center text-[var(--secondForeGround)]">RogueLite NFTs</h1>
              
              <div className="useFlexRowCenter mt-5 w-10/12 sm:8/12 md:w-5/12 pt-10 pb-4 px-2 rounded-md bg-[var(--mainColor)]">                          
                <p className="mb-5 text-center">
                  Enter your wallet address and key phrase!
                </p>

                <input
                  type="text"
                  placeholder="Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="border p-2 rounded w-9/12 mb-5 text-slate-950"
                />
                <input
                  type="password"
                  placeholder="Private Key"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="border p-2 rounded w-9/12 mb-5 text-slate-950"
                />
                <button onClick={handleSignIn} className="bg-[var(--secondColor)] text-white px-4 py-2 rounded ">
                  Submit
                </button>
              </div>
            </div>

            </>
          ) : (
            <>
              <div className="useFlexRowCenter mt-4 w-11/12 md:w-8/12 lg:w-6/12 
                  py-8 px-2 rounded-2xl bg-[var(--mainColor)] text-center break-words"
                >
                <h4 className="font-minecraft">
                  Welcome to <span className="text-[var(--secondForeGround)] font-minecraft">RogueNFTS!</span>
                </h4>
                <LineBreaker marginDown="1" marginUp="0.5" lineHeight="0.1rem" lineWidth="70%" lineColour="white"/>
                <h4>
                  Wallet Address
                </h4>
                <p className="text-[var(--secondForeGround)]">
                  {walletAddress}
                </p>
                
              </div>
              <div className="useFlexRowFStart w-11/12">
                  <button
                    className="p-1 mt-2 mb-2 bg-[var(--contrastForeGround)] rounded-2xl"
                    onClick={refreshData}
                  >
                    Refresh Data
                  </button>
              </div>
              <div className="useFlexRowCenter w-11/12 py-4 px-8 rounded-lg bg-[var(--mainColor)]">
                <div className="useFlexRowSEvenly md:useFlexRowFStart w-full">
                  <button 
                    className={`py-2 px-4 rounded-2xl mb-4 ${minting? "bg-gray-500" : "bg-[var(--secondForeGround)]" }`}
                    onClick={mintNewToken}
                    disabled={minting}
                  >
                    Mint New Heroes
                  </button>
                  <button 
                    className={`py-2 px-4 rounded-2xl mb-4 ${merging ? "bg-gray-500" : wantToMerge ? "bg-indigo-500": "bg-[var(--secondForeGround)]" }`}
                    onClick={()=>{
                      setWantToMerge(!wantToMerge)
                      setSelectedCards([])
                    }}
                    disabled={merging}
                  >
                    Select & Merge 2 Heroes
                  </button>
                </div>
                <div className="useFlexRowSEvenly w-full">
                  {nftData.length > 0 ? (
                      nftData.map((nft, index) => (
                        <RogueCards 
                          key={nft.tokenId} 
                          nftDetails={nft} 
                          canMerge={wantToMerge}
                          adventuring={adventuring}
                          isSelected={selectedCards.some((card) => card.tokenId === nft.tokenId)}
                          toggleSelect={() => handleSelectMergeCards(nft)}
                          adventureSelect={()=> startAdventure(nft)} 
                          getAdventuresSelect={()=> handleGetAdventure(nft)} 
                        />
                      ))
                    ) : (
                      <p>No NFTs found. Try minting some!</p>
                    )}
                </div>
                
                {
                  cardStories.length !== 0 && (
                    <RogueAdventures cardStories={cardStories} setCardStories={() => setCardStories([])}/>
                  )
                }

                {
                  selectedCards.length === 2 && (
                    <button 
                      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 ${merging ? "bg-gray-500" : "bg-[var(--secondForeGround)]" }`}
                      onClick={mergeHeroes}
                      disabled={merging}
                    >
                      Merge Selected Heroes
                    </button>
                  )
                }
              </div>
            </>
        )}
    </div>
    
    </>
  );
}
