/* eslint-disable @typescript-eslint/no-explicit-any */
// import {removeDuplicates} from '../utils';

export interface RGBAPoint {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const bounding = (
  roadPixels: RGBAPoint[],
  redPixels: RGBAPoint[],
  bluePixels: RGBAPoint[]
) => {
  // const nextPixelsFromRed: RGBAPoint[] = [];
  // const nextPixelsFromBlue: RGBAPoint[] = [];
  //find the first set of pixels from the red/blue spawns
  // for (let idx = 0; idx < redPixels.length; idx++) {
  //   nextPixelsFromRed.push({x: redPixels[idx].x, y: redPixels[idx].y});
  //   // nextPixelsFromRed.push({x: redPixels[idx].x + 1, y: redPixels[idx].y});
  //   // nextPixelsFromRed.push({x: redPixels[idx].x + 1, y: redPixels[idx].y + 1});
  //   // nextPixelsFromRed.push({x: redPixels[idx].x + 1, y: redPixels[idx].y - 1});

  //   // nextPixelsFromRed.push({x: redPixels[idx].x, y: redPixels[idx].y + 1});
  //   // nextPixelsFromRed.push({x: redPixels[idx].x, y: redPixels[idx].y - 1});

  //   // nextPixelsFromRed.push({x: redPixels[idx].x - 1, y: redPixels[idx].y + 1});
  //   // nextPixelsFromRed.push({x: redPixels[idx].x - 1, y: redPixels[idx].y});
  //   // nextPixelsFromRed.push({x: redPixels[idx].x - 1, y: redPixels[idx].y - 1});
  // }

  // console.log(nextPixelsFromRed);

  // for (let idx = 0; idx < bluePixels.length; idx++) {
  //   nextPixelsFromRed.push({x: bluePixels[idx].x + 1, y: bluePixels[idx].y});
  //   nextPixelsFromRed.push({x: bluePixels[idx].x, y: bluePixels[idx].y + 1});
  //   nextPixelsFromRed.push({
  //     x: bluePixels[idx].x + 1,
  //     y: bluePixels[idx].y + 1,
  //   });

  //   nextPixelsFromRed.push({x: bluePixels[idx].x - 1, y: bluePixels[idx].y});
  //   nextPixelsFromRed.push({x: bluePixels[idx].x, y: bluePixels[idx].y - 1});
  //   nextPixelsFromRed.push({
  //     x: bluePixels[idx].x - 1,
  //     y: bluePixels[idx].y - 1,
  //   });

  //   nextPixelsFromRed.push({
  //     x: bluePixels[idx].x + 1,
  //     y: bluePixels[idx].y - 1,
  //   });
  //   nextPixelsFromRed.push({
  //     x: bluePixels[idx].x - 1,
  //     y: bluePixels[idx].y + 1,
  //   });
  // }

  // console.log(nextPixelsFromRed, removeDuplicates(nextPixelsFromRed));

  // return nextPixelsToSearchFunc({
  //   nextPixels: nextPixelsFromRed,
  //   pixelsToSearch: roadPixels,
  // });

  console.log(roadPixels);

  const a = boundOutFromPoints(roadPixels, [...redPixels, ...bluePixels]);

  // console.log(a);
  return a;
  // console.log(nextPixelsFromBlue, removeDuplicates(nextPixelsFromBlue));

  //once we have all possible red/blue adjacent pixels, find all corresponding road pixels

  // const nextPixelsToSearch: PixelData[] = [];
  // // console.log(roadPixels);
  // for (const pixel of nextPixelsFromRed) {
  //   const x = pixel.x;
  //   const y = pixel.y;

  //   const roadFound = roadPixels.find((i) => i.x === x && i.y === y);
  //   if (roadFound) {
  //     nextPixelsToSearch.push(roadFound);
  //   }
  // }

  // console.log(removeDuplicates(nextPixelsToSearch));

  // // return Array.from(removeDuplicates(nextPixelsToSearch));
  // return nextPixelsToSearch;
};

// let iter = 0;

// const nextPixelsToSearchFunc = ({
//   nextPixels = [],
//   pixelsToSearch = [],
// }: {
//   nextPixels: PixelData[]; //next set of pixels to look at
//   pixelsToSearch: PixelData[]; // full array of all road pixels
// }): PixelData[] => {
//   const nextPixelsToSearch: PixelData[] = [];
//   for (const pixel of nextPixels) {
//     const x = pixel.x;
//     const y = pixel.y;

//     const roadFound = pixelsToSearch.find((i) => i.x === x && i.y === y);
//     if (roadFound) {
//       console.log(roadFound);
//       nextPixelsToSearch.push(roadFound);
//     }
//   }

//   return [
//     ...nextPixelsToSearchFunc({
//       nextPixels: removeDuplicates(nextPixelsToSearch) as PixelData[],
//       pixelsToSearch,
//     }),
//     ...nextPixelsToSearch,
//   ];
// };

function boundOutFromPoints(
  objects: RGBAPoint[],
  startPoints: {x: number; y: number}[]
): RGBAPoint[] {
  let iteration = 0;
  const newObjects: RGBAPoint[] = [];
  const maxX = Math.max(...objects.map((obj) => obj.x));
  const maxY = Math.max(...objects.map((obj) => obj.y));
  const size = (maxX + 1) * (maxY + 1);
  const pixelMap: RGBAPoint[] = new Array(size);
  const visited: boolean[] = new Array(size).fill(false);

  for (const obj of objects) {
    pixelMap[obj.y * (maxX + 1) + obj.x] = obj;
  }

  const queue: {x: number; y: number}[] = [];
  let queueStart = 0;
  let queueEnd = 0;

  function enqueue(x: number, y: number) {
    queue[queueEnd++] = {x, y};
    visited[y * (maxX + 1) + x] = true;
  }

  function dequeue() {
    return queue[queueStart++];
  }

  for (const startPoint of startPoints) {
    enqueue(startPoint.x, startPoint.y);
  }

  while (queueStart < queueEnd) {
    console.log(iteration);
    iteration++;
    const {x, y} = dequeue();
    const key = y * (maxX + 1) + x;

    if (pixelMap[key]) {
      const obj = pixelMap[key];
      obj.r = 255;
      obj.g = 0;
      obj.b = 0;
      obj.a = 1;
      newObjects.push(obj);

      const directions = [-1, 0, 1];
      for (const dx of directions) {
        for (const dy of directions) {
          if ((dx !== 0 || dy !== 0) && !visited[key + dx + dy * (maxX + 1)]) {
            enqueue(x + dx, y + dy);
          }
        }
      }
    }

    if (iteration === 1000) {
      iteration = 0;
      return newObjects;
    }
  }

  return newObjects;
}

// function boundOutFromPoints(
//   objects: RGBAPoint[],
//   startPoints: {
//     x: number;
//     y: number;
//     r: number;
//     g: number;
//     b: number;
//     a: number;
//   }[]
// ): RGBAPoint[] {
//   const newObjects: RGBAPoint[] = [];
//   const maxX = Math.max(...objects.map((obj) => obj.x));
//   const maxY = Math.max(...objects.map((obj) => obj.y));
//   const size = (maxX + 1) * (maxY + 1);
//   const pixelMap: RGBAPoint[] = new Array(size);
//   const visited: boolean[] = new Array(size).fill(false);

//   for (const obj of objects) {
//     pixelMap[obj.y * (maxX + 1) + obj.x] = obj;
//   }

//   const queue: {x: number; y: number}[] = [];
//   let queueStart = 0;
//   let queueEnd = 0;

//   function enqueue(
//     x: number,
//     y: number,
//     color: {r: number; g: number; b: number; a: number}
//   ) {
//     const key = y * (maxX + 1) + x;
//     if (!visited[key]) {
//       queue[queueEnd++] = {x, y};
//       visited[key] = true;
//       pixelMap[key] = {...color, x, y}; // Set the starting point's color for new points
//     }
//   }

//   function dequeue() {
//     return queue[queueStart++];
//   }

//   for (const startPoint of startPoints) {
//     enqueue(startPoint.x, startPoint.y, {
//       r: startPoint.r,
//       g: startPoint.g,
//       b: startPoint.b,
//       a: startPoint.a,
//     });
//   }

//   while (queueStart < queueEnd) {
//     const {x, y} = dequeue();
//     const key = y * (maxX + 1) + x;

//     const obj = pixelMap[key];
//     if (obj) {
//       obj.r = 255;
//       obj.g = 0;
//       obj.b = 0;
//       obj.a = 1;
//       newObjects.push(obj);

//       const directions = [-1, 0, 1];
//       for (const dx of directions) {
//         for (const dy of directions) {
//           if ((dx !== 0 || dy !== 0) && !visited[key + dx + dy * (maxX + 1)]) {
//             enqueue(x + dx, y + dy, obj); // Pass the starting point's color to new points
//           }
//         }
//       }
//     }
//   }

//   return newObjects;
// }
