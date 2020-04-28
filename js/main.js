'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'calculate': {
          'onclick': calculate,
        },
        'calculate-interest': {
          'onclick': calculate_interest,
        },
        'calculate-percent': {
          'onclick': calculate_percent,
        },
        'height': {
          'oninput': calculate_width,
        },
        'pi': {
          'onclick': function(){
              document.getElementById('calculator').value += 'π';
          },
        },
        'ratio-height': {
          'oninput': calculate_width,
        },
        'ratio-width': {
          'oninput': calculate_height,
        },
        'width': {
          'oninput': calculate_height,
        },
      },
      'keybinds': {
        13: {
          'todo': function(event){
              if(document.getElementById('calculator') === document.activeElement){
                  event.preventDefault();
              }

              calculate();
          },
        },
      },
      'storage': {
        'calculator': '',
        'compound': false,
        'decimals-min': 2,
        'interest': 0,
        'principal': 0,
        'step-interval': 1,
        'step-limit': 100,
        'step-max': 10,
        'step-start': 0,
        'time': 0,
      },
      'title': 'Math.htm',
    });

    core_storage_update();
    calculate();
}
