//for rounding to hundreth
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

//getting the value of each cookie and assigning them to variables
var score_var = Cookies.get("score_cookie")
var time_var = Cookies.get("fastest_time_cookie");

//for first-time users; if the cookies don't exist, your high score is 0 and your fastest time is an arbitrary high number
if (score_var == null && time_var == null) {
    Cookies.set("score_cookie", "0");
    Cookies.set("fastest_time_cookie", "99999");
    $("#high_score").html("High Score: 0")
    location.reload()
} else if (time_var == "99999") {
    $("#high_score").html("High Score: " + score_var)
} else {
    $("#high_score").html("Fastest time: " + Math.round10(time_var, -2) + "s")
}