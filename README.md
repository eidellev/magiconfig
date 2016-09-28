# Magiconfig
This is a tool for building app configuration based on the environment that it's run in.

### Installation
```
npm i magiconfig --save
```

### Usage

```javascript
var magiconfig = require('magiconfig')
```

```javascript
var config = magiconfig(params);
```

Magiconfig accepts a configuration object with the following properties:
* `envConfig` - Key-value pairs of environment names and their respective config files
* `template` - Path to config template file
* `mandatoryKeys` - A list of keys that require values.
* `staticConfig` - Path to static config file
* `validate` - Custom validation function

#### envConfig
An object with key-value pairs of environment names and their config files(can be either `.toml`, `.json` or `.js` files). i.e.
```javascript
{
    dev: '/path/to/your/file'
    prod: '/path/to/some/other/file'
}
```

#### template(Optional)
Use this to validate a config file against a template file(can be either a `.toml`, `.json` or `.js` file).
The template file must itself be valid and contain all the keys that you wish the config file to have (including nested objects!). The values are not used anywhere, so feel free to provide sample values and comments to make it easier on the user.

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

### validate (optional)
Additional custom validation function. Function accepts the final config and a callback:
```javascript
    ...
    validate: function(config, cb) {
        if (config.port !== 1337) {
            // Invalid config
            return cb (new Error('Invalid port number'))
        }

        // Valid config
        cb(null)
    }
```
