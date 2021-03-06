




var elem = document.getElementById('btcz-halving-countdown');

var ActualBlockHeight = <%= BlockHeiht %>;
var HalvingInterval = 840000;
var BlockTime = 150;

var NextHalvingBlock =0;
while (NextHalvingBlock < ActualBlockHeight) {
    NextHalvingBlock=NextHalvingBlock+HalvingInterval;
}

var BlocksToHalving = NextHalvingBlock-ActualBlockHeight;
var SecondsToHalving = BlocksToHalving*BlockTime;
var MinutesToHalving = SecondsToHalving/60;
var HoursToHalving = MinutesToHalving/60;
var DaysToHalving = HoursToHalving/24;

var DateTimeNow = new  Date();
var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}
var HalvingDateTime = add_minutes(DateTimeNow, MinutesToHalving); //MinutesToHalving





if (!!elem) {



  // Set the date we're counting down to
  var countDownDate = HalvingDateTime.getTime();

  // Update the count down every 1 second
  setInterval(function() {

    // Get today's date and time
    var now = new  Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"

    if (elem.getAttribute("display")=="countdown1") elem.innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    if (elem.getAttribute("display")=="countdown2") elem.innerText = days + ":" + hours + ":" + minutes + ":" + seconds;
    if (elem.getAttribute("display")=="fulldatetime") elem.innerText = HalvingDateTime.toString();
    if (elem.getAttribute("display")=="full1") {
      elem.innerText = days + "d " + hours + "h " + minutes + "m " + seconds + "s \r\n" + HalvingDateTime.toString();
    }
    if (elem.getAttribute("display")=="full2") {
      elem.innerText = days + ":" + hours + ":" + minutes + ":" + seconds + " \r\n" + HalvingDateTime.toString();
    }


  }, 990);

}



console.log("Date now : " + Date().toString());
console.log("Date halving : " + HalvingDateTime.toString());
console.log("---------------------------------");
