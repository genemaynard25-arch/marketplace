const replaceTemplate = (template, item) => {
  let output = template.replace(/{%ID%}/g, item.id);
  output = output.replace(/{%NAME%}/g, item.name);
  output = output.replace(/{%PRICE%}/g, item.price);
  output = output.replace(/{%CATEGORY%}/g, item.category);
  output = output.replace(/{%DESCRIPTION%}/g, item.description);
  output = output.replace(/{%SELLER%}/g, item.seller);
  return output;
};

module.exports = replaceTemplate;
