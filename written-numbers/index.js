(function(d,i,l,M,c,k,m,x,O,$){"use strict";const{FormSection:B,FormDivider:C,FormRow:N,FormSwitchRow:w}=k.Forms;function E(){return M.useProxy(i.storage),React.createElement(l.ReactNative.ScrollView,{style:{flex:1}},React.createElement(B,{title:"Message Text Replacement",titleStyleType:"no_border"},React.createElement(w,{label:"Basic Numbers",subLabel:"Replaces numbers in your messages like `10 -> ten`.",leading:React.createElement(N.Icon,{source:c.getAssetIDByName(i.storage.replace.basic?"ic_check_24px":"ic_close_24px")}),value:i.storage.replace.basic,onValueChange:function(e){i.storage.replace.basic=e}}),React.createElement(C,null),React.createElement(w,{label:"Syntax Numbers",subLabel:"Replaces numbers in your messages with syntax like `n10;; -> ten` and `N10n**100n;; -> Ten duotrigintillion`.",leading:React.createElement(N.Icon,{source:c.getAssetIDByName(i.storage.replace.syntax?"ic_check_24px":"ic_close_24px")}),value:i.storage.replace.syntax,onValueChange:function(e){i.storage.replace.syntax=e}})))}let v;function P(){I(),v=m.commands.registerCommand({name:"reload",displayName:"reload",applicationId:"vendetta",description:"Reloads the Discord client.",displayDescription:"Reloads the Discord client.",type:1,inputType:1,options:[],async execute(e,n){l.ReactNative.NativeModules.BundleUpdaterManager.reload()}})}function I(){v?.()}function p(e,n,a){return e.find(function(t){return t.name===n})?.value??a}function R(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const t=n.map(function(r){switch(typeof r){case"string":return r;case"object":return JSON.stringify(r)}return r?.toString()}).join(" ");x.showToast(t,c.getAssetIDByName("ic_badge_staff")),m.logger.log(...n)}const F=/^-?(?:\d+\.?|\.\d+|\d+\.\d+)$/,g=new Map;async function h(e){let{number:n,options:a,languageOptions:t}=e;if(a??={language:"en"},t??={},g.has(n))return g.get(n);if(!F.test(n))try{n=new Function(`return ${n}`)()}catch(s){return R(s),"NotANumber"}const r=await fetch("https://numbers.kyza.net/api",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({number:n,options:a,languageOptions:t})}).then(function(s){return s.text()});return g.set(n,r),r}let _;function L(){S(),_=m.commands.registerCommand({name:"written number",displayName:"written number",applicationId:"written-numbers",description:"Makes numbers written.",displayDescription:"Makes numbers written.",type:1,inputType:1,options:[{name:"number",displayName:"number",description:"The number to convert.",displayDescription:"The number to convert.",type:3,required:!0},{name:"commas",displayName:"commas",description:"Whether or not to use commas.",displayDescription:"Whether or not to use commas.",type:5,required:!1},{name:"hundred_and",displayName:"hundred_and",description:"Whether or not to use and after hundreds.",displayDescription:"Whether or not to use and after hundreds.",type:5,required:!1}],async execute(e,n){let a=p(e,"number","");const t=p(e,"commas",!1),r=p(e,"hundred_and",!1),s=await h({number:a,languageOptions:{commas:t,hundredAnd:r}});l.clipboard.setString(s),x.showToast("Copied number to clipboard.",c.getAssetIDByName("toast_copy_link"))}})}function S(){_?.()}const j=O.findByProps("sendMessage","receiveMessage");let A;function T(e,n){return e.some(function(a){let[t,r]=a;return t<=n&&n<=r})}function z(e){return e.charAt(0).toUpperCase()+e.slice(1)}function J(e,n,a,t){return e.substring(0,n)+t+e.substring(a)}var u;(function(e){e[e.PLAIN=0]="PLAIN",e[e.SYNTAX=1]="SYNTAX"})(u||(u={}));const y=/(?:(?:(?<!\\)```(?:.|\n)+?(?<!\\)```)|(?:(?<!\\)`[^`]+?`))/g,f=/\b(?<!n)-?(?:\d+\.|\d+|\.\d+|\d+\.\d+)(?!;;)\b/gi,b=/\b(n)(.+?);;/gi;async function W(e){const n=e,a=[];let t;for(;(t=y.exec(e))!==null;)t.index===y.lastIndex&&y.lastIndex++,a.push([t.index,t.index+t[0].length-1]);const r=[];if(i.storage.replace.syntax)for(t=null;(t=b.exec(e))!==null;)t.index===b.lastIndex&&b.lastIndex++,T(a,t.index)||(r.push({type:u.SYNTAX,match:t,capitalize:t[1]==="N",words:h({number:t[2]})}),a.push([t.index,t.index+t[0].length-1]));if(i.storage.replace.basic)for(t=null;(t=f.exec(e))!==null;)t.index===f.lastIndex&&f.lastIndex++,T(a,t.index)||r.push({type:u.PLAIN,match:t,capitalize:!1,words:h({number:t[0]})});r.sort(function(s,o){return s.match.index>o.match.index?-1:s.match.index<o.match.index?1:0});for(const s of r){let o=await s.words;s.capitalize&&(o=z(o)),e=J(e,s.match.index,s.match.index+s.match[0].length,o)}return e.length>4e3?n:e}function q(){D(),A=$.instead("sendMessage",j,function(e,n){const a=JSON.parse(JSON.stringify(e));(async function(){try{a[1].content=await W(a[1].content)}catch(t){R(t.stack)}n(...a)})()})}function D(){A?.()}i.storage.replace??={basic:!0,syntax:!0};var U={onLoad:function(){L(),P(),q()},onUnload:function(){S(),I(),D()},settings:E};return d.default=U,Object.defineProperty(d,"__esModule",{value:!0}),d})({},vendetta.plugin,vendetta.metro.common,vendetta.storage,vendetta.ui.assets,vendetta.ui.components,vendetta,vendetta.ui.toasts,vendetta.metro,vendetta.patcher);
