let trigrams
let bigrams
let endings
let word
let string = ""

async function getTextData() {
    try {
        // Wait for both fetches to complete
        const [trigramsResponse, bigramsResponse, endingsResponse] = await Promise.all([
            fetch("data/trigrams.json"),
            fetch("data/bigrams.json"),
            fetch("data/endings.json")
        ])

        // Convert both responses to JSON
        trigrams = await trigramsResponse.json()
        bigrams = await bigramsResponse.json()
        endings = await endingsResponse.json()

        return {trigrams, bigrams, endings}

    }   catch (error) {
        console.error('Error fetching data:', error)
    }
}

// Correct way to use the async function
export async function generatePseudoWords(iterations, amount) {
    console.log("hello")
    const textData = await getTextData()

    // Get the total weights of the bigrams and trigrams
    const totalBiWeights = Object.values(textData.bigrams).reduce((sum, current) => sum + current, 0)
    const totalTriWeights = Object.values(textData.trigrams).reduce((sum, current) => sum + current, 0)
    const totalEndWeights = Object.values(textData.endings).reduce((sum, current) => sum + current, 0)

    for (let i = 0; i < amount; i++) {
        // Pick a random initial bigram
        let weightSum = 0
        let initialBigram
        let random_ = Math.random() * totalBiWeights
        for (const [bigram, weight] of Object.entries(textData.bigrams)) {
            // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
            // Add accumalating weight to current bigram
            weightSum += weight
            if (random_ <= weightSum) {
                // If the number chosen is less than or equal the sum of the weights before current bigram, pick said bigram
                initialBigram = bigram
                break
            }
        }

        // Create first two letters of the word
        word = initialBigram

        // Iterate "i" times on word, getting the last two letters of it every time and matching it with a trigram, then adding the last letter of the trigram to the word
        for (let i = 0; i < iterations - 3; i++) {
            // Reset matching trigrams object every iteration
            let matchingTrigrams = {}
            let matchingTriWeights = 0
            Object.entries(textData.trigrams).forEach(([trigram, weight]) => {
                // Check for each trigram that starts with the same two letters as the end of the word and create an object for it
                if (trigram.startsWith(word.toLowerCase().slice(-2))) {
                    matchingTrigrams[trigram] = weight
                    matchingTriWeights += weight
                }
            })
            
            let weightSum = 0
            // Pick a random trigram from matching trigrams (weighted choice)
            let random = Math.random() * matchingTriWeights
            for (const [matchingTrigram, weight] of Object.entries(matchingTrigrams)) {
                // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
                // Add accumalating weight to current bigram
                weightSum += weight
                if (random <= weightSum) {
                    // If the number chosen is less than or equal the sum of the weights before current trigram, pick said trigram
                    // Add trigram to the end of the word
                    word += matchingTrigram.slice(-1)
                    break
                }
            }
        }

        // Use the word endings for the last three letters of the word
            // Reset matching trigrams object every iteration
            let matchingEndings = {}
            let matchingEndWeights = 0
            Object.entries(textData.endings).forEach(([ending, weight]) => {
                // Check for each trigram that starts with the same two letters as the end of the word and create an object for it
                if (ending.startsWith(word.toLowerCase().slice(-2))) {
                    matchingEndings[ending] = weight
                    matchingEndWeights += weight
                }
            })

        // Pick a random trigram from matching trigrams (weighted choice)
        let random = Math.random() * matchingEndWeights
        for (const [matchingEnding, weight] of Object.entries(matchingEndings)) {
            // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
            // Add accumalating weight to current bigram
            weightSum += weight
            if (random <= weightSum) {
                // If the number chosen is less than or equal the sum of the weights before current trigram, pick said trigram
                // Add trigram to the end of the word
                word += matchingEnding.slice(-3)
                break
            }
        }

        word += " "
        string += word

    }
    return string
    
}