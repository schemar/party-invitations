# Party Invitations

TL;DR:

```shell
git clone git@github.com:schemar/party-invitations.git
cd party-invitations
npm ci
npm run build
./party_invitations
```

Sample output:

```
The following warnings were encountered while processing the data:
Invalid customer id: 'e6ee6861'
Incomplete customer won't be considered: {"position":{"latitude":55.08068312,"longitude":12.86196247}}
Given longitude is not a number: 'x.26537009'
Incomplete customer won't be considered: {"position":{"latitude":50.41642815},"id":"e187aea0-95a6-41a7-b75c-3956a48c558d"}

Customer IDs within 100 km of 52.493256 lat, 13.446082 lon (in alphabetical order):
02335e27-e152-4771-9a6b-5b88c3b29eb9
05d07502-b345-4133-b6b0-668ca44a5e95
129b3b89-1b29-4aaa-a30c-b7e1a1dd46a0
1a3b6dca-a1c9-4b9b-b280-007a040cc4da
27051d0b-6476-4794-bb5d-27e7db8e29d5
2cce11c3-6979-42a5-b501-ace4d5e598ec
4013ac11-6d4a-41c5-94e4-abc4bb931e80
469dc15d-6726-4e7d-8da4-d2e10e5a7669
517ea41d-be50-4c2c-ba49-59a4de03842b
6536a868-b83e-47b0-9462-7448a93b9827
839e0ebc-4bce-4d2d-93d8-a1201b31c496
841d0654-9971-4c84-a5a5-d3e5b5dbc77e
add9c5a5-65d6-49a1-a260-c984905a9745
b86d6784-7b41-4e3c-971a-5ca2ce8ee895
bbccc9e8-5cee-439a-a00c-0088b88bc327
cab0ebd3-149b-4bd7-9862-e3e11a9273d5
ceaa3ede-1805-4c41-a2d1-79b1c74c033b
d3b64719-3b9a-40b7-81e6-56dd94a5a794
d5c05bd3-76d4-4c3c-9985-deb82751c611
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
