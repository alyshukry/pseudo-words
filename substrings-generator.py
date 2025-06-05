import json
from collections import Counter

# Count n-grams only if there are at least x amount of them
MIN_TRI_FREQUENCY = 10
MIN_BI_FREQUENCY = 10
MIN_ENDING_FREQUENCY = 10

with open("data/words.txt", "r", encoding="utf-8") as sample:
    text = sample.read()
    # Include only alhpabetical characters and spaces
    text = ''.join(char for char in text if char.isalpha() or char.isspace())
    # Split at each word
    words = [word.lower() for word in text.split()]

# Get all trigrams from each word
trigrams = []
# Get first two letters from each word
bigrams = []
# Get last two letters from each word
ending = []

for word in words:
    # Get trigrams from current word
    if len(word) >= 3:
        for i in range(len(word) - 2):
            trigrams.append(word[i:i+3])
    # Get first two letters from current word
    if len(word) >= 2:
        bigrams.append(word[0:2])
    # Get last two letters from current word
    if len(word) >= 5:
        ending.append(word[-5:])


# Count occurrences
trigram_counts = dict(Counter(trigrams))
trigram_counts = {k: int(v ** .5) for k, v in trigram_counts.items() if int(v ** .5) >= MIN_TRI_FREQUENCY} # Remove trigrams with frequencies less than the min

bigram_counts = dict(Counter(bigrams))
bigram_counts = {k: int(v ** .5) for k, v in bigram_counts.items() if int(v ** .5) >= MIN_BI_FREQUENCY} # Remove bigrams with frequencies less than the min

ending_counts = dict(Counter(ending))
ending_counts = {k: int(v ** .5) for k, v in ending_counts.items() if int(v ** .5) >= MIN_ENDING_FREQUENCY} # Remove ending with frequencies less than the min

# Dump the data
with open("data/trigrams.json", "w") as substrings:
    json.dump(trigram_counts, substrings, indent = 4)
with open("data/bigrams.json", "w") as bigrams:
    json.dump(bigram_counts, bigrams, indent = 4)
with open("data/endings.json", "w") as ending:
    json.dump(ending_counts, ending, indent = 4)