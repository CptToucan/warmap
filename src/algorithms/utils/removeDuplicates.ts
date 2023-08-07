export const removeDuplicates = (arr: Object[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seen: any = {};
  const uniqueArr = [];

  for (const obj of arr) {
    const strRepresentation = JSON.stringify(obj);

    if (!seen[strRepresentation]) {
      seen[strRepresentation] = true;
      uniqueArr.push(obj);
    }
  }

  return uniqueArr;
};
