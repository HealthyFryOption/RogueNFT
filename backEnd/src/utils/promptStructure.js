export const promptStructure = {
    levelToCharacters: {
        50:100, 100:150, 200:350
    },
    geminiConfig : {
        temperature: 1.5,
        topP: 1,
        topK: 1,
        maxOutputTokens: 4096,
    },
    
    botRole: "You are an incredible fantasy short story teller. I want you to help write extremely creative stories with the following scenario: ",

    prompt: "Write a short story of a {hero} in roughly {wordCount} words, and how his adventure may look like. Give me a creative story that showcases genius, bravery, cunning, " +
    "romance. Make it safe to read. It would be great if there's small dialogs. Describe the lands as fantastical environments. " + 
    "Assuming this was a scenario in a game, be reasonable amount of XP should they get, if the XP full bar was 100, and their " +
    "current XP is {currentXP} and their level is {level}. " +
    'Please write your answer in JSON format. For example, you should only return `{"story": "your story", "xpGained": 10}`. No other symbols, no json infront, no extra "`" ',

    previousStories:"You have some previous stories to follow up and continue generating. " + 
    "Determine who is the main character, and use the same name should there be any when generating new story. The previous stories are: "
}