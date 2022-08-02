(()=>{var e={5193:(e,t,s)=>{const r=s(6217),n=s(4408);e.exports={record:async function(e,t){const s=new r;s.load(e.body.session_id),n.isRecording()?t.send({status:"recording",message:"Already recording."}):(await n.record(s,e.body.side),t.send({status:"recording"}))},stop:async function(e,t){let s=await n.stop();t.send(s)}}},202:(e,t,s)=>{const r=s(5653),n=s(9450);e.exports={proxyHandler:async function(e){e.register(n,{upstream:"https://burntable.com",http2:!1,prefix:"/bt",replyOptions:{rewriteRequestHeaders:(e,t)=>{console.log("rewriteRequestHeaders",r.getBearer());let s={...t,authorization:"Bearer "+r.getBearer(),accept:"application/json"};return delete s.dspin,s},rewriteHeaders:e=>({...e,"x-bt-token":r.getBearer()})}})},authHandler:async function(e){e.put("/token",(async(e,t)=>{const s=await r.setBearer(e.body.token);t.send({token:s})})),e.delete("/token",(async(e,t)=>{await r.deleteBearer(),t.send({result:"disconnected"})}))}}},7534:(e,t,s)=>{const r=s(6737);e.exports={index:async function(e,t){t.send(await r.index())},update:async function(e,t){if("object"!=typeof e.body)throw new Error("Missing application/json Content-type header");t.send(await r.update(e.body))}}},6863:(e,t,s)=>{s(7147);const r=s(6217);e.exports={upload:async function(e,t){let s=e.params.id,n=new r;n.load(s);try{const t=await e.saveRequestFiles();console.log("files",t),await n.updateImage(t[0].filepath)}catch(e){console.error("upload request error",e.message,e)}t.send({...n})}}},8558:(e,t,s)=>{const r=s(5898);e.exports={get:async function(e,t){const s=await r.getPinHash();let n={protected:!!s,authenticated:!s||!(!e.headers.dspin||e.headers.dspin!==s)};t.send(n)},post:async function(e,t){const s=await r.updatePinHash(null,e.body.new_pin);t.send({result:"success",dspin:s})},put:async function(e,t){const s=await r.updatePinHash(e.body.current_pin,e.body.new_pin);t.send({result:"success",dspin:s})},del:async function(e,t){},authentication:async function(e,t){const s=await r.authenticate(e.body.pin);t.send({result:"success",dspin:s})}}},3666:(e,t,s)=>{const r=s(3271),n=s(5653),o=s(6552),i=s(6217),a=s(7567);e.exports={play:async function(e,t){try{if("Session"===e.body.context_type){let s=new i;await s.load(e.body.context_id);let r=new a({context_type:"Session",context_id:s.id,rate:e.body.recording.rate,format:e.body.recording.format,bits:e.body.recording.bits,album:s.title,title:`Side ${e.body.recording.side}`,uri:e.body.recording.file,image:s.image,context:s});await o.play(r),t.send({playable:{...r}})}else if("Drop"===e.body.context_type){const s=await n.getClient().post("plays",{drop_id:e.body.context_id,side:e.body.side,format:"aac"});let r=s.data.drop,i=new a({title:`Side ${e.body.side}`,track:e.body.side,album:r.release_version.title,artist:r.release_version.artist.title,image:r.photo.url,uri:s.data.audio.url,id_discogs:r.release_version.id_discogs,rate:96e3,bits:24,format:s.data.audio.codec,context_type:"Drop",context_id:r.id,context:r});await o.play(i),t.send({playable:{...i}})}}catch(e){t.send({error:e.message})}},pause:async function(e,t){await r.pause()},stop:async function(e,t){try{await o.stop()}catch(e){}t.send({status:"stopped"})},init:async function(e,t){await o.init(),t.send({init:!0})}}},6105:(e,t,s)=>{const r=s(3489),{ValidationError:n}=s(5636);e.exports={index:async function(e,t){t.send(r.all())},update:async function(e,t){let s={},o=r.keys();console.log("validPreferences",o);for(const t of Object.keys(e.body))if(!o.indexOf(t)<0)console.error("Invalid key for preferences",t);else try{r.set(t,e.body[t])}catch(e){s[t]=[e.message]}if(Object.keys(s).length>0)throw new n("Validation errors.",s);t.send(r.all())}}},2945:(e,t,s)=>{const r=s(6217),n=s(3619),o=s(7147);s(1017),e.exports={index:async function(e,t){console.log("GET /sessions",`${n.dataDir}/sessions`);let s=o.readdirSync(`${n.dataDir}/sessions`,{withFileTypes:!0}).filter((e=>e.isDirectory()&&e.name.indexOf(".")<0)),r=s.map((e=>JSON.parse(o.readFileSync(`${n.dataDir}/sessions/${e.name}/session.json`,"utf-8")))).sort((function(e,t){return parseFloat(t.updated_at)-parseFloat(e.updated_at)}));t.send({data:r,total:s.length})},store:async function(e,t){let s=e.body.title,n=new r;return n.create(s),n.save(),{...n}},read:async function(e,t){let s=e.params.id,n=new r;n.load(s),t.send({...n})},update:async function(e,t){let s=e.params.id,n=new r;n.load(s),n.update(e.body),t.send({...n})},destroy:async function(e,t){let s=e.params.id;try{o.rmSync(`${n.dataDir}/sessions/${s}`,{recursive:!0})}catch(e){console.log("Nothing to delete")}t.send({id:s})},deleteRecording:async function(e,t){let s=e.params.id,n=e.params.side,o=new r;o.load(s),await o.deleteSide(n),t.send({...o})},getRecording:async function(e,t){let s=e.params.id,n=e.params.side,o=new r;o.load(s);const i=await o.getRecording(n);let a=await i.getInfo();console.log("info",a),t.send({...i,info:a})}}},5852:(e,t,s)=>{const r=s(6217),{ValidationError:n}=s(5636),o=s(53);e.exports={store:async function(e,t){for(const t of["from","to"])if(0!==e.body[t]&&(!e.body[t]||isNaN(parseFloat(e.body[t]))))throw new n("Validation errors.",{[t]:[`${t} is required and must be numeric`]});try{let s=new r;await s.load(e.params.id);let n=new o(s,e.params.side);t.send({job:await n.trim(e.body.from,e.body.to)})}catch(e){throw new n("Validation errors.",{session_id:[e.message]})}}}},7232:(e,t,s)=>{const{spawn:r,exec:n,execSync:o}=s(2081);e.exports={store:async function(e,t){try{let e=await async function(){return new Promise(((e,t)=>{n("sudo apt-get --yes install mp3splt",((e,t,s)=>{e&&console.error("Failed to install startup packages")})),n("cd /home/ds/ds-fw-dist && git fetch --all && git reset --hard origin/master && yarn install && sudo chmod 755 ./init.sh && sudo chmod 755 ./update.sh && sudo chmod 755 ./wifi-connect/start-wifi-connect.sh",((s,r,n)=>{s?t(s):e(r)}))}))}();t.send({message:"Update completed",result:e}),async function(){return new Promise(((e,t)=>{n("sudo service ds restart",((s,r,n)=>{s?t(s):e(r)}))}))}().then((e=>{console.log(`I don't think you'll ever see this...${e}`)}))}catch(e){t.send({message:"Update failed",result:JSON.stringify(e)})}}}},3361:(e,t,s)=>{const{spawn:r,exec:n,execSync:o}=s(2081),{EventEmitter:i}=s(1239);s(3489),e.exports=new class extends i{jackd;duration;lastSampleRate;sampleRateMap={48e3:{n:4,p:2048,m0:"dl",m1:"dl"},96e3:{n:4,p:4096,m0:"dh",m1:"dl"},192e3:{n:8,p:8192,m0:"dl",m1:"dh"}};constructor(){super();try{o("export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/dbus/system_bus_socket")}catch(e){console.error("Failed to export DBUS_SESSION_BUS_ADDRESS")}}async init(){}async isRunning(e){let t=process.platform,s="";switch(t){case"win32":s="tasklist";break;case"darwin":s=`ps -ax | grep ${e}`;break;case"linux":s="ps -A"}return this.emit("debug",`Checking jackd process status with ${s}`),new Promise(((t,r)=>{n(s,((s,r,n)=>{let o=r.toLowerCase().indexOf(e.toLowerCase())>-1;this.emit("debug",`Result of JackManager.isRunning(): ${o}`),t(o)}))}))}async ensure(e,t){let s=this;if(this.jackd&&!t)return this.emit("debug","Jackd is already running, no forceRestart requested."),this.jackd;if(await this.isRunning("jackd")){if(!t)return void this.emit("debug","jackd is already running");this.emit("debug","Jack ensure() forceRestart, killing jackd"),await this.kill()}return!e||[48,96,192].indexOf(e)<0?(this.emit("debug","JackManager.ensure received no sampleRate, using default."),e=96e3):e*=1e3,this.lastSampleRate=e,await this.changeSampleRate(e),this.emit("debug",`JackManager.ensure starting with a sampleRate of ${e}.`),this.jackd=r("jackd",["-d","alsa","-r",e,"-n",this.sampleRateMap[e].n,"-p",this.sampleRateMap[e].p,"-C","hw:CARD=GenericStereoAu,DEV=1","-P","hw:CARD=GenericStereoAu,DEV=0"],{env:{...process.env,JACK_NO_AUDIO_RESERVATION:"1",DBUS_SESSION_BUS_ADDRESS:"unix:path=/run/dbus/system_bus_socket"}}),new Promise(((e,t)=>{let r=setTimeout((()=>{t("Failed to start jackd within 10 seconds.  Check error logs and contact support.")}),1e4);this.jackd.on("exit",(function(e,t){s.jackd=null,e?s.emit("exit",`jackd exited with code ${e}`):t?s.emit("exit",`jackd exited with signal ${t}`):s.emit("exit","jackd exited on completion")})),this.jackd.on("close",(function(e,t){s.jackd=null,s.emit("close",`jackd closed with code ${e} and signal ${t}`)})),this.jackd.stdout.on("data",(function(t){let n=t.toString();console.log("jackd stdout",t.toString()),n.indexOf("periods for playback")>-1&&(clearTimeout(r),setTimeout((()=>{e("jackd started")}),1e3)),s.emit("data",t)})),this.jackd.stderr.on("data",(function(e){console.log("jackd stderr",e.toString());try{s.emit("error",e)}catch(e){console.log("jackd unhandled error")}}))}))}async changeSampleRate(e){if(!this.sampleRateMap[e])throw console.error(`JackManager.changeSampleRate() not a valid rate: ${e}`),Error(`${e} is not a valid sample rate`);o("raspi-gpio set 5 op pn dl"),o("raspi-gpio set 26 op pn dl"),o(`raspi-gpio set 6 op pn ${this.sampleRateMap[e].m0} && raspi-gpio set 13 op pn ${this.sampleRateMap[e].m1}`),o("raspi-gpio set 26 op pn dh"),o("raspi-gpio set 5 op pn dh")}async kill(){try{this.emit("debug","Killing jackd process"),o("killall jackd")}catch(e){console.log("jackd not running...")}}async isJackdRunning(){return this.isRunning("jackd")}async killIfRunning(){return!!await this.isRunning("jackd")&&(await this.kill(),!0)}}},267:(e,t,s)=>{e.exports=class{dataDir;recordingProcess;meteringProcess;averageLevelInterval;averageLevelIntervalMs=3e3;averageLevelSamples=[];averageLevel=0;constructor(e){this.dataDir=e.dataDir}async stop(){return this.recordingProcess.kill("SIGTERM")}meter(e){const t=this,{spawn:r}=s(2081);this.averageLevelInterval=setInterval((()=>{this.setAverageLevel(this.averageLevelSamples.reduce(((e,t)=>e+t),0)/this.averageLevelSamples.length),this.averageLevelSamples=[]}),this.averageLevelIntervalMs),this.meteringProcess=r("arecord",["-D","pulse","-f","dat","-c","2","-vv","/dev/null"],{stdio:["ignore","ignore","pipe"]}),this.meteringProcess.stderr.on("data",(function(s){let r=parseInt(String(s).substr(54,2));isNaN(r)||(t.averageLevelSamples.push(r),e&&e(r))}))}setAverageLevel(e){this.averageLevel=e,console.log("Average level",e)}async recordSideForSession(e,t){return this.record(`${t.id}-${e}`)}async record(e){const{spawn:t}=s(2081);return new Promise(((s,r)=>{this.recordingProcess=t("parec",["--rate=96000","--format=s24le","-d","alsa_input.platform-soc_sound.stereo-fallback","|","sox","-t","raw","-b","24","-e","signed","-c","2","-r","96000","-",`${this.dataDir}/${e}.wav`],{stdio:["ignore","ignore","pipe"]}),this.recordingProcess.on("close",((e,t)=>{s({code:e,signal:t})}))}))}}},5898:(e,t,s)=>{const r=s(7096),n=(s(1017),s(7147)),o=s(3619),{ValidationError:i}=s(5636),a=`${o.rootDataDir}/.PIN`;let c,l=null,d=0;async function p(e){const t=await r.hash(String(e),5);return n.writeFileSync(a,t,{encoding:"utf8",flag:"w"}),l=t,t}async function u(){if(l)return l;try{if(n.existsSync(a))return l=n.readFileSync(a,"utf8"),l}catch(e){return null}}e.exports={updatePinHash:async function(e,t){if(!/[0-9]{4}/.test(t))throw new i("Current pin entered is incorrect.",{new_pin:["Must be 4 numbers."]});const s=await u();if(!s)return console.log("updatePinHash has no currentPinHash, setting to newPin",t),p(t);if(!await r.compare(String(e),String(s)))throw new i("Current pin entered is incorrect.",{current_pin:["Incorrect pin entered."]});return p(t)},getPinHash:u,authenticate:async function(e){if(d++,d>=5&&(c&&clearTimeout(c),c=setTimeout((()=>{d=0}),15e3),1))throw new i("Please try again in 15 seconds.",{pin:["Please wait 15 seconds and try again..."]});const t=await u();if(!t)throw new i("Current pin entered is incorrect.",{pin:["Please set a pin before trying to authenticate."]});if(!await r.compare(String(e),String(t)))throw new i("Incorrect pin sorry.",{current_pin:["Incorrect pin entered."]});return t}}},5653:(e,t,s)=>{s(1017);const r=s(7147),n=s(2167),o=s(3619);let i=null;const{ValidationError:a}=s(5636),c=`${o.rootDataDir}/.BTBEARER`;let l=null;function d(){if(console.log("burntable.getBearer()"),l)return console.log("using bearer cache",l),l;try{if(r.existsSync(c))return l=r.readFileSync(c,"utf8"),console.log("Setting BT_BEARER_CACHE",l),l;console.log("No bearer file --",c)}catch(e){return console.log("No bearer file",c),null}}e.exports={getBearer:d,setBearer:async function(e){return r.writeFileSync(c,e,{encoding:"utf8",flag:"w"}),l=e,e},deleteBearer:async function(){try{r.rmSync(c),l=null}catch(e){console.error("Failed to delete burntable bearer file.")}return!0},getClient:function(){return i||(i=n.create({baseURL:"https://burntable.com/api",headers:{accept:"application/json","content-type":"application/json"}}),i.defaults.headers.authorization="Bearer "+d(),console.log("getClient axiosInstance.defaults.headers",i.defaults.headers),i)}}},9549:(e,t,s)=>{const r=s(2544);r.setMode(r.MODE_BCM);const n=s(4525),o=r.promise;let i=null,a=0,c=!0,l=null,d=null;e.exports={observe:async function(e){await o.setup(3,r.DIR_IN,r.EDGE_BOTH),o.on("change",(function(t,s){c!==s&&(c=s,!1===s?i=setInterval((()=>{a++,4===a?"wants_sleep"!=l&&(l="wants_sleep",n.flashAll(1,500),e("wants_sleep")):10===a?"wants_reboot"!=l&&(l="wants_reboot",n.flashAll(2,500),e("wants_reboot")):29===a?"wants_factory_reset"!=l&&(n.flashAll(8,250),l="wants_factory_reset",e("wants_factory_reset")):a>40&&(a=0,l=null,clearInterval(i))}),1e3):(a>29?"factory_reset"!=l&&(l="factory_reset",e("factory_reset")):a>=10?"reboot"!=l&&(l="reboot",e("reboot")):a>=4?"sleep"!=l&&(l="sleep",e("sleep")):"stop"!=l&&(l="stop",e("stop")),null===d&&(d=setTimeout((()=>{l=null,clearTimeout(d),d=null}),250)),a=0,i&&(console.log("clearInterval holdInterval"),clearInterval(i),i=null)))}))}}},2353:(e,t,s)=>{const{exec:r}=s(2081);e.exports=class{session_id;file;reference;waveform;side;seconds;rate;format;bits;trimmed=!1;trimmedFrom;trimmedTo;filesize;constructor(e){Object.keys(e).forEach((t=>{this[t]=e[t]}))}async declick(){}async getInfoForAudio(e){return new Promise(((t,s)=>{r(`ffprobe ${this[e]}`,((e,r,n)=>{if(e)return s(e.message);if(n){let e={seconds:0,rate:null,format:null,bits:null};const s=/Duration: (\d{2}):(\d{2}):(\d{2}).(\d{1,2}),/gm.exec(n);s&&s[1]&&(e.seconds+=3600*parseInt(s[1]),e.seconds+=60*parseInt(s[2]),e.seconds+=parseInt(s[3]),e.seconds+=parseInt(s[4])/100);const r=/Audio: ([a-z0-9]+),\s?(\d+)\s?Hz/gm.exec(n);r&&r[1]&&(e.format=r[1].trim(),e.rate=parseInt(r[2]));const o=/Audio:.+\((\d+)\sbit\)/gm.exec(n);o&&o[1]&&(e.bits=parseInt(o[1])),t(e)}}))}))}async syncFileInfo(){const e=await this.getInfoForAudio("file");return Object.keys(e).forEach((t=>{this[t]=e[t]})),e}async getInfo(){const e=await this.getInfoForAudio("file");Object.keys(e).forEach((t=>{this[t]=e[t]}))}}},6217:(e,t,s)=>{const r=s(2345),n=s(7147),o=s(3619),i=s(2353);e.exports=class{id;drop_id;id_discogs;title;description;release_version;created_at;updated_at;recordings=[];uploads=[];image;constructor(){}ensureRecording(e){let t=this.recordings.findIndex((t=>t.side===e.side));t>-1?this.recordings[t]={...e}:this.recordings.push({...e})}ensureUpload(e){this.uploads.push(e)}create(e){const t=Math.round(Date.now()/1e3);this.id=t,this.title=e,this.drop_id=null,this.created_at=t,this.updated_at=t,this.save()}update(e){if(!this.id)throw new Error("Cannot update without id");const t=["title","description","id_discogs"];for(const s of t)e[s]&&(this[s]=e[s]);return this.save()}load(e){let t=this;const s=r.get(`sessions.${e}.session`);if(!s)throw new Error(`Invalid session id ${e}`);Object.keys(s).forEach((e=>{t[e]=s[e]}))}save(){return r.put(`sessions.${this.id}.session`,{...this}),this.toJSON()}async deleteSide(e){let t=this.recordings.findIndex((t=>t.side===e));if(t<0)return!1;let s=new i(this.recordings[t]),r=[s.file,s.waveform,s.reference];s.trimmed;for(const e of r)try{n.unlinkSync(e)}catch(t){console.log(`Didn't delete ${e} because it didn't exist`)}try{return this.recordings.splice(t,1),this.save(),!0}catch(e){return console.error(e),!1}}async getRecording(e){let t=this.recordings.findIndex((t=>t.side===e));if(t<0)throw new Error("No side found.");return new i(this.recordings[t])}getSessionDir(){return`${o.dataDir}/sessions/${this.id}`}async updateImage(e){try{const t=s(7441);let r=`${this.getSessionDir()}/image.jpg`,n=await t(e).resize(1200,1200).jpeg({quality:70}).toFile(r);console.log("sharp image ",n),this.image=r,this.save()}catch(e){}}toJSON(){return{...this}}}},4408:(e,t,s)=>{const{EventEmitter:r}=s(1239),n=s(7147),o=s(2353),i=s(3361),a=s(4525),c=s(4386),l=s(3619),d=s(3489),p=s(1041),{exec:u,execSync:g,spawn:h}=s(2081);e.exports=new class extends r{duration;jack_capture;flacFile;levelReportingInterval;secondsReportingInterval;ledInterval;waveFormSourceFile;jackManager;preferredSampleRate;preferredFormat;preferredAutoStopSeconds;session;side;seconds;constructor(){super(),this.jackManager=i,this.preferredFormat=d.get("captureFormat"),this.preferredSampleRate=1e3*d.get("captureSampleRate"),this.preferredAutoStopSeconds=d.get("captureAutoStopSeconds")}async record(e,t){let s=this;if(console.log("Transport.record()",{session:e,side:t}),this.jack_capture)return void console.log("Transport jack_capture already exists. Aborting.");try{await this.jackManager.ensure(this.preferredSampleRate,!0),console.log(`Transport.record() jackd is running at ${this.preferredSampleRate}.`),await new Promise((e=>setTimeout(e,1e3)))}catch(e){throw new Error(`Could not ensure jack: ${e.message}`)}if(this.seconds=0,!e||!e.id)throw new Error("There is no session id");if(!t)throw new Error("There is no side (like A, B, C, D, etc...)");this.side=t,this.session=e;let r=d.get("captureFormat");console.log("Transport preferences captureFormat",r);let o="flac"===r?"flac":"alac",i=`${l.dataDir}/sessions/${this.session.id}/audio`;n.existsSync(i)||n.mkdirSync(i,{recursive:!0}),this.flacFile=`${i}/${t}.${o}`;let a=`-c 2 -p system:capture* -f ${r} --hide-buffer-usage --silent --meterbridge -fn ${this.flacFile}`;console.log(`jack_capture ${a}`),this.jack_capture=h("jack_capture",a.split(" ")),this.jack_capture.on("exit",(function(e,t){s.jack_capture=null,console.error(`jack_capture exited with code ${e} and signal ${t}`),s.emit("exit",`jack_capture exited with code ${e} and signal ${t}`)})),this.jack_capture.on("close",(function(e,t){s.jack_capture=null,s.secondsReportingInterval&&clearInterval(s.secondsReportingInterval),s.levelReportingInterval&&clearInterval(s.levelReportingInterval),console.error(`jack_capture closed with code ${e} and signal ${t}`),s.emit("close",`jack_capture closed with code ${e} and signal ${t}`)})),this.jack_capture.on("error",(function(e){try{this.emit("error",e)}catch(e){console.error(e)}})),this.jack_capture.stderr.on("data",(function(e){}));let p=!1,u=null;this.levelReportingInterval=setInterval((()=>{p=!0}),100);let g=!1;this.jack_capture.stdout.on("data",(e=>{if(g||(this.startReportingSeconds(),this.startLedRotation(),g=!0),!p)return;const t=e.toString().split(/[/\r\n]/);if(!t||!t[0]||!t[1])return;p=!1;const r=[s.extractLevelsFromBfrPart(t[0]),s.extractLevelsFromBfrPart(t[1])];if(0===r[0]||0===r[1])return s.emit("levels",u),void c.pub("levels",u);u=r,s.emit("levels",r),c.pub("levels",r)}))}startReportingSeconds(){this.seconds=0,this.secondsReportingInterval=setInterval((()=>{this.seconds++,this.seconds>this.preferredAutoStopSeconds&&this.stop();const e={side:this.side,offset:this.seconds,session_id:this.session.id,session:{...this.session}};c.pub("store",{name:"capture",data:e}),c.pub("store",{name:"session",data:{...this.session}})}),1e3)}startLedRotation(){let e=0;const t=[25,24,23];this.ledInterval=setInterval((()=>{t.map(((t,s)=>{g(s===e?`raspi-gpio set ${t} op pn dh`:`raspi-gpio set ${t} op pn dl`)})),e++,3===e&&(e=0)}),900)}extractLevelsFromBfrPart(e){const t=/(\d{2}):\|(\-+)\s+?\*?\s+\|$/g.exec(e);return t&&t[2]?t[2].length:0}async stop(){if(await a.setAllLeds(!1),await a.flashAll(3,500),this.jack_capture&&this.jack_capture.pid){console.log(`Killing jack capture ${this.jack_capture.pid}`),p(this.jack_capture.pid),this.jack_capture=null,this.levelReportingInterval&&clearInterval(this.levelReportingInterval),this.ledInterval&&clearInterval(this.ledInterval);try{console.log("stop() generating waveform, starting async job...");let e=new o({session_id:this.session.id,file:this.flacFile,waveform:null,reference:null,side:this.side,rate:this.preferredSampleRate,format:this.preferredFormat});await e.getInfo();let t={object:"Recording",data:{...e},id:`${this.session.id}-${this.side}`,title:`Waveform for Side ${this.side}`,name:"waveform",status:"Processing waveform",completed:!1,progress:!0};return this.generateWaveformSourceMP3().then((async s=>{let r=await this.generateWaveform(s);e.waveform=r,e.reference=s,this.session.ensureRecording(e),this.session.save(),c.pub("job",{...t,completed:!0,data:{...e}})})),console.log("stop() ensuring recording and saving session..."),this.session.ensureRecording(e),this.session.save(),e}catch(e){return{waveform:null,error:e.message}}}else console.log("Transport: received stop() but I was not recording")}isRecording(){return null!=this.jack_capture}async generateWaveformSourceMP3(){let e=`${this.flacFile}.mp3`,t=`-i ${this.flacFile} -ar 48000 -b:a 128k ${e}`;return new Promise(((s,r)=>{const n=h("ffmpeg",t.split(" "));n.on("error",(e=>{r(e)})),n.on("close",(()=>{console.log("generateWaveformSource mp3 CLOSE (ignoring)")})),n.on("exit",(()=>{console.log("generateWaveformSource mp3 EXIT"),setTimeout((()=>{s(e)}),250)})),n.stdout.on("data",(function(e){console.log("generateWaveformSource.stdout",e.toString())})),n.stderr.on("data",(function(e){}))}))}async generateWaveformSourceFLAC(){let e=`${this.flacFile}.reference.flac`,t=`-i ${this.flacFile} -ar 48000 -sample_fmt s16 -threads 4 ${e}`;return new Promise(((s,r)=>{const n=h("ffmpeg",t.split(" "));n.on("error",(e=>{r(e)})),n.on("close",(()=>{console.log("generateWaveformSource flac CLOSE (ignoring)")})),n.on("exit",(()=>{console.log("generateWaveformSource flac EXIT"),setTimeout((()=>{s(e)}),250)})),n.stdout.on("data",(function(e){console.log("generateWaveformSource.stdout",e.toString())})),n.stderr.on("data",(function(e){}))}))}async generateWaveformSource(){let e=`${this.flacFile}.wav`,t=`-i ${this.flacFile} -ar 3000 ${e}`;return new Promise(((s,r)=>{const n=h("ffmpeg",t.split(" "));n.on("error",(e=>{r(e)})),n.on("close",(()=>{console.log("generateWaveformSource CLOSE (ignoring)")})),n.on("exit",(()=>{console.log("generateWaveformSource EXIT"),setTimeout((()=>{s(e)}),250)})),n.stdout.on("data",(function(e){console.log("generateWaveformSource.stdout",e.toString())})),n.stderr.on("data",(function(e){}))}))}async generateWaveform(e){let t=`${this.flacFile}.png`,s=`-i ${e} -filter_complex compand=gain=6,aformat=channel_layouts=mono,showwavespic=s=7200x240:colors=white -frames:v 1 ${t}`;return c.pub("job",{object:"Recording",id:123,title:"Waveform for Side A",name:"waveform",status:"Processing waveform",completed:!1,progress:!0}),new Promise(((e,r)=>{const n=h("ffmpeg",s.split(" "));n.on("error",(e=>{r(e)})),n.on("close",(()=>{console.log("generateWaveform CLOSE (ignoring)")})),n.on("exit",(()=>{console.log("generateWaveform EXIT"),e(t)})),n.stdout.on("data",(function(e){console.log("generateWaveform.stdout",e.toString())})),n.stderr.on("data",(function(e){}))}))}filename(){}}},53:(e,t,s)=>{const r=s(4386),{exec:n,execSync:o,spawn:i}=(s(3619),s(3489),s(1041),s(2081)),a=s(7441);s(6217),e.exports=class{trimming=!1;session;side;recording;from;to;reportInterval;constructor(e,t){this.session=e,this.side=t}reportJobStatus(e){let t={object:"Recording",data:{...this.recording},id:`${this.recording.session_id}-${this.recording.side}`,title:`Trimming ${this.session.title} Side ${this.recording.side}`,name:"trim",status:"Trimming audio",error:null,completed:!1,progress:!0,...e};return r.pub("job",t),t}async trim(e,t){this.recording=await this.session.getRecording(this.side),this.from=e,this.to=t,this.recording.trimmedFrom=e,this.recording.trimmedTo=t;try{let e=this.reportJobStatus({});return this.reportInterval=setInterval((()=>{this.reportJobStatus({})}),2e3),Promise.all([this.trimFile(),this.trimReference(),this.trimWaveform()]).then((async e=>{this.reportInterval&&clearInterval(this.reportInterval),this.reportJobStatus({completed:!0}),this.recording.trimmed=!0,this.recording.trimming=!1,this.recording.file=e[0],this.recording.reference=e[1],this.recording.waveform=e[2],await this.recording.syncFileInfo(),this.session.ensureRecording(this.recording),this.session.save(),r.pub("store",{name:"session",data:{...this.session}}),this.trimming=!1})).catch((e=>{console.log("Trimmer.trim ERROR: ",e)})),e}catch(e){console.error(e),this.reportJobStatus({completed:!0,error:"Error trimming side."})}}async trimFile(){const e=`${this.recording.file}.t.flac`,t=`-y -i ${this.recording.file} -ss ${this.from}s -to ${this.to}s ${e}`;return console.log(`Trimmer.trimFile(): ffmpeg ${t}`),new Promise(((s,r)=>{i("ffmpeg",t.split(" ")).on("close",(t=>{0===t?s(e):r(`Exited with code ${t} while trimming file`)})).on("error",(function(e){try{r(e)}catch(e){console.error(e)}}))}))}async trimReference(){const e=`${this.recording.reference}.t.mp3`,t=`-f ${this.recording.reference} ${this.mp3spltTime(this.from)} ${this.mp3spltTime(this.to)} -o @f.mp3.t`;return console.log(`Trimmer.trimReference(): mp3splt ${t}`),new Promise(((s,r)=>{i("mp3splt",t.split(" ")).on("close",(t=>{0===t?s(e):r(`Exited with code ${t} while trimming file`)})).on("error",(function(e){try{r(e)}catch(e){console.error(e)}}))}))}mp3spltTime(e){return`${Math.floor(e/60)}.${(e%60).toFixed(2)}`}async trimWaveform(){const e=`${this.recording.waveform}.t.png`,{width:t,height:s}=await a(this.recording.waveform).metadata(),r=this.from/this.recording.seconds*t,n=t-this.to/this.recording.seconds*t;return await a(this.recording.waveform).extract({left:Math.floor(r),top:0,width:Math.floor(t-(r+n)),height:s}).toFile(e,(function(e){})),e}}},3619:(e,t,s)=>{s(5142).config();const{resolve:r}=s(1017);process.env.DATA_DIR||(console.error('CANNOT RUN WITHOUT "DATA_DIR=" IN ENV'),process.exit());const n=process.env.DATA_DIR;e.exports={rootDataDir:n,dataDir:`${n}/data`,shareDir:`${n}/shared`,btHome:process.env.BT_HOME,dsApiPort:process.env.DS_API_PORT,dataIsMount:process.env.DATA_IS_MOUNT}},2345:(e,t,s)=>{const r=s(1017),n=s(7147),o=s(3619);e.exports={get:function(e){let t=o.dataDir+"/"+e.split(".").join("/")+".json";if(!n.existsSync(t))return null;let s=n.readFileSync(t);return JSON.parse(s.toString("utf-8"))},put:function(e,t){let s=o.dataDir+"/"+e.split(".").join("/")+".json",i=JSON.stringify({...t});const a=r.dirname(s);return n.existsSync(a)||n.mkdirSync(a,{recursive:!0}),n.writeFileSync(s,i),!0}}},6737:(e,t,s)=>{const{exec:r,execSync:n,spawn:o}=s(2081),i={mute:5,relay:17},a=s(2544),c=a.promise;async function l(e){return c.read(e)}async function d(){return[{name:"mute",value:await l(5)},{name:"relay",value:!await l(17)}]}(async()=>{a.setMode(a.MODE_BCM),await c.setup(5,c.DIR_IN,c.EDGE_NONE),await c.setup(17,c.DIR_IN,c.EDGE_NONE)})(),e.exports={index:d,update:async function(e){console.log("UPDATE",e);for(const t of Object.keys(e)){if(!i[t]){console.log("Not setting, name not in gpio map",t,i);continue}let s=!(!e[t]||"false"===e[t]||"lo"===e[t]),r=`raspi-gpio set ${i[t]} op pn ${s?"dh":"dl"}`;console.log(r),n(r)}return d()}}},4306:(e,t,s)=>{s(2081).exec,s(7147),s(3619),e.exports={get:async function(){return process.env.PORTAL_SSID}}},5636:e=>{class t extends Error{errors;constructor(e,t){super(e),this.name="ValidationError",this.errors=t}}e.exports={ValidationError:t}},4525:(e,t,s)=>{const{exec:r,execSync:n,spawn:o}=s(2081);let i=null;const a={1:25,2:24,3:23};async function c(e,t){a[e]&&n(`raspi-gpio set ${a[e]} op pn ${t?"dh":"dl"}`)}async function l(e){c(1,e),c(2,e),c(3,e)}async function d(){return i&&clearInterval(i),l(!1)}async function p(e){e||(e=900);let t=0;const s=[25,24,23];i?clearInterval(i):i=setInterval((()=>{s.map(((e,s)=>{n(s===t?`raspi-gpio set ${e} op pn dh`:`raspi-gpio set ${e} op pn dl`)})),t++,3===t&&(t=0)}),e)}e.exports={setAllLeds:l,setLedState:c,flashAll:async function(e,t){t||(t=500);let s=0,r=!1,n=setInterval((()=>{s++,s>=2*e&&(l(!1),clearInterval(n)),r?(r=!1,l(!1)):(r=!0,l(!0))}),t)},startTransportRotation:p,stopTransportRotation:d,waveHi:async function(){await l(!1),await p(150),setTimeout((async()=>{await d(),await l(!0),setTimeout((async()=>{await l(!1)}),2e3)}),5e3)}}},1436:(e,t,s)=>{const r=s(4306),n=s(3619),{networkInterfaces:o}=s(2037),{Bonjour:i}=s(3423),a=new i,{existsSync:c}=s(7147);let l=!1;async function d(){const e=o();let t=[];for(const s of Object.keys(e))for(const r of e[s])"IPv4"!==r.family||r.internal||t.push(r.address);return 0===t.length?null:t[t.length-1]}e.exports={publish:async function(){if(c("/etc/avahi/services/ds.service"))return void console.log("Network skipping publish because avahi is configured.");const e=await r.get();console.log("Publishing bonjour",e),l&&(console.log("Unpublishing..."),await a.unpublishAll()),l=!0;let t={name:e,type:"http",port:n.dsApiPort||8081},s=await d();s&&console.log(`network got ipv4 using for publishing host ${s}`),setTimeout((()=>{console.log(`Publishing bonjour: ${JSON.stringify(t)}`),a.publish(t).on("up",(()=>{}))}),3e3)},ipv4:d}},7945:(e,t,s)=>{const{spawn:r,exec:n}=s(2081);e.exports={init:async function(){n("raspi-gpio set 13 op pn dl"),n("raspi-gpio set 6 op pn dh"),n("raspi-gpio set 26 pd && raspi-gpio set op pn dh"),n("raspi-gpio set 5 op pn dh"),n("raspi-gpio set 17 op pn dh"),n("raspi-gpio set 12 pu")}}},6552:(e,t,s)=>{const r=s(3361),n=(s(4525),s(6737)),o=s(4386),i=(s(3619),s(3489),s(1041)),{exec:a,execSync:c,spawn:l}=s(2081);e.exports=new class{mpv;playable;playbackReportingInterval;playing=!1;buffering=!1;offset=0;constructor(){}async init(){await n.update({relay:!0}),await r.killIfRunning(),await r.changeSampleRate(96e3)}async play(e){const t=this;this.playable=e,await this.init();let s=`--audio-device=alsa/ds_96 ${e.uri}`;console.log(`mpv ${s}`),this.mpv=l("mpv",s.split(" ")),this.mpv.on("exit",(function(e,s){t.mpv=null,console.error(`mpv exited with code ${e} and signal ${s}`),o.pub("store",{name:"playback",data:{playable:null,offset:null,seconds:null,hmsOffset:null,hmsSeconds:null}})})),this.mpv.on("close",(function(e,s){t.mpv=null,console.error(`mpv closed with code ${e} and signal ${s}`)})),this.mpv.stdout.on("data",(e=>{const t=e.toString().split(/[/\r\n]/);console.log(t)}));let r=!1;this.playbackReportingInterval=setInterval((()=>{r=!0}),1e3),this.mpv.stderr.on("data",(t=>{if(!1===r)return;r=!1;let s=t.toString();try{let t=/A:\s?((\d{2}):(\d{2}):(\d{2}))\s?\/\s((\d{2}):(\d{2}):(\d{2}))\s\((\d{1,2})%\)/gm.exec(s);const r={name:"playback",data:{playable:{...e},offset:3600*parseInt(t[2])+60*parseInt(t[3])+parseInt(t[4]),seconds:3600*parseInt(t[6])+60*parseInt(t[7])+parseInt(t[8]),hmsOffset:t[1],hmsSeconds:t[5]}};o.pub("store",r)}catch(e){console.log("error on stderr parsing",e.message,`String:${s}`)}}))}async stop(){this.playbackReportingInterval&&clearInterval(this.playbackReportingInterval),this.mpv&&this.mpv.pid?(console.log(`Killing mpv ${this.mpv.pid}`),i(this.mpv.pid),this.mpv=null):console.log("MPV: received stop() but I was not playing?")}}},7567:e=>{e.exports=class{title;track;album;artist;image;uri;userid;username;avatar;id_discogs;rate=96e3;bits=24;format="flac";context_type;context_id;context;constructor(e){Object.assign(this,e)}}},3489:(e,t,s)=>{const r=s(9242),n={captureAutoStopSeconds:{type:"number",default:1800},captureSampleRate:{type:"number",enum:[48,96,192],default:96},captureFormat:{enum:["flac","alac"],default:"flac"},bar:{type:"string",default:"foo"}},o=new r({schema:n});o.all=()=>{let e=[];for(const t of Object.keys(n))e.push({name:t,value:o.get(t)});return e},o.keys=()=>Object.keys(n),e.exports=o},4386:e=>{e.exports=new class{channels={};constructor(){}sub(e,t){this.channels[e]||(this.channels[e]=[]),this.channels[e].push(t)}pub(e,t){if(this.channels[e])for(const s of this.channels[e])s(t)}}},3771:(e,t,s)=>{const{EventEmitter:r}=s(1239);e.exports=class extends r{mpv;duration;constructor(){super()}async init(){}async ensureMpv(){}async play(e,t){console.log("Player.play",{url:e,offset:t}),this.emit("duration",this.duration),console.log("fired")}async seek(e){return this.mpv.goToPosition(e)}async resume(){this.mpv.isPaused()&&this.mpv.resume()}async stop(){this.mpv.isRunning()&&await this.mpv.quit()}async pause(){if(!this.mpv.isPaused())return this.mpv.pause()}}},3271:(e,t,s)=>{const r=s(3771);let n=null;async function o(){return n||(n=new r,n)}e.exports={play:async function(e,t){await(await o()).play(e.url,t)},stop:async function(){await(await o()).stop()},pause:async function(){},seek:async function(e){}}},5647:e=>{"use strict";e.exports=require("@fastify/cors")},9450:e=>{"use strict";e.exports=require("@fastify/http-proxy")},2782:e=>{"use strict";e.exports=require("@fastify/multipart")},871:e=>{"use strict";e.exports=require("@fastify/static")},2167:e=>{"use strict";e.exports=require("axios")},7096:e=>{"use strict";e.exports=require("bcrypt")},3423:e=>{"use strict";e.exports=require("bonjour-service")},9242:e=>{"use strict";e.exports=require("conf")},5142:e=>{"use strict";e.exports=require("dotenv")},1239:e=>{"use strict";e.exports=require("events")},1442:e=>{"use strict";e.exports=require("fastify")},2544:e=>{"use strict";e.exports=require("rpi-gpio")},7441:e=>{"use strict";e.exports=require("sharp")},1041:e=>{"use strict";e.exports=require("tree-kill")},5352:e=>{"use strict";e.exports=require("ws")},2081:e=>{"use strict";e.exports=require("child_process")},7147:e=>{"use strict";e.exports=require("fs")},2037:e=>{"use strict";e.exports=require("os")},1017:e=>{"use strict";e.exports=require("path")}},t={};function s(r){var n=t[r];if(void 0!==n)return n.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,s),o.exports}(()=>{const e=s(5352),t=s(4386),{spawn:r,exec:n,execSync:o}=s(2081),i=s(1436),a=s(7147),c=s(3619),l=(s(4306),s(5898)),d=s(4525),p=s(3361),u=s(4408);c.dataIsMount&&console.log("MOUNTED: /dropstation recognized as mounted dedicated drive."),u.on("exit",(()=>{console.log("Transport.on(exit)")})),u.on("error",(e=>{console.error("Transport.on(error)",e)}));const g=s(9549);["/dropstation/data/sessions","/dropstation/shared"].map((e=>{a.existsSync(e)||(console.log(`Creating ${e}`),a.mkdirSync(e,{recursive:!0}))}));const h=s(7945);p.on("debug",console.debug),(async()=>{await h.init(),await d.waveHi(),await g.observe((async e=>{console.log(`button.observe ${e}`),"sleep"===e?(await d.flashAll(1,250),o("sudo poweroff")):"reboot"===e?(await d.flashAll(2,250),o("sudo reboot now")):"stop"===e&&(await d.flashAll(1,250),await i.publish(),u.isRecording()&&u.stop().then((e=>{})))})),await i.publish()})();const f=()=>{console.log("Cleaning up child processes...");try{o("killall jack_capture")}catch(e){console.log("jack_capture not running...")}try{o("killall jackd")}catch(e){console.log("jackd not running...")}process.exit()};process.on("SIGTERM",f),process.on("SIGINT",f);const m=c.dsApiPort||8081,{join:y}=s(1017),v=s(8558),w=s(3666),b=s(5193),x=s(5852),S=s(2945),k=s(6105),_=s(6863),I=(s(267),s(1442)({logger:!0}));I.register(s(2782),{fileSize:1e7,files:1}),I.register(s(871),{root:c.dataDir,prefix:"/files",decorateReply:!1}),I.register(s(5647),{origin:!0,methods:["GET","PUT","POST","DELETE","OPTIONS"],exposedHeaders:["Content-Type","Authorization"],credentials:!0}),I.addHook("onRequest",(async(e,t)=>{if("/files/*"===e.routerPath)return;if("/management/auth"===e.routerPath&&["GET","POST"].indexOf(e.routerMethod)>-1)return;if("/management/authentication"===e.routerPath&&"POST"===e.routerMethod)return;let s=await l.getPinHash();!s||e.headers.dspin&&s===e.headers.dspin||t.code(403).send({message:"Access denied"})})),I.setErrorHandler((function(e,t,s){if(console.log("error handler",e.message,e.name,e.stack),"ValidationError"===e.name)return s.code(422).send(e.errors);s.code(500).send({message:"System Error",error:e.message})})),I.get("/management/auth",v.get),I.post("/management/auth",v.post),I.put("/management/auth",v.put),I.delete("/management/auth",v.del),I.post("/management/authentication",v.authentication);const $=s(202);I.register($.proxyHandler),I.register($.authHandler,{prefix:"/bt-auth"}),I.post("/playback/init",w.init),I.post("/playback",w.play),I.delete("/playback",w.stop),I.get("/sessions",S.index),I.post("/sessions",S.store),I.get("/sessions/:id",S.read),I.put("/sessions/:id",S.update),I.delete("/sessions/:id",S.destroy),I.delete("/sessions/:id/:side",S.deleteRecording),I.get("/sessions/:id/:side",S.getRecording),I.post("/sessions/:id/image",_.upload),I.post("/sessions/:id/recordings/:side/trim",x.store),I.post("/captures/record",b.record),I.post("/captures/stop",b.stop),I.get("/preferences",k.index),I.put("/preferences",k.update);const R=s(7534);I.get("/state",R.index),I.put("/state",R.update);const j=s(7232);function E(){this.isAlive=!0}I.post("/updates",j.store),I.get("/",(async(e,t)=>{t.send({message:"Welcome to DropStation."})})),(async()=>{try{await I.listen({port:3e3,host:"0.0.0.0"})}catch(e){I.log.error(e),process.exit(1)}})().then((()=>{console.log("started web server")}));let T=parseInt(m)+1;const D=new e.Server({host:"0.0.0.0",port:T});D.on("listening",(()=>{console.log("ws listening",T)})),D.on("connection",(function(e){e.isAlive=!0,e.on("pong",E)}));const P=setInterval((function(){D.clients.forEach((function(e){if(!1===e.isAlive)return e.terminate();e.isAlive=!1,e.ping()}))}),3e4);D.on("close",(function(){clearInterval(P)})),D.on("connection",(function(e){e.on("message",(function(e){console.log("received: %s",e)})),t.sub("levels",(t=>{e.send(JSON.stringify({event:"levels",levels:t}))})),t.sub("store",(({name:t,data:s})=>{e.send(JSON.stringify({event:"store",name:t,data:s}))})),t.sub("job",(t=>{e.send(JSON.stringify({event:"job",job:t}))})),e.send(JSON.stringify({message:"Welcome to DropStation"}))}))})()})();