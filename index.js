(()=>{var e={202:(e,t,s)=>{const n=s(653),r=s(543);e.exports={proxyHandler:async function(e){e.register(r,{upstream:"https://burntable.com",http2:!1,prefix:"/bt",replyOptions:{rewriteRequestHeaders:(e,t)=>{let s={...t,authorization:"Bearer "+n.getBearer(),accept:"application/json"};return delete s.dspin,s}}})},authHandler:async function(e){e.put("/token",(async(e,t)=>{const s=await n.setBearer(e.body.token);t.send({token:s})})),e.delete("/token",((e,t)=>{t.send({result:"disconnected"})}))}}},435:(e,t,s)=>{const n=s(408),r=s(217),o=s(386);let i=null;e.exports={record:async function(e,t){const s=new r;s.load(e.body.session_id),i||(i=new n,await i.record(s,e.body.side),i.on("levels",(e=>{o.pub("levels",e)})),i.on("capturing",(e=>{o.pub("capturing",e)})),i.on("exit",(()=>{console.log("jack_capture QUIT!"),i=null})),i.on("error",(e=>{console.log("jack_capture ERROR!",e),i=null}))),t.send({status:"recording"})},stop:async function(e,t){let s=null;i?s=await i.stop():console.log("capture controller has no transport"),t.send({status:"stopped",recording:s})}}},558:(e,t,s)=>{const n=s(898);e.exports={get:async function(e,t){const s=await n.getPinHash();let r={protected:!!s,authenticated:!s||!(!e.headers.dspin||e.headers.dspin!==s)};t.send(r)},post:async function(e,t){const s=await n.updatePinHash(null,e.body.new_pin);t.send({result:"success",dspin:s})},put:async function(e,t){const s=await n.updatePinHash(e.body.current_pin,e.body.new_pin);t.send({result:"success",dspin:s})},del:async function(e,t){},authentication:async function(e,t){const s=await n.authenticate(e.body.pin);t.send({result:"success",dspin:s})}}},666:(e,t,s)=>{const n=s(271),r=s(653);e.exports={play:async function(e,t){if(e.body.drop_id&&e.body.side)try{const s=await r.getClient().post("plays",{drop_id:e.body.drop_id,side:e.body.side,format:"flac"});console.log(s.data),await n.play({url:s.data.audio.url}),t.send({status:"MAYBE"})}catch(e){console.error(e),t.send({status:"NO"})}},pause:async function(e,t){await n.pause()},stop:async function(e,t){await n.stop(),t.send({status:"stopped"})}}},274:(e,t,s)=>{const n=s(217),r=s(619),o=s(147),i=s(17);e.exports={index:async function(e,t){let s=o.readdirSync(`${r.dataDir}/sessions`).filter((e=>".json"===i.extname(e))),n=s.map((e=>JSON.parse(o.readFileSync(`${r.dataDir}/sessions/${e}`,"utf-8")))).sort((function(e,t){return parseFloat(e.updated_at)-parseFloat(t.updated_at)}));t.send({data:n,total:s.length})},store:async function(e,t){let s=e.body.title,r=new n;return r.create(s),r.save(),{...r}},read:async function(e,t){let s=e.params.id,r=new n;r.load(s),t.send({...r})},update:async function(e,t){let s=e.params.id,r=new n;r.load(s),t.send({...r})},deleteRecording:async function(e,t){let s=e.params.id,r=e.params.side,o=new n;o.load(s),await o.deleteSide(r),t.send({...o})},getRecording:async function(e,t){let s=e.params.id,r=e.params.side,o=new n;o.load(s);const i=await o.getRecording(r);let a=await i.getInfo();console.log("info",a),t.send({...i,info:a})}}},894:(e,t,s)=>{const{spawn:n,exec:r}=s(81),{EventEmitter:o}=s(239);e.exports=class extends o{jackd;duration;constructor(){super()}async init(){}async isRunning(e){let t=process.platform,s="";switch(t){case"win32":s="tasklist";break;case"darwin":s=`ps -ax | grep ${e}`;break;case"linux":s="ps -A"}return new Promise(((t,n)=>{r(s,((s,n,r)=>{t(n.toLowerCase().indexOf(e.toLowerCase())>-1)}))}))}async ensure(){let e=this;if(this.jackd)return this.jackd;await this.isRunning("jackd")?this.emit("debug","jackd is already running"):(this.jackd=n("jackd",["-d","alsa","-r","96000","-C","hw:CARD=GenericStereoAu,DEV=1","-P","hw:CARD=GenericStereoAu,DEV=0"]),this.jackd.on("exit",(function(t,s){e.jackd=null,e.emit("exit",`jackd exited with code ${t} and signal ${s}`)})),this.jackd.on("close",(function(t,s){e.jackd=null,e.emit("close",`jackd closed with code ${t} and signal ${s}`)})),this.jackd.stdout.on("data",(function(t){e.emit("data",t)})))}async isJackdRunning(){return this.isRunning("jackd")}}},267:(e,t,s)=>{e.exports=class{dataDir;recordingProcess;meteringProcess;averageLevelInterval;averageLevelIntervalMs=3e3;averageLevelSamples=[];averageLevel=0;constructor(e){this.dataDir=e.dataDir}async stop(){return this.recordingProcess.kill("SIGTERM")}meter(e){const t=this,{spawn:n}=s(81);this.averageLevelInterval=setInterval((()=>{this.setAverageLevel(this.averageLevelSamples.reduce(((e,t)=>e+t),0)/this.averageLevelSamples.length),this.averageLevelSamples=[]}),this.averageLevelIntervalMs),this.meteringProcess=n("arecord",["-D","pulse","-f","dat","-c","2","-vv","/dev/null"],{stdio:["ignore","ignore","pipe"]}),this.meteringProcess.stderr.on("data",(function(s){let n=parseInt(String(s).substr(54,2));isNaN(n)||(t.averageLevelSamples.push(n),e&&e(n))}))}setAverageLevel(e){this.averageLevel=e,console.log("Average level",e)}async recordSideForSession(e,t){return this.record(`${t.id}-${e}`)}async record(e){const{spawn:t}=s(81);return new Promise(((s,n)=>{this.recordingProcess=t("parec",["--rate=96000","--format=s24le","-d","alsa_input.platform-soc_sound.stereo-fallback","|","sox","-t","raw","-b","24","-e","signed","-c","2","-r","96000","-",`${this.dataDir}/${e}.wav`],{stdio:["ignore","ignore","pipe"]}),this.recordingProcess.on("close",((e,t)=>{s({code:e,signal:t})}))}))}}},898:(e,t,s)=>{const n=s(96),r=s(17),o=s(147),{ValidationError:i}=s(636),a=r.resolve("/","../data/.PIN");let c,l=null,d=0;async function u(e){const t=await n.hash(String(e),5);return o.writeFileSync(a,t,{encoding:"utf8",flag:"w"}),l=t,t}async function p(){if(l)return l;try{if(o.existsSync(a))return l=o.readFileSync(a,"utf8"),l}catch(e){return null}}e.exports={updatePinHash:async function(e,t){if(!/[0-9]{4}/.test(t))throw new i("Current pin entered is incorrect.",{new_pin:["Must be 4 numbers."]});const s=await p();if(!s)return console.log("updatePinHash has no currentPinHash, setting to newPin",t),u(t);if(!await n.compare(String(e),String(s)))throw new i("Current pin entered is incorrect.",{current_pin:["Incorrect pin entered."]});return u(t)},getPinHash:p,authenticate:async function(e){if(d++,d>=5&&(c&&clearTimeout(c),c=setTimeout((()=>{d=0}),15e3),1))throw new i("Please try again in 15 seconds.",{pin:["Please wait 15 seconds and try again..."]});const t=await p();if(!t)throw new i("Current pin entered is incorrect.",{pin:["Please set a pin before trying to authenticate."]});if(!await n.compare(String(e),String(t)))throw new i("Incorrect pin sorry.",{current_pin:["Incorrect pin entered."]});return t}}},653:(e,t,s)=>{const n=s(17),r=s(147),o=s(167);let i=null;const{ValidationError:a}=s(636),c=n.resolve("/","../data/.BTBEARER");let l=null;function d(){if(l)return l;try{if(r.existsSync(c))return l=r.readFileSync(c,"utf8"),l}catch(e){return null}}e.exports={getBearer:d,setBearer:async function(e){return r.writeFileSync(c,e,{encoding:"utf8",flag:"w"}),l=e,e},getClient:function(){return i||(i=o.create({baseURL:"https://burntable.com/api",headers:{accept:"application/json","content-type":"application/json"}}),i.defaults.headers.authorization="Bearer "+d(),console.log("getClient axiosInstance.defaults.headers",i.defaults.headers),i)}}},549:(e,t,s)=>{const n=s(544);n.setMode(n.MODE_BCM);const r=s(525),o=n.promise;let i=null,a=0,c=!0,l=null;e.exports={observe:async function(e){await o.setup(3,n.DIR_IN,n.EDGE_BOTH),o.on("change",(function(t,s){c!==s&&(c=s,!1===s?i=setInterval((()=>{a++,4===a?"wants_sleep"!=l&&(l="wants_sleep",r.flashAll(3,500),e("wants_sleep")):29===a?"wants_factory_reset"!=l&&(r.flashAll(8,250),l="wants_factory_reset",e("wants_factory_reset")):a>40&&(a=0,l=null,clearInterval(i))}),1e3):(a>29?"factory_reset"!=l&&(l="factory_reset",e("factory_reset")):a>4?"sleep"!=l&&(l="sleep",e("sleep")):"stop"!=l&&(l="stop",e("stop")),a=0,i&&(console.log("clearInterval holdInterval"),clearInterval(i),i=null)))}))}}},353:(e,t,s)=>{const{exec:n}=s(81);e.exports=class{file;session_id;waveform;side;seconds;rate;format;bits;filesize;constructor(e){Object.keys(e).forEach((t=>{this[t]=e[t]}))}async declick(){}async getInfo(){return new Promise(((e,t)=>{n(`ffprobe ${this.file}`,((s,n,r)=>{if(s)return t(s.message);if(r){let t={seconds:0,rate:null,format:null,bits:null};const s=/Duration: (\d{2}):(\d{2}):(\d{2}).(\d{1,2}),/gm.exec(r);s&&s[1]&&(t.seconds+=3600*parseInt(s[1]),t.seconds+=60*parseInt(s[2]),t.seconds+=parseInt(s[3]),t.seconds+=parseInt(s[4])/100);const n=/Audio: ([a-z0-9]+),\s?(\d+)\s?Hz/gm.exec(r);n&&n[1]&&(t.format=n[1].trim(),t.rate=parseInt(n[2]));const o=/Audio:.+\((\d+)\sbit\)/gm.exec(r);o&&o[1]&&(t.bits=parseInt(o[1])),Object.keys(t).forEach((e=>{this[e]=t[e]})),e(t)}}))}))}}},217:(e,t,s)=>{const n=s(345),r=s(147),o=s(353);e.exports=class{id;dropId;title;description;seconds;release_version;created_at;updated_at;recordings=[];uploads=[];constructor(){}ensureRecording(e){let t=this.recordings.findIndex((t=>t.side===e.side));t>-1?this.recordings[t]={...e}:this.recordings.push({...e})}ensureUpload(e){this.uploads.push(e)}create(e){const t=Math.round(Date.now()/1e3);this.id=t,this.title=e,this.seconds=0,this.created_at=t,this.updated_at=t,this.save()}load(e){let t=this;const s=n.get(`sessions.${e}`);if(!s)throw new Error(`Invalid session id ${e}`);Object.keys(s).forEach((e=>{t[e]=s[e]}))}save(){return n.put(`sessions.${this.id}`,{...this})}async deleteSide(e){let t=this.recordings.findIndex((t=>t.side===e));if(t<0)return!1;try{return r.unlinkSync(this.recordings[t].file),r.unlinkSync(this.recordings[t].waveform),r.unlinkSync(`${this.recordings[t].file}.wav`),this.recordings.splice(t,1),this.save(),!0}catch(e){return console.error(e),!1}}async getRecording(e){let t=this.recordings.findIndex((t=>t.side===e));if(t<0)throw new Error("No side found.");return new o(this.recordings[t])}toJSON(){return{...this}}}},408:(e,t,s)=>{const{EventEmitter:n}=s(239),r=s(147),o=s(353),i=s(619),a=(s(489),s(41)),{exec:c,execSync:l,spawn:d}=s(81);e.exports=class extends n{duration;jack_capture;flacFile;levelReportingInterval;secondsReportingInterval;ledInterval;waveFormSourceFile;session;side;seconds;constructor(){super()}async record(e,t){let s=this;if(this.jack_capture)return void console.log("Already recording...");if(this.seconds=0,!e||!e.id)throw new Error("There is no session id");if(!t)throw new Error("There is no side (like A, B, C, D, etc...)");this.side=t,this.session=e,this.flacFile=`${i.audioDir}/${this.session.id}/${t}.flac`;let n=`${i.audioDir}/${this.session.id}`;r.existsSync(n)||r.mkdirSync(n,{recursive:!0});let o=`-c 2 -p system:capture* -f flac --hide-buffer-usage --silent --meterbridge -fn ${this.flacFile}`;this.jack_capture=d("jack_capture",o.split(" ")),this.jack_capture.on("exit",(function(e,t){s.jack_capture=null,console.error(`jack_capture exited with code ${e} and signal ${t}`),s.emit("exit",`jack_capture exited with code ${e} and signal ${t}`)})),this.jack_capture.on("close",(function(e,t){s.jack_capture=null,s.secondsReportingInterval&&clearInterval(s.secondsReportingInterval),s.levelReportingInterval&&clearInterval(s.levelReportingInterval),console.error(`jack_capture closed with code ${e} and signal ${t}`),s.emit("close",`jack_capture closed with code ${e} and signal ${t}`)})),this.jack_capture.on("error",(function(e){try{this.emit("error",e)}catch(e){console.error(e)}})),this.jack_capture.stderr.on("data",(function(e){try{this.emit("stderr",e.toString())}catch(e){console.error(e)}}));let a=!1,c=null;this.levelReportingInterval=setInterval((()=>{a=!0}),100);let l=!1;this.jack_capture.stdout.on("data",(e=>{if(l||(this.startReportingSeconds(),this.startLedRotation(),l=!0),!a)return;const t=e.toString().split(/[/\r\n]/);if(!t||!t[0]||!t[1])return;a=!1;const n=[s.extractLevelsFromBfrPart(t[0]),s.extractLevelsFromBfrPart(t[1])];0!==n[0]&&0!==n[1]?(c=n,s.emit("levels",n)):s.emit("levels",c)}))}startReportingSeconds(){this.seconds=0,this.secondsReportingInterval=setInterval((()=>{this.seconds++,this.emit("capturing",{session_id:this.session.id,seconds:this.seconds})}),1e3)}startLedRotation(){let e=0;const t=[25,24,23];this.ledInterval=setInterval((()=>{t.map(((t,s)=>{l(s===e?`raspi-gpio set ${t} op pn dh`:`raspi-gpio set ${t} op pn dl`)})),e++,3===e&&(e=0)}),900)}extractLevelsFromBfrPart(e){const t=/(\d{2}):\|(\-+)\s+?\*?\s+\|$/g.exec(e);return t&&t[2]?t[2].length:0}async stop(){this.jack_capture&&this.jack_capture.pid&&(console.log(`Killing jack capture ${this.jack_capture.pid}`),a(this.jack_capture.pid)),this.levelReportingInterval&&clearInterval(this.levelReportingInterval),this.ledInterval&&clearInterval(this.ledInterval);try{console.log("stop() generating waveform...");let e=await this.generateWaveform(await this.generateWaveformSource()),t=new o({session_id:this.session.id,file:this.flacFile,waveform:e,side:this.side});return await t.getInfo(),console.log("stop() ensuring recording and saving session..."),this.session.ensureRecording(t),this.session.save(),t}catch(e){return{waveform:null,error:e.message}}}async generateWaveformSource(){let e=`${this.flacFile}.wav`,t=`-i ${this.flacFile} -ar 3000 ${e}`;return new Promise(((s,n)=>{const r=d("ffmpeg",t.split(" "));r.on("error",(e=>{n(e)})),r.on("close",(()=>{console.log("generateWaveformSource CLOSE (ignoring)")})),r.on("exit",(()=>{console.log("generateWaveformSource EXIT"),setTimeout((()=>{s(e)}),250)})),r.stdout.on("data",(function(e){console.log("generateWaveformSource.stdout",e.toString())})),r.stderr.on("data",(function(e){console.log("generateWaveformSource.stderr",e.toString())}))}))}async generateWaveform(e){let t=`${this.flacFile}.png`,s=`-i ${e} -filter_complex compand=gain=6,aformat=channel_layouts=mono,showwavespic=s=7200x240:colors=white -frames:v 1 ${t}`;return new Promise(((e,n)=>{const r=d("ffmpeg",s.split(" "));r.on("error",(e=>{n(e)})),r.on("close",(()=>{console.log("generateWaveform CLOSE (ignoring)")})),r.on("exit",(()=>{console.log("generateWaveform EXIT"),e(t)})),r.stdout.on("data",(function(e){console.log("generateWaveform.stdout",e.toString())})),r.stderr.on("data",(function(e){console.log("generateWaveform.stderr",e.toString())}))}))}filename(){}}},619:(e,t,s)=>{s(142).config();const{resolve:n}=s(17),r=process.env.DATA_DIR||n("/","../data"),o=n("/","..");e.exports={rootDir:o,rootDataDir:r,dataDir:`${r}/data`,audioDir:`${r}/audio`,btHome:process.env.BT_HOME,dsApiPort:process.env.DS_API_PORT}},345:(e,t,s)=>{const n=s(17),r=s(147),o=s(619);e.exports={get:function(e){let t=o.dataDir+"/"+e.split(".").join("/")+".json";if(!r.existsSync(t))return null;let s=r.readFileSync(t);return JSON.parse(s.toString("utf-8"))},put:function(e,t){let s=o.dataDir+"/"+e.split(".").join("/")+".json",i=JSON.stringify({...t});const a=n.dirname(s);return r.existsSync(a)||r.mkdirSync(a,{recursive:!0}),r.writeFileSync(s,i),!0}}},306:(e,t,s)=>{const n=s(81).exec,r=s(147),o=`${s(619).rootDir}/.DSID`;let i;e.exports={reset:async function(){const e=await async function(e){return new Promise(((e,t)=>{n("dbus-uuidgen",((s,n,r)=>{if(s)return t(s);e(n)}))}))}();return r.existsSync(o)&&r.unlinkSync(o),r.writeFileSync(o,Buffer.from(e)),i=e,e},get:async function(){return process.env.PORTAL_SSID}}},636:e=>{class t extends Error{errors;constructor(e,t){super(e),this.name="ValidationError",this.errors=t}}e.exports={ValidationError:t}},525:(e,t,s)=>{const{exec:n,execSync:r,spawn:o}=s(81);let i=null;const a={1:25,2:24,3:23};async function c(e,t){a[e]&&r(`raspi-gpio set ${a[e]} op pn ${t?"dh":"dl"}`)}async function l(e){c(1,e),c(2,e),c(3,e)}async function d(){return i&&clearInterval(i),l(!1)}async function u(e){e||(e=900);let t=0;const s=[25,24,23];i?clearInterval(i):i=setInterval((()=>{s.map(((e,s)=>{r(s===t?`raspi-gpio set ${e} op pn dh`:`raspi-gpio set ${e} op pn dl`)})),t++,3===t&&(t=0)}),e)}e.exports={setAllLeds:l,setLedState:c,flashAll:async function(e,t){t||(t=500);let s=0,n=!1,r=setInterval((()=>{s++,s>=2*e&&(l(!1),clearInterval(r)),n?(n=!1,l(!1)):(n=!0,l(!0))}),t)},startTransportRotation:u,stopTransportRotation:d,waveHi:async function(){await l(!1),await u(150),setTimeout((async()=>{await d(),await l(!0),setTimeout((async()=>{await l(!1)}),2e3)}),5e3)}}},945:(e,t,s)=>{const{spawn:n,exec:r}=s(81);e.exports={init:async function(){r("raspi-gpio set 13 op pn dl"),r("raspi-gpio set 6 op pn dh"),r("raspi-gpio set 26 pd && raspi-gpio set op pn dh"),r("raspi-gpio set 5 op pn dh"),r("raspi-gpio set 17 op pn dh"),r("raspi-gpio set 12 pu")}}},489:(e,t,s)=>{const n=new(s(242))({schema:{captureSampleRate:{enum:[48,96,192],default:96},bar:{type:"string",format:"url"}}});e.exports=n},386:e=>{e.exports=new class{channels={};constructor(){}sub(e,t){this.channels[e]||(this.channels[e]=[]),this.channels[e].push(t)}pub(e,t){if(this.channels[e])for(const s of this.channels[e])s(t)}}},771:(e,t,s)=>{const{EventEmitter:n}=s(239);e.exports=class extends n{mpv;duration;constructor(){super()}async init(){}async ensureMpv(){}async play(e,t){console.log("Player.play",{url:e,offset:t}),this.emit("duration",this.duration),console.log("fired")}async seek(e){return this.mpv.goToPosition(e)}async resume(){this.mpv.isPaused()&&this.mpv.resume()}async stop(){this.mpv.isRunning()&&await this.mpv.quit()}async pause(){if(!this.mpv.isPaused())return this.mpv.pause()}}},271:(e,t,s)=>{const n=s(771);let r=null;async function o(){return r||(r=new n,r)}e.exports={play:async function(e,t){await(await o()).play(e.url,t)},stop:async function(){await(await o()).stop()},pause:async function(){},seek:async function(e){}}},167:e=>{"use strict";e.exports=require("axios")},96:e=>{"use strict";e.exports=require("bcrypt")},423:e=>{"use strict";e.exports=require("bonjour-service")},242:e=>{"use strict";e.exports=require("conf")},142:e=>{"use strict";e.exports=require("dotenv")},239:e=>{"use strict";e.exports=require("events")},442:e=>{"use strict";e.exports=require("fastify")},103:e=>{"use strict";e.exports=require("fastify-cors")},543:e=>{"use strict";e.exports=require("fastify-http-proxy")},87:e=>{"use strict";e.exports=require("fastify-static")},544:e=>{"use strict";e.exports=require("rpi-gpio")},41:e=>{"use strict";e.exports=require("tree-kill")},352:e=>{"use strict";e.exports=require("ws")},81:e=>{"use strict";e.exports=require("child_process")},147:e=>{"use strict";e.exports=require("fs")},17:e=>{"use strict";e.exports=require("path")}},t={};function s(n){var r=t[n];if(void 0!==r)return r.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,s),o.exports}(()=>{const e=s(352),t=s(386),{spawn:n,exec:r,execSync:o}=s(81),i=s(17),a=s(619),c=s(306),l=s(898),d=s(525),u=s(894),p=s(549),g=s(945);(async()=>{await g.init();const e=new u;e.on("debug",console.debug),await e.ensure(),await d.waveHi(),await p.observe((e=>{"sleep"===e&&o("sudo poweroff")}))})();const h=()=>{console.log("Cleaning up child processes...");try{o("killall jack_capture")}catch(e){console.log("jack_capture not running...")}try{o("killall jackd")}catch(e){console.log("jackd not running...")}process.exit()};process.on("SIGTERM",h),process.on("SIGINT",h);const f=a.dsApiPort||8081;c.get().then((e=>{const{Bonjour:t}=s(423),n=new t;console.log("Publishing bonjour",e),n.publish({name:e,type:"http",port:f})}));const{join:y}=s(17),v=s(558),m=s(666),w=s(435),x=s(274),S=(s(267),s(442)({logger:!0}));S.register(s(87),{root:i.join("/","ui/dropstation/dist"),prefix:"/",decorateReply:!1}),S.register(s(87),{root:a.rootDataDir,prefix:"/files",decorateReply:!1}),S.register(s(103),{origin:!0,methods:["GET","PUT","POST","DELETE","OPTIONS"],exposedHeaders:["Content-Type","Authorization"],credentials:!0}),S.addHook("onRequest",(async(e,t)=>{"/files/*"!==e.routerPath&&("/management/auth"===e.routerPath&&["GET","POST"].indexOf(e.routerMethod)>-1||"/management/authentication"===e.routerPath&&"POST"===e.routerMethod||e.headers.dspin&&await l.getPinHash()===e.headers.dspin||t.code(403).send({message:"Access denied"}))})),S.setErrorHandler((function(e,t,s){if(console.log("error handler",e.message,e.name,e.stack),"ValidationError"===e.name)return s.code(422).send(e.errors);s.code(500).send({message:"System Error",error:e.message})})),S.get("/management/auth",v.get),S.post("/management/auth",v.post),S.put("/management/auth",v.put),S.delete("/management/auth",v.del),S.post("/management/authentication",v.authentication);const I=s(202);function k(){this.isAlive=!0}S.register(I.proxyHandler),S.register(I.authHandler,{prefix:"/bt-auth"}),S.post("/playing",m.play),S.delete("/playing",m.stop),S.get("/sessions",x.index),S.post("/sessions",x.store),S.get("/sessions/:id",x.read),S.delete("/sessions/:id/:side",x.deleteRecording),S.get("/sessions/:id/:side",x.getRecording),S.post("/captures/record",w.record),S.post("/captures/stop",w.stop),S.get("/",(async(e,t)=>{t.send({message:"Welcome to dropstation."})})),S.listen(f,"0.0.0.0",((e,t)=>{if(e)throw e}));const _=new e.Server({host:"0.0.0.0",port:parseInt(f)+1});_.on("listening",(()=>{console.log("ws listening",f+1)})),_.on("connection",(function(e){e.isAlive=!0,e.on("pong",k)}));const j=setInterval((function(){_.clients.forEach((function(e){if(!1===e.isAlive)return e.terminate();e.isAlive=!1,e.ping()}))}),3e4);_.on("close",(function(){clearInterval(j)})),_.on("connection",(function(e){e.on("message",(function(e){console.log("received: %s",e)})),t.sub("levels",(t=>{e.send(JSON.stringify({event:"levels",levels:t}))})),t.sub("capturing",(t=>{e.send(JSON.stringify({event:"capturing",capturing:t}))})),e.send("hi")}))})()})();