import {RearrangementEngine} from './engine.js';
export class Analytics {
  constructor(epsilon=0.01){this.epsilon=epsilon;this.reset()}
  reset(){this.minError=Infinity;this.firstHit=null;this.streak=0;this.crossings=0;this.lastOvershoot=null;this.maxOvershoot=0;this.overshoots=[];this.positive=0;this.negative=0}
  ingest(r){if(r.sign>0)this.positive++;else this.negative++;
    if(r.error!==null){this.minError=Math.min(this.minError,r.error);if(r.error<this.epsilon){this.streak++;if(this.firstHit===null)this.firstHit=r.step}else this.streak=0}
    if(r.crossing){this.crossings++;this.lastOvershoot=r.crossing.overshoot;this.maxOvershoot=Math.max(this.maxOvershoot,this.lastOvershoot);this.overshoots.push(r.crossing.overshoot)}
  }
}
/** First hit and last observed exit; finite-prefix statistics, not convergence claims. */
export function epsilonSweep(series,target,epsilons,maxSteps){
  const result=epsilons.map(epsilon=>({epsilon,firstHit:null,lastExit:null,observedTailStart:null}));
  // Single numerical trajectory is sufficient for all tolerances.
  const engine=new RearrangementEngine(series,{target,maxSteps});
  while(!engine.finished){const r=engine.step();if(!r)break;
    for(const entry of result){if(r.error<entry.epsilon){if(entry.firstHit===null)entry.firstHit=r.step}
      else entry.lastExit=r.step;
    }
  }
  for(const entry of result){entry.observedTailStart=entry.lastExit===null?(entry.firstHit===null?null:0):
    (entry.lastExit<engine.steps?entry.lastExit+1:null)}
  return {rows:result,computedSteps:engine.steps};
}
