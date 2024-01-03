import fs from "fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export class ImageMatcher {
  public async match(pair: [string, string]): Promise<number> {
    const img1 = await this.readFile(pair[0]);
    const img2 = await this.readFile(pair[1]);

    if (img1.height !== img2.height) {
      throw new Error("ImageMatcher: invalid height");
    }
    if (img1.width !== img2.width) {
      throw new Error("ImageMatcher: invalid width");
    }

    const { height, width } = img1;
    const diffs = pixelmatch(
      img1.data,
      img2.data,
      null,
      img1.width,
      img1.height,
    );
    const error = Math.round((100 * 100 * diffs) / (width * height)) / 100;

    return error;
  }

  private readFile(file: string): Promise<PNG> {
    return new Promise<PNG>((resolve) => {
      fs.createReadStream(file)
        .pipe(new PNG())
        .on("parsed", function () {
          resolve(this);
        });
    });
  }
}
