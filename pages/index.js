<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Key Quote Extractor</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        textarea { width: 100%; height: 200px; }
        #results, #highlightedAbstract { margin-top: 20px; }
        .highlight { background-color: yellow; }
        .ranking { font-weight: bold; color: #007bff; margin-right: 5px; }
    </style>
</head>
<body>
    <h1>Enhanced Key Quote Extractor</h1>
    <textarea id="abstract" placeholder="Paste your abstract here..."></textarea>
    <br>
    <button onclick="extractQuotes()">Extract Key Quotes</button>
    <div id="results"></div>
    <div id="highlightedAbstract"></div>

    <script>
    // List of common English stop words
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
      'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with'
    ]);

    function extractKeyQuotes(text, numSentences = 3) {
      // Split the text into sentences
      const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];

      // Tokenize words and remove stopwords
      const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
      const filteredWords = words.filter(word => !stopWords.has(word));

      // Calculate word frequencies
      const wordFreq = {};
      filteredWords.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });

      // Calculate sentence scores
      const sentenceScores = sentences.map(sentence => {
        const sentenceWords = sentence.toLowerCase().match(/\b(\w+)\b/g) || [];
        const score = sentenceWords.reduce((total, word) => total + (wordFreq[word] || 0), 0);
        return { sentence, score };
      });

      // Sort sentences by score and get top N
      const keyQuotes = sentenceScores
        .sort((a, b) => b.score - a.score)
        .slice(0, numSentences);

      return keyQuotes;
    }

    function extractQuotes() {
        const abstract = document.getElementById('abstract').value;
        const keyQuotes = extractKeyQuotes(abstract);
        
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<h2>Key Quotes:</h2>';
        keyQuotes.forEach((quote, index) => {
            resultsDiv.innerHTML += `<p><span class="ranking">${index + 1}.</span> ${quote.sentence.trim()}</p>`;
        });

        // Highlight sentences in the original abstract
        const highlightedAbstractDiv = document.getElementById('highlightedAbstract');
        highlightedAbstractDiv.innerHTML = '<h2>Highlighted Abstract:</h2>';

        let highlightedText = abstract;
        keyQuotes.forEach((quote, index) => {
            const escapedSentence = quote.sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSentence})`, 'gi');
            highlightedText = highlightedText.replace(regex, `<span class="highlight"><span class="ranking">${index + 1}</span>$1</span>`);
        });

        highlightedAbstractDiv.innerHTML += `<p>${highlightedText}</p>`;
    }
    </script>
</body>
</html>
