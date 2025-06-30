/*
 ** Script Name: IOTO Quick Image
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 1.1.0
 */

/**
 * 快速插入图片的类
 */
class QuickImage {
  /**
   * 构造函数
   * @param {Object} tp - Templater插件对象
   * @param {string} tR - 模板返回值
   * @param {Object} settings - 配置项
   */
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
    this.ml = new (tp.user.IOTOMultiLangs())();
  }

  /**
   * 生成并插入图片
   * @returns {string} 返回插入的图片Markdown语法
   */
  async makeImage() {
    // 从设置中获取图片尺寸和是否使用遮罩的配置
    const { size = ["1920x1080", "500x500"], useMask } = this.settings;

    // 让用户选择图片尺寸
    const sizeChoice = await this.tp.system.suggester(
      size,
      size,
      false,
      this.ml.t("Please select the size of the image you want to insert")
    );
    if (!sizeChoice) return "";

    // 处理遮罩选项
    let maskType = "&mask=";
    if (useMask) {
      // 遮罩类型映射
      const maskMap = {
        1: "corners", // 圆角遮罩
        2: "ellipse", // 圆形遮罩
      };
      // 让用户选择遮罩类型
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

    // 获取用户输入的图片关键词
    const keywords = await this.tp.system.prompt(
      this.ml.t(
        "Please input the keywords of the image you want to find (English)"
      )
    );
    if (!keywords) return "";

    // 获取随机图片并处理图片URL
    let imageEmbed = await this.tp.web.random_picture(sizeChoice, keywords);
    imageEmbed = imageEmbed
      .replace(")", `&fit=crop${maskType})`) // 添加裁剪和遮罩参数
      .replace("crop=entropy", "crop=faces,focalpoint,center,entropy") // 优化裁剪参数
      .replace("fm=jpg", "fm=png"); // 将图片格式改为PNG

    // 将图片Markdown语法添加到返回值中
    this.tR += imageEmbed;
    return this.tR;
  }
}

async function IOTOQuickImage(tp, tR, settings) {
  const ImageMaker = new QuickImage(tp, tR, settings);
  return ImageMaker.makeImage();
}

module.exports = IOTOQuickImage;
