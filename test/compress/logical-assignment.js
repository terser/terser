logical_assignment: {
  options = {
      ecma: 2021,
  }

  input: {
      var x;
      x ||= 3;
      x ??= 3;
      x &&= 3;
  }

  expect: {
     var x;
     x ||= 3;
     x ??= 3;
     x &&= 3;
  }
}
