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

function calculate_width(){
    document.getElementById('width').value = document.getElementById('height').value
      * (document.getElementById('ratio-width').value / document.getElementById('ratio-height').value);
}
