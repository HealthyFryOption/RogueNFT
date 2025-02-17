import { NFTDetails } from "../lib/typeInterface";

export default function RogueCards({
    nftDetails,
    canMerge,
    adventuring,
    isSelected,
    toggleSelect,
    adventureSelect,
    getAdventuresSelect
}: {
    nftDetails: NFTDetails;
    canMerge: boolean;
    adventuring: boolean;
    isSelected: boolean;
    toggleSelect: () => void;
    adventureSelect: () => void;
    getAdventuresSelect: () => void;
}) {
    return (
        <div
            className={`relative useFlexRowCenter border-4 py-4 px-10 mb-4 rounded-md transition-colors duration-300 text-center 
                ${ canMerge ? "cursor-pointer" : ""}
                ${ isSelected ? "border-yellow-500" : "border-indigo-500" 
            }`}
            onClick={toggleSelect}
        >
            <p className="mb-4">Token ID: {nftDetails.tokenId}</p>
            <h4 className="font-minecraft capitalize">{nftDetails.class}</h4>
            <p className="text-[var(--secondForeGround)]">Level: {nftDetails.level}</p>
            <p className="text-[var(--secondForeGround)]">XP: {nftDetails.xp}</p>
            <p>Cooldown Until: <span className="text-[var(--contrastForeGround)]">{ Number(nftDetails.cooldown) ? new Date(Number(nftDetails.cooldown) * 1000).toLocaleString() : "Available" }</span></p>

            <button 
                className={`mt-4 p-2 border-4 rounded-xl ${
                    adventuring ? "bg-gray-500" :
                    Number(nftDetails.cooldown) ? Math.floor(Date.now() / 1000) < Number(nftDetails.cooldown) ? 
                    "bg-gray-500" : "bg-[var(--secondForeGround)]" :  "bg-[var(--secondForeGround)]"}`
                }
                onClick={adventureSelect}
                disabled={adventuring ? true : Number(nftDetails.cooldown) ? Math.floor(Date.now() / 1000) < Number(nftDetails.cooldown) : false}
            >
                Go Adventure
            </button>
            <button 
                className="mt-4 p-2 border-4 rounded-xl"
                onClick={getAdventuresSelect}
            >
                Get Previous Adventures
            </button>

            {/* Small "X" button for deselecting */}
            {isSelected && (
                <button
                    className="absolute top-1 right-1 text-red-500 font-bold text-lg"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent click
                        toggleSelect();
                    }}
                >
                    ✖
                </button>
            )}
        </div>
    );
}
