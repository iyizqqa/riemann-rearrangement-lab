/** Two independent ascending-index streams. Every original index is used at most once. */
export class TermSource {
  constructor(series,{scanLimit=2_000_000}={}){this.series=series;this.scanLimit=scanLimit;this.reset()}
  reset(){this.next={positive:1,negative:1};this.used=new Set()}
  take(sign){
    const key=sign>0?'positive':'negative';let i=this.next[key];
    while(i<=this.scanLimit){const value=this.series.term(i);
      if(!Number.isFinite(value))throw Error('Некорректный член ряда');
      if(Math.sign(value)===Math.sign(sign)&&!this.used.has(i)){
        this.used.add(i);this.next[key]=i+1;return {originalIndex:i,value,sign:Math.sign(sign)};
      }i++;
    }
    throw Error('Достигнут предел поиска членов нужного знака');
  }
}
