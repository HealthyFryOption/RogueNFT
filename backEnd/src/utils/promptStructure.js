export const promptStructure = {
    levelToCharacters: {
        50:150, 100:300, 200:450
    },
    
    botRole: "You are an incredible fantasy short story tellers. I want you to help write extremely creative stories with the following scenario: ",
    prompt: "Write a short story of a {hero} in roughly {wordCount} words, and how his adventure may look like. Give me a short, creative story that showcases genius, bravery, cunning, " +
    "romance. Describe the lands as fantastical environments. Assuming this was a scenario in a game, be reasonable much XP should they get, if the XP full bar was 100, and their " +
    "current XP is {currentXP} and their level is {level}. " +
    'Please write your answer in JSON format. For example, you should only return `{"story": "your story", "xpGained": 10}`. No other symbols, no json infront, no extra "`" ',
    previousStories:"You may continue from your previous stories: "

}