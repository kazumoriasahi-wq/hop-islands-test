(function(root){'use strict';
function create(sdk){const hosted=!!sdk?.IN_PLAYABLES_ENV;let paused=false,audio=!hosted,loaded=false,dirty=false,writing=null,version=0;let data={schema:1,best:0,sound:true};const listeners=new Set();const emit=()=>listeners.forEach(fn=>fn());
function validate(raw){if(!raw)return{schema:1,best:0,sound:true};const d=JSON.parse(raw);if(d.schema!==1||!Number.isSafeInteger(d.best)||d.best<0||typeof d.sound!=='boolean')throw Error('Invalid save');return d;}
async function flush(final=false){if(!loaded||!dirty||(paused&&!final))return;if(writing){await writing;if(dirty&&(final||!paused))return flush(final);return;}const rev=version,snapshot=JSON.stringify(data);writing=Promise.resolve().then(async()=>{try{if(hosted)await sdk.game.saveData(snapshot);else localStorage.setItem('hop_islands_v1',snapshot);if(version===rev)dirty=false;}catch{}finally{writing=null;}});await writing;}
if(hosted){audio=!!sdk.system.isAudioEnabled();sdk.system.onAudioEnabledChange(v=>{audio=!!v;emit();});sdk.system.onPause(()=>{paused=true;emit();void flush(true);});sdk.system.onResume(()=>{paused=false;emit();void flush();});}
return{hosted,on:fn=>listeners.add(fn),get paused(){return paused;},get audio(){return audio;},get data(){return data;},async init(){let raw;if(hosted)raw=await sdk.game.loadData();else try{raw=localStorage.getItem('hop_islands_v1');}catch{}data=validate(raw);loaded=true;return data;},update(best,sound){if(!loaded)return;data={schema:1,best:Math.max(data.best,best),sound};dirty=true;version++;void flush();},flush,firstFrame(){if(hosted)sdk.game.firstFrameReady();},ready(){if(hosted)sdk.game.gameReady();}};
}
root.HopHost={create};if(typeof module!=='undefined')module.exports={create};
})(globalThis);

