import { CrmExportProvider } from '../../../src/PartyInvitations/CustomersProviders/CrmExportProvider.js';

describe('CrmExportFile', () => {
  it('returns customers from a file', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n' +
              'id: 98765432-1234-1234-1234-12345678, lat: 13.1, long: 9.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
        {
          id: '98765432-1234-1234-1234-12345678',
          position: { latitude: 13.1, longitude: 9.2 },
        },
      ],
      warnings: [],
    });
  });

  it('adds a warning for a malformed id and skips that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n' +
              'id: 98765432-1234, lat: 13.1, long: 9.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a malformed latitude and skips that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n' +
              'id: 98765432-1234-1234-1234-12345678, lat: x.1, long: 9.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a malformed longitude and skips that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n' +
              'id: 98765432-1234-1234-1234-12345678, lat: 13.1, long: nope\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a missing id and skips that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'lat: 13.1, long: 9.2\n' +
              'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a missing latitude and skips that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 98765432-1234-1234-1234-12345678, long: 9.2\n' +
              'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a missing longitude and skips that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 98765432-1234-1234-1234-12345678, lat: 9.2\n' +
              'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a duplicate id, but adds that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 98765432-1234-1234-1234-12345678, id: 98765432-1234-1234-1234-12345678, lat: 13.1, long: 9.2\n' +
              'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '98765432-1234-1234-1234-12345678',
          position: { latitude: 13.1, longitude: 9.2 },
        },
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a duplicate latitude, but adds that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 98765432-1234-1234-1234-12345678, lat: 58.1, lat: 13.1, long: 9.2\n' +
              'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '98765432-1234-1234-1234-12345678',
          position: { latitude: 13.1, longitude: 9.2 },
        },
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('adds a warning for a duplicate longitude, but adds that customer', async () => {
    // Arrange
    const crmExportFile = new CrmExportProvider({
      contentProvider: {
        getContent: jest
          .fn()
          .mockResolvedValueOnce(
            'id: 98765432-1234-1234-1234-12345678, lat: 13.1, long: 12.3, long: 9.2\n' +
              'id: 12345678-1234-1234-1234-12345678, lat: 52.1, long: 13.2\n',
          ),
      },
    });

    // Act
    const customers = await crmExportFile.readCustomersOrThrow({
      fileIdentifier: 'we/inject/a/mock/provider',
    });

    // Assert
    expect(customers).toStrictEqual({
      customers: [
        {
          id: '98765432-1234-1234-1234-12345678',
          position: { latitude: 13.1, longitude: 9.2 },
        },
        {
          id: '12345678-1234-1234-1234-12345678',
          position: { latitude: 52.1, longitude: 13.2 },
        },
      ],
      // Do not assert implementation details. Only make sure warnings are added.
      warnings: expect.arrayContaining([expect.any(String)]),
    });
  });
});
