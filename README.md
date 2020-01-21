HomeyPanel
==========
The ~~missing~~ futuristic panel to control Homey devices

**Table of Contents**
* [Requirements](#requirements)
* [Running Local Environment](#running-local-environment)
* [Contributing](#contributing)

- - -

## Requirements
To run this software AS IS in your local environment you'll need to install the following:
- NodeJS >= 12 ([NVM](https://github.com/nvm-sh/nvm#installing-and-updating) recommended)
- Angular CLI >= 8.3: `npm install -g @angular/cli`
- Install Yarn: `npm install -g yarn`
- Install App dependencies: run `yarn`

_Note: If you run `yarn install` on Windows and some Linux distros, you might encounter errors. In that case, delete the `postinstall` script in the package.json. In a later stage this will be improved to work cross-platform._


Moreover, if you want the weather widged in the header to properly show the temperature and rain chance, you'll need to:
- Signup for free at [DarkSky API](https://darksky.net/dev)
- Get the Secret Key (HEADS UP! This app refreshed the weather every 5 minutes (288 calls / day) because there is a daily limit on the Free API. If you run this app in multiple devices you might hit the limit)
- Edit the file proxy.conf.json add replace the \<API_KEY\> for the Key you just obtained and the \<LAT\> and \<LONG\> for the latitude and longitue you want to show the weather from (in future versions this will be directly taken from Homey)


## Running Local Environment
Once you met the requirements above, just type `yarn start` and navigate to http://localhost:4200 in your favourite modern browser.


## Contributing
If you're planning to contribute to this project, please read this carefuly.
This is an open source project and it requires the community to keep some standards to maintain the code quality, standard conventions and so on. Here are some of the requirements:

- No one is allowed to push to master branch, everything should be done in a separated branch and pull requested to master
- Pull requests must be approved by the project maintainers to be merged
- Commits and branch names must follow the [Conventional Commits Specifications](https://www.conventionalcommits.org/en/v1.0.0/)
- Automated testing is recommended and will be mandatory in the future
