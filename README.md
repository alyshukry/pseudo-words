
# 🧾 Pseudo-word Generator

A pseudo-word generator that creates words which _resemble_ real ones—though they usually aren't!

## 💡 How It Works

This generator is inspired by the logic behind [feldarkrealms.com](https://feldarkrealms.com/).  
It requires a large sample of text, which is split into individual words. From each word, the following are extracted:

-   The first two letters
-   All three-letter sequences
-   The last five letters
    

### Example:

**`hello`** → `he`, `hel`, `ell`, `llo`, `hello`  
**`goodbye`** → `go`, `goo`, `ood`, `odb`, `dby`, `bye`, `odbye`

These fragments are stored in separate files along with their frequencies. For instance:

```json
// Initial two-letter prefixes  "he":  10,  "go":  4,
// Three-letter sequences  "hel":  3,  "god":  20,
// Word endings  "rings":  12,  "nners":  15,` 
```
After generation, fragments that appear less than a certain number of times are filtered out.

Word construction:

1.  A **two-letter prefix** is chosen randomly, weighted by frequency (e.g., if `"go"` appears 5× and `"he"` appears 1×, `"go"` is 5× more likely to be selected).
    
2.  The script searches for **three-letter sequences** that start with those two letters (e.g., `"go"` → `"goo"`, `"gon"`, `"gop"`, etc.).
    
3.  One is chosen (again, by frequency), and the third letter is added to the word.
    
4.  This continues by matching the **last two letters** of the current word with the **first two letters** of available sequences, adding one letter each time.
    
5.  Finally, the last two letters of the partially formed word are used to find a matching **ending** fragment, which is appended (also weighted by frequency).
    

Example flow:
1. Start with: "he"
2. Found sequences: "hel", "hep", "hen" (with respective weights)
3. Chose: "hep" → now word is "hep"
4. Next: match "ep" to sequences → choose and append next letter
5. Continue until desired length
6. Append suitable ending fragment
## 🎮 Usage
`generatePseudoWords(iterations, amount)` 
-   `iterations`_`(number)`_ – Roughly the length of each generated word (i.e., how many steps to build it)
-   `amount`_`(number)`_ – Number of pseudo-words to generate
Example:
```js
// Generate 3 pseudo-words with 5 construction steps each 
generatePseudoWords(5, 3); // Possible output: "matosis ocinate bleling" 
```
<br>

**License:** MIT
**Contributing:** Contributions welcome! Please feel free to submit a Pull Request.