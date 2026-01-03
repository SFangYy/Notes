/*
 ** Script Name: IOTO Quick Image
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.1.0
 */

class QuickImage {
  constructor(tp, tR, settings = {}) {
    this.tp = tp;
    this.tR = tR;
    this.iotoSettings = app.plugins.plugins["ioto-settings"].settings;
    this.settings = Object.assign(
      {
        size: this.iotoSettings.iotoUtilsQuickImageSize.trim().split("\n"),
        useMask: this.iotoSettings.iotoUtilsQuickImageMask,
        maskType: 0,
      },
      settings
    );
    this.ml = new (tp.user.IOTOMultiLangs(tp))();
  }

  async makeImage() {
    const { size = ["1920x1080", "500x500"], useMask } = this.settings;

    const sizeChoice = await this.tp.system.suggester(
      size,
      size,
      false,
      this.ml.t("Please select the size of the image you want to insert")
    );
    if (!sizeChoice) return "";

    let maskType = "&mask=";
    if (useMask) {
      const maskMap = {
        1: "corners",
        2: "ellipse",
      };

      const option = await this.tp.system.suggester(
        [
          this.ml.t("No mask"),
          this.ml.t("Round mask"),
          this.ml.t("Circle mask"),
        ],
        [0, 1, 2],
        false,
        this.ml.t("Please select the mask type you want to use")
      );
      maskType += maskMap[option] || "";
    }

    const keywords = await this.tp.system.prompt(
      this.ml.t(
        "Please input the keywords of the image you want to find (English)"
      )
    );
    if (!keywords) return "";

    let imageEmbed = await this.tp.web.random_picture(sizeChoice, keywords);
    imageEmbed = imageEmbed
      .replace(/\)$/g, `&fit=crop${maskType})`)
      .replace("crop=entropy", "crop=faces,focalpoint,center,entropy")
      .replace("fm=jpg", "fm=png");

    this.tR += imageEmbed;
    return this.tR;
  }
}

async function IOTOQuickImage(tp, tR, settings) {
  const ImageMaker = new QuickImage(tp, tR, settings);
  return ImageMaker.makeImage();
}

module.exports = IOTOQuickImage;
