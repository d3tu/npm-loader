const pacote = require('pacote'),
  fs = require('fs'),
  path = process.cwd() + '/node_modules/',
  exist = name => new Promise(res => {
    fs.stat(path + name, err => {
      if (err) res(false);
      else res(true);
    });
  });

module.exports = async function load(name, run = true) {
  if (await exist(name)) return run && require(name);
  const { dependencies } = await pacote.manifest(name);
  if (dependencies)
    for (const _name of Object.keys(dependencies))
      await load(_name, false);
  const _path = path + name;
  await pacote.extract(name, _path);
  return run && require(_path);
};
