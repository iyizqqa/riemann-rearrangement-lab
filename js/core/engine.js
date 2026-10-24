import {TermSource} from './termSource.js';
export const MODES=Object.freeze({finite:'finite',plus:'plus',minus:'minus'});
/** Pure numerical engine; no DOM or plotting. */
export class RearrangementEngine {
  constructor(series,{mode='finite',target=0,maxSteps=10000}={}){
    if(!Object.values(MODES).includes(mode))throw Error('Неизвестный режим');
    if(mode==='finite'&&!Number.isFinite(target))throw Error('L должно быть конечным');
    if(!Number.isSafeInteger(maxSteps)||maxSteps<1)throw Error('Неверный предел шагов');
    this.series=series;this.config={mode,target,maxSteps};this.reset();
  }
  reset(){
    this.source=new TermSource(this.series);this.sum=0;this.steps=0;this.crossings=[];this.usedPositive=0;this.usedNegative=0;
    this.stage=1;this.stagePhase='main';this.blockStart=0;
    this.direction=this.config.mode==='finite'?(this.sum<=this.config.target?1:-1):(this.config.mode==='plus'?1:-1);
    this.finished=false;this.reason='';
  }
  step(){
    if(this.finished)return null;
    if(this.steps>=this.config.maxSteps){this.finished=true;this.reason='Достигнут предел шагов';return null}
    const {mode,target}=this.config;const directionBefore=this.direction;
    const before=this.sum;const term=this.source.take(directionBefore);
    const after=before+term.value;
    if(!Number.isFinite(after)||after===before){this.finished=true;this.reason='Ограничение точности чисел Number';return null}
    this.sum=after;this.steps++;
    if(term.sign>0)this.usedPositive++;else this.usedNegative++;
    let crossing=null;let milestone=null;
    if(mode==='finite'){
      const crossed=directionBefore>0?after>target:after<target;
      if(crossed){
        crossing={number:this.crossings.length+1,step:this.steps,from:this.blockStart,to:after,side:directionBefore,overshoot:Math.abs(after-target),lastTerm:Math.abs(term.value),originalIndex:term.originalIndex};
        this.crossings.push(crossing);this.direction=-directionBefore;this.blockStart=after;
      }
    }else{
      // Each stage uses a finite block of the main sign to exceed ±stage,
      // then consumes exactly one opposite-sign term. Thus both streams are exhausted.
      const main=mode==='plus'?1:-1;
      if(this.stagePhase==='main' && main*after>this.stage){
        milestone={stage:this.stage,threshold:main*this.stage,step:this.steps,value:after};
        this.stagePhase='opposite';this.direction=-main;
      }else if(this.stagePhase==='opposite'){
        this.stage++;this.stagePhase='main';this.direction=main;
      }
    }
    if(this.steps>=this.config.maxSteps){this.finished=true;this.reason='Достигнут предел шагов'}
    return {step:this.steps,originalIndex:term.originalIndex,term:term.value,sign:term.sign,before,after,
      error:mode==='finite'?Math.abs(after-target):null,directionBefore,directionAfter:this.direction,
      crossing,milestone,stage:this.stage,stagePhase:this.stagePhase};
  }
}
