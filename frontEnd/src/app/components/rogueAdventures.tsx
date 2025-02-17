export default function RogueAdventures(
    {cardStories, setCardStories}:{cardStories:String[],setCardStories: ()=>void }
){
    return(
        <>
            <div 
                className="fixed top-0 left-0 w-screen h-screen bg-black/25 z-100"
            >
                <div className="
                    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-black z-150
                    w-11/12 h-4/5 overflow-y-auto
                ">
                    {
                        cardStories.length > 0 && (
                            cardStories.map((story, index) => (
                                <div key={index} className="border mb-3">
                                    <p className="text-sm">
                                        {index + 1}.&nbsp;
                                        {story}
                                    </p>
                                </div>
                            ))
                        )
                    }
                </div>
                <button 
                      className={`fixed bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-xl shadow-lg z-150 bg-[var(--secondForeGround)]`}
                      onClick={setCardStories}
                    >
                      Return
                </button>
            </div>
        </>
    )
}