'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/blog/login', controller.user.accessToken);
  router.get('/blog/postList', controller.post.getPost);
  router.get('/blog/postComments', controller.comment.getPostComment);
};
