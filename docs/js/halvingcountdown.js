/*
 * Copyright 2021 The BitcoinZ Project
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to
 * do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHTHOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var elem = document.getElementById('btcz-halving-countdown');

// Set (get) the block height, halving interval and blocktime
var ActualBlockHeight = <%= BlockHeiht %>;
var HalvingInterval = 840000;
var BlockTime = 150;

// get the next halving values
var NextHalvingIsNb = 0;
var NextHalvingBlock = 0;
while (NextHalvingBlock < ActualBlockHeight) {
    NextHalvingBlock = NextHalvingBlock + HalvingInterval;
    NextHalvingIsNb ++;
}

// Define some other utils value
var BlocksToHalving = NextHalvingBlock-ActualBlockHeight;
var SecondsToHalving = BlocksToHalving*BlockTime;
var MinutesToHalving = SecondsToHalving/60;
var HoursToHalving = MinutesToHalving/60;
var DaysToHalving = HoursToHalving/24;

var DateTimeNow = new  Date();
var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}

// Set the date we're counting down to
var HalvingDateTime = add_minutes(DateTimeNow, MinutesToHalving); // MinutesToHalving selected
var countDownDate = HalvingDateTime.getTime();

if (!!elem) {
  setInterval(function() {

    // Get today's date and time
    // and fin the distance between now and the count down date
    var now = new  Date().getTime();
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="btcz-halving-countdown" as defined in the display attribute
    if (elem.getAttribute("display")=="countdown1") elem.innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    if (elem.getAttribute("display")=="countdown2") elem.innerText = days + ":" + hours + ":" + minutes + ":" + seconds;
    if (elem.getAttribute("display")=="fulldatetime") elem.innerText = HalvingDateTime.toString();
    if (elem.getAttribute("display")=="full1") elem.innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s \r\n" + HalvingDateTime.toString();
    if (elem.getAttribute("display")=="full2") elem.innerText = days + ":" + hours + ":" + minutes + ":" + seconds + " \r\n" + HalvingDateTime.toString();

  }, 990);
}


// Only for debug...
//console.log("Date now : " + Date().toString());
//console.log("Date halving : " + HalvingDateTime.toString());
//console.log("---------------------------------");
