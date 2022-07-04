# Party Invitations

TODO: Better explanation.
Following [12 Factor](), [SOLID](), etc.

TODO: Explain reasoning behind decisions.

## Running

### Initially

```shell
git clone git@github.com:schemar/party-invitations.git
cd party-invitations
npm ci
```

### Running

The build process also lints and tests the code.

```shell
npm run build
npm start
```

Following [The Twelve-Factor App](https://12factor.net/), you configure the
application through the environment. The following environment variables are
required to run Party Invitations:

```shell
PI_RADIUS_IN_KM="100" # The radius from within which the customers should be invited.
PI_LATITUDE="52.493256" # Latitude of the location of the host.
PI_LONGITUDE="13.446082" # Longitude of the location of the host.
PI_CUSTOMERS_FILE="./data/Customers_Martin.txt" # Path to a file containing customer details.
```

After you built the application, you can also run the wrapper script if you want
to run it with an example configuration and example data. See the script for
details.

```shell
./party_invitations
```

### Development

Testing:

```shell
npm run test:watch
```
