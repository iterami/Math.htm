'use strict';

function calculate(){
    core_storage_save({
      'keys': [
        'calculator',
      ],
    });

    let to_calculate = document.getElementById('calculator').value.replace(
      /\s/g,
      ''
    );
    if(to_calculate.length === 0){
        return;
    }

    to_calculate = to_calculate.replace(
      /,/g,
      ''
    );
    to_calculate = to_calculate.replace(
      /π/g,
      'Math.PI'
    );

    let result = '';

    try{
        result = core_round({
          'number': eval(to_calculate),
        });

    }catch(error){
        document.getElementById('result').textContent = 'SYNTAX ERROR';
        document.getElementById('result-formatted').textContent = '';
        return;
    }

    document.getElementById('result').textContent = result;

    let decimals = 0;
    const result_string = result.toString();
    if(result_string.includes('.')){
        decimals = result_string.split('.')[1].length;
    }
    const formatted_result = core_number_format({
      'decimals-min': decimals,
      'number': result,
    });
    document.getElementById('result-formatted').textContent = formatted_result;
    document.title = formatted_result + ' - ' + core_repo_title;
}

function calculate_height(){
    document.getElementById('height').value = document.getElementById('width').value
      * (document.getElementById('ratio-height').value / document.getElementById('ratio-width').value);
}

function calculate_interest(){
    core_storage_save({
      'keys': [
        'compound',
        'decimals-min',
        'interest',
        'principal',
        'time',
      ],
    });

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

    document.getElementById('result-interest').textContent = core_number_format({
      'decimals-min': core_storage_data['decimals-min'],
      'number': result,
    });
}

function calculate_percent(){
    core_storage_save({
      'keys': [
        'step-interval',
        'step-limit',
        'step-max',
        'step-start',
      ],
    });

    let result = '';
    let steps = 0;
    for(let i = core_storage_data['step-start']; i <= core_storage_data['step-max']; i+= core_storage_data['step-interval']){
        if(core_storage_data['step-limit'] > 0){
            steps++;

            if(steps > core_storage_data['step-limit']){
                result += '<tr><td colspan=3>Step Limit Reached';

                break;
            }
        }

        const step_percent = i === 0
          ? 0
          : core_round({
              'number': (core_storage_data['step-interval'] / (core_storage_data['step-max'] - i + core_storage_data['step-interval'])) * 100,
            });

        result += '<tr><td>' + core_round({
            'number': i,
          })
          + '<td>' + step_percent + '%'
          + '<td>' + core_round({
            'number': (i / core_storage_data['step-max']) * 100,
          }) + '%';
    }
    document.getElementById('result-percent').innerHTML = result;
}

function calculate_width(){
    document.getElementById('width').value = document.getElementById('height').value
      * (document.getElementById('ratio-width').value / document.getElementById('ratio-height').value);
}

function insert(text){
    const calculator = document.getElementById('calculator');
    const position = calculator.selectionStart;
    calculator.value = calculator.value.substring(0, position) + text + calculator.value.substring(position, calculator.value.length);
    calculator.selectionEnd = position + text.length;
    calculator.focus();
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
              const calculator = document.getElementById('calculator');
              calculator.value = '';
              calculator.focus();
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
        13: {
          'todo': function(event){
              const calculator = document.getElementById('calculator');

              if(calculator === document.activeElement){
                  event.preventDefault();
                  if(event.shiftKey){
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
