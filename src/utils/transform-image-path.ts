type ObjectForTransform = Record<string, unknown>;

const isObject = ( value: unknown ) => typeof value === 'object' && value !== null;

const findImagePath = (
  property: string,
  data: ObjectForTransform,
  cb: ( obj: ObjectForTransform ) => void,
) => {
  Object.keys(data).forEach(( key ) => {
    if (key === property) {
      return cb(data);
    } else if (isObject(data[key])) {
      findImagePath(property, data[key] as ObjectForTransform, cb);
    }
  });
};

export const transformImagePath = ( properties: string[], staticPath: string, uploadPath: string, data: ObjectForTransform ) => {
  properties.forEach(( property ) => findImagePath(property, data, ( target: ObjectForTransform ) => {
    const rootPath = properties.includes(property as string) ? uploadPath : staticPath;
    if (Array.isArray(target[property])) {
      const pathArray = target[property] as Array<string>;
      target[property] = pathArray.map(( path: string ) => `${rootPath}/${path}`);
    } else {
      target[property] = `${rootPath}/${target[property]}`;
    }
  }));
};
