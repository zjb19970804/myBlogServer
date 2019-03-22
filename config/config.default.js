/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // 数据库配置
  config.mongoose = {
   client: {
     url: 'mongodb://zjb1070179206:zjb970804@127.0.0.1/blog',
     options: {},
   }
  };
  // 跨域配置
  config.security = {
    domainWhiteList: ['http://127.0.0.1:3000'],
    csrf: {
      enable: false
    },
  };
  config.cors = {
    credentials: true,
    origin: 'http://127.0.0.1:3000',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  config.jwt = {
    enable: false,
    secret: "zjbblog",
    expiresIn: "12h",
    ignore: []
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551080824292_8273';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
