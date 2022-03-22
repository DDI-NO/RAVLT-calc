const coefs = {
  'intercept': 5.052935,
  'age': -0.041005,
  'education': 0.127599,
  'sex': 0.761477,
  'sd': 1.589299,
  'trial1': {
    'b': 0,
    'age': 0,
    'education': 0,
    'sex': 0,
    'sd': 1.589299
  },

  'trial2': {
    'b': 2.456629,
    'education': 0.096803,
    'sex': 0.540453,
    'sd': 1.812938
  },
  'trial3': {
    'b': 3.825560,
    'education': 0.122444,
    'sex': 0.620025,
    'sd': 2.068447
  },
  'trial4': {
    'b': 5.099066,
    'education': 0.120430,
    'sex': 0.317594,
    'sd': 2.167247
  },
  'trial5': {
    'b': 5.591102,
    'education': 0.157893,
    'sex': 0.570805,
    'sd': 2.118599
  },
  'trial6': {
    'b': 3.281919,
    'education': 0.212357,
    'sex': 0.900086,
    'sd': 2.676763
  },
  'trial7': {
    'b': 3.150541,
    'education': 0.230134,
    'sex': 0.712087,
    'sd': 2.695187
  },
  'listb': {
    'b': 0.181328,
    'education': 0.053071,
    'sex': -0.414812,
    'sd': 1.673211
  },

  // Derived measures
  'total-learning': {
    'intercept': 42.295694,
    'age': -0.269194,
    'education': 1.095370,
    'sex': 5.853990,
    'sd': 7.981813
  },
  'learning-over': {
    'intercept': 16.971644,
    'education': 0.479403,
    'sex': 2.151586,
    'sd': 6.698638
  },
  'learning-rate': {
    'intercept': 5.591102,
    'education': 0.157893,
    'sex': 0.570805,
    'sd': 2.132889
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
    'intercept': 77.377120,
    'age': -0.427209,
    'education': 1.054169,
    'sd': 16.492587
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
