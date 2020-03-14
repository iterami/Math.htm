'use strict';

function add_result(){
    const element = document.getElementById('calculator');
    element.value =
      element.value.substring(
        0,
        element.selectionStart
      ) + document.getElementById('result').textContent
      + element.value.substring(
        element.selectionStart
      );

    core_storage_save();
}

function calculate(){
    core_storage_save();

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
    document.getElementById('result-formatted').textContent = core_number_format({
      'decimals-min': decimals,
      'number': result,
    });
}

function calculate_height(){
    document.getElementById('height').value = document.getElementById('width').value
      * (document.getElementById('ratio-height').value / document.getElementById('ratio-width').value);
}

function calculate_interest(){
    core_storage_save();

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

    document.getElementById('result-interest').value = core_number_format({
      'decimals-min': core_storage_data['decimals-min'],
      'number': result,
    });
}

function calculate_width(){
    document.getElementById('width').value = document.getElementById('height').value
      * (document.getElementById('ratio-width').value / document.getElementById('ratio-height').value);
}
