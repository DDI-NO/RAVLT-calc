const coefs = {
  'intercept': 5.070,
  'age': -0.035,
  'education': 0.129,
  'sex': 0.748,
  'sd': 1.590,
  'trial1': {
    'b': 0,
    'age': 0,
    'education': 0,
    'sex': 0,
    'sd': 1.590
  },

  'trial2': {
    'b': 2.430,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },
  'trial3': {
    'b': 3.834,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },
  'trial4': {
    'b': 5.063,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },
  'trial5': {
    'b': 5.558,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },
  'trial6': {
    'b': 3.274,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },
  'trial7': {
    'b': 3.145,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },
  'listb': {
    'b': 0.165,
    'age': -0.035,
    'education': 0.129,
    'sex': 0.748,
    'sd': 1.590
  },

  // Derived measures
  'total-learning': {
    'intercept': 42.319,
    'age': -0.270,
    'education': 1.097,
    'sex': 5.861,
    'sd': 7.983
  },
  'learning-over': {
    'intercept': 16.981,
    'education': 0.485,
    'sex': 2.155,
    'sd': 6.695
  },
  'learning-rate': {
    'intercept': 5.594,
    'education': 0.159,
    'sex': 0.572,
    'sd': 6.695
  },
  'proactive': {
    'intercept': 0.053,
    'sd': 1.887
  },
  'retroactive': {
    'intercept': 2.123,
    'sd': 1.886
  },
  'ltpr': {
    'intercept': 77.405,
    'age': -0.429,
    'education': 3.834,
    'sd': 16.502
  },
}

function calculate_tscore(elem) {

  var age = parseInt($('#age').val());
  var edu = parseInt($('#edu').val());
  var sex = parseInt($('#sex').val());

  if (this.value !== '') {
    var value = parseInt(this.value);
    var trial = $(this).data('trial');
    var trial_coefs = coefs[trial];
    var predicted = coefs.intercept + (sex * coefs.sex) +
      (age * coefs.age) + (edu * coefs.education) + trial_coefs.b +
      (edu * trial_coefs.education) + (sex * trial_coefs.sex);
    // console.log(coefs.intercept + '+(' + sex +'*'+coefs.sex+')' +
    //           '+ ('+age+'*'+coefs.age+') + ('+ edu+'*'+coefs.education+') + ('+trial_coefs.b+') + ' +edu+ '*'+ trial_coefs.education+') + ('+sex+ '*' +trial_coefs.sex+')')

    var dif = value - predicted;
    var zscore = (value - predicted) / trial_coefs.sd;
    var tscore = Math.round(zscore * 10 + 50);
    // console.log(trial + '==> predicted=' + predicted + ' dif='+dif + ' zscore='+zscore + ' tscore='+tscore);
    $('#t-score-' + trial).val(tscore);
  }


}

function calculate_1_5(age, edu, sex) {
  var result = undefined;
  try {
    var derived = 'total-learning'
    var vals = $('input')
      .filter(function() {
        return this.id.match(/raw-[1,2,3,4,5]/);
      }).map(function(idx, ele) {
        return $(ele).val();
      }).get();
    var result = vals.reduce((a, b) => parseInt(a) + parseInt(b), 0)
    $('#total-learning').val(result)

    tcoefs = coefs[derived];
    var predicted = tcoefs["intercept"] + (edu * tcoefs["education"]) + (sex * tcoefs["sex"]) + (age * tcoefs["age"]);
    var dif = result - predicted;
    var zscore = dif / tcoefs.sd;
    var tscore = Math.round(zscore * 10 + 50);
    $('#t-score-' + derived).val(tscore);
  } catch (e) {
    console.log(e)
  }
  return result;

}

function calculate_learning(t_1_5, age, edu, sex) {
  if (t_1_5 !== undefined) {
    var derived = 'learning-over'
    var t1 = parseInt($('#raw-1').val());
    var learning = t_1_5 - (t1 * 5);
    $('#learning-over').val(learning);
    tcoefs = coefs[derived];
    var predicted = tcoefs["intercept"] + (edu * tcoefs["education"]) + (sex * tcoefs["sex"]);
    var dif = learning - predicted;
    var zscore = dif / tcoefs.sd;
    var tscore = Math.round(zscore * 10 + 50);
    $('#t-score-' + derived).val(tscore);
  }
}

function calculate_learning_rate(age, edu, sex) {
  var derived = 'learning-rate'
  var t1 = parseInt($('#raw-1').val())
  var t5 = parseInt($('#raw-5').val())
  var rate = (t5 - t1)
  $('#learning-rate').val(rate)

  tcoefs = coefs[derived];
  var predicted = tcoefs["intercept"] + (edu * tcoefs["education"]) + (sex * tcoefs["sex"]);
  var dif = rate - predicted;
  var zscore = dif / tcoefs.sd;
  var tscore = Math.round(zscore * 10 + 50);
  $('#t-score-' + derived).val(tscore);
}

function calculate_proactive(age, edu, sex) {
  var t1 = parseInt($('#raw-1').val())
  var listb = parseInt($('#raw-list-B').val())
  var rate = (t1 - listb)
  $('#proactive').val(rate)
}

function calculate_retroactive(age, edu, sex) {
  var t5 = parseInt($('#raw-5').val())
  var t6 = parseInt($('#raw-6').val())
  var rate = (t5 - t6)
  $('#retroactive').val(rate)
}

function calculate_retention(age, edu, sex) {
  var derived = 'ltpr'
  var t5 = parseInt($('#raw-5').val())
  var t6 = parseInt($('#raw-6').val())
  var rate = (100 * (t6 / t5))
  $('#ltpr').val(rate)

  var tcoefs = coefs[derived];
  var predicted = tcoefs["intercept"] + (edu * tcoefs["education"]) + (age * tcoefs["age"]);
  var dif = rate - predicted;
  var zscore = dif / tcoefs.sd;
  var tscore = Math.round(zscore * 10 + 50);
  $('#t-score-' + derived).val(tscore);

}

function calculate_derived(age, edu, sex) {
  var t_1_5 = calculate_1_5(age, edu, sex);
  calculate_learning(t_1_5, age, edu, sex);
  calculate_learning_rate(age, edu, sex);
  calculate_proactive(age, edu, sex);
  calculate_retroactive(age, edu, sex);
  calculate_retention(age, edu, sex);
}

function calculate() {
  $('.raw').each(calculate_tscore);
  var age = parseInt($('#age').val());
  var edu = parseInt($('#edu').val());
  var sex = parseInt($('#sex').val());
  calculate_derived(age, edu, sex);
}
