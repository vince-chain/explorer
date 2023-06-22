import stripLeadingSlash from 'lib/stripLeadingSlash';

export default function getFullPathOfImportedFile(baseFilePath: string, importedFilePath: string, remappings?: Array<string>) {
  if (importedFilePath[0] !== '.') {
    let result = importedFilePath;

    if (remappings && remappings.length > 0) {
      const [ alias, target ] = remappings.map((item) => item.split('=')).find(([ key ]) => importedFilePath.startsWith(key)) || [];
      if (alias) {
        result = importedFilePath.replace(alias, target);
      }
    }

    return result[0] === '/' ? result : '/' + result;
  }

  const baseFileChunks = stripLeadingSlash(baseFilePath).split('/');
  const importedFileChunks = importedFilePath.split('/');

  const result: Array<string> = baseFileChunks.slice(0, -1);

  for (let index = 0; index < importedFileChunks.length - 1; index++) {
    const element = importedFileChunks[index];

    if (element === '.') {
      continue;
    }

    if (element === '..') {
      if (result.length === 0) {
        break;
      }
      result.pop();
      continue;
    }

    result.push(element);
  }

  if (result.length === 0) {
    return;
  }

  result.push(importedFileChunks[importedFileChunks.length - 1]);

  return '/' + result.join('/');
}
