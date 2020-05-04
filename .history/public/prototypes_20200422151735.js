const split = (input, len) =>
  input.match(
    new RegExp(
      ".{1," + len + "}(?=(.{" + len + "})+(?!.))|.{1," + len + "}$",
      "g"
    )
  );

Array.prototype.unique = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};

String.prototype.toDashDate = function () {
  let date = new Date(this),
    dat =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return dat;
};

String.prototype.addComma = function () {
  return split(this.toString(), 3).join(",");
};

Number.prototype.addComma = function () {
  return split(this.toString(), 3).join(",");
};