function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function currentLeniance(){
    const rbs = document.querySelectorAll('input[name="choice"]')
    let selectedValue;
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue = rb.value;
                    break;
                }
            }
    return selectedValue
}

class PotOddsQuiz {

    constructor(potSize, toCall){
        this.potSize = potSize;
        this.toCall = toCall;
        this.minPot = 10;
        this.maxPot = 100;
        this.bet_sizes = [0.50, 0.75, 0.85, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
        this.correct = 0
        this.incorrect = 0
        this.lastAnswer = -1
        this.prob_regex = /[1|0]?\.\d+/g
        this.odds_regex = /(\d+)\:(\d)/g
        this.percent_regex = /\d{1,3}/g
    }
    
    new_question() {
        var newPotSize = randomIntFromInterval(this.minPot, this.maxPot)
        var newBetSize = Math.round(this.bet_sizes[Math.floor(Math.random() * this.bet_sizes.length)] * this.potSize)
        document.getElementById("current-pot").innerHTML = newPotSize
        document.getElementById("bet").innerHTML = newBetSize
        this.potSize = newPotSize
        this.toCall = newBetSize
        this.lastAnswer = -1
    }

    odds_string_to_prop(oddsString){
        var sep = oddsString.split(":")
        var a = parseInt(sep[0])
        var b = parseInt(sep[1])
        return a / (a+b)
    }

    parse_answer(answer){
        var odds = answer.match(this.odds_regex)
        if (odds){
            return this.odds_string_to_prop(odds[0])
        }
        var prob = answer.match(this.prob_regex)
        if (prob){
            return parseFloat(prob)
        }
        var percent = answer.match(this.percent_regex)
        if (percent){
            return parseFloat(percent)
        }
        alert("Please enter a valid percent, odd, or probability.")
        return -1
    }

    score_answer(leniance){
        var answer = this.parse_answer(document.getElementById("user-answer").value)
        if (answer == -1){
            return
        }
        var correctAnswer = (this.toCall / (this.potSize + this.toCall)).toFixed(3)
        var offBy = Math.abs(correctAnswer - answer)
        var offByPercent = (offBy / correctAnswer).toFixed(3)
        if (offByPercent <= leniance){
            document.getElementById('result').innerHTML= "Correct!" + " " + "True Answer = " + String(correctAnswer)
            this.correct = this.correct + 1
            this.lastAnswer = -1
            this.new_question()
        } else{
            var distance = ""
            if (this.lastAnswer != -1 & this.lastAnswer != offByPercent){
                if (this.lastAnswer > offByPercent){
                    distance = "But you are getting closer!"
                }
                else{
                    distance = "And you are getting further!"
                }
            }
            document.getElementById('result').innerHTML = "Incorrect! " + distance
            this.incorrect = this.incorrect + 1
            this.lastAnswer = offByPercent
        }
        document.getElementById("correct-count").innerHTML = this.correct
        document.getElementById("incorrect-count").innerHTML = this.incorrect
    }


}

let quiz = new PotOddsQuiz(10, 5)

document.getElementById("newQ").addEventListener("click", function(){quiz.new_question()})
document.getElementById("submit").addEventListener("click", function(){quiz.score_answer(currentLeniance())})
quiz.new_question()
