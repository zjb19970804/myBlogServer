'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 登录
  router.get('/blog/login', controller.user.accessToken);
  // 文章列表
  router.get('/blog/postList', controller.post.getPost);
  // 文章的评论
  router.get('/blog/postComments', controller.comment.getPostComment);
  // 获取评论的点赞/踩
  router.get('/blog/commentPraise', controller.praise.getPraise);
  // 给评论点赞/踩
  router.post('/blog/thumbsUp', controller.praise.thumbsUp);
};
