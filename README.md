# techsee-common
This repo contains various useful common utilities.


## config-builder
This is a tool for building app configuration based on the environment that it's run in.

### Requiring config-builder

```javascript
var configBuilder = require('techsee-common').configBuilder
```

OR

```javascript
var configBuilder = require('techsee-common/lib/config-builder')
```

### Usage

```javascript
configBuilder.build(params);
```

`build` accepts a configuration object with the following properties:
* `envConfig` - Key-value pairs of environment names and their respective config files
* `template` - Path to config template file
* `mandatoryKeys` - A list of keys that require values.
* `staticConfig` - Path to static config file

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
ip = '12.5.136.2'
...
```
#### staticConfig(Optional)
Oftentimes an app has static values that do not change between different environments.
The static config file will be merged with the environment config.

#### mandatoryKeys(Optional)
Use this to provide a list of mandatory keys(currently we only guard against empty strings).
You can use dot notation for nested keys (i.e. `['api.ip']`).
If you wish to mark all keys as mandatory simply use `['*']`. However, if you still want to exclude some keys use the `'-'` prefix: `['*', '-api.ip']`

## login-info-encoder
This is a tool for for encoding and decoding login information on both the client and the server.

### Requiring login-info-encoder

```javascript
var encoder = require('techsee-common').loginInfoEncoder
```

OR

```javascript
var encoder = require('techsee-common/lib/login-info-encoder')
```

### Usage
`login-info-encoder` exposes to methods:

* `encode` accepts two parameters: `userName` and `password` and returns a base64 encoded string
* `decode` return a login info object, e.g. `{ userName: 'hello', password: 'world' }`
