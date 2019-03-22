'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 博客信息
  router.get('/blog/getBloginfo', controller.user.getBloginfo);
  // 热门标签
  router.get('/blog/getHotLabel', controller.label.getHotLabel);
  // 创建标签
  router.post('/blog/createLabel', controller.label.createLabel);
  // 登录
  router.get('/blog/login', controller.user.accessToken);
  // 文章列表
  router.get('/blog/postList', controller.post.getPost);
  // 热门文章
  router.get('/blog/hotPostList', controller.post.getHotPost);
  // 推荐文章
  router.get('/blog/getRecommendPost', controller.post.getRecommendPost);
  // 根据标签获取文章
  router.get('/blog/getPostByLabel', controller.post.getPostByLabel);
  // 文章详情
  router.get('/blog/postDetail', controller.post.getDetail);
  // 文章的评论
  router.get('/blog/postComments', controller.comment.getPostComment);
  // 对文章评论
  router.post('/blog/commentsArticles', controller.comment.commentsArticles);
  // 给评论点赞/踩
  router.post('/blog/thumbsUp', controller.praise.thumbsUp);
  // 发布文章
  router.post('/blog/publishArticle', controller.post.publishArticle);
  // 修改文章
  router.post('/blog/updateArticle', controller.post.updateArticle);
};
