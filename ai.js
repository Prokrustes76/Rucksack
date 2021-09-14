class AI {
  constructor() {
    this.posSize        = 4
    this.anzRuns        = 300000 
    this.mutaProb       = .10
    this.allowIncrease  = true
  }

  init() {
    this.topTwo       = [{score: Infinity}, 
                         {scores: Infinity}]
  }

  action() {
    this.init()
    for (let j = 0; j < this.anzRuns; j++) {
      for (let i = 0; i < this.posSize; i++) {
        bowls = [[], [], [], [], [], [], [], [], [], [], [], []]

        j == 0 ? this.randomFill() : 
                 this.selectedFill()

        this.checkTopTwo(j)
      }
    }
  }

  randomFill() {
    for (let p of pieces) {
        p.myBowl = Math.floor(Math.random() * anzBowls)
        bowls[p.myBowl].push(p.id)
    }
  }

  selectedFill() {
    for (let i = 0; i < anzBowls; i++) 
      for (let nr of this.topTwo[0].bowls[i])
        pieces[nr].myBowl = this.doesMutate() ? Math.floor(Math.random() * anzBowls) : i

    for (let p of pieces) 
      bowls[p.myBowl].push(p.id)
  }

  doesMutate() {
    return Math.random() < this.mutaProb
  }

  calcScore() {
    let score = 0
    for (let b of bowls) {
      score += Math.pow(Math.abs(Math.floor(anzPieces / anzBowls) - b.length), 2)
    }
    let list,
        criteria
    
    for (let bowl of bowls) {
      list = [[], [], [], [], []]
      for (let b of bowl) {
        b = pieces.find(a => a.id == b) 
        criteria = [b.content, b.size, b.contentColor, b.frameColor, b.fontColor]

        for (let i = 0; i < list.length; i++) {
          if (!list[i].includes(criteria[i]))
            list[i].push(criteria[i])
        }
      }
      for (let l of list)
      score += l.length - 1
      
    } 
    return score
  }

  checkTopTwo(j) {
    let score = this.calcScore()
    if (score <= this.topTwo[0].score) {

      if (this.allowIncrease)
        this.anzRuns = [5000000, 2000000, 700000][score - 48] || this.anzRuns
      if (score < this.topTwo[0].score) console.log(j,score)
      this.topTwo[1] = this.pushNewRecord(this.topTwo[0])
      this.topTwo[0] = this.pushNewRecord()
    }
    else if (score <= this.topTwo[1].score)
      this.topTwo[1] = this.pushNewRecord()
  }

  pushNewRecord(val) {
    let list = [[], [], [], [], [], [], [], [], [], [], [], [],]
    if (!val) {
      for (let p of pieces)
        list[p.myBowl].push(p.id)
    }

    return {
      bowls  : val ? val.bowls  : list,
      score  : val ? val.score  : this.calcScore()
    }
  }
}
