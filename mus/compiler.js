var endTime = function (time, expr) {
	if(expr.tag==='note') return time+expr.dur;
	if(expr.tag==='rest') return time+expr.duration;
	if(expr.tag==='seq') return endTime(endTime(time,expr.left),expr.right);
	if(expr.tag==='par') return Math.max(endTime(time,expr.left),endTime(time,expr.right));
	if(expr.tag==='repeat') return expr.count*endTime(expr.section);
};

function charCode(letter) {
	return letter.charCodeAt(0);
}
function convertPitch(pitch) {
	var letter=pitch.substr(0,1).toUpperCase().charCodeAt(0)-'C'.charCodeAt(0);
	var octave=pitch.substr(1);
	if(letter<0) letter+=12;
	return 12+12*octave+letter;
}
function compileT(time,expr) {
	if(expr.tag==='repeat') {
		var r=[];
		var t=time, dt=endTime(0,expr.section);
		for(var i=1;i<=expr.count;++i) {
			r=r.concat(compileT(t,expr.section));
			t+=dt;
		}
		return r;
	}
	if(expr.tag==='rest') {
		return [{tag:expr.tag, start:time, duration:expr.duration}];
	}
	if(expr.tag==='note') {
		return [{tag:expr.tag, pitch:convertPitch(expr.pitch),
			start:time, dur:expr.dur}];
	}
	if(expr.tag==='seq') {
		var end=endTime(time,expr.left);
		return compileT(time,expr.left).concat(compileT(end,expr.right));
	}
	if(expr.tag==='par') {
		return compileT(time,expr.left).concat(compileT(time,expr.right));
	}
}
										var compile = function (musexpr) {
	return compileT(0,musexpr);
};
var melody_mus = 
{ tag: 'seq',
left:{ tag: 'seq',
	left: 
		{ tag: 'seq',
		left: { tag: 'note', pitch: 'a4', dur: 250 },
		right: { tag: 'note', pitch: 'b4', dur: 250 } },
	right:
		{ tag: 'seq',
		left: { tag: 'note', pitch: 'c4', dur: 500 },
		right: { tag: 'note', pitch: 'd4', dur: 500 } }
},
right:{ tag: 'repeat',
  section: { tag: 'note', pitch: 'c4', dur: 250 },
    count: 3 }
};

console.log(melody_mus);
console.log(compile(melody_mus));
