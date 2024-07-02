
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Key Quote Extractor</title>
    <style>
      :root {
            --primary-color: #2c3e50;
            --secondary-color: #34495e;
            --accent-color: #3498db;
            --background-color: #ecf0f1;
            --text-color: #333;
            --highlight-color: #f39c12;
        }
        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: var(--primary-color);
            text-align: center;
            padding: 20px 0;
            margin: 0;
            background-color: var(--secondary-color);
            color: #fff;
        }
        textarea {
            width: 100%;
            height: 200px;
            padding: 10px;
            border: 1px solid var(--secondary-color);
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 10px;
        }
        button {
            background-color: var(--accent-color);
            color: #fff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #2980b9;
        }
        #results, #highlightedAbstract {
            margin-top: 20px;
            background-color: #fff;
            padding: 15px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h2 {
            color: var(--primary-color);
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 10px;
        }
        .highlight {
            background-color: var(--highlight-color);
            padding: 2px 0;
        }
        .ranking {
            font-weight: bold;
            color: var(--accent-color);
            margin-right: 5px;
        }
        p {
            margin-bottom: 10px;
        }
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
