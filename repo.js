'use strict';

function calculate(){
    core_storage_save({
      'keys': [
        'calculator',
      ],
      'rebind': false,
    });

    if(core_elements.calculator.value.length === 0){
        document.title = core_repo_title;
        core_ui_update({
          'ids': {
            'result': '',
            'result_formatted': '',
          },
        });
        return;
    }

    let result = '';
    try{
        result = globalThis.eval(core_replace({
          'patterns': {
            'Result': core_elements.result.textContent,
            ',': '',
            'π': 'Math.PI',
          },
          'string': core_elements.calculator.value,
        }));

    }catch(error){
        result = error;
    }
    const formatted_result = core_number_format({
      'number': result,
    });
    core_ui_update({
      'ids': {
        'result': result,
        'result_formatted': formatted_result,
      },
    });
    document.title = formatted_result + ' = ' + core_elements.calculator.value;
}

function calculate_height(){
    core_elements.height.value = core_round({
      'number': core_elements.width.value
        * (core_elements.ratio_height.value / core_elements.ratio_width.value),
    });
}

function calculate_interest(){
    core_storage_save({
      'keys': [
        'compound',
        'decimals',
        'interest',
        'principal',
        'time',
      ],
      'rebind': false,
    });

    const interest = core_storage_data.interest / 100;
    let result = core_storage_data.principal;
    let principal = core_storage_data.principal;

    for(let i = core_storage_data.time; i > 0; i--){
        result += principal * interest;

        if(core_storage_data.compound){
            principal += principal * interest;
        }
    }

    core_ui_update({
      'ids': {
        'result_interest': core_number_format({
          'decimals_min': core_storage_data.decimals,
          'number': result,
        }),
      },
    });
}

function calculate_percent(){
    core_storage_save({
      'keys': [
        'step_end',
        'step_interval',
        'step_limit',
        'step_start',
      ],
      'rebind': false,
    });

    let result = '';
    let steps = 0;
    for(let i = core_storage_data.step_start; i <= core_storage_data.step_end; i+= core_storage_data.step_interval){
        if(core_storage_data.step_limit > 0
          && steps > core_storage_data.step_limit){
            result += '<tr><td colspan=4>Step Limit Reached';
            break;
        }
        steps++;

        const step_percent = i === 0
          ? 0
          : (core_storage_data.step_interval / (core_storage_data.step_end - i + core_storage_data.step_interval)) * 100;

        result += '<tr><td>' + (steps - 1)
          + '<td>' + i
          + '<td>' + core_round({
              'number': step_percent,
            }) + '%'
          + '<td>' + core_round({
              'number': (i / core_storage_data.step_end) * 100,
            }) + '%';
    }
    core_elements.result_percent.innerHTML = result;
}

function calculate_width(){
    core_elements.width.value = core_round({
      'number': core_elements.height.value
        * (core_elements.ratio_width.value / core_elements.ratio_height.value),
    });
}

function insert(text){
    const position = core_elements.calculator.selectionStart;
    core_elements.calculator.value = core_elements.calculator.value.substring(0, position) + text + core_elements.calculator.value.substring(position, core_elements.calculator.value.length);
    core_elements.calculator.selectionEnd = position + text.length;
    core_elements.calculator.focus();
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

              core_elements.calculator.value = '';
              core_elements.calculator.focus();
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
        'ratio_height': {
          'oninput': calculate_width,
        },
        'ratio_width': {
          'oninput': calculate_height,
        },
        'result_use': {
          'onclick': function(){
              insert('Result');
          },
        },
        'width': {
          'oninput': calculate_height,
        },
      },
      'keybinds': {
        'Enter': {
          'down': function(event){
              if(core_elements.calculator === document.activeElement){
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
        'decimals': 2,
        'interest': 0,
        'principal': 0,
        'step_end': 10,
        'step_interval': 1,
        'step_limit': 100,
        'step_start': 0,
        'time': 0,
      },
      'title': 'Math.htm',
      'ui_elements': [
        'height',
        'ratio_height',
        'ratio_width',
        'result',
        'result_percent',
        'width',
      ],
    });

    core_elements.height.value = globalThis.innerHeight;
    core_elements.width.value = globalThis.innerWidth;
    core_elements.ratio_height.value = 1;
    core_elements.ratio_width.value = globalThis.innerWidth / globalThis.innerHeight;

    core_storage_update();
    calculate();
}
