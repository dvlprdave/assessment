var ctx = document.getElementById('myChart').getContext('2d');

const tweets = []
let wordgroupObj = {}

// Fetch JSON file locally and return the data
fetch('../test_feed.json')
  .then(res => res.json())
  .then(data => {
    handleTweetText(data)
    wordgroupObj = getWordCount(tweets)
    createChart()
  })
.catch(err => console.error(err));

// Could have broken down functions more for more reusable pieces
// Not sure if I could use regex next time. It has a learning curve

function handleTweetText(data) {
  for (var i = 0; i < data.content.length; i++) {
    const tweetHtml = data.content[i].content.bodyHtml;
    // If tweet exists, return it
    if(tweetHtml && tweetHtml != '') {
      // Regex to grab entire anchor tag
      const regEx = /<a(\s[^>]*)?>.*?<\/a>/ig
      // Replace anchor with empty string and remove empty space
      const splitTweetText = tweetHtml.replace(regEx, '').trim()
      const allWords = splitTweetText.split(' ')
      // tweets.push(splitTweetText) displays the entire tweet, but not sure if correct

      allWords.forEach(word => tweets.push(word))
    }
  }
}

function getWordCount(arr) {
  // Word vars
  const indWord = []
  const wordOccurrence = []
  const sortedWords = []
  let prev

  // Data groupObj and chart data vars
  const groupObj = {}
  const wordLabel = []
  const wordOccur = []

  arr.sort();

  for (var i = 0; i < arr.length; i++) {
      var currentWord = arr[i].toLowerCase()
      // Avoids duplicates by pushing words compared against prev
      if (currentWord !== prev) {
        indWord.push(currentWord)
          wordOccurrence.push(1)
      } else {
          wordOccurrence[wordOccurrence.length - 1]++
      }
      prev = currentWord
  }

  /*
  This was an alternate attempt, but I ran into issues
  
  const counts = {}
  const keyz = []

  function wordCount() {
    const allWords = tweets.join('\n')
    const tokens = allWords.split(/\W+/)

    for (let i = 0; i < tokens.length; i++) {
      var word = tokens[i].toLowerCase()

      if (counts[word] === undefined) {
        counts[word] = 1 
        keyz.push(word)
      } else {
        counts[word] = counts[word] + 1
      }
    } 
  }
  
  */

  // Pair individual words to its occurrence
  indWord.forEach((key, i) => groupObj[key] = wordOccurrence[i])
 
  for (let singleWord in groupObj) {
    sortedWords.push([singleWord, groupObj[singleWord]])
  }

  sortedWords.sort((a, b) => {
      return b[1] - a[1]
  });

  sortedWords.map(set => {
      wordLabel.push(set[0])
      wordOccur.push(set[1])
  })

  return {
      wordLabel: wordLabel,
      wordOccur: wordOccur
  }
}

// Chart
function createChart() {
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
      labels: wordgroupObj.wordLabel,
      datasets: [{
          label: 'Word Count',
          data: wordgroupObj.wordOccur,
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
})}