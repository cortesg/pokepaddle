function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
          return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
          return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }  

        // Decimal round
        if (!Math.round10) {
            Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    };

if (Cookies.get("score_cookie") == null) {
    Cookies.set("score_cookie", "0");
    $("#high_score").html("High Score: 0")
} 

//getting the value of each cookie and assigning them to variables
var highscore_var = Cookies.get("highscore_cookie");
//for first-time users; if the cookies don't exist, your fastest time is an arbitrary high number
if (highscore_var == null) {
    Cookies.set("highscore_cookie", "99999");
} 

if (Cookies.get("highscore_cookie") == "99999") {
    $("#high_score").html("High Score: " + Cookies.get("score_cookie"))
} else {
    $("#high_score").html("Fastest time: " + Math.round10(highscore_var, -2) + "s")
}




// if (parseInt(Cookies.get("highscore_cookie")) > game.time.totalElapsedSeconds() && score == 21){
//     $("#high_score").html("Fastest time: " + Math.round10(highscore_var, -2) + "s")
// }