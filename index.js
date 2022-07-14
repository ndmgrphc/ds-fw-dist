(()=>{var e={193:(e,t,s)=>{const n=s(408),r=s(217),a=s(386);e.exports=class{jackManager;transport;constructor(e){this.jackManager=e}record(){let e=this;return async(t,s)=>{const o=new r;o.load(t.body.session_id),e.transport||(e.transport=new n(e.jackManager),await e.transport.record(o,t.body.side),e.transport.on("levels",(e=>{a.pub("levels",e)})),e.transport.on("capturing",(e=>{a.pub("capturing",e)})),e.transport.on("exit",(()=>{console.log("jack_capture QUIT!"),e.transport=null})),e.transport.on("error",(t=>{console.log("jack_capture ERROR!",t),e.transport=null}))),s.send({status:"recording"})}}stop(){let e=this;return async(t,s)=>{let n=null;e.transport?(n=await e.transport.stop(),e.transport=null):console.log("capture controller has no transport"),s.send({status:"stopped",recording:n})}}}},202:(e,t,s)=>{const n=s(653),r=s(543);e.exports={proxyHandler:async function(e){e.register(r,{upstream:"https://burntable.com",http2:!1,prefix:"/bt",replyOptions:{rewriteRequestHeaders:(e,t)=>{let s={...t,authorization:"Bearer "+n.getBearer(),accept:"application/json"};return delete s.dspin,s}}})},authHandler:async function(e){e.put("/token",(async(e,t)=>{const s=await n.setBearer(e.body.token);t.send({token:s})})),e.delete("/token",((e,t)=>{t.send({result:"disconnected"})}))}}},558:(e,t,s)=>{const n=s(898);e.exports={get:async function(e,t){const s=await n.getPinHash();let r={protected:!!s,authenticated:!s||!(!e.headers.dspin||e.headers.dspin!==s)};t.send(r)},post:async function(e,t){const s=await n.updatePinHash(null,e.body.new_pin);t.send({result:"success",dspin:s})},put:async function(e,t){const s=await n.updatePinHash(e.body.current_pin,e.body.new_pin);t.send({result:"success",dspin:s})},del:async function(e,t){},authentication:async function(e,t){const s=await n.authenticate(e.body.pin);t.send({result:"success",dspin:s})}}},666:(e,t,s)=>{const n=s(271),r=s(653);e.exports={play:async function(e,t){if(e.body.drop_id&&e.body.side)try{const s=await r.getClient().post("plays",{drop_id:e.body.drop_id,side:e.body.side,format:"flac"});console.log(s.data),await n.play({url:s.data.audio.url}),t.send({status:"MAYBE"})}catch(e){console.error(e),t.send({status:"NO"})}},pause:async function(e,t){await n.pause()},stop:async function(e,t){await n.stop(),t.send({status:"stopped"})}}},274:(e,t,s)=>{const n=s(217),r=s(619),a=s(147),o=s(17);e.exports={index:async function(e,t){console.log("GET /sessions",`${r.dataDir}/sessions`);let s=a.readdirSync(`${r.dataDir}/sessions`).filter((e=>".json"===o.extname(e))),n=s.map((e=>JSON.parse(a.readFileSync(`${r.dataDir}/sessions/${e}`,"utf-8")))).sort((function(e,t){return parseFloat(e.updated_at)-parseFloat(t.updated_at)}));t.send({data:n,total:s.length})},store:async function(e,t){let s=e.body.title,r=new n;return r.create(s),r.save(),{...r}},read:async function(e,t){let s=e.params.id,r=new n;r.load(s),t.send({...r})},update:async function(e,t){let s=e.params.id,r=new n;r.load(s),t.send({...r})},deleteRecording:async function(e,t){let s=e.params.id,r=e.params.side,a=new n;a.load(s),await a.deleteSide(r),t.send({...a})},getRecording:async function(e,t){let s=e.params.id,r=e.params.side,a=new n;a.load(s);const o=await a.getRecording(r);let i=await o.getInfo();console.log("info",i),t.send({...o,info:i})}}},232:(e,t,s)=>{const{spawn:n,exec:r,execSync:a}=s(81);e.exports={store:async function(e,t){try{let e=await async function(){return new Promise(((e,t)=>{r("cd /home/ds/ds-fw-dist && git pull && sudo chmod 755 ./init.sh && sudo chmod 755 ./wifi-connect/start-wifi-connect.sh",((s,n,r)=>{s?t(s):e(n)}))}))}();t.send({message:"Update completed",result:e}),async function(){return new Promise(((e,t)=>{r("sudo service ds restart",((s,n,r)=>{s?t(s):e(n)}))}))}().then((e=>{console.log(`I don't think you'll ever see this...${e}`)}))}catch(e){t.send({message:"Update failed",result:JSON.stringify(e)})}}}},361:(e,t,s)=>{const{spawn:n,exec:r,execSync:a}=s(81),{EventEmitter:o}=s(239);s(489),e.exports=class extends o{jackd;duration;lastSampleRate;sampleRateMap={48e3:{n:4,p:2048,m0:"dl",m1:"dl"},96e3:{n:4,p:4096,m0:"dh",m1:"dl"},192e3:{n:8,p:8192,m0:"dl",m1:"dh"}};constructor(){super()}async init(){}async isRunning(e){let t=process.platform,s="";switch(t){case"win32":s="tasklist";break;case"darwin":s=`ps -ax | grep ${e}`;break;case"linux":s="ps -A"}return this.emit("debug",`Checking jackd process status with ${s}`),new Promise(((t,n)=>{r(s,((s,n,r)=>{let a=n.toLowerCase().indexOf(e.toLowerCase())>-1;this.emit("debug",`Result of JackManager.isRunning(): ${a}`),t(a)}))}))}async ensure(e,t){let s=this;if(this.jackd&&!t)return this.emit("debug","Jackd is already running, no forceRestart requested."),this.jackd;if(await this.isRunning("jackd")){if(!t)return void this.emit("debug","jackd is already running");this.emit("debug","Jack ensure() forceRestart, killing jackd"),await this.kill()}return(!e||[48e3,96e3,192e3].indexOf(e)<0)&&(this.emit("debug","JackManager.ensure received no sampleRate, using default."),e=96e3),this.lastSampleRate=e,await this.changeSampleRate(e),this.emit("debug",`JackManager.ensure starting with a sampleRate of ${e}.`),this.jackd=n("jackd",["-d","alsa","-r",e,"-n",this.sampleRateMap[e].n,"-p",this.sampleRateMap[e].p,"-C","hw:CARD=GenericStereoAu,DEV=1","-P","hw:CARD=GenericStereoAu,DEV=0"]),new Promise(((e,t)=>{let n=setTimeout((()=>{t("Failed to start jackd within 10 seconds.  Check error logs and contact support.")}),1e4);this.jackd.on("exit",(function(e,t){s.jackd=null,e?s.emit("exit",`jackd exited with code ${e}`):t?s.emit("exit",`jackd exited with signal ${t}`):s.emit("exit","jackd exited on completion")})),this.jackd.on("close",(function(e,t){s.jackd=null,s.emit("close",`jackd closed with code ${e} and signal ${t}`)})),this.jackd.stdout.on("data",(function(t){let r=t.toString();console.log("jackd stdout",t.toString()),r.indexOf("periods for playback")>-1&&(clearTimeout(n),setTimeout((()=>{e("jackd started")}),1e3)),s.emit("data",t)})),this.jackd.stderr.on("data",(function(e){console.log("jackd stderr",e.toString());try{s.emit("error",e)}catch(e){console.log("jackd unhandled error")}}))}))}async changeSampleRate(e){if(!this.sampleRateMap[e])throw Error(`${e} is not a valid sample rate`);a("raspi-gpio set 5 op pn dl"),a("raspi-gpio set 26 op pn dl"),a(`raspi-gpio set 6 op pn ${this.sampleRateMap[e].m0} && raspi-gpio set 13 op pn ${this.sampleRateMap[e].m1}`),a("raspi-gpio set 26 op pn dh"),a("raspi-gpio set 5 op pn dh")}async kill(){try{this.emit("debug","Killing jackd process"),a("killall jackd")}catch(e){console.log("jackd not running...")}}async isJackdRunning(){return this.isRunning("jackd")}}},267:(e,t,s)=>{e.exports=class{dataDir;recordingProcess;meteringProcess;averageLevelInterval;averageLevelIntervalMs=3e3;averageLevelSamples=[];averageLevel=0;constructor(e){this.dataDir=e.dataDir}async stop(){return this.recordingProcess.kill("SIGTERM")}meter(e){const t=this,{spawn:n}=s(81);this.averageLevelInterval=setInterval((()=>{this.setAverageLevel(this.averageLevelSamples.reduce(((e,t)=>e+t),0)/this.averageLevelSamples.length),this.averageLevelSamples=[]}),this.averageLevelIntervalMs),this.meteringProcess=n("arecord",["-D","pulse","-f","dat","-c","2","-vv","/dev/null"],{stdio:["ignore","ignore","pipe"]}),this.meteringProcess.stderr.on("data",(function(s){let n=parseInt(String(s).substr(54,2));isNaN(n)||(t.averageLevelSamples.push(n),e&&e(n))}))}setAverageLevel(e){this.averageLevel=e,console.log("Average level",e)}async recordSideForSession(e,t){return this.record(`${t.id}-${e}`)}async record(e){const{spawn:t}=s(81);return new Promise(((s,n)=>{this.recordingProcess=t("parec",["--rate=96000","--format=s24le","-d","alsa_input.platform-soc_sound.stereo-fallback","|","sox","-t","raw","-b","24","-e","signed","-c","2","-r","96000","-",`${this.dataDir}/${e}.wav`],{stdio:["ignore","ignore","pipe"]}),this.recordingProcess.on("close",((e,t)=>{s({code:e,signal:t})}))}))}}},898:(e,t,s)=>{const n=s(96),r=(s(17),s(147)),a=s(619),{ValidationError:o}=s(636),i=`${a.rootDataDir}/.PIN`;let c,l=null,d=0;async function p(e){const t=await n.hash(String(e),5);return r.writeFileSync(i,t,{encoding:"utf8",flag:"w"}),l=t,t}async function u(){if(l)return l;try{if(r.existsSync(i))return l=r.readFileSync(i,"utf8"),l}catch(e){return null}}e.exports={updatePinHash:async function(e,t){if(!/[0-9]{4}/.test(t))throw new o("Current pin entered is incorrect.",{new_pin:["Must be 4 numbers."]});const s=await u();if(!s)return console.log("updatePinHash has no currentPinHash, setting to newPin",t),p(t);if(!await n.compare(String(e),String(s)))throw new o("Current pin entered is incorrect.",{current_pin:["Incorrect pin entered."]});return p(t)},getPinHash:u,authenticate:async function(e){if(d++,d>=5&&(c&&clearTimeout(c),c=setTimeout((()=>{d=0}),15e3),1))throw new o("Please try again in 15 seconds.",{pin:["Please wait 15 seconds and try again..."]});const t=await u();if(!t)throw new o("Current pin entered is incorrect.",{pin:["Please set a pin before trying to authenticate."]});if(!await n.compare(String(e),String(t)))throw new o("Incorrect pin sorry.",{current_pin:["Incorrect pin entered."]});return t}}},653:(e,t,s)=>{s(17);const n=s(147),r=s(167),a=s(619);let o=null;const{ValidationError:i}=s(636),c=`${a.rootDataDir}/.BTBEARER`;let l=null;function d(){if(l)return l;try{if(n.existsSync(c))return l=n.readFileSync(c,"utf8"),l}catch(e){return null}}e.exports={getBearer:d,setBearer:async function(e){return n.writeFileSync(c,e,{encoding:"utf8",flag:"w"}),l=e,e},getClient:function(){return o||(o=r.create({baseURL:"https://burntable.com/api",headers:{accept:"application/json","content-type":"application/json"}}),o.defaults.headers.authorization="Bearer "+d(),console.log("getClient axiosInstance.defaults.headers",o.defaults.headers),o)}}},549:(e,t,s)=>{const n=s(544);n.setMode(n.MODE_BCM);const r=s(525),a=n.promise;let o=null,i=0,c=!0,l=null;e.exports={observe:async function(e){await a.setup(3,n.DIR_IN,n.EDGE_BOTH),a.on("change",(function(t,s){c!==s&&(c=s,!1===s?o=setInterval((()=>{i++,4===i?"wants_sleep"!=l&&(l="wants_sleep",r.flashAll(2,500),e("wants_sleep")):10===i?"wants_reboot"!=l&&(l="wants_reboot",r.flashAll(3,500),e("wants_reboot")):29===i?"wants_factory_reset"!=l&&(r.flashAll(8,250),l="wants_factory_reset",e("wants_factory_reset")):i>40&&(i=0,l=null,clearInterval(o))}),1e3):(i>29?"factory_reset"!=l&&(l="factory_reset",e("factory_reset")):i>=10?"reboot"!=l&&(l="reboot",e("sleep")):i>=4?"sleep"!=l&&(l="sleep",e("sleep")):"stop"!=l&&(l="stop",e("stop")),i=0,o&&(console.log("clearInterval holdInterval"),clearInterval(o),o=null)))}))}}},353:(e,t,s)=>{const{exec:n}=s(81);e.exports=class{file;session_id;waveform;side;seconds;rate;format;bits;filesize;constructor(e){Object.keys(e).forEach((t=>{this[t]=e[t]}))}async declick(){}async getInfo(){return new Promise(((e,t)=>{n(`ffprobe ${this.file}`,((s,n,r)=>{if(s)return t(s.message);if(r){let t={seconds:0,rate:null,format:null,bits:null};const s=/Duration: (\d{2}):(\d{2}):(\d{2}).(\d{1,2}),/gm.exec(r);s&&s[1]&&(t.seconds+=3600*parseInt(s[1]),t.seconds+=60*parseInt(s[2]),t.seconds+=parseInt(s[3]),t.seconds+=parseInt(s[4])/100);const n=/Audio: ([a-z0-9]+),\s?(\d+)\s?Hz/gm.exec(r);n&&n[1]&&(t.format=n[1].trim(),t.rate=parseInt(n[2]));const a=/Audio:.+\((\d+)\sbit\)/gm.exec(r);a&&a[1]&&(t.bits=parseInt(a[1])),Object.keys(t).forEach((e=>{this[e]=t[e]})),e(t)}}))}))}}},217:(e,t,s)=>{const n=s(345),r=s(147),a=s(353);e.exports=class{id;dropId;title;description;seconds;release_version;created_at;updated_at;recordings=[];uploads=[];constructor(){}ensureRecording(e){let t=this.recordings.findIndex((t=>t.side===e.side));t>-1?this.recordings[t]={...e}:this.recordings.push({...e})}ensureUpload(e){this.uploads.push(e)}create(e){const t=Math.round(Date.now()/1e3);this.id=t,this.title=e,this.seconds=0,this.created_at=t,this.updated_at=t,this.save()}load(e){let t=this;const s=n.get(`sessions.${e}`);if(!s)throw new Error(`Invalid session id ${e}`);Object.keys(s).forEach((e=>{t[e]=s[e]}))}save(){return n.put(`sessions.${this.id}`,{...this})}async deleteSide(e){let t=this.recordings.findIndex((t=>t.side===e));if(t<0)return!1;try{return r.unlinkSync(this.recordings[t].file),r.unlinkSync(this.recordings[t].waveform),r.unlinkSync(`${this.recordings[t].file}.wav`),this.recordings.splice(t,1),this.save(),!0}catch(e){return console.error(e),!1}}async getRecording(e){let t=this.recordings.findIndex((t=>t.side===e));if(t<0)throw new Error("No side found.");return new a(this.recordings[t])}toJSON(){return{...this}}}},408:(e,t,s)=>{const{EventEmitter:n}=s(239),r=s(147),a=s(353),o=s(619),i=s(489),c=s(41),{exec:l,execSync:d,spawn:p}=s(81);e.exports=class extends n{duration;jack_capture;flacFile;levelReportingInterval;secondsReportingInterval;ledInterval;waveFormSourceFile;jackManager;preferredSampleRate;preferredFormat;session;side;seconds;constructor(e){super(),console.log("Transport.constructor myJackManager",e),this.jackManager=e,this.preferredFormat=i.get("captureFormat"),this.preferredSampleRate=1e3*i.get("captureSampleRate")}async record(e,t){let s=this;if(this.jack_capture)return void console.log("Already recording...");try{await this.jackManager.ensure(this.preferredSampleRate,!0)}catch(e){throw new Error(`Could not ensure jack: ${e.message}`)}if(this.seconds=0,!e||!e.id)throw new Error("There is no session id");if(!t)throw new Error("There is no side (like A, B, C, D, etc...)");this.side=t,this.session=e;let n=i.get("captureFormat"),a="flac"===n?"flac":"alac";this.flacFile=`${o.dataDir}/${this.session.id}/${t}.${a}`;let c=`${o.dataDir}/${this.session.id}`;r.existsSync(c)||r.mkdirSync(c,{recursive:!0});let l=`-c 2 -p system:capture* -f ${n} --hide-buffer-usage --silent --meterbridge -fn ${this.flacFile}`;this.jack_capture=p("jack_capture",l.split(" ")),this.jack_capture.on("exit",(function(e,t){s.jack_capture=null,console.error(`jack_capture exited with code ${e} and signal ${t}`),s.emit("exit",`jack_capture exited with code ${e} and signal ${t}`)})),this.jack_capture.on("close",(function(e,t){s.jack_capture=null,s.secondsReportingInterval&&clearInterval(s.secondsReportingInterval),s.levelReportingInterval&&clearInterval(s.levelReportingInterval),console.error(`jack_capture closed with code ${e} and signal ${t}`),s.emit("close",`jack_capture closed with code ${e} and signal ${t}`)})),this.jack_capture.on("error",(function(e){try{this.emit("error",e)}catch(e){console.error(e)}})),this.jack_capture.stderr.on("data",(function(e){try{console.error("jack_capture error: ",e.toString()),this.emit("stderr",e.toString())}catch(e){console.error(e)}}));let d=!1,u=null;this.levelReportingInterval=setInterval((()=>{d=!0}),100);let g=!1;this.jack_capture.stdout.on("data",(e=>{if(g||(this.startReportingSeconds(),this.startLedRotation(),g=!0),!d)return;const t=e.toString().split(/[/\r\n]/);if(!t||!t[0]||!t[1])return;d=!1;const n=[s.extractLevelsFromBfrPart(t[0]),s.extractLevelsFromBfrPart(t[1])];0!==n[0]&&0!==n[1]?(u=n,s.emit("levels",n)):s.emit("levels",u)}))}startReportingSeconds(){this.seconds=0,this.secondsReportingInterval=setInterval((()=>{this.seconds++,this.emit("capturing",{session_id:this.session.id,seconds:this.seconds})}),1e3)}startLedRotation(){let e=0;const t=[25,24,23];this.ledInterval=setInterval((()=>{t.map(((t,s)=>{d(s===e?`raspi-gpio set ${t} op pn dh`:`raspi-gpio set ${t} op pn dl`)})),e++,3===e&&(e=0)}),900)}extractLevelsFromBfrPart(e){const t=/(\d{2}):\|(\-+)\s+?\*?\s+\|$/g.exec(e);return t&&t[2]?t[2].length:0}async stop(){this.jack_capture&&this.jack_capture.pid&&(console.log(`Killing jack capture ${this.jack_capture.pid}`),c(this.jack_capture.pid)),this.levelReportingInterval&&clearInterval(this.levelReportingInterval),this.ledInterval&&clearInterval(this.ledInterval);try{console.log("stop() generating waveform...");let e=await this.generateWaveform(await this.generateWaveformSource()),t=new a({session_id:this.session.id,file:this.flacFile,waveform:e,side:this.side,rate:this.preferredSampleRate,format:this.preferredFormat});return await t.getInfo(),console.log("stop() ensuring recording and saving session..."),this.session.ensureRecording(t),this.session.save(),t}catch(e){return{waveform:null,error:e.message}}}async generateWaveformSource(){let e=`${this.flacFile}.wav`,t=`-i ${this.flacFile} -ar 3000 ${e}`;return new Promise(((s,n)=>{const r=p("ffmpeg",t.split(" "));r.on("error",(e=>{n(e)})),r.on("close",(()=>{console.log("generateWaveformSource CLOSE (ignoring)")})),r.on("exit",(()=>{console.log("generateWaveformSource EXIT"),setTimeout((()=>{s(e)}),250)})),r.stdout.on("data",(function(e){console.log("generateWaveformSource.stdout",e.toString())})),r.stderr.on("data",(function(e){console.log("generateWaveformSource.stderr",e.toString())}))}))}async generateWaveform(e){let t=`${this.flacFile}.png`,s=`-i ${e} -filter_complex compand=gain=6,aformat=channel_layouts=mono,showwavespic=s=7200x240:colors=white -frames:v 1 ${t}`;return new Promise(((e,n)=>{const r=p("ffmpeg",s.split(" "));r.on("error",(e=>{n(e)})),r.on("close",(()=>{console.log("generateWaveform CLOSE (ignoring)")})),r.on("exit",(()=>{console.log("generateWaveform EXIT"),e(t)})),r.stdout.on("data",(function(e){console.log("generateWaveform.stdout",e.toString())})),r.stderr.on("data",(function(e){console.log("generateWaveform.stderr",e.toString())}))}))}filename(){}}},619:(e,t,s)=>{s(142).config();const{resolve:n}=s(17);process.env.DATA_DIR||(console.error('CANNOT RUN WITHOUT "DATA_DIR=" IN ENV'),process.exit());const r=process.env.DATA_DIR;e.exports={rootDataDir:r,dataDir:`${r}/data`,shareDir:`${r}/shared`,btHome:process.env.BT_HOME,dsApiPort:process.env.DS_API_PORT}},345:(e,t,s)=>{const n=s(17),r=s(147),a=s(619);e.exports={get:function(e){let t=a.dataDir+"/"+e.split(".").join("/")+".json";if(!r.existsSync(t))return null;let s=r.readFileSync(t);return JSON.parse(s.toString("utf-8"))},put:function(e,t){let s=a.dataDir+"/"+e.split(".").join("/")+".json",o=JSON.stringify({...t});const i=n.dirname(s);return r.existsSync(i)||r.mkdirSync(i,{recursive:!0}),r.writeFileSync(s,o),!0}}},306:(e,t,s)=>{s(81).exec,s(147),s(619),e.exports={get:async function(){return process.env.PORTAL_SSID}}},636:e=>{class t extends Error{errors;constructor(e,t){super(e),this.name="ValidationError",this.errors=t}}e.exports={ValidationError:t}},525:(e,t,s)=>{const{exec:n,execSync:r,spawn:a}=s(81);let o=null;const i={1:25,2:24,3:23};async function c(e,t){i[e]&&r(`raspi-gpio set ${i[e]} op pn ${t?"dh":"dl"}`)}async function l(e){c(1,e),c(2,e),c(3,e)}async function d(){return o&&clearInterval(o),l(!1)}async function p(e){e||(e=900);let t=0;const s=[25,24,23];o?clearInterval(o):o=setInterval((()=>{s.map(((e,s)=>{r(s===t?`raspi-gpio set ${e} op pn dh`:`raspi-gpio set ${e} op pn dl`)})),t++,3===t&&(t=0)}),e)}e.exports={setAllLeds:l,setLedState:c,flashAll:async function(e,t){t||(t=500);let s=0,n=!1,r=setInterval((()=>{s++,s>=2*e&&(l(!1),clearInterval(r)),n?(n=!1,l(!1)):(n=!0,l(!0))}),t)},startTransportRotation:p,stopTransportRotation:d,waveHi:async function(){await l(!1),await p(150),setTimeout((async()=>{await d(),await l(!0),setTimeout((async()=>{await l(!1)}),2e3)}),5e3)}}},945:(e,t,s)=>{const{spawn:n,exec:r}=s(81);e.exports={init:async function(){r("raspi-gpio set 13 op pn dl"),r("raspi-gpio set 6 op pn dh"),r("raspi-gpio set 26 pd && raspi-gpio set op pn dh"),r("raspi-gpio set 5 op pn dh"),r("raspi-gpio set 17 op pn dh"),r("raspi-gpio set 12 pu")}}},489:(e,t,s)=>{const n=new(s(242))({schema:{captureAutoStopSeconds:{type:"number",default:1800},captureSampleRate:{type:"number",enum:[48,96,192],default:96},captureFormat:{enum:["flac","alac"],default:"alac"},bar:{type:"string",format:"url"}}});e.exports=n},386:e=>{e.exports=new class{channels={};constructor(){}sub(e,t){this.channels[e]||(this.channels[e]=[]),this.channels[e].push(t)}pub(e,t){if(this.channels[e])for(const s of this.channels[e])s(t)}}},771:(e,t,s)=>{const{EventEmitter:n}=s(239);e.exports=class extends n{mpv;duration;constructor(){super()}async init(){}async ensureMpv(){}async play(e,t){console.log("Player.play",{url:e,offset:t}),this.emit("duration",this.duration),console.log("fired")}async seek(e){return this.mpv.goToPosition(e)}async resume(){this.mpv.isPaused()&&this.mpv.resume()}async stop(){this.mpv.isRunning()&&await this.mpv.quit()}async pause(){if(!this.mpv.isPaused())return this.mpv.pause()}}},271:(e,t,s)=>{const n=s(771);let r=null;async function a(){return r||(r=new n,r)}e.exports={play:async function(e,t){await(await a()).play(e.url,t)},stop:async function(){await(await a()).stop()},pause:async function(){},seek:async function(e){}}},167:e=>{"use strict";e.exports=require("axios")},96:e=>{"use strict";e.exports=require("bcrypt")},423:e=>{"use strict";e.exports=require("bonjour-service")},242:e=>{"use strict";e.exports=require("conf")},142:e=>{"use strict";e.exports=require("dotenv")},239:e=>{"use strict";e.exports=require("events")},442:e=>{"use strict";e.exports=require("fastify")},103:e=>{"use strict";e.exports=require("fastify-cors")},543:e=>{"use strict";e.exports=require("fastify-http-proxy")},87:e=>{"use strict";e.exports=require("fastify-static")},544:e=>{"use strict";e.exports=require("rpi-gpio")},41:e=>{"use strict";e.exports=require("tree-kill")},352:e=>{"use strict";e.exports=require("ws")},81:e=>{"use strict";e.exports=require("child_process")},147:e=>{"use strict";e.exports=require("fs")},17:e=>{"use strict";e.exports=require("path")}},t={};function s(n){var r=t[n];if(void 0!==r)return r.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,s),a.exports}(()=>{const e=s(352),t=s(386),{spawn:n,exec:r,execSync:a}=s(81),o=s(147),i=s(619),c=s(306),l=s(898),d=s(525),p=s(361),u=s(549);["/dropstation/data/sessions"].map((e=>{o.existsSync(e)||(console.log(`Creating ${e}`),o.mkdirSync(e,{recursive:!0}))}));const g=s(945),h=new p;h.on("debug",console.debug),console.log("index jackManager",h),(async()=>{await g.init(),await d.waveHi(),await u.observe((e=>{console.log(`button.observe ${e}`)}))})();const f=()=>{console.log("Cleaning up child processes...");try{a("killall jack_capture")}catch(e){console.log("jack_capture not running...")}try{a("killall jackd")}catch(e){console.log("jackd not running...")}process.exit()};process.on("SIGTERM",f),process.on("SIGINT",f);const m=i.dsApiPort||8081;c.get().then((e=>{const{Bonjour:t}=s(423),n=new t;console.log("Publishing bonjour",e),n.publish({name:e,type:"http",port:m}).on("up",(()=>{}))}));const{join:y}=s(17),v=s(558),w=s(666),x=new(s(193))(h),k=s(274),S=(s(267),s(442)({logger:!0}));S.register(s(87),{root:i.rootDataDir,prefix:"/files",decorateReply:!1}),S.register(s(103),{origin:!0,methods:["GET","PUT","POST","DELETE","OPTIONS"],exposedHeaders:["Content-Type","Authorization"],credentials:!0}),S.addHook("onRequest",(async(e,t)=>{if("/files/*"===e.routerPath)return;if("/management/auth"===e.routerPath&&["GET","POST"].indexOf(e.routerMethod)>-1)return;if("/management/authentication"===e.routerPath&&"POST"===e.routerMethod)return;let s=await l.getPinHash();!s||e.headers.dspin&&s===e.headers.dspin||t.code(403).send({message:"Access denied"})})),S.setErrorHandler((function(e,t,s){if(console.log("error handler",e.message,e.name,e.stack),"ValidationError"===e.name)return s.code(422).send(e.errors);s.code(500).send({message:"System Error",error:e.message})})),S.get("/management/auth",v.get),S.post("/management/auth",v.post),S.put("/management/auth",v.put),S.delete("/management/auth",v.del),S.post("/management/authentication",v.authentication);const j=s(202);S.register(j.proxyHandler),S.register(j.authHandler,{prefix:"/bt-auth"}),S.post("/playing",w.play),S.delete("/playing",w.stop),S.get("/sessions",k.index),S.post("/sessions",k.store),S.get("/sessions/:id",k.read),S.delete("/sessions/:id/:side",k.deleteRecording),S.get("/sessions/:id/:side",k.getRecording),S.post("/captures/record",x.record()),S.post("/captures/stop",x.stop());const I=s(232);function _(){this.isAlive=!0}S.post("/updates",I.store),S.get("/",(async(e,t)=>{t.send({message:"Welcome to DropStation."})})),S.listen(m,"0.0.0.0",((e,t)=>{if(e)throw e}));const b=new e.Server({host:"0.0.0.0",port:parseInt(m)+1});b.on("listening",(()=>{console.log("ws listening",m+1)})),b.on("connection",(function(e){e.isAlive=!0,e.on("pong",_)}));const R=setInterval((function(){b.clients.forEach((function(e){if(!1===e.isAlive)return e.terminate();e.isAlive=!1,e.ping()}))}),3e4);b.on("close",(function(){clearInterval(R)})),b.on("connection",(function(e){e.on("message",(function(e){console.log("received: %s",e)})),t.sub("levels",(t=>{e.send(JSON.stringify({event:"levels",levels:t}))})),t.sub("capturing",(t=>{e.send(JSON.stringify({event:"capturing",capturing:t}))})),e.send("hi")}))})()})();