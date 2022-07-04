# Party Invitations

TL;DR:

```shell
git clone git@github.com:schemar/party-invitations.git
cd party-invitations
npm ci
npm run build
./party_invitations
```

Example data is located in the `./data` directory.

I finished the exercise in less than 6 hours. I didn't have time to work on it
further. I think it is in a good state to show my skills and discuss some of the
decisions that I made and how to further improve the code.

See some explanations below. Please also see the in-line comments in the code.

## Design, Decisions, etc.

I followed [12 Factor](https://12factor.net/),
[SOLID](https://en.wikipedia.org/wiki/SOLID), etc. with the implementation.

When looking at the size of the application, I overdid it with the abstractions.
I did so on purpose in order to illustrate how clean code would use abstractions
to be composable and extendable.

For example, the `Distance` class is overkill in the current code base, but can
be useful in a larger code base. A class for the `id` of a customer could make
sense as well (or at least a type).

I added the units to some of the variable names, for example `radiusInKm`. I
think this is a good practice to prevent bugs, especially in international
teams.

I didn't test `./src/main.ts`. It is trivial, but some tests might be good
nevertheless. I simply ran out of time for the exercise.

Only `main.ts` interacts with the environment (`process.env`, `stdout`,
`stderr`, and so on). This allows the classes that implement the business logic
to not be cluttered with process or input/output handling.

For exception management, I only used `Error`. In a production system, it can
make sense to create custom errors instead. I didn't have the time to add those.

I decided to postfix (most) interfaces with `...Interface`. I like the
distinction, but I completely understand the reasoning for avoiding it as well.
In the end, with all things "opinions" (tabs/spaces, naming, etc.), I care a lot
more about consistency than about the actual choice.

When it comes to testing, the code only contains unit tests. A production
code-base would also include integration tests and end-to-end tests. I didn't
have the time to add those.

Some libraries could be added to improve usability. For example:

- [`commander`](https://www.npmjs.com/package/commander) for set-up and options
  parsing. For example, `commander` provides utilities to get command options
  from the environment, but also allow flags to override them on the command
  line.
- [`winston`](https://www.npmjs.com/package/winston) for logging.
- [`chalk`](https://www.npmjs.com/package/chalk) to terminal output.
- [`esbuild`](https://www.npmjs.com/package/esbuild) (or an alternative) to
  package the application and its dependencies into a contained file.

However, dependencies shouldn't be added without a good reason, as they require
more maintenance effort. For a small program like this one, it probably makes
sense to have the fewest dependencies possible.

I decided to go with `npm`, as it is the default. However, I have experience
with `yarn` as well.

If I had more time, I would set up
[lefthook](https://www.npmjs.com/package/lefthook) so that prettier and eslint
run before every code commit. Unit tests (and potentially other tests) would
probably run before pushing to the remote. However, these settings depend on how
the team wants to work. My experience with `lefthook` is much better than my
experience with husky.

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
