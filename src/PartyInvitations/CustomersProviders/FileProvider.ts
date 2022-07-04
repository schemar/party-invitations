import fs from 'fs/promises';

/**
 * Provides content of a file based on the path to the file.
 */
export class FileProvider {
  /**
   * Returns the file content of a file, UTF-8 encoded.
   *
   * The fileIdentifier is used as a path to lookup the file in the file system.
   */
  public getContent({
    fileIdentifier,
  }: {
    fileIdentifier: string;
  }): Promise<string> {
    return fs.readFile(fileIdentifier, { encoding: 'utf8' });
  }
}
