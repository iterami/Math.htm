'use strict';

function calculate(){
    core_storage_save([
      'calculator',
    ]);

    if(core_elements['calculator'].value.length === 0){
        document.title = core_repo_title;
        core_ui_update({
          'ids': {
            'result': '',
            'result-formatted': '',
          },
        });
        return;
    }

    let syntax_error = false;
    let result = '';
    try{
        result = globalThis.eval(core_replace_multiple({
          'patterns': {
            ',': '',
            'π': 'Math.PI',
          },
          'string': core_elements['calculator'].value,
        }));

    }catch(error){
        syntax_error = true;
        result = 'SYNTAX ERROR';
    }
    let formatted_result = result;
    if(!syntax_error){
        let decimals = 0;
        const result_string = result.toString();
        if(result_string.includes('.')){
            decimals = result_string.split('.')[1].length;
        }
        formatted_result = core_number_format({
          'decimals-min': decimals,
          'number': result,
        });
    }
    core_ui_update({
      'ids': {
        'result': result,
        'result-formatted': formatted_result,
      },
    });
    document.title = formatted_result + ' = ' + core_elements['calculator'].value;
}

function calculate_height(){
    core_elements['height'].value = core_elements['width'].value
      * (core_elements['ratio-height'].value / core_elements['ratio-width'].value);
}

function calculate_interest(){
    core_storage_save([
      'compound',
      'decimals-min',
      'interest',
      'principal',
      'time',
    ]);

    let loop_counter = core_storage_data['time'] - 1;
    let result = 0;
    if(loop_counter >= 0){
        const interest = core_storage_data['interest'] / 100;
        let principal = core_storage_data['principal'];

        do{
            result += principal * interest;

            if(core_storage_data['compound']){
                principal += principal * interest;
            }
        }while(loop_counter--);
        result += principal;

    }else{
        result = core_storage_data['principal'];
    }

    core_ui_update({
      'ids': {
        'result-interest': core_number_format({
          'decimals-min': core_storage_data['decimals-min'],
          'number': result,
        }),
      },
    });
}

function calculate_percent(){
    core_storage_save([
      'step-end',
      'step-interval',
      'step-limit',
      'step-start',
    ]);

    let result = '';
    let steps = 0;
    for(let i = core_storage_data['step-start']; i <= core_storage_data['step-end']; i+= core_storage_data['step-interval']){
        steps++;

        if(core_storage_data['step-limit'] > 0
          && steps > core_storage_data['step-limit']){
            result += '<tr><td colspan=4>Step Limit Reached';
            break;
        }

        const step_percent = i === 0
          ? 0
          : (core_storage_data['step-interval'] / (core_storage_data['step-end'] - i + core_storage_data['step-interval'])) * 100;

        result += '<tr><td>' + (steps - 1)
          + '<td>' + i
          + '<td>' + step_percent + '%'
          + '<td>' + (i / core_storage_data['step-end']) * 100 + '%';
    }
    core_elements['result-percent'].innerHTML = result;
}

function calculate_width(){
    core_elements['width'].value = core_elements['height'].value
      * (core_elements['ratio-width'].value / core_elements['ratio-height'].value);
}

function insert(text){
    const position = core_elements['calculator'].selectionStart;
    core_elements['calculator'].value = core_elements['calculator'].value.substring(0, position) + text + core_elements['calculator'].value.substring(position, core_elements['calculator'].value.length);
    core_elements['calculator'].selectionEnd = position + text.length;
    core_elements['calculator'].focus();
}

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
        'clear': {
          'onclick': function(){
              if(!globalThis.confirm('Clear?')){
                  return;
              }

              core_elements['calculator'].value = '';
              core_elements['calculator'].focus();
              calculate();
          },
        },
        'euler': {
          'onclick': function(){
              insert('Math.E');
          },
        },
        'height': {
          'oninput': calculate_width,
        },
        'pi': {
          'onclick': function(){
              insert('π');
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
        'Enter': {
          'todo': function(event){
              if(core_elements['calculator'] === document.activeElement){
                  event.preventDefault();
                  if(core_key_shift){
                      insert('\n');
                      return;
                  }
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
        'step-end': 10,
        'step-interval': 1,
        'step-limit': 100,
        'step-start': 0,
        'time': 0,
      },
      'title': 'Math.htm',
      'ui-elements': [
        'height',
        'ratio-height',
        'ratio-width',
        'result-percent',
        'width',
      ],
    });

    core_storage_update();
    calculate();
}
