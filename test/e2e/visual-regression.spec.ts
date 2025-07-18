import { test, expect } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const PROD_URL = "https://blog.odan.dev";
const DEV_PORT = 4321;
const DEV_URL = `http://localhost:${DEV_PORT}`;

const TARGET_PATHS = [
  "/",
  "/articles/2020/06/blog",
  "/articles/2020/07/hardware-wallet-protocol",
  "/articles/2020/09/isucon10-qualify",
  "/articles/2020/08/aws-codebuild-run-build",
];

test.describe("Visual Regression Tests", () => {
  for (const targetPath of TARGET_PATHS) {
    test(`should match visual appearance for ${targetPath}`, async ({
      page,
    }) => {
      // Navigate to dev version
      await page.goto(`${DEV_URL}${targetPath}`, { waitUntil: "networkidle" });
      const devScreenshot = await page.screenshot({ fullPage: true });

      // Navigate to production version
      await page.goto(`${PROD_URL}${targetPath}`, { waitUntil: "networkidle" });
      const prodScreenshot = await page.screenshot({ fullPage: true });

      // Parse PNG images
      const devImg = PNG.sync.read(devScreenshot);
      const prodImg = PNG.sync.read(prodScreenshot);

      // Ensure images have the same dimensions
      expect(devImg.width).toBe(prodImg.width);
      expect(devImg.height).toBe(prodImg.height);

      // Create diff image
      const diff = new PNG({ width: devImg.width, height: devImg.height });

      // Compare images
      const numDiffPixels = pixelmatch(
        new Uint8Array(
          devImg.data.buffer,
          devImg.data.byteOffset,
          devImg.data.byteLength,
        ),
        new Uint8Array(
          prodImg.data.buffer,
          prodImg.data.byteOffset,
          prodImg.data.byteLength,
        ),
        new Uint8Array(
          diff.data.buffer,
          diff.data.byteOffset,
          diff.data.byteLength,
        ),
        devImg.width,
        devImg.height,
        { threshold: 0.01 }, // Allow 1% color difference per pixel
      );

      // Calculate percentage of different pixels
      const totalPixels = devImg.width * devImg.height;
      const diffPercentage = (numDiffPixels / totalPixels) * 100;

      // Assert that less than 1% of pixels are different
      expect(diffPercentage).toBeLessThan(1);
    });
  }
});
