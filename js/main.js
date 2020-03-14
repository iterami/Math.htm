'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'add-result': {
          'onclick': add_result,
        },
        'calculate': {
          'onclick': calculate,
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
      },
      'title': 'Math.htm',
    });

    core_storage_update();
    calculate();
}
