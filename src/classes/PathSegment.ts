/**
 * Class used to construct a {@link Path} to a {@link SchemaNode}.
 */
export class PathSegment {
  constructor(
    public key: string,
    public isList = false,
    public isVariant = false,
    /**
     * Path for cloned nodes need to be unique as well,
     * a segment is added with this flag to avoid collisions
     **/
    public isClone = false,
  ) {}

  toString() {
    return this.key;
  }
}
