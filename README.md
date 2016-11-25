# Magiconfig
[![npm version](https://badge.fury.io/js/magiconfig.svg)](https://badge.fury.io/js/magiconfig)

This is a tool for building app configuration based on the environment that it's run in.
Magiconfig does the work of validating your config for you and is flexible enough to allow you as little or as much control over it as you would like.<br>
<strong>Note:</strong><br>
Each validation step throws an error upon failing. For instance, if you haven't set NODE_ENV you will get the following:<br>
<i>'NODE_ENV is not set!'</i><br>

### Installation
```
npm i magiconfig --save
```

### Usage

```javascript
const magiconfig = require('magiconfig')

const config = magiconfig(params)
```

Magiconfig accepts a configuration object with the following properties:
* `envConfig` - Key-value pairs of environment names and their respective config files
* `template` - Path to config template file
* `mandatoryKeys` - A list of keys that require values.
* `staticConfig` - Path to static config file
* `doTypeValidation` - Should we validate config types against the template?
* `validate` - Custom validation function

<strong>Note</strong>: All paths are relative to project root.

#### envConfig
An object with key-value pairs of environment names and their config files(can be either `.toml`, `.yml`, `.yaml`, `.json` or `.js` files). i.e.
```javascript
{
    dev: '/path/to/your/file'
    prod: '/path/to/some/other/file'
}
```
Your environment is determined based on `NODE_ENV`. For instance, you can set it this way through package.json:
```json
...
"scripts": {
    "run-dev": "NODE_ENV=dev node app.js",
    "run-prod": "NODE_ENV=prod node app.js"
}
...
```

#### template(Optional)
Use this to validate a config file against a template file(can be either a `.toml`, `.yml`, `.yaml`, `.json` or `.js` file).
The template file must itself be valid and contain all the keys that you wish the config file to have, including nested keys. The values are not used anywhere, so feel free to provide sample values and comments.

```toml
a = 'some string'
b = 1 # should be a number

[api]
hostname = 'someapi.com'
port = 1337
...
```
#### staticConfig(Optional)
Oftentimes an app has static values that do not change between different environments.
The static config file will be merged with the environment config.
Environment config parameters will override their static counterparts.

#### mandatoryKeys(Optional)
Use this to provide a list of mandatory keys(currently we only guard against empty strings).
You can use dot notation for nested keys (i.e. `['api.hostname']`).
If you wish to mark all keys as mandatory simply use `['*']`. However, if you still want to exclude some keys use the `'-'` prefix: `['*', '-api.port']`

#### doTypeValidation(Optional)
(Works in conjunction with 'template')<br>
Validate the types of properties in our config as set in the config template.
Supported types are:
* number
* boolean
* string
* array
* object
* enum

<strong>Example</strong>:
```javascript
// config.js
const config = magiconfig({
    templateFile: 'template.toml',
    envConfig: {
        'prod': 'test4.toml'
    },
    doTypeValidation: true
})
```
```toml
    # template.toml
    a = 'string'
    b = 'number'
    c = 'array'
    d = 'object'
    e = 'enum: abc,def,ghi'
```

```toml
    # config.toml
    a = 'some srting'
    b = '123'
    c = [1, 2, 3]
    [d]
    e = 'Object property'
    f = 'Another object property'
```

#### validate (optional)
Additional custom validation function. Function accepts the final config and a callback:
```javascript
    ...
    const fs = require('fs')

    validate: (config, cb) => {
        if (!fs.existsSync(config.path)) {
            // Invalid config
            return cb (new Error('Path does not exist!'))
        }

        // Valid config
        cb()
    }
```
