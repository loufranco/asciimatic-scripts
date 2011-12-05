// ASCIIMatic Drawing
// Copyright (c) Lou Franco. All rights reserved.
// 
//   Current source can be found here: https://github.com/loufranco/asciimatic-scripts
//   By using this software in any fashion, you are agreeing to be bound by
//   the terms of this license.
//
// You must not remove this notice, or any other, from this software.
//   The use and distribution terms for this software are covered by the
//   BSD 3 Clause License
//
// Copyright (c) 2011, Lou Franco
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, 
// are permitted provided that the following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the 
// following disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the 
// following disclaimer in the documentation and/or other materials provided with the distribution.
//
// Neither the name of the owner, Lou Franco, or ASCIIMatic nor the names of its contributors may be used to endorse or 
// promote products derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY 
// AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
// OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
// USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

function AsciiScreen () {
	this._screenData = new Array();
	this._fontSize = 10;
	this._width = 0;
}

AsciiScreen.prototype.clear = function() {
	this._screenData = new Array();
	this._width = 0;
}

AsciiScreen.prototype.getRow = function(y) {
	var row = this._screenData[y];
	if (!row) {
		this._screenData[y] = new Array();
	}
	return this._screenData[y];
}

AsciiScreen.prototype.getWidth = function() {
	return this._width;
}

AsciiScreen.prototype.updateWidth = function(w) {
	if (w > this._width) this._width = w;
}

AsciiScreen.prototype.getHeight = function() {
	return this._screenData[y].length;
}

AsciiScreen.prototype.drawLine = function(x1, y1, x2, y2) {
	x1 = Math.round(x1);
	y1 = Math.round(y1);
	x2 = Math.round(x2);
	y2 = Math.round(y2);
	
	if (y1==y2) {
		if (x2 > x1)
			this.drawHLine(x1, y1, x2-x1+1);
		else
			this.drawHLine(x2, y1, x1-x2+1);	
		return;	
	} else if (x1==x2) {
		if (y2 > y1)
			this.drawVLine(x1, y1, y2-y1+1);
		else
			this.drawVLine(x1, y2, y1-y2+1);
		return;
	} else {
		if (Math.abs(x2-x1) > Math.abs(y2-y1))
			this.drawRectLine(x1, y1, x2, y2, '-', '-');
		else
			this.drawRectLine(x1, y1, x2, y2, '|', '|');
	}
}

AsciiScreen.prototype.drawHLine = function (x, y, len) {
	x = Math.round(x);
	y = Math.round(y);

	if (len < 0) {
		len = -len;
		x -= len;
	}
	var row = this.getRow(y);
	row[x] = '+';
	for (var i = x+1; i < x+len-1; ++i) {
		if (row[i] != '+')
			row[i] = '-';
	}	
	row[x+len-1] = '+';
	this.updateWidth(row.length);
}

AsciiScreen.prototype.drawVLine = function (x, y, len) {
	x = Math.round(x);
	y = Math.round(y);
	
	if (len < 0) {
		len = -len;
		y -= len;
	}
	var row = this.getRow(y);
	row[x] = '+';
	for (var i = y+1; i < y+len-1; ++i) {
		row = this.getRow(i);
		if (row[x] != '+')
			row[x] = '|';
	}	
	this.getRow(y+len-1)[x] = '+';
	this.updateWidth(x+1);
}

AsciiScreen.prototype.drawRect = function(x, y, w, h) {
	this.drawHLine(x, y, w);
	this.drawHLine(x, y+h-1, w);
	this.drawVLine(x, y, h);
	this.drawVLine(x+w-1, y, h);
}

AsciiScreen.prototype.drawRectLine = function(x1, y1, x2, y2, sdir, edir) {
	x1 = Math.round(x1);
	y1 = Math.round(y1);
	x2 = Math.round(x2);
	y2 = Math.round(y2);

	if (x1==x2 || y1==y2) {
		this.drawLine(x1, y1, x2, y2);
		return;
	}
	
	if (sdir == edir) {
		if (sdir =='-') {
			var halfLen = (x2-x1)/2;
			this.drawLine(x1, y1, x1+halfLen, y1);
			this.drawLine(x1+halfLen, y1, x1+halfLen, y2);
			this.drawLine(x1+halfLen, y2, x2, y2);				
		} else {
			var halfLen = (y2-y1)/2;
			this.drawLine(x1, y1, x1, y1+halfLen);
			this.drawLine(x1, y1+halfLen, x2, y1+halfLen);
			this.drawLine(x2, y1+halfLen, x2, y2);
		}
	} else {
		if (sdir == '-') {
			this.drawLine(x1, y1, x2, y1);
			this.drawLine(x2, y1, x2, y2);	
		} else {
			this.drawLine(x1, y1, x1, y2);
			this.drawLine(x1, y2, x2, y2);
		}
	}
	
}

AsciiScreen.prototype.fillRect = function(x, y, w, h, fillChar) {
	if (!fillChar) fillChar = ' ';
	this.drawRect(x, y, w, h);
	for (var i = y+1; i < y+h-1; ++i) {
		row = this.getRow(i);
		for (var j = x+1; j < x+w-1; ++j) {
			row[j] = fillChar;
		}
	}	
}

AsciiScreen.prototype.drawHString = function(x, y, s) {
	x = Math.round(x);
	y = Math.round(y);
	
	var row = this.getRow(y);
	var l = s.length;
	for (var i = 0; i < l; ++i) {
		row[x+i] = s[i];
	}
	this.updateWidth(x+l);
}

AsciiScreen.prototype.getCharAt = function(x, y) {
	var row = this.getRow(y);
	var c = row[x];
	if (c) {
		return c;
	}
	return ' ';
}

AsciiScreen.prototype.putChar = function(x, y, c) {
	x = Math.round(x);
	y = Math.round(y);

	this.getRow(y)[x] = c;
	this.updateWidth(x+1);
}

AsciiScreen.prototype.getHeight = function() {
	return this._screenData.length;
}

AsciiScreen.prototype.getRowWidth = function(y) {
	return this.getRow(y).length;
}

AsciiScreen.prototype.paintOnto = function(el) {
	var s = "<pre style='font-family:courier;font-size:"+
		this._fontSize+"px;line-height:"+(this._fontSize)+"px'>";
	var h = this.getHeight();
	
	for (var y = 0; y<h; ++y) {
		var w = this.getRowWidth(y);
		for (var x = 0; x<w; ++x) {
			s += this.getCharAt(x, y);
		}		
		s += "\n";
	}
	s += "</pre>";
	el.innerHTML = s;
}

