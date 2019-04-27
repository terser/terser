module_collapse_vars: {
    options = {
        collapse_vars: true,
    }
    input: {
      var setToString = function(){};

      var _setToString = setToString;

      export function baseRest() {
        return _setToString();
      }

      export { _setToString };
    }
    expect: {
      var setToString=function(){};
      export function baseRest(){return setToString()}
      export{setToString as _setToString};
    }
}

